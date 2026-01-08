import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CORRELATION_ID_HEADER, REQUEST_ID_HEADER, TRACE_ID_HEADER } from '../constants';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    // Generate IDs if not present
    const correlationId = req.headers[CORRELATION_ID_HEADER.toLowerCase()] as string || uuidv4();
    const requestId = req.headers[REQUEST_ID_HEADER.toLowerCase()] as string || `req-${uuidv4()}`;
    const traceId = req.headers[TRACE_ID_HEADER.toLowerCase()] as string || `trace-${uuidv4()}`;

    // Set headers
    req.headers[CORRELATION_ID_HEADER.toLowerCase()] = correlationId;
    req.headers[REQUEST_ID_HEADER.toLowerCase()] = requestId;
    req.headers[TRACE_ID_HEADER.toLowerCase()] = traceId;

    // Add to response headers
    res.setHeader(CORRELATION_ID_HEADER, correlationId);
    res.setHeader(REQUEST_ID_HEADER, requestId);
    res.setHeader(TRACE_ID_HEADER, traceId);

    // Log incoming request
    this.logger.log({
      message: 'Incoming request',
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      correlationId,
      requestId,
      traceId,
      timestamp: new Date().toISOString(),
    });

    // Override res.json to log response
    const originalJson = res.json;
    res.json = function (body: any) {
      const duration = Date.now() - startTime;
      
      const logData = {
        message: 'Outgoing response',
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        correlationId,
        requestId,
        traceId,
        timestamp: new Date().toISOString(),
      };

      if (res.statusCode >= 400) {
        LoggingMiddleware.prototype.logger.error(logData);
      } else {
        LoggingMiddleware.prototype.logger.log(logData);
      }

      return originalJson.call(this, body);
    };

    next();
  }
}

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers[CORRELATION_ID_HEADER.toLowerCase()] as string || uuidv4();
    
    req['correlationId'] = correlationId;
    res.setHeader(CORRELATION_ID_HEADER, correlationId);
    
    next();
  }
}

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PerformanceMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = process.hrtime.bigint();
    const correlationId = req.headers[CORRELATION_ID_HEADER.toLowerCase()] as string;

    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

      // Log slow requests (>1000ms)
      if (duration > 1000) {
        this.logger.warn({
          message: 'Slow request detected',
          method: req.method,
          url: req.url,
          duration: `${duration.toFixed(2)}ms`,
          statusCode: res.statusCode,
          correlationId,
          timestamp: new Date().toISOString(),
        });
      }

      // Log performance metrics
      this.logger.debug({
        message: 'Request performance',
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        correlationId,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // CORS headers (if needed)
    if (process.env.NODE_ENV === 'development') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Correlation-ID');
    }

    next();
  }
}
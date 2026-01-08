import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrometheusService } from './prometheus.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly prometheusService: PrometheusService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Skip metrics endpoint to avoid circular metrics collection
    if (req.path === '/metrics') {
      return next();
    }

    const route = this.getRoutePattern(req);
    const method = req.method;
    
    // Record request size
    const requestSize = req.headers['content-length'] ? 
      parseInt(req.headers['content-length'], 10) : 0;
    this.prometheusService.recordHttpRequestSize(method, route, requestSize);
    
    // Start tracking request
    const startTime = this.prometheusService.startHttpRequest(method, route);
    
    // Capture response data
    const originalSend = res.send;
    res.send = function (body) {
      const responseSize = body ? Buffer.byteLength(body) : 0;
      self.prometheusService.recordHttpResponseSize(method, route, responseSize);
      return originalSend.call(this, body);
    };
    
    // Store reference to this for the response handler
    const self = this;
    
    // Handle response finishing
    res.on('finish', () => {
      const duration = self.prometheusService.endHttpRequest(method, route, startTime);
      self.prometheusService.recordHttpRequest(method, route, res.statusCode, duration);
    });
    
    next();
  }

  private getRoutePattern(req: Request): string {
    // Try to get the route pattern from the request
    // This will normalize routes with path parameters
    if (req.route && req.route.path) {
      return req.route.path;
    }
    
    // Fallback to the actual path if route pattern is not available
    // This is less ideal as it won't group similar routes
    return req.path || 'unknown';
  }
}
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '../constants';
import { ApiResponseUtil } from '../utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = request.headers[CORRELATION_ID_HEADER.toLowerCase()] as string;
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        error = responseObj.error || exception.constructor.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.constructor.name;
    }

    // Log the error
    this.logger.error({
      message: 'Exception caught',
      error: error,
      details: message,
      statusCode: status,
      method: request.method,
      url: request.url,
      correlationId,
      stack: exception instanceof Error ? exception.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Send error response
    const errorResponse = ApiResponseUtil.error(message, correlationId);
    
    response
      .status(status)
      .json({
        ...errorResponse,
        statusCode: status,
        path: request.url,
        method: request.method,
      });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const correlationId = request.headers[CORRELATION_ID_HEADER.toLowerCase()] as string;
    
    const exceptionResponse = exception.getResponse();
    let message = 'Bad request';
    let details: any = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || message;
      details = responseObj.details || responseObj.errors;
    }

    // Log non-client errors (5xx)
    if (status >= 500) {
      this.logger.error({
        message: 'HTTP Exception',
        statusCode: status,
        error: message,
        details,
        method: request.method,
        url: request.url,
        correlationId,
        timestamp: new Date().toISOString(),
      });
    } else {
      this.logger.warn({
        message: 'Client Error',
        statusCode: status,
        error: message,
        method: request.method,
        url: request.url,
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const errorResponse = {
      success: false,
      error: message,
      details,
      statusCode: status,
      path: request.url,
      method: request.method,
      correlationId,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
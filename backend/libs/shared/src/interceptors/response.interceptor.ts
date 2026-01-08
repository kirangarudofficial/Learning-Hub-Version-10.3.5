import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CORRELATION_ID_HEADER } from '../constants';
import { ApiResponseUtil } from '../utils';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const correlationId = request.headers[CORRELATION_ID_HEADER.toLowerCase()];

    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        // If data is already a formatted API response, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Otherwise, wrap in standard response format
        return ApiResponseUtil.success(data, undefined, correlationId);
      }),
      tap((data) => {
        const duration = Date.now() - startTime;
        
        this.logger.debug({
          message: 'Response sent',
          method: request.method,
          url: request.url,
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          correlationId,
          timestamp: new Date().toISOString(),
        });
      }),
    );
  }
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);
  private cache = new Map<string, { data: any; expiry: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expiry) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return new Observable(observer => {
        observer.next(cached.data);
        observer.complete();
      });
    }

    return next.handle().pipe(
      tap((data) => {
        // Cache for 5 minutes
        const expiry = Date.now() + (5 * 60 * 1000);
        this.cache.set(cacheKey, { data, expiry });
        this.logger.debug(`Cached response for ${cacheKey}`);
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const url = request.url;
    const query = JSON.stringify(request.query);
    const userId = request.user?.sub || 'anonymous';
    return `${request.method}:${url}:${query}:${userId}`;
  }

  clearCache(pattern?: string) {
    if (pattern) {
      const keys = Array.from(this.cache.keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    } else {
      this.cache.clear();
    }
  }
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Transform Prisma objects to remove sensitive data
        if (data && typeof data === 'object') {
          return this.transformData(data);
        }
        return data;
      }),
    );
  }

  private transformData(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.transformData(item));
    }

    if (data && typeof data === 'object') {
      const transformed = { ...data };
      
      // Remove sensitive fields
      delete transformed.passwordHash;
      delete transformed.password;
      delete transformed.refreshToken;
      
      // Transform nested objects
      Object.keys(transformed).forEach(key => {
        if (transformed[key] && typeof transformed[key] === 'object') {
          transformed[key] = this.transformData(transformed[key]);
        }
      });

      return transformed;
    }

    return data;
  }
}
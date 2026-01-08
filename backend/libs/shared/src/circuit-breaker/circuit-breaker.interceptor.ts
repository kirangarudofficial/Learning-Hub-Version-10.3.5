import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CircuitBreakerService } from './circuit-breaker.service';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CircuitBreakerInterceptor.name);

  constructor(private readonly circuitBreakerService: CircuitBreakerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;
    
    // Create a service identifier from the request
    const serviceId = `${method}:${this.normalizeRoute(path)}`;
    
    // Ensure circuit exists
    if (!this.circuitBreakerService.getState(serviceId)) {
      this.circuitBreakerService.registerCircuit(serviceId);
    }
    
    try {
      return next.handle().pipe(
        tap(() => {
          // Success case - nothing to do here as the circuit breaker
          // will handle success in the execute method
        }),
        catchError(error => {
          this.logger.error(`Error in ${serviceId}: ${error.message}`);
          return throwError(() => error);
        })
      );
    } catch (error) {
      this.logger.error(`Unexpected error in circuit breaker for ${serviceId}: ${error.message}`);
      return throwError(() => error);
    }
  }

  /**
   * Normalize a route path to create a consistent service identifier
   * Replaces path parameters with placeholders
   */
  private normalizeRoute(path: string): string {
    // Replace numeric path segments with :id
    return path.split('/')
      .map(segment => /^\d+$/.test(segment) ? ':id' : segment)
      .join('/');
  }
}
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HealthCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HealthCheckMiddleware.name);
  private healthStatus = {
    database: true,
    lastCheck: new Date(),
  };

  constructor(private prisma: PrismaService) {
    // Perform health checks every 30 seconds
    setInterval(() => {
      this.performHealthChecks();
    }, 30000);
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Add health status to request context
    req['health'] = this.healthStatus;
    next();
  }

  private async performHealthChecks() {
    try {
      // Check database connection
      // Use a raw query to check DB connection, as `healthCheck` is not a standard Prisma method.
      const result = await this.prisma.$queryRaw`SELECT 1`;
      
      this.healthStatus = {
        database: !!result,
        lastCheck: new Date(),
      };

      if (!result) {
        this.logger.error('Database health check failed');
      }
    } catch (error) {
      this.logger.error('Health check error:', error);
      this.healthStatus = {
        database: false,
        lastCheck: new Date(),
      };
    }
  }

  getHealthStatus() {
    return this.healthStatus;
  }
}

@Injectable()
export class CircuitBreakerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CircuitBreakerMiddleware.name);
  private circuitBreakers = new Map<string, {
    failures: number;
    lastFailure: Date;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    nextAttempt: Date;
  }>();

  private readonly maxFailures = 5;
  private readonly resetTimeout = 60000; // 1 minute

  use(req: Request, res: Response, next: NextFunction) {
    const endpoint = `${req.method}:${req.path}`;
    const circuit = this.getCircuit(endpoint);

    if (circuit.state === 'OPEN' && Date.now() < circuit.nextAttempt.getTime()) {
      this.logger.warn(`Circuit breaker OPEN for ${endpoint}`);
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable',
        message: 'Circuit breaker is open',
      });
    }

    if (circuit.state === 'OPEN') {
      circuit.state = 'HALF_OPEN';
    }

    // Monitor response for failures
    res.on('finish', () => {
      if (res.statusCode >= 500) {
        this.recordFailure(endpoint);
      } else if (circuit.state === 'HALF_OPEN') {
        this.recordSuccess(endpoint);
      }
    });

    next();
  }

  private getCircuit(endpoint: string) {
    if (!this.circuitBreakers.has(endpoint)) {
      this.circuitBreakers.set(endpoint, {
        failures: 0,
        lastFailure: new Date(0),
        state: 'CLOSED',
        nextAttempt: new Date(0),
      });
    }
    return this.circuitBreakers.get(endpoint)!;
  }

  private recordFailure(endpoint: string) {
    const circuit = this.getCircuit(endpoint);
    circuit.failures++;
    circuit.lastFailure = new Date();

    if (circuit.failures >= this.maxFailures) {
      circuit.state = 'OPEN';
      circuit.nextAttempt = new Date(Date.now() + this.resetTimeout);
      this.logger.error(`Circuit breaker OPENED for ${endpoint} after ${circuit.failures} failures`);
    }
  }

  private recordSuccess(endpoint: string) {
    const circuit = this.getCircuit(endpoint);
    circuit.failures = 0;
    circuit.state = 'CLOSED';
    this.logger.log(`Circuit breaker CLOSED for ${endpoint}`);
  }
}
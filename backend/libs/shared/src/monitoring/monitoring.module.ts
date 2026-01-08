import { Module, DynamicModule, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrometheusService } from './prometheus.service';
import { MetricsController } from './metrics.controller';
import { MetricsMiddleware } from './metrics.middleware';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service';
import { CircuitBreakerHttpService } from '../circuit-breaker/circuit-breaker-http.service';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [MetricsController],
  providers: [
    PrometheusService,
    CircuitBreakerService,
    CircuitBreakerHttpService,
  ],
  exports: [
    PrometheusService,
    CircuitBreakerService,
    CircuitBreakerHttpService,
    MetricsMiddleware,
  ],
})
export class MonitoringModule {
  static forRoot(): DynamicModule {
    return {
      module: MonitoringModule,
      global: true,
    };
  }
}
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from '@shared/database/database.module';
import { MonitoringModule } from '@shared/monitoring/monitoring.module';
import { MetricsMiddleware } from '@shared/monitoring/metrics.middleware';
import { CircuitBreakerInterceptor } from '@shared/circuit-breaker/circuit-breaker.interceptor';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MonitoringModule,
    ReviewModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CircuitBreakerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .forRoutes('*');
  }
}
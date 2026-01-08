import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from '@shared/database/database.module';
import { MonitoringModule } from '@shared/monitoring/monitoring.module';
import { MetricsMiddleware } from '@shared/monitoring/metrics.middleware';
import { CircuitBreakerInterceptor } from '@shared/circuit-breaker/circuit-breaker.interceptor';
import { ProgressModule } from './progress';
import { HealthModule } from './health';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MonitoringModule,
    ProgressModule,
    HealthModule,
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
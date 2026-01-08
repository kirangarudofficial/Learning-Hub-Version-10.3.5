import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from '@app/shared/database';
import { MonitoringModule } from '@shared/monitoring/monitoring.module';
import { MetricsMiddleware } from '@shared/monitoring/metrics.middleware';
import { CircuitBreakerInterceptor } from '@shared/circuit-breaker/circuit-breaker.interceptor';
import { NotificationModule } from './notification/notification.module';
import { MICROSERVICE_QUEUES, MICROSERVICE_TOKENS } from '@app/shared/constants';

// Real-time notification imports
import { NotificationGateway } from './websocket/notification.gateway';
import { PreferencesService } from './preferences/preferences.service';
import { PreferencesController } from './preferences/preferences.controller';
import { RealtimeNotificationService } from './realtime/realtime-notification.service';
import { RealtimeNotificationController } from './realtime/realtime-notification.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
      global: true,
    }),
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_TOKENS.USER_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: MICROSERVICE_QUEUES.USER_QUEUE,
            queueOptions: {
              durable: true,
              'x-message-ttl': 60000, // 1 minute
              'x-max-retries': 3,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DatabaseModule,
    MonitoringModule,
    NotificationModule,
  ],
  controllers: [PreferencesController, RealtimeNotificationController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CircuitBreakerInterceptor,
    },
    // WebSocket Gateway
    NotificationGateway,
    // Services
    PreferencesService,
    RealtimeNotificationService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .forRoutes('*');
  }
}
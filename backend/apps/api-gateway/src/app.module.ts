import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Shared modules
import { DatabaseModule } from '@shared/database/database.module';
import { 
  JwtAuthGuard, 
  RolesGuard, 
  JwtStrategy 
} from '@shared/auth';
import { 
  GlobalExceptionFilter,
  ResponseInterceptor,
  TransformInterceptor,
  CacheInterceptor 
} from '@shared/interceptors';
import { 
  LoggingMiddleware,
  CorrelationMiddleware,
  PerformanceMiddleware,
  HealthCheckMiddleware 
} from '@shared/middleware';
import { MICROSERVICE_TOKENS } from '@shared/constants';
import { MonitoringModule } from '@shared/monitoring/monitoring.module';
import { MetricsMiddleware } from '@shared/monitoring/metrics.middleware';
import { CircuitBreakerInterceptor } from '@shared/circuit-breaker/circuit-breaker.interceptor';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PaymentsModule } from './payments/payments.module';
import { MediaModule } from './media/media.module';
import { ContentModule } from './content/content.module';
import { NotificationModule } from './notification/notification.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.development'],
      expandVariables: true,
    }),

    // JWT Configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h',
          issuer: configService.get<string>('JWT_ISSUER') || 'learning-platform',
          audience: configService.get<string>('JWT_AUDIENCE') || 'learning-platform-users',
        },
        verifyOptions: {
          issuer: configService.get<string>('JWT_ISSUER') || 'learning-platform',
          audience: configService.get<string>('JWT_AUDIENCE') || 'learning-platform-users',
        },
      }),
      inject: [ConfigService],
    }),

    // Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: configService.get('THROTTLE_SHORT_LIMIT') || 10,
        },
        {
          name: 'medium',
          ttl: 10000, // 10 seconds
          limit: configService.get('THROTTLE_MEDIUM_LIMIT') || 20,
        },
        {
          name: 'long',
          ttl: 60000, // 1 minute
          limit: configService.get('THROTTLE_LONG_LIMIT') || 100,
        },
      ],
      inject: [ConfigService],
    }),

    // Microservices Clients
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_TOKENS.USER_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'user_queue',
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': 60000,
                'x-max-retries': 3,
              },
            },
            socketOptions: {
              keepAlive: true,
              heartbeatIntervalInSeconds: 30,
              reconnectTimeInSeconds: 1,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MICROSERVICE_TOKENS.COURSE_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'course_queue',
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': 60000,
                'x-max-retries': 3,
              },
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MICROSERVICE_TOKENS.ENROLLMENT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'enrollment_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MICROSERVICE_TOKENS.AUTH_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'auth_queue',
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': 60000,
                'x-max-retries': 3,
              },
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MICROSERVICE_TOKENS.PAYMENT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'payment_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MICROSERVICE_TOKENS.NOTIFICATION_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'notification_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MICROSERVICE_TOKENS.CONTENT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'content_queue',
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': 60000,
                'x-max-retries': 3,
              },
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: MICROSERVICE_TOKENS.MEDIA_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'media_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),

    // Shared modules
    DatabaseModule,
    MonitoringModule,

    // Feature modules
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    PaymentsModule,
    MediaModule,
    ContentModule,
    NotificationModule,
    HealthModule,
  ],
  providers: [
    // JWT Strategy
    JwtStrategy,
    
    // Global Guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    
    // Global Filters
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CircuitBreakerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CorrelationMiddleware,
        LoggingMiddleware,
        PerformanceMiddleware,
        HealthCheckMiddleware,
        MetricsMiddleware,
      )
      .forRoutes('*');
  }
}
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from '@shared/database/database.module';
import { MonitoringModule } from '@shared/monitoring/monitoring.module';
import { MetricsMiddleware } from '@shared/monitoring/metrics.middleware';
import { CircuitBreakerInterceptor } from '@shared/circuit-breaker/circuit-breaker.interceptor';
import { ContentModule } from './content/content.module';
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

    // Database
    DatabaseModule,
    
    // Monitoring
    MonitoringModule,

    // Feature modules
    ContentModule,
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
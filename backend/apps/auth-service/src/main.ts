import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const logger = new Logger('AuthServiceBootstrap');

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.AUTH_QUEUE || 'auth_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Create HTTP app for REST API and documentation
  const httpApp = await NestFactory.create(AppModule);
  httpApp.setGlobalPrefix('api/auth');

  // Enable CORS with proper configuration
  httpApp.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID', 'X-Request-ID'],
  });

  // Validation
  httpApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Authentication and authorization service for Learning Hub platform')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api/auth/docs', httpApp, document);

  // Start both services
  await app.listen();
  await httpApp.listen(3002);

  logger.log('🚀 Auth Service is running on port 3002 and listening on RabbitMQ');
}

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  logger.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Error handlers
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap().catch((error) => {
  logger.error('Failed to start Auth Service:', error);
  process.exit(1);
});
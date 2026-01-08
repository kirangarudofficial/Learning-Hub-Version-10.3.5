import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

const logger = new Logger('UserServiceBootstrap');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: true, // FIXED: Changed from false to prevent message loss
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  logger.log('🚀 User Service is listening on RabbitMQ');
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
  logger.error('Failed to start User Service:', error);
  process.exit(1);
});
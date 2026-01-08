import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MICROSERVICE_QUEUES } from '@app/shared/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS for WebSocket connections
  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS')?.split(',') || ['http://localhost:5173'],
    credentials: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: MICROSERVICE_QUEUES.NOTIFICATION_QUEUE,
      queueOptions: {
        durable: true,
        'x-message-ttl': 60000, // 1 minute
        'x-max-retries': 3,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('NOTIFICATION_SERVICE_PORT') || 3006);
  console.log(`Notification Service is running on: ${await app.getUrl()}`);
  console.log(`WebSocket server is ready for connections at ws://localhost:${configService.get<number>('NOTIFICATION_SERVICE_PORT')}/notifications`);
}

bootstrap();
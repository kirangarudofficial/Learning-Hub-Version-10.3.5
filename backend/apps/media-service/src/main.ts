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

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: MICROSERVICE_QUEUES.MEDIA_QUEUE,
      queueOptions: {
        durable: true,
        'x-message-ttl': 60000, // 1 minute
        'x-max-retries': 3,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('MEDIA_SERVICE_PORT') || 3007);
  console.log(`Media Service is running on: ${await app.getUrl()}`);
}

bootstrap();
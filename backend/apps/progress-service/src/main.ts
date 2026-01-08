import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MICROSERVICE_QUEUES } from '@shared/constants';

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.PROGRESS_QUEUE || MICROSERVICE_QUEUES.PROGRESS_QUEUE,
      queueOptions: {
        durable: true,
        'x-message-ttl': 60000, // 1 minute TTL for messages
        'x-max-retries': 3, // Max retries for failed messages
      },
    },
  });

  // Create HTTP app for REST API and documentation
  const httpApp = await NestFactory.create(AppModule);
  httpApp.setGlobalPrefix('api/progress');
  
  // Enable CORS
  httpApp.enableCors();

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
    .setTitle('Progress Service API')
    .setDescription('Progress tracking service for Learning Hub platform')
    .setVersion('1.0')
    .addTag('progress')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api/progress/docs', httpApp, document);

  // Start both services
  await app.listen();
  await httpApp.listen(3012);
  
  console.log(`Progress service microservice is running`);
  console.log(`Progress service REST API is running on: http://localhost:3012/api/progress`);
  console.log(`Progress service Swagger documentation is available at: http://localhost:3012/api/progress/docs`);
}

bootstrap();
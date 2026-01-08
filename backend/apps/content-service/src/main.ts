import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.CONTENT_QUEUE || 'content_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Create HTTP app for REST API and documentation
  const httpApp = await NestFactory.create(AppModule);
  httpApp.setGlobalPrefix('api/content');
  
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
    .setTitle('Content Service API')
    .setDescription('Content management service for Learning Hub platform')
    .setVersion('1.0')
    .addTag('content')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api/content/docs', httpApp, document);

  // Start both services
  await app.listen();
  await httpApp.listen(3011);
  
  console.log(`🚀 Content Service is running on port 3011 and listening on RabbitMQ`);
}

bootstrap();
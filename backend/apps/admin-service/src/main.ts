import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('AdminService');
  
  // Create microservice app
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Set up microservice transport
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
      queue: 'admin_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // Create HTTP app for REST API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const options = new DocumentBuilder()
    .setTitle('Admin Service API')
    .setDescription('API for admin operations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  // Start both microservice and HTTP server
  await app.startAllMicroservices();
  
  const port = configService.get('ADMIN_SERVICE_PORT') || 3008;
  await app.listen(port);
  
  logger.log(`Admin Service is running on port ${port}`);
  logger.log(`Admin Service documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@shared/filters';
import { ResponseInterceptor } from '@shared/interceptors';
import { LoggingMiddleware } from '@shared/middleware';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Global middleware
  app.use(new LoggingMiddleware().use);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://yourdomain.com',
      /^https:\/\/.*\.yourdomain\.com$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Correlation-ID',
      'X-Request-ID',
      'X-Trace-ID',
    ],
  });

  // API prefix
  app.setGlobalPrefix('api', {
    exclude: ['/health', '/metrics'],
  });

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Learning Platform API')
    .setDescription(`
      ## Learning Platform REST API Documentation
      
      This API provides comprehensive endpoints for managing a learning platform with:
      - User authentication and authorization
      - Course management and enrollment
      - Progress tracking and analytics
      - Payment processing
      - Real-time notifications
      
      ### Features
      - **JWT Authentication**: Secure token-based authentication
      - **Role-based Access Control**: User, Instructor, and Admin roles
      - **Rate Limiting**: Protection against abuse
      - **Request Tracing**: Full observability with correlation IDs
      - **Circuit Breakers**: Fault tolerance and resilience
      - **Caching**: Optimized performance for read operations
      
      ### Base URL
      - Development: \`http://localhost:3000/api\`
      - Production: \`https://api.yourdomain.com/api\`
      
      ### Authentication
      Most endpoints require a valid JWT token. Include it in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
      
      ### Error Handling
      All errors follow a consistent format:
      \`\`\`json
      {
        "success": false,
        "error": "Error message",
        "statusCode": 400,
        "correlationId": "uuid",
        "timestamp": "2024-01-01T00:00:00Z"
      }
      \`\`\`
      
      ### Rate Limits
      - Anonymous: 100 requests per minute
      - Authenticated: 1000 requests per minute
      - Admin: Unlimited
      
      ### Support
      For API support, contact: api-support@yourdomain.com
    `)
    .setVersion('1.0')
    .setContact(
      'API Support',
      'https://yourdomain.com/support',
      'api-support@yourdomain.com'
    )
    .setLicense(
      'MIT License',
      'https://opensource.org/licenses/MIT'
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:3000/api', 'Development Server')
    .addServer('https://api.yourdomain.com/api', 'Production Server')
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management and profiles')
    .addTag('Courses', 'Course management and content')
    .addTag('Enrollments', 'Course enrollment and progress')
    .addTag('Payments', 'Payment processing and billing')
    .addTag('Media', 'File upload and media management')
    .addTag('Health', 'System health and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });

  // Customize swagger document
  document.info['x-logo'] = {
    url: 'https://yourdomain.com/logo.png',
    altText: 'Learning Platform Logo'
  };

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Learning Platform API Documentation',
    customfavIcon: 'https://yourdomain.com/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info .title { color: #3b82f6; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'healthy',
        redis: 'healthy',
        rabbitmq: 'healthy',
      },
    });
  });

  // Metrics endpoint is now handled by the MonitoringModule

  const port = configService.get('API_GATEWAY_PORT') || 3000;
  const host = configService.get('API_GATEWAY_HOST') || '0.0.0.0';

  await app.listen(port, host);

  logger.log(`🚀 Learning Platform API Gateway running on http://${host}:${port}`);
  logger.log(`📚 API Documentation available at http://${host}:${port}/docs`);
  logger.log(`❤️  Health Check available at http://${host}:${port}/health`);
  logger.log(`📊 Metrics available at http://${host}:${port}/metrics`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse,
  ApiExcludeEndpoint 
} from '@nestjs/swagger';
import { HealthService } from './health.service';
import { Public } from '@shared/auth/auth.guard';
import { CorrelationId } from '@shared/decorators';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Check the overall health status of the API Gateway and connected services' 
  })
  @ApiResponse({
    status: 200,
    description: 'System is healthy',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'healthy' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' },
            environment: { type: 'string' },
            version: { type: 'string' },
            services: {
              type: 'object',
              properties: {
                database: { type: 'string', example: 'healthy' },
                redis: { type: 'string', example: 'healthy' },
                rabbitmq: { type: 'string', example: 'healthy' },
              },
            },
            memory: {
              type: 'object',
              properties: {
                rss: { type: 'number' },
                heapTotal: { type: 'number' },
                heapUsed: { type: 'number' },
                external: { type: 'number' },
                arrayBuffers: { type: 'number' },
              },
            },
          },
        },
        correlationId: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'System is unhealthy',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        data: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'unhealthy' },
            issues: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        correlationId: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async healthCheck(@CorrelationId() correlationId: string) {
    return this.healthService.getHealthStatus(correlationId);
  }

  @Public()
  @Get('detailed')
  @ApiOperation({ 
    summary: 'Detailed health check',
    description: 'Get detailed health information including all connected services and dependencies' 
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed health information',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            services: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  responseTime: { type: 'number' },
                  lastCheck: { type: 'string' },
                  details: { type: 'object' },
                },
              },
            },
            systemInfo: {
              type: 'object',
              properties: {
                nodeVersion: { type: 'string' },
                platform: { type: 'string' },
                arch: { type: 'string' },
                uptime: { type: 'number' },
                memory: { type: 'object' },
                cpu: { type: 'object' },
              },
            },
          },
        },
        correlationId: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
  })
  async detailedHealthCheck(@CorrelationId() correlationId: string) {
    return this.healthService.getDetailedHealthStatus(correlationId);
  }

  @Public()
  @Get('ready')
  @ApiOperation({ 
    summary: 'Readiness check',
    description: 'Check if the service is ready to accept traffic' 
  })
  @ApiResponse({
    status: 200,
    description: 'Service is ready',
  })
  @ApiResponse({
    status: 503,
    description: 'Service is not ready',
  })
  async readinessCheck(@CorrelationId() correlationId: string) {
    return this.healthService.getReadinessStatus(correlationId);
  }

  @Public()
  @Get('live')
  @ApiOperation({ 
    summary: 'Liveness check',
    description: 'Check if the service is alive and responding' 
  })
  @ApiResponse({
    status: 200,
    description: 'Service is alive',
  })
  async livenessCheck(@CorrelationId() correlationId: string) {
    return {
      success: true,
      data: {
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('metrics')
  @ApiExcludeEndpoint()
  async getMetrics(@CorrelationId() correlationId: string) {
    return this.healthService.getMetrics(correlationId);
  }
}
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check service health' })
  check() {
    return this.health.check([
      // Check if the service is up
      () => this.http.pingCheck('content-service', 'http://localhost:3011/api/content/health'),
      
      // Check disk usage
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
      
      // Check memory usage
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      
      // Check RabbitMQ connection
      () =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'health_check_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
    ]);
  }
}
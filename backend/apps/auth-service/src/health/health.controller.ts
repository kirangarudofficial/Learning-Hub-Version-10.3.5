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
      () => this.http.pingCheck('api-gateway', 'http://localhost:3000/api/health'),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  @ApiOperation({ summary: 'Kubernetes liveness probe' })
  liveness() {
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Kubernetes readiness probe' })
  readiness() {
    return this.health.check([
      () =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [this.configService.get<string>('RABBITMQ_URL')],
            queue: 'auth_queue',
          },
        }),
    ]);
  }
}
import { Controller, Get, Header, Inject, Injectable } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

@Controller('metrics')
@Injectable()
export class MetricsController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  async getMetrics() {
    const contentType = await this.prometheusService.getContentType();
    return {
      contentType,
      metrics: await this.prometheusService.getMetrics(),
    };
  }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { ApiResponseUtil } from '@shared/utils';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getHealthStatus() {
    return ApiResponseUtil.success({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'API Gateway',
      version: '1.0.0',
    });
  }

  async getDetailedHealthStatus() {
    const checks = {
      database: await this.checkDatabase(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };

    const overallStatus = checks.database ? 'OK' : 'ERROR';

    return ApiResponseUtil.success({
      status: overallStatus,
      checks,
    });
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}
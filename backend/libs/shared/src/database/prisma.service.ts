import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query' as any, (e: any) => {
        if (e.duration > 1000) {
          this.logger.warn(`Slow query detected: ${e.duration}ms - ${e.query}`);
        }
      });
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to database successfully');
      
      // Test the connection
      await this.$queryRaw`SELECT 1`;
      this.logger.log('Database connection verified');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Disconnected from database');
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  // Transaction helper
  async transaction<T>(fn: (prisma: PrismaService) => Promise<T>): Promise<T> {
    return this.$transaction(async (prisma) => {
      return fn(prisma as PrismaService);
    });
  }

  // Soft delete helpers
  async softDelete(model: string, where: any) {
    return (this as any)[model].update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(model: string, where: any) {
    return (this as any)[model].update({
      where,
      data: {
        deletedAt: null,
      },
    });
  }

  // Pagination helper
  async paginate<T>(
    model: string,
    {
      page = 1,
      limit = 10,
      where = {},
      orderBy = {},
      include = {},
      select = undefined,
    }: {
      page?: number;
      limit?: number;
      where?: any;
      orderBy?: any;
      include?: any;
      select?: any;
    }
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      (this as any)[model].findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include,
        select,
      }),
      (this as any)[model].count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  // Bulk operations
  async bulkCreate<T>(model: string, data: T[]): Promise<{ count: number }> {
    return (this as any)[model].createMany({
      data,
      skipDuplicates: true,
    });
  }

  async bulkUpdate<T>(model: string, data: Array<{ where: any; data: T }>) {
    const updatePromises = data.map(({ where, data: updateData }) =>
      (this as any)[model].update({
        where,
        data: updateData,
      })
    );

    return Promise.all(updatePromises);
  }

  // Search helper
  async search<T>(
    model: string,
    {
      query,
      searchFields,
      page = 1,
      limit = 10,
      where = {},
      orderBy = {},
      include = {},
    }: {
      query: string;
      searchFields: string[];
      page?: number;
      limit?: number;
      where?: any;
      orderBy?: any;
      include?: any;
    }
  ) {
    const searchConditions = searchFields.map(field => ({
      [field]: {
        contains: query,
        mode: 'insensitive',
      },
    }));

    const searchWhere = {
      ...where,
      OR: searchConditions,
    };

    return this.paginate<T>(model, {
      page,
      limit,
      where: searchWhere,
      orderBy,
      include,
    });
  }
}
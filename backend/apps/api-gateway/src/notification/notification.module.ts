import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController } from './notification.controller';
import { MICROSERVICE_QUEUES, MICROSERVICE_TOKENS } from '@app/shared/constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_TOKENS.NOTIFICATION_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: MICROSERVICE_QUEUES.NOTIFICATION_QUEUE,
            queueOptions: {
              durable: true,
              'x-message-ttl': 60000, // 1 minute
              'x-max-retries': 3,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
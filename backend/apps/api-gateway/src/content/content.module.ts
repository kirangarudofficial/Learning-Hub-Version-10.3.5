import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MICROSERVICE_TOKENS } from '@shared/constants';
import { ContentController } from './content.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_TOKENS.CONTENT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: 'content_queue',
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': 60000,
                'x-max-retries': 3,
              },
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ContentController],
})
export class ContentModule {}
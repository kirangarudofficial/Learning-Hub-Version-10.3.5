import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_TOKENS, MICROSERVICE_QUEUES } from '@app/shared/constants';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_TOKENS.MEDIA_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: MICROSERVICE_QUEUES.MEDIA_QUEUE,
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
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
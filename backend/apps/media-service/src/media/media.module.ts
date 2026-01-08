import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaService } from '@app/shared/database';

@Module({
  controllers: [MediaController],
  providers: [MediaService, PrismaService],
  exports: [MediaService],
})
export class MediaModule {}
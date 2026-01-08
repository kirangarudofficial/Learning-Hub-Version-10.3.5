import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  UseInterceptors, 
  UploadedFile,
  UploadedFiles,
  Body 
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser, Roles } from '@shared/decorators/user.decorator';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata?: any,
  ) {
    return this.mediaService.uploadSingleFile(user.id, file, metadata);
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(
    @CurrentUser() user: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() metadata?: any,
  ) {
    return this.mediaService.uploadMultipleFiles(user.id, files, metadata);
  }

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  @Roles('INSTRUCTOR', 'ADMIN')
  async uploadVideo(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: { courseId?: string; lessonId?: string; title?: string },
  ) {
    return this.mediaService.uploadVideo(user.id, file, metadata);
  }

  @Get('file/:id')
  async getFile(@Param('id') id: string) {
    return this.mediaService.getFile(id);
  }

  @Get('user/:userId/files')
  async getUserFiles(@Param('userId') userId: string) {
    return this.mediaService.getUserFiles(userId);
  }
}
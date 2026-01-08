import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICE_TOKENS, PATTERNS } from '@app/shared/constants';
import { CreateMediaDto, MediaType } from '@app/shared/dto/media.dto';

@Injectable()
export class MediaService {
  constructor(
    @Inject(MICROSERVICE_TOKENS.MEDIA_SERVICE)
    private mediaServiceClient: ClientProxy,
  ) {}

  async uploadSingleFile(userId: string, file: Express.Multer.File, metadata?: any) {
    try {
      const createMediaDto: CreateMediaDto = {
        userId,
        type: this.determineMediaType(file.mimetype),
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: '', // Will be set by the media service after upload
        metadata: metadata || {},
        isPublic: metadata?.isPublic || false,
        entityId: metadata?.entityId,
        entityType: metadata?.entityType,
      };

      // First upload the file to storage
      const uploadResult = await firstValueFrom(
        this.mediaServiceClient.send('upload_file', {
          buffer: file.buffer,
          originalName: file.originalname,
          mimeType: file.mimetype,
        }),
      );

      // Then create the media record with the URL from the upload
      createMediaDto.url = uploadResult.url;
      
      return firstValueFrom(
        this.mediaServiceClient.send(PATTERNS.MEDIA.CREATE, createMediaDto),
      );
    } catch (error) {
      throw error;
    }
  }

  async uploadMultipleFiles(userId: string, files: Express.Multer.File[], metadata?: any) {
    try {
      const results = [];
      
      for (const file of files) {
        const result = await this.uploadSingleFile(userId, file, metadata);
        results.push(result);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  async uploadVideo(userId: string, file: Express.Multer.File, metadata: any) {
    try {
      // Set video-specific metadata
      const videoMetadata = {
        ...metadata,
        entityType: 'lesson',
        entityId: metadata.lessonId,
        title: metadata.title,
        isPublic: false,
      };
      
      return this.uploadSingleFile(userId, file, videoMetadata);
    } catch (error) {
      throw error;
    }
  }

  async getFile(fileId: string) {
    try {
      return firstValueFrom(
        this.mediaServiceClient.send(PATTERNS.MEDIA.FIND_ONE, fileId),
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserFiles(userId: string) {
    try {
      return firstValueFrom(
        this.mediaServiceClient.send(PATTERNS.MEDIA.FIND_BY_USER, userId),
      );
    } catch (error) {
      throw error;
    }
  }
  
  private determineMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else if (mimeType.startsWith('audio/')) {
      return MediaType.AUDIO;
    } else if (
      mimeType === 'application/pdf' ||
      mimeType === 'application/msword' ||
      mimeType.includes('document') ||
      mimeType.includes('presentation') ||
      mimeType.includes('spreadsheet')
    ) {
      return MediaType.DOCUMENT;
    } else {
      return MediaType.OTHER;
    }
  }
}
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@shared/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
}

export enum MediaStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
  DELETED = 'deleted',
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  buffer: Buffer;
  size: number;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  [key: string]: any;
}

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private readonly uploadDir = this.configService.get('UPLOAD_DEST') || './uploads';
  private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
  private readonly allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  private readonly allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

  async uploadFile(file: FileUpload, userId: string, entityType?: string, entityId?: string) {
    try {
      // Validate file type and size
      this.validateFile(file);

      // Ensure upload directory exists
      this.ensureUploadDirectory();

      const fileId = uuidv4();
      const fileExtension = this.getFileExtension(file.mimetype);
      const fileName = `${fileId}.${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);
      const publicUrl = `/uploads/${fileName}`;

      // Save file to disk
      await fs.promises.writeFile(filePath, file.buffer);

      // Determine media type
      const mediaType = this.determineMediaType(file.mimetype);

      // Process metadata based on file type
      let metadata: MediaMetadata = {};
      if (mediaType === MediaType.IMAGE) {
        metadata = await this.processImageMetadata(filePath);
      }

      // Create media record
      const media = await this.prisma.media.create({
        data: {
          id: fileId,
          type: mediaType,
          originalName: file.filename,
          fileName,
          filePath,
          mimeType: file.mimetype,
          size: file.size,
          url: publicUrl,
          userId,
          entityType,
          entityId,
          metadata: metadata as any,
          status: MediaStatus.READY,
        },
      });

      return {
        success: true,
        data: media,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('File upload error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async uploadMultipleFiles(files: FileUpload[], userId: string, entityType?: string, entityId?: string) {
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, userId, entityType, entityId);
        results.push(result.data);
      } catch (error) {
        errors.push({
          filename: file.filename,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      uploaded: results.length,
      failed: errors.length,
      files: results,
      errors,
    };
  }

  async findAll(params: any = {}) {
    const { page = 1, limit = 10, type, userId, entityType } = params;
    const skip = (page - 1) * limit;

    const where = {
      status: { not: MediaStatus.DELETED },
      ...(type && { type }),
      ...(userId && { userId }),
      ...(entityType && { entityType }),
    };

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      media,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: string, params: any = {}) {
    const { page = 1, limit = 10, type } = params;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      status: { not: MediaStatus.DELETED },
      ...(type && { type }),
    };

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      media,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByEntity(entityId: string, entityType: string, params: any = {}) {
    const { type } = params;
    
    const where = {
      entityId,
      entityType,
      status: { not: MediaStatus.DELETED },
      ...(type && { type }),
    };

    return this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findFirst({
      where: { 
        id,
        status: { not: MediaStatus.DELETED },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  async updateMetadata(id: string, metadata: MediaMetadata) {
    await this.findOne(id);

    return this.prisma.media.update({
      where: { id },
      data: { 
        metadata: metadata as any,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string, hard: boolean = false) {
    const media = await this.findOne(id);

    if (hard) {
      // Delete physical file
      try {
        if (media.filePath && fs.existsSync(media.filePath)) {
          await fs.promises.unlink(media.filePath);
        }
        // Delete thumbnail if exists
        if (media.metadata?.thumbnailUrl) {
          const thumbnailPath = path.join(this.uploadDir, path.basename(media.metadata.thumbnailUrl as string));
          if (fs.existsSync(thumbnailPath)) {
            await fs.promises.unlink(thumbnailPath);
          }
        }
      } catch (error) {
        console.error('Error deleting physical file:', error);
      }

      // Delete from database
      return this.prisma.media.delete({
        where: { id },
      });
    } else {
      // Soft delete
      return this.prisma.media.update({
        where: { id },
        data: { 
          status: MediaStatus.DELETED,
          updatedAt: new Date(),
        },
      });
    }
  }

  async getFileStream(id: string) {
    const media = await this.findOne(id);
    
    if (!media.filePath || !fs.existsSync(media.filePath)) {
      throw new NotFoundException('Physical file not found');
    }

    return {
      stream: fs.createReadStream(media.filePath),
      media,
    };
  }

  async generateThumbnail(id: string, width: number = 300, height: number = 200) {
    const media = await this.findOne(id);

    if (media.type !== MediaType.IMAGE) {
      throw new BadRequestException('Thumbnails can only be generated for images');
    }

    if (!media.filePath || !fs.existsSync(media.filePath)) {
      throw new NotFoundException('Source image file not found');
    }

    const thumbnailFileName = `thumb_${width}x${height}_${media.fileName}`;
    const thumbnailPath = path.join(this.uploadDir, thumbnailFileName);
    const thumbnailUrl = `/uploads/${thumbnailFileName}`;

    try {
      await sharp(media.filePath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(thumbnailPath);

      // Update media metadata with thumbnail info
      const updatedMetadata = {
        ...media.metadata as any,
        thumbnailUrl,
        thumbnailWidth: width,
        thumbnailHeight: height,
      };

      await this.updateMetadata(id, updatedMetadata);

      return {
        success: true,
        thumbnailUrl,
        message: 'Thumbnail generated successfully',
      };
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      throw new InternalServerErrorException('Failed to generate thumbnail');
    }
  }

  private validateFile(file: FileUpload) {
    const maxSize = parseInt(this.configService.get('MAX_FILE_SIZE') || '10485760'); // 10MB default
    
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${maxSize} bytes`);
    }

    const allowedTypes = [
      ...this.allowedImageTypes,
      ...this.allowedVideoTypes,
      ...this.allowedDocumentTypes,
      ...this.allowedAudioTypes,
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed`);
    }
  }

  private determineMediaType(mimeType: string): MediaType {
    if (this.allowedImageTypes.includes(mimeType)) return MediaType.IMAGE;
    if (this.allowedVideoTypes.includes(mimeType)) return MediaType.VIDEO;
    if (this.allowedDocumentTypes.includes(mimeType)) return MediaType.DOCUMENT;
    if (this.allowedAudioTypes.includes(mimeType)) return MediaType.AUDIO;
    return MediaType.DOCUMENT; // Default fallback
  }

  private getFileExtension(mimeType: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'video/mp4': 'mp4',
      'video/avi': 'avi',
      'video/mov': 'mov',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
    };
    
    return extensions[mimeType] || 'bin';
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private async processImageMetadata(filePath: string): Promise<MediaMetadata> {
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        hasAlpha: metadata.hasAlpha,
        channels: metadata.channels,
      };
    } catch (error) {
      console.error('Error processing image metadata:', error);
      return {};
    }
  }

  async getStats(userId?: string) {
    const where = {
      status: { not: MediaStatus.DELETED },
      ...(userId && { userId }),
    };

    const [total, byType, totalSize] = await Promise.all([
      this.prisma.media.count({ where }),
      this.prisma.media.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      this.prisma.media.aggregate({
        where,
        _sum: { size: true },
      }),
    ]);

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as any),
      totalSize: totalSize._sum.size || 0,
      totalSizeFormatted: this.formatBytes(totalSize._sum.size || 0),
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

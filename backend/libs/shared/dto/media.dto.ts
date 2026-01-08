import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export enum MediaStatus {
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

export class CreateMediaDto {
  @ApiProperty({
    description: 'The type of media',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;

  @ApiProperty({
    description: 'The original filename',
    example: 'profile-picture.jpg',
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({
    description: 'The MIME type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({
    description: 'The size of the file in bytes',
    example: 1024000,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  size: number;

  @ApiProperty({
    description: 'The URL where the file is stored',
    example: 'https://storage.example.com/files/profile-picture-123.jpg',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'The owner user ID',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The related entity ID (e.g., course, lesson)',
    example: 'course123',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityId?: string;

  @ApiProperty({
    description: 'The related entity type',
    example: 'course',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiProperty({
    description: 'Additional metadata for the media',
    example: { width: 1920, height: 1080, duration: 120 },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Whether the media is public or private',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateMediaDto {
  @ApiProperty({
    description: 'The status of the media',
    enum: MediaStatus,
    example: MediaStatus.READY,
    required: false,
  })
  @IsEnum(MediaStatus)
  @IsOptional()
  status?: MediaStatus;

  @ApiProperty({
    description: 'The URL where the file is stored',
    example: 'https://storage.example.com/files/profile-picture-123.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'The related entity ID (e.g., course, lesson)',
    example: 'course123',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityId?: string;

  @ApiProperty({
    description: 'The related entity type',
    example: 'course',
    required: false,
  })
  @IsString()
  @IsOptional()
  entityType?: string;

  @ApiProperty({
    description: 'Additional metadata for the media',
    example: { width: 1920, height: 1080, duration: 120 },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Whether the media is public or private',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class MediaResponseDto {
  @ApiProperty({
    description: 'The media ID',
    example: 'media123',
  })
  id: string;

  @ApiProperty({
    description: 'The type of media',
    enum: MediaType,
    example: MediaType.IMAGE,
  })
  type: MediaType;

  @ApiProperty({
    description: 'The status of the media',
    enum: MediaStatus,
    example: MediaStatus.READY,
  })
  status: MediaStatus;

  @ApiProperty({
    description: 'The original filename',
    example: 'profile-picture.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'The MIME type of the file',
    example: 'image/jpeg',
  })
  mimeType: string;

  @ApiProperty({
    description: 'The size of the file in bytes',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: 'The URL where the file is stored',
    example: 'https://storage.example.com/files/profile-picture-123.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'The owner user ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'The related entity ID (e.g., course, lesson)',
    example: 'course123',
  })
  entityId?: string;

  @ApiProperty({
    description: 'The related entity type',
    example: 'course',
  })
  entityType?: string;

  @ApiProperty({
    description: 'Additional metadata for the media',
    example: { width: 1920, height: 1080, duration: 120 },
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Whether the media is public or private',
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: 'When the media was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the media was last updated',
    example: '2023-01-01T12:05:00Z',
  })
  updatedAt: Date;
}
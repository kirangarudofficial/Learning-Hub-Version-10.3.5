import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID, IsEnum, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export enum ContentType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PDF = 'PDF',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  CODE = 'CODE',
  PRESENTATION = 'PRESENTATION',
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export class CreateContentDto {
  @ApiProperty({ description: 'Content title', example: 'Introduction to JavaScript' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content description', example: 'Learn the basics of JavaScript programming' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Content type', enum: ContentType, example: ContentType.VIDEO })
  @IsEnum(ContentType)
  @IsNotEmpty()
  type: ContentType;

  @ApiProperty({ description: 'Content data (URL, text, etc.)', example: 'https://example.com/video.mp4' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'Course ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'Module ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({ description: 'Duration in minutes (for video/audio)', example: 15, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'Order within module', example: 1, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ description: 'Is this content required to complete the module', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({ description: 'Tags for the content', example: ['javascript', 'beginner'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Content status', enum: ContentStatus, example: ContentStatus.DRAFT, required: false })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class UpdateContentDto {
  @ApiProperty({ description: 'Content title', example: 'Introduction to JavaScript', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Content description', example: 'Learn the basics of JavaScript programming', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Content type', enum: ContentType, example: ContentType.VIDEO, required: false })
  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;

  @ApiProperty({ description: 'Content data (URL, text, etc.)', example: 'https://example.com/video.mp4', required: false })
  @IsString()
  @IsOptional()
  data?: string;

  @ApiProperty({ description: 'Module ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174001', required: false })
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @ApiProperty({ description: 'Duration in minutes (for video/audio)', example: 15, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'Order within module', example: 1, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiProperty({ description: 'Is this content required to complete the module', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({ description: 'Tags for the content', example: ['javascript', 'beginner'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Content status', enum: ContentStatus, example: ContentStatus.PUBLISHED, required: false })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}

export class ContentResponseDto {
  @ApiProperty({ description: 'Content ID', example: '123e4567-e89b-12d3-a456-426614174002' })
  id: string;

  @ApiProperty({ description: 'Content title', example: 'Introduction to JavaScript' })
  title: string;

  @ApiProperty({ description: 'Content description', example: 'Learn the basics of JavaScript programming' })
  description: string;

  @ApiProperty({ description: 'Content type', enum: ContentType, example: ContentType.VIDEO })
  type: ContentType;

  @ApiProperty({ description: 'Content data (URL, text, etc.)', example: 'https://example.com/video.mp4' })
  data: string;

  @ApiProperty({ description: 'Course ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174000' })
  courseId: string;

  @ApiProperty({ description: 'Module ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174001' })
  moduleId: string;

  @ApiProperty({ description: 'Duration in minutes (for video/audio)', example: 15 })
  duration?: number;

  @ApiProperty({ description: 'Order within module', example: 1 })
  order?: number;

  @ApiProperty({ description: 'Is this content required to complete the module', example: true })
  isRequired: boolean;

  @ApiProperty({ description: 'Tags for the content', example: ['javascript', 'beginner'] })
  tags: string[];

  @ApiProperty({ description: 'Content status', enum: ContentStatus, example: ContentStatus.PUBLISHED })
  status: ContentStatus;

  @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2023-01-02T00:00:00Z' })
  updatedAt: Date;
}
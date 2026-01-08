import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional, IsArray, Min, Max, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgressDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The ID of the course',
    example: 'course123',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @ApiProperty({
    description: 'The progress percentage (0-100)',
    example: 25.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressPercentage?: number;

  @ApiProperty({
    description: 'IDs of completed lessons',
    example: ['lesson1', 'lesson2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  @IsOptional()
  completedLessonIds?: string[];
}

export class UpdateProgressDto {
  @ApiProperty({
    description: 'The progress percentage (0-100)',
    example: 50.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressPercentage?: number;

  @ApiProperty({
    description: 'IDs of completed lessons to add',
    example: ['lesson1', 'lesson2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsUUID(undefined, { each: true })
  @IsOptional()
  completedLessonIds?: string[];

  @ApiProperty({
    description: 'Last accessed timestamp',
    example: new Date(),
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastAccessed?: Date;
}

export class ProgressResponseDto {
  @ApiProperty({
    description: 'The ID of the progress record',
    example: 'progress123',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'The ID of the course',
    example: 'course123',
  })
  courseId: string;

  @ApiProperty({
    description: 'The progress percentage (0-100)',
    example: 75.5,
  })
  progressPercentage: number;

  @ApiProperty({
    description: 'Last accessed timestamp',
    example: new Date(),
  })
  lastAccessed: Date;

  @ApiProperty({
    description: 'Completed lessons',
    example: [{ id: 'lesson1', title: 'Introduction' }],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
      },
    },
  })
  completedLessons: any[];
}
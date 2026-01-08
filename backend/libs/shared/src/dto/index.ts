import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsNumber, IsArray, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Role, CourseLevel, LessonType } from '@prisma/client';

// Auth DTOs
export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

// User DTOs
export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;
}

// Course DTOs
export class CreateCourseDto {
  @ApiProperty({ example: 'Complete React Development Course' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn React from basics to advanced' })
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 149.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ example: '40 hours' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({ enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 'Programming' })
  @IsString()
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whatYouWillLearn?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}

export class UpdateCourseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ enum: CourseLevel })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whatYouWillLearn?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];
}

// Course Module DTOs
export class CreateCourseModuleDto {
  @ApiProperty({ example: 'Introduction to React' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '2 hours' })
  @IsOptional()
  @IsString()
  duration?: string;
}

export class UpdateCourseModuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;
}

// Lesson DTOs
export class CreateLessonDto {
  @ApiProperty({ example: 'What is React?' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: '15 minutes' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({ enum: LessonType })
  @IsEnum(LessonType)
  type: LessonType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

export class UpdateLessonDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ enum: LessonType })
  @IsOptional()
  @IsEnum(LessonType)
  type?: LessonType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

// Enrollment DTOs
export class CreateEnrollmentDto {
  @ApiProperty()
  @IsString()
  courseId: string;
}

// Review DTOs
export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Great course!' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty()
  @IsString()
  courseId: string;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}

// Progress DTOs
export class UpdateProgressDto {
  @ApiProperty()
  @IsString()
  lessonId: string;

  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiPropertyOptional({ example: 75.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercentage?: number;
}

// Note DTOs
export class CreateNoteDto {
  @ApiProperty({ example: 'Important concept explained here' })
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  lessonId: string;

  @ApiPropertyOptional({ example: 120.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timestamp?: number;
}

export class UpdateNoteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  timestamp?: number;
}

// Pagination DTOs
export class PaginationDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'desc' })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}

// Payment DTOs
export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  courseId: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'stripe' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

// Instructor DTOs
export class CreateInstructorProfileDto {
  @ApiPropertyOptional({ example: 'Experienced React developer' })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class UpdateInstructorProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;
}
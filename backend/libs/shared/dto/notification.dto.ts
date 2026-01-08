import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The type of notification',
    enum: NotificationType,
    example: NotificationType.EMAIL,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({
    description: 'The recipient user ID',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The notification subject',
    example: 'New Course Available',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'The notification content',
    example: 'A new course "Advanced JavaScript" is now available!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Additional data for the notification',
    example: { courseId: 'course123' },
    required: false,
  })
  @IsOptional()
  data?: Record<string, any>;

  @ApiProperty({
    description: 'The notification template ID (if using templates)',
    example: 'welcome-email',
    required: false,
  })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiProperty({
    description: 'Template variables for dynamic content',
    example: { userName: 'John', courseName: 'Advanced JavaScript' },
    required: false,
  })
  @IsOptional()
  templateVars?: Record<string, any>;
}

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'The notification status',
    enum: NotificationStatus,
    example: NotificationStatus.SENT,
    required: false,
  })
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @ApiProperty({
    description: 'The notification content',
    example: 'Updated content for the notification',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Additional data for the notification',
    example: { courseId: 'course123' },
    required: false,
  })
  @IsOptional()
  data?: Record<string, any>;
}

export class NotificationResponseDto {
  @ApiProperty({
    description: 'The notification ID',
    example: 'notif123',
  })
  id: string;

  @ApiProperty({
    description: 'The type of notification',
    enum: NotificationType,
    example: NotificationType.EMAIL,
  })
  type: NotificationType;

  @ApiProperty({
    description: 'The recipient user ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'The notification subject',
    example: 'New Course Available',
  })
  subject: string;

  @ApiProperty({
    description: 'The notification content',
    example: 'A new course "Advanced JavaScript" is now available!',
  })
  content: string;

  @ApiProperty({
    description: 'The notification status',
    enum: NotificationStatus,
    example: NotificationStatus.SENT,
  })
  status: NotificationStatus;

  @ApiProperty({
    description: 'Additional data for the notification',
    example: { courseId: 'course123' },
  })
  data?: Record<string, any>;

  @ApiProperty({
    description: 'When the notification was created',
    example: '2023-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the notification was last updated',
    example: '2023-01-01T12:05:00Z',
  })
  updatedAt: Date;
}

export class SendBulkNotificationsDto {
  @ApiProperty({
    description: 'The type of notification',
    enum: NotificationType,
    example: NotificationType.EMAIL,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({
    description: 'The recipient user IDs',
    example: ['user123', 'user456'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  userIds: string[];

  @ApiProperty({
    description: 'The notification subject',
    example: 'New Course Available',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'The notification content',
    example: 'A new course "Advanced JavaScript" is now available!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Additional data for the notification',
    example: { courseId: 'course123' },
    required: false,
  })
  @IsOptional()
  data?: Record<string, any>;

  @ApiProperty({
    description: 'The notification template ID (if using templates)',
    example: 'welcome-email',
    required: false,
  })
  @IsString()
  @IsOptional()
  templateId?: string;
}
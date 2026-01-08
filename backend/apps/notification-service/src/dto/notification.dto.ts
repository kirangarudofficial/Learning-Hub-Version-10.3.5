import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { NotificationType } from '@prisma/client';

/**
 * DTO for creating a new notification
 */
export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEnum(NotificationType)
    type: NotificationType;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsObject()
    data?: Record<string, any>;
}

/**
 * DTO for updating notification preferences
 */
export class UpdateNotificationPreferencesDto {
    // Course notifications
    @IsOptional()
    @IsBoolean()
    newCourseContent?: boolean;

    @IsOptional()
    @IsBoolean()
    courseUpdates?: boolean;

    @IsOptional()
    @IsBoolean()
    courseScheduleChanges?: boolean;

    // Assignment & Assessment notifications
    @IsOptional()
    @IsBoolean()
    assignmentDeadlines?: boolean;

    @IsOptional()
    @IsBoolean()
    quizAvailable?: boolean;

    @IsOptional()
    @IsBoolean()
    gradeReleased?: boolean;

    // Progress notifications
    @IsOptional()
    @IsBoolean()
    milestoneAchieved?: boolean;

    @IsOptional()
    @IsBoolean()
    certificateIssued?: boolean;

    @IsOptional()
    @IsBoolean()
    courseCompletion?: boolean;

    // Social notifications
    @IsOptional()
    @IsBoolean()
    newComment?: boolean;

    @IsOptional()
    @IsBoolean()
    newReply?: boolean;

    @IsOptional()
    @IsBoolean()
    instructorMessage?: boolean;

    // System notifications
    @IsOptional()
    @IsBoolean()
    systemAnnouncements?: boolean;

    @IsOptional()
    @IsBoolean()
    securityAlerts?: boolean;

    // Delivery preferences
    @IsOptional()
    @IsBoolean()
    emailNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    pushNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    inAppNotifications?: boolean;
}

/**
 * DTO for notification response
 */
export class NotificationResponseDto {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    read: boolean;
    readAt?: Date;
    createdAt: Date;
}

/**
 * DTO for paginated notifications response
 */
export class PaginatedNotificationsDto {
    data: NotificationResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

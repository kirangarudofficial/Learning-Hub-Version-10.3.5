import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/shared/database/prisma.service';
import { NotificationGateway } from '../websocket/notification.gateway';
import { PreferencesService } from '../preferences/preferences.service';
import { CreateNotificationDto, NotificationResponseDto, PaginatedNotificationsDto } from '../dto/notification.dto';
import { NotificationType } from '@prisma/client';

/**
 * Service for managing real-time notifications
 * Handles WebSocket delivery and notification history
 */
@Injectable()
export class RealtimeNotificationService {
    private readonly logger = new Logger(RealtimeNotificationService.name);

    constructor(
        private prisma: PrismaService,
        private notificationGateway: NotificationGateway,
        private preferencesService: PreferencesService,
    ) { }

    /**
     * Create and send a real-time notification
     */
    async createAndSend(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
        // Check if user should receive this notification
        const shouldReceive = await this.preferencesService.shouldReceiveNotification(
            dto.userId,
            dto.type,
        );

        if (!shouldReceive) {
            this.logger.debug(`User ${dto.userId} has disabled ${dto.type} notifications`);
            return null;
        }

        // Save notification to database
        const notification = await this.prisma.notification.create({
            data: {
                userId: dto.userId,
                type: dto.type,
                title: dto.title,
                message: dto.message,
                data: dto.data || {},
            },
        });

        // Send real-time notification via WebSocket
        const preferences = await this.preferencesService.getPreferences(dto.userId);

        if (preferences.inAppNotifications) {
            this.notificationGateway.sendNotificationToUser(dto.userId, notification);
        }

        // TODO: Send email notification if enabled
        if (preferences.emailNotifications) {
            this.logger.debug(`Email notification queued for user ${dto.userId}`);
        }

        // TODO: Send push notification if enabled
        if (preferences.pushNotifications) {
            this.logger.debug(`Push notification queued for user ${dto.userId}`);
        }

        this.logger.log(`Notification created and sent to user ${dto.userId}: ${dto.title}`);
        return notification as NotificationResponseDto;
    }

    /**
     * Get all notifications for a user (paginated)
     */
    async getUserNotifications(
        userId: string,
        page: number = 1,
        limit: number = 20,
        unreadOnly: boolean = false,
    ): Promise<PaginatedNotificationsDto> {
        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(unreadOnly && { read: false }),
        };

        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where }),
        ]);

        return {
            data: notifications as NotificationResponseDto[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get unread notifications count
     */
    async getUnreadCount(userId: string): Promise<number> {
        return this.prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string, userId: string): Promise<NotificationResponseDto> {
        const notification = await this.prisma.notification.update({
            where: {
                id: notificationId,
                userId, // Ensure user owns the notification
            },
            data: {
                read: true,
                readAt: new Date(),
            },
        });

        this.logger.debug(`Notification ${notificationId} marked as read`);
        return notification as NotificationResponseDto;
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string): Promise<{ count: number }> {
        const result = await this.prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
                readAt: new Date(),
            },
        });

        this.logger.log(`${result.count} notifications marked as read for user ${userId}`);
        return { count: result.count };
    }

    /**
     * Delete a notification
     */
    async deleteNotification(notificationId: string, userId: string): Promise<void> {
        await this.prisma.notification.delete({
            where: {
                id: notificationId,
                userId, // Ensure user owns the notification
            },
        });

        this.logger.debug(`Notification ${notificationId} deleted`);
    }

    /**
     * Delete old read notifications (cleanup job)
     */
    async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await this.prisma.notification.deleteMany({
            where: {
                read: true,
                readAt: {
                    lt: cutoffDate,
                },
            },
        });

        this.logger.log(`Cleaned up ${result.count} old notifications`);
        return result.count;
    }

    /**
     * Broadcast system announcement to all users
     */
    async broadcastSystemAnnouncement(title: string, message: string, data?: any): Promise<number> {
        // Get all users
        const users = await this.prisma.user.findMany({
            select: { id: true },
        });

        // Create notifications for all users
        const notifications = await Promise.all(
            users.map(user =>
                this.createAndSend({
                    userId: user.id,
                    type: NotificationType.SYSTEM_ANNOUNCEMENT,
                    title,
                    message,
                    data,
                }),
            ),
        );

        const successCount = notifications.filter(n => n !== null).length;
        this.logger.log(`Broadcasted system announcement to ${successCount} users`);

        return successCount;
    }
}

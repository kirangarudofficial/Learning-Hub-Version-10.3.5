import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@app/shared/database/prisma.service';
import { UpdateNotificationPreferencesDto } from '../dto/notification.dto';

/**
 * Service for managing user notification preferences
 */
@Injectable()
export class PreferencesService {
    private readonly logger = new Logger(PreferencesService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Get user notification preferences
     * Creates default preferences if they don't exist
     */
    async getPreferences(userId: string) {
        let preferences = await this.prisma.userNotificationPreferences.findUnique({
            where: { userId },
        });

        // Create default preferences if they don't exist
        if (!preferences) {
            preferences = await this.createDefaultPreferences(userId);
        }

        return preferences;
    }

    /**
     * Update user notification preferences
     */
    async updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
        // Ensure preferences exist
        await this.getPreferences(userId);

        const updated = await this.prisma.userNotificationPreferences.update({
            where: { userId },
            data: dto,
        });

        this.logger.log(`Updated notification preferences for user ${userId}`);
        return updated;
    }

    /**
     * Reset preferences to defaults
     */
    async resetPreferences(userId: string) {
        await this.prisma.userNotificationPreferences.delete({
            where: { userId },
        });

        const preferences = await this.createDefaultPreferences(userId);
        this.logger.log(`Reset notification preferences for user ${userId}`);

        return preferences;
    }

    /**
     * Create default notification preferences for a user
     */
    async createDefaultPreferences(userId: string) {
        const preferences = await this.prisma.userNotificationPreferences.create({
            data: {
                userId,
                // All defaults are set in Prisma schema
            },
        });

        this.logger.log(`Created default notification preferences for user ${userId}`);
        return preferences;
    }

    /**
     * Check if user should receive notification based on preferences
     */
    async shouldReceiveNotification(userId: string, notificationType: string): Promise<boolean> {
        const preferences = await this.getPreferences(userId);

        // Map notification types to preference fields
        const typeToPreferenceMap = {
            COURSE_NEW_CONTENT: preferences.newCourseContent,
            COURSE_UPDATE: preferences.courseUpdates,
            COURSE_SCHEDULE_CHANGE: preferences.courseScheduleChanges,
            ASSIGNMENT_DEADLINE: preferences.assignmentDeadlines,
            QUIZ_AVAILABLE: preferences.quizAvailable,
            GRADE_RELEASED: preferences.gradeReleased,
            MILESTONE_ACHIEVED: preferences.milestoneAchieved,
            CERTIFICATE_ISSUED: preferences.certificateIssued,
            COURSE_COMPLETED: preferences.courseCompletion,
            NEW_COMMENT: preferences.newComment,
            NEW_REPLY: preferences.newReply,
            INSTRUCTOR_MESSAGE: preferences.instructorMessage,
            SYSTEM_ANNOUNCEMENT: preferences.systemAnnouncements,
            SECURITY_ALERT: preferences.securityAlerts,
        };

        return typeToPreferenceMap[notificationType] ?? true; // Default to true if type not found
    }
}

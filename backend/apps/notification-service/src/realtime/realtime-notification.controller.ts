import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RealtimeNotificationService } from './realtime-notification.service';
import { CreateNotificationDto } from '../dto/notification.dto';
import { JwtAuthGuard } from '@app/shared/auth/auth.guard';

/**
 * Controller for real-time notifications
 */
@ApiTags('Real-Time Notifications')
@ApiBearerAuth()
@Controller('realtime')
@UseGuards(JwtAuthGuard)
export class RealtimeNotificationController {
    constructor(private readonly realtimeService: RealtimeNotificationService) { }

    @Get()
    @ApiOperation({ summary: 'Get user notifications (paginated)' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
    @ApiResponse({ status: 200, description: 'Returns paginated notifications' })
    async getNotifications(
        @Req() req: any,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
        @Query('unreadOnly') unreadOnly: string = 'false',
    ) {
        const userId = req.user.userId;
        return this.realtimeService.getUserNotifications(
            userId,
            parseInt(page),
            parseInt(limit),
            unreadOnly === 'true',
        );
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread notifications count' }}
@ApiResponse({ status: 200, description: 'Returns unread count' })
async getUnreadCount(@Req() req: any) {
    const userId = req.user.userId;
    const count = await this.realtimeService.getUnreadCount(userId);
    return { count };
}

@Patch(':id/read')
@ApiOperation({ summary: 'Mark notification as read' })
@ApiResponse({ status: 200, description: 'Notification marked as read' })
async markAsRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.realtimeService.markAsRead(id, userId);
}

@Post('mark-all-read')
@ApiOperation({ summary: 'Mark all notifications as read' })
@ApiResponse({ status: 200, description: 'All notifications marked as read' })
async markAllAsRead(@Req() req: any) {
    const userId = req.user.userId;
    return this.realtimeService.markAllAsRead(userId);
}

@Delete(':id')
@ApiOperation({ summary: 'Delete a notification' })
@ApiResponse({ status: 200, description: 'Notification deleted' })
async deleteNotification(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.realtimeService.deleteNotification(id, userId);
    return { message: 'Notification deleted successfully' };
}

@Post('broadcast')
@ApiOperation({ summary: 'Broadcast system announcement (Admin only)' })
@ApiResponse({ status: 200, description: 'Announcement broadcasted' })
// TODO: Add admin role guard
async broadcastAnnouncement(
    @Body() body: { title: string; message: string; data?: any },
) {
    const count = await this.realtimeService.broadcastSystemAnnouncement(
        body.title,
        body.message,
        body.data,
    );
    return { message: `Announcement sent to ${count} users` };
}
}

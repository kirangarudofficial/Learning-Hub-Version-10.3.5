import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MICROSERVICE_TOKENS, PATTERNS } from '@app/shared/constants';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationResponseDto,
  SendBulkNotificationsDto,
} from '@app/shared/dto/notification.dto';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationController {
  constructor(
    @Inject(MICROSERVICE_TOKENS.NOTIFICATION_SERVICE)
    private readonly notificationServiceClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'The notification has been successfully created.',
    type: NotificationResponseDto,
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationServiceClient.send(
      PATTERNS.NOTIFICATION.CREATE,
      createNotificationDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Return all notifications',
    type: [NotificationResponseDto],
  })
  findAll() {
    return this.notificationServiceClient.send(PATTERNS.NOTIFICATION.FIND_ALL, {});
  }

  @Get('my-notifications')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiResponse({
    status: 200,
    description: 'Return user notifications',
    type: [NotificationResponseDto],
  })
  findMyNotifications(@CurrentUser() user: any) {
    return this.notificationServiceClient.send(
      PATTERNS.NOTIFICATION.FIND_BY_USER,
      user.id,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the notification',
    type: NotificationResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.notificationServiceClient.send(PATTERNS.NOTIFICATION.FIND_ONE, id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully updated.',
    type: NotificationResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationServiceClient.send(PATTERNS.NOTIFICATION.UPDATE, {
      id,
      updateNotificationDto,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.notificationServiceClient.send(PATTERNS.NOTIFICATION.REMOVE, id);
  }

  @Post(':id/mark-as-read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been marked as read.',
    type: NotificationResponseDto,
  })
  markAsRead(@Param('id') id: string) {
    return this.notificationServiceClient.send(
      PATTERNS.NOTIFICATION.MARK_AS_READ,
      id,
    );
  }

  @Post('mark-all-as-read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications have been marked as read.',
  })
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationServiceClient.send(
      PATTERNS.NOTIFICATION.MARK_ALL_AS_READ,
      user.id,
    );
  }

  @Post('send-bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Send bulk notifications' })
  @ApiResponse({
    status: 201,
    description: 'Bulk notifications have been sent.',
  })
  sendBulk(@Body() sendBulkNotificationsDto: SendBulkNotificationsDto) {
    return this.notificationServiceClient.send(
      PATTERNS.NOTIFICATION.SEND_BULK,
      sendBulkNotificationsDto,
    );
  }
}
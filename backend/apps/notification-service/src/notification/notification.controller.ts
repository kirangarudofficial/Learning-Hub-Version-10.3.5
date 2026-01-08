import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, UpdateNotificationDto, SendBulkNotificationsDto } from '@app/shared/dto/notification.dto';
import { PATTERNS } from '@app/shared/constants';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(PATTERNS.NOTIFICATION.CREATE)
  create(@Payload() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @MessagePattern(PATTERNS.NOTIFICATION.FIND_ALL)
  findAll() {
    return this.notificationService.findAll();
  }

  @MessagePattern(PATTERNS.NOTIFICATION.FIND_BY_USER)
  findByUser(@Payload() userId: string) {
    return this.notificationService.findByUser(userId);
  }

  @MessagePattern(PATTERNS.NOTIFICATION.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.notificationService.findOne(id);
  }

  @MessagePattern(PATTERNS.NOTIFICATION.UPDATE)
  update(@Payload() payload: { id: string; updateNotificationDto: UpdateNotificationDto }) {
    return this.notificationService.update(payload.id, payload.updateNotificationDto);
  }

  @MessagePattern(PATTERNS.NOTIFICATION.REMOVE)
  remove(@Payload() id: string) {
    return this.notificationService.remove(id);
  }

  @MessagePattern(PATTERNS.NOTIFICATION.MARK_AS_READ)
  markAsRead(@Payload() id: string) {
    return this.notificationService.markAsRead(id);
  }

  @MessagePattern(PATTERNS.NOTIFICATION.MARK_ALL_AS_READ)
  markAllAsRead(@Payload() userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @MessagePattern(PATTERNS.NOTIFICATION.SEND_BULK)
  sendBulk(@Payload() sendBulkNotificationsDto: SendBulkNotificationsDto) {
    return this.notificationService.sendBulk(sendBulkNotificationsDto);
  }
}
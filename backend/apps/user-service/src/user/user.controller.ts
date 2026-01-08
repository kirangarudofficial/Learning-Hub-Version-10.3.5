import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_user_profile')
  async getUserProfile(@Payload() data: { userId: string }) {
    return this.userService.getUserProfile(data.userId);
  }

  @MessagePattern('update_user_profile')
  async updateUserProfile(@Payload() data: { userId: string; updateData: any }) {
    return this.userService.updateUserProfile(data.userId, data.updateData);
  }

  @MessagePattern('get_user_by_id')
  async getUserById(@Payload() data: { userId: string }) {
    return this.userService.getUserById(data.userId);
  }

  @MessagePattern('get_all_users')
  async getAllUsers(@Payload() data: any) {
    return this.userService.getAllUsers(data);
  }

  @MessagePattern('delete_user')
  async deleteUser(@Payload() data: { userId: string }) {
    return this.userService.deleteUser(data.userId);
  }

  @MessagePattern('get_user_stats')
  async getUserStats(@Payload() data: { userId: string }) {
    return this.userService.getUserStats(data.userId);
  }

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any) {
    console.log('User created event received:', data);
    // Handle post-user creation tasks like sending welcome email
    // This would typically emit events to notification service
  }

  @EventPattern('user.updated')
  async handleUserUpdated(@Payload() data: any) {
    console.log('User updated event received:', data);
    // Handle post-user update tasks
  }

  @EventPattern('course.enrolled')
  async handleCourseEnrolled(@Payload() data: { userId: string; courseId: string }) {
    console.log('Course enrolled event received:', data);
    // Update user stats or trigger notifications
  }
}
import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { EnrollmentService } from './enrollment.service';

@Controller()
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @MessagePattern('enroll_user_in_course')
  async enrollUserInCourse(@Payload() data: { userId: string; courseId: string }) {
    return this.enrollmentService.enrollUserInCourse(data.userId, data.courseId);
  }

  @MessagePattern('unenroll_user_from_course')
  async unenrollUserFromCourse(@Payload() data: { userId: string; courseId: string }) {
    return this.enrollmentService.unenrollUserFromCourse(data.userId, data.courseId);
  }

  @MessagePattern('get_user_enrollments')
  async getUserEnrollments(@Payload() data: { userId: string; params?: any }) {
    return this.enrollmentService.getUserEnrollments(data.userId, data.params);
  }

  @MessagePattern('get_course_enrollments')
  async getCourseEnrollments(@Payload() data: { courseId: string; params?: any }) {
    return this.enrollmentService.getCourseEnrollments(data.courseId, data.params);
  }

  @MessagePattern('check_enrollment_status')
  async checkEnrollmentStatus(@Payload() data: { userId: string; courseId: string }) {
    return this.enrollmentService.checkEnrollmentStatus(data.userId, data.courseId);
  }

  @MessagePattern('get_enrollment_stats')
  async getEnrollmentStats(@Payload() data: { courseId?: string; userId?: string }) {
    return this.enrollmentService.getEnrollmentStats(data.courseId, data.userId);
  }

  @MessagePattern('bulk_enroll_users')
  async bulkEnrollUsers(@Payload() data: { userIds: string[]; courseId: string }) {
    return this.enrollmentService.bulkEnroll(data.userIds, data.courseId);
  }

  // Event handlers
  @EventPattern('user.registered')
  async handleUserRegistered(@Payload() data: { userId: string; email: string }) {
    console.log('User registered event received:', data);
    // Handle post-registration tasks like offering free courses
  }

  @EventPattern('payment.completed')
  async handlePaymentCompleted(@Payload() data: { userId: string; courseId: string; amount: number }) {
    console.log('Payment completed event received:', data);
    // Automatically enroll user after successful payment
    try {
      await this.enrollmentService.enrollUserInCourse(data.userId, data.courseId);
      console.log(`User ${data.userId} auto-enrolled in course ${data.courseId} after payment`);
    } catch (error) {
      console.error('Failed to auto-enroll user after payment:', error);
    }
  }

  @EventPattern('course.deleted')
  async handleCourseDeleted(@Payload() data: { courseId: string }) {
    console.log('Course deleted event received:', data);
    // Clean up enrollments for deleted course would be handled by cascade delete
  }

  @EventPattern('enrollment.created')
  async handleEnrollmentCreated(@Payload() data: { userId: string; courseId: string }) {
    console.log('Enrollment created event received:', data);
    // Emit event for other services (notifications, analytics, etc.)
  }

  @EventPattern('enrollment.cancelled')
  async handleEnrollmentCancelled(@Payload() data: { userId: string; courseId: string }) {
    console.log('Enrollment cancelled event received:', data);
    // Handle cleanup tasks
  }
}
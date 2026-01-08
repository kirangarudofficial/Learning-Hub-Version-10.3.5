import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { CurrentUser } from '@shared/decorators/user.decorator';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('enroll/:courseId')
  async enrollInCourse(@CurrentUser() user: any, @Param('courseId') courseId: string) {
    return this.enrollmentsService.enrollInCourse(user.id, courseId);
  }

  @Get('my-courses')
  async getMyEnrollments(@CurrentUser() user: any) {
    return this.enrollmentsService.getUserEnrollments(user.id);
  }

  @Get(':courseId/progress')
  async getCourseProgress(@CurrentUser() user: any, @Param('courseId') courseId: string) {
    return this.enrollmentsService.getCourseProgress(user.id, courseId);
  }

  @Put(':courseId/progress')
  async updateProgress(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string,
    @Body() progressData: { lessonId: string; completed: boolean },
  ) {
    return this.enrollmentsService.updateProgress(user.id, courseId, progressData);
  }

  @Get('course/:courseId/students')
  async getCourseStudents(@Param('courseId') courseId: string) {
    return this.enrollmentsService.getCourseStudents(courseId);
  }
}
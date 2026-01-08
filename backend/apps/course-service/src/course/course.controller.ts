import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { CourseService } from './course.service';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @MessagePattern('get_all_courses')
  async getAllCourses(@Payload() data: any) {
    return this.courseService.getAllCourses(data);
  }

  @MessagePattern('get_course_by_id')
  async getCourseById(@Payload() data: { courseId: string }) {
    return this.courseService.getCourseById(data.courseId);
  }

  @MessagePattern('create_course')
  async createCourse(@Payload() data: { instructorId: string; courseData: any }) {
    return this.courseService.createCourse(data.instructorId, data.courseData);
  }

  @MessagePattern('update_course')
  async updateCourse(@Payload() data: { courseId: string; instructorId: string; updateData: any }) {
    return this.courseService.updateCourse(data.courseId, data.instructorId, data.updateData);
  }

  @MessagePattern('delete_course')
  async deleteCourse(@Payload() data: { courseId: string; instructorId: string }) {
    return this.courseService.deleteCourse(data.courseId, data.instructorId);
  }

  @MessagePattern('get_courses_by_instructor')
  async getCoursesByInstructor(@Payload() data: { instructorId: string }) {
    return this.courseService.getCoursesByInstructor(data.instructorId);
  }

  @MessagePattern('get_courses_by_category')
  async getCoursesByCategory(@Payload() data: { category: string; pagination: any }) {
    return this.courseService.getCoursesByCategory(data.category, data.pagination);
  }

  @MessagePattern('search_courses')
  async searchCourses(@Payload() data: { query: string; filters: any; pagination: any }) {
    return this.courseService.searchCourses(data.query, data.filters, data.pagination);
  }

  @MessagePattern('get_course_curriculum')
  async getCourseCurriculum(@Payload() data: { courseId: string }) {
    return this.courseService.getCourseCurriculum(data.courseId);
  }

  @MessagePattern('add_course_module')
  async addCourseModule(@Payload() data: { courseId: string; moduleData: any }) {
    return this.courseService.addCourseModule(data.courseId, data.moduleData);
  }

  @MessagePattern('add_lesson_to_module')
  async addLessonToModule(@Payload() data: { moduleId: string; lessonData: any }) {
    return this.courseService.addLessonToModule(data.moduleId, data.lessonData);
  }

  @MessagePattern('update_course_stats')
  async updateCourseStats(@Payload() data: { courseId: string }) {
    return this.courseService.updateCourseStats(data.courseId);
  }

  @EventPattern('course.created')
  async handleCourseCreated(@Payload() data: any) {
    console.log('Course created event received:', data);
    // Handle post-course creation tasks
  }

  @EventPattern('course.updated')
  async handleCourseUpdated(@Payload() data: any) {
    console.log('Course updated event received:', data);
    // Handle post-course update tasks
  }

  @EventPattern('enrollment.created')
  async handleEnrollmentCreated(@Payload() data: { courseId: string; userId: string }) {
    console.log('Enrollment created event received:', data);
    // Update course stats when someone enrolls
    await this.courseService.updateCourseStats(data.courseId);
  }

  @EventPattern('review.created')
  async handleReviewCreated(@Payload() data: { courseId: string; rating: number }) {
    console.log('Review created event received:', data);
    // Update course rating when a review is added
    await this.courseService.updateCourseStats(data.courseId);
  }
}
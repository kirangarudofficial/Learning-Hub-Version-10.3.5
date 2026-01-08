import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto, UpdateProgressDto } from '@shared/dto/progress.dto';
import { PATTERNS } from '@shared/constants';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Create new progress record' })
  @ApiResponse({ status: 201, description: 'Progress record successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProgressDto })
  @ApiBearerAuth()
  async create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all progress records' })
  @ApiResponse({ status: 200, description: 'Return all progress records' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  @ApiBearerAuth()
  async findAll(
    @Query('userId') userId?: string,
    @Query('courseId') courseId?: string,
  ) {
    if (userId && courseId) {
      return this.progressService.findByUserAndCourse(userId, courseId);
    }
    if (userId) {
      return this.progressService.findByUser(userId);
    }
    if (courseId) {
      return this.progressService.findByCourse(courseId);
    }
    return this.progressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get progress by ID' })
  @ApiResponse({ status: 200, description: 'Return progress by ID' })
  @ApiResponse({ status: 404, description: 'Progress not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update progress' })
  @ApiResponse({ status: 200, description: 'Progress successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Progress not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProgressDto })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.update(id, updateProgressDto);
  }

  @Put(':id/lesson/:lessonId')
  @ApiOperation({ summary: 'Mark lesson as completed' })
  @ApiResponse({ status: 200, description: 'Lesson successfully marked as completed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Progress or lesson not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'lessonId', type: String })
  @ApiBearerAuth()
  async addCompletedLesson(
    @Param('id') id: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressService.addCompletedLesson(id, lessonId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete progress' })
  @ApiResponse({ status: 200, description: 'Progress successfully deleted' })
  @ApiResponse({ status: 404, description: 'Progress not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }

  @Get('report/course/:courseId')
  @ApiOperation({ summary: 'Generate progress report for a course' })
  @ApiResponse({ status: 200, description: 'Progress report successfully generated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiBearerAuth()
  async generateReport(@Param('courseId') courseId: string) {
    return this.progressService.generateReport(courseId);
  }

  // Microservice message patterns
  @MessagePattern(PATTERNS.PROGRESS.FIND_ALL)
  async msgFindAll() {
    return this.progressService.findAll();
  }

  @MessagePattern(PATTERNS.PROGRESS.FIND_BY_USER)
  async msgFindByUser(@Payload() userId: string) {
    return this.progressService.findByUser(userId);
  }

  @MessagePattern(PATTERNS.PROGRESS.FIND_BY_COURSE)
  async msgFindByCourse(@Payload() courseId: string) {
    return this.progressService.findByCourse(courseId);
  }

  @MessagePattern(PATTERNS.PROGRESS.FIND_BY_USER_AND_COURSE)
  async msgFindByUserAndCourse(@Payload() data: { userId: string; courseId: string }) {
    return this.progressService.findByUserAndCourse(data.userId, data.courseId);
  }

  @MessagePattern(PATTERNS.PROGRESS.FIND_ONE)
  async msgFindOne(@Payload() id: string) {
    return this.progressService.findOne(id);
  }

  @MessagePattern(PATTERNS.PROGRESS.CREATE)
  async msgCreate(@Payload() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @MessagePattern(PATTERNS.PROGRESS.UPDATE)
  async msgUpdate(@Payload() data: { id: string; updateProgressDto: UpdateProgressDto }) {
    return this.progressService.update(data.id, data.updateProgressDto);
  }

  @MessagePattern(PATTERNS.PROGRESS.DELETE)
  async msgRemove(@Payload() id: string) {
    return this.progressService.remove(id);
  }

  @MessagePattern(PATTERNS.PROGRESS.ADD_COMPLETED_LESSON)
  async msgAddCompletedLesson(@Payload() data: { id: string; lessonId: string }) {
    return this.progressService.addCompletedLesson(data.id, data.lessonId);
  }

  @MessagePattern(PATTERNS.PROGRESS.GENERATE_REPORT)
  async msgGenerateReport(@Payload() courseId: string) {
    return this.progressService.generateReport(courseId);
  }
}
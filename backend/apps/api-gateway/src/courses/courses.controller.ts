import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  PaginationDto,
} from '@shared/dto';
import { 
  JwtAuthGuard, 
  RolesGuard, 
  Roles,
  Public 
} from '@shared/auth/auth.guard';
import { Role } from '@prisma/client';
import { 
  CurrentUser, 
  UserId, 
  CorrelationId 
} from '@shared/decorators';
import { ParseUUIDPipe } from '@shared/pipes';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Get all courses',
    description: 'Retrieve a paginated list of all courses with search and filter options' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'React' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], example: 'desc' })
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              rating: { type: 'number' },
              level: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] },
              category: { type: 'string' },
              instructor: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      avatar: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  async getAllCourses(
    @Query() paginationDto: PaginationDto,
    @CorrelationId() correlationId: string,
  ) {
    return this.coursesService.getAllCourses(paginationDto);
  }

  @Public()
  @Get('category/:category')
  @ApiOperation({ 
    summary: 'Get courses by category',
    description: 'Retrieve courses filtered by category' 
  })
  @ApiParam({ name: 'category', type: String, example: 'Programming' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Courses retrieved successfully',
  })
  async getCoursesByCategory(
    @Param('category') category: string,
    @Query() paginationDto: PaginationDto,
    @CorrelationId() correlationId: string,
  ) {
    return this.coursesService.getCoursesByCategory(category, paginationDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get course by ID',
    description: 'Retrieve detailed information about a specific course' 
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Course retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            rating: { type: 'number' },
            level: { type: 'string' },
            category: { type: 'string' },
            curriculum: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  lessons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        type: { type: 'string' },
                        isFree: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
            instructor: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    avatar: { type: 'string' },
                  },
                },
              },
            },
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  rating: { type: 'number' },
                  comment: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      avatar: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async getCourseById(
    @Param('id', ParseUUIDPipe) id: string,
    @CorrelationId() correlationId: string,
  ) {
    return this.coursesService.getCourseById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new course',
    description: 'Create a new course (requires instructor or admin role)' 
  })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            level: { type: 'string' },
            category: { type: 'string' },
            instructorId: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @UserId() userId: string,
    @CorrelationId() correlationId: string,
  ) {
    return this.coursesService.createCourse(userId, createCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update a course',
    description: 'Update an existing course (only course owner or admin)' 
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the course owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async updateCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UserId() userId: string,
    @CorrelationId() correlationId: string,
  ) {
    return this.coursesService.updateCourse(id, userId, updateCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete a course',
    description: 'Delete an existing course (only course owner or admin)' 
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Course deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the course owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  async deleteCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @CorrelationId() correlationId: string,
  ) {
    return this.coursesService.deleteCourse(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('instructor/my-courses')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get instructor courses',
    description: 'Get all courses created by the current instructor' 
  })
  @ApiResponse({
    status: 200,
    description: 'Instructor courses retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getInstructorCourses(
    @UserId() instructorId: string,
    @CorrelationId() correlationId: string,
  ) {
    return this.coursesService.getCoursesByInstructor(instructorId);
  }
}
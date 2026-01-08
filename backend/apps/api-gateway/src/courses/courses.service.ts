import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_TOKENS } from '@shared/constants';
import { CreateCourseDto, UpdateCourseDto, PaginationDto } from '@shared/dto';
import { PrismaService } from '@shared/database/prisma.service';
import { ApiResponseUtil } from '@shared/utils';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    @Inject(MICROSERVICE_TOKENS.COURSE_SERVICE)
    private courseServiceClient: ClientProxy,
  ) {}

  async getAllCourses(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sort = 'createdAt', order = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as any } },
            { description: { contains: search, mode: 'insensitive' as any } },
            { category: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.course.count({ where } as any),
    ]);

    return ApiResponseUtil.paginated(courses, total, page, limit);
  }

  async getCourseById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        curriculum: {
          include: {
            lessons: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return ApiResponseUtil.success(course);
  }

  async createCourse(userId: string, createCourseDto: CreateCourseDto) {
    // Get or create instructor profile
    let instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      instructor = await this.prisma.instructor.create({
        data: {
          userId,
          bio: 'New instructor',
        },
      });
    }

    const course = await this.prisma.course.create({
      data: {
        ...createCourseDto,
        instructorId: instructor.id,
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Emit course creation event
    this.courseServiceClient.emit('course.created', {
      courseId: course.id,
      instructorId: instructor.id,
      title: course.title,
    });

    return ApiResponseUtil.success(course);
  }

  async updateCourse(id: string, userId: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructor.userId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
      include: {
        instructor: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Emit course update event
    this.courseServiceClient.emit('course.updated', {
      courseId: updatedCourse.id,
      changes: updateCourseDto,
    });

    return ApiResponseUtil.success(updatedCourse);
  }

  async deleteCourse(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructor.userId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.prisma.course.delete({
      where: { id },
    });

    return ApiResponseUtil.success({ message: 'Course deleted successfully' });
  }

  async getCoursesByInstructor(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: {
        instructor: {
          userId: instructorId,
        },
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponseUtil.success(courses);
  }

  async getCoursesByCategory(category: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = paginationDto;
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: {
          category: {
            contains: category,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.course.count({
        where: {
          category: {
            contains: category,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return ApiResponseUtil.paginated(courses, total, page, limit);
  }
}
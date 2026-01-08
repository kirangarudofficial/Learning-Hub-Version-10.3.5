import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses(params: any) {
    const { page = 1, limit = 10, search, category, level, minPrice, maxPrice, sort = 'createdAt', order = 'desc' } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as any } },
          { description: { contains: search, mode: 'insensitive' as any } },
          { category: { contains: search, mode: 'insensitive' as any } },
        ],
      }),
      ...(category && { category: { contains: category, mode: 'insensitive' as any } }),
      ...(level && { level }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
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
      this.prisma.course.count({ where }),
    ]);

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCourseById(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
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
          orderBy: {
            title: 'asc',
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
          take: 10, // Limit to recent reviews
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async createCourse(instructorId: string, courseData: any) {
    // Get or create instructor profile
    let instructor = await this.prisma.instructor.findUnique({
      where: { userId: instructorId },
    });

    if (!instructor) {
      instructor = await this.prisma.instructor.create({
        data: {
          userId: instructorId,
          bio: 'New instructor',
        },
      });
    }

    const course = await this.prisma.course.create({
      data: {
        ...courseData,
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

    return course;
  }

  async updateCourse(courseId: string, instructorId: string, updateData: any) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructor.userId !== instructorId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data: updateData,
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

    return updatedCourse;
  }

  async deleteCourse(courseId: string, instructorId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructor.userId !== instructorId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.prisma.course.delete({
      where: { id: courseId },
    });

    return { message: 'Course deleted successfully' };
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

    return courses;
  }

  async getCoursesByCategory(category: string, pagination: any) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
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

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchCourses(query: string, filters: any, pagination: any) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = pagination;
    const { category, level, minPrice, maxPrice } = filters;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        ...(category && [{ category: { contains: category, mode: 'insensitive' } }]),
        ...(level && [{ level }]),
        ...(minPrice !== undefined && [{ price: { gte: minPrice } }]),
        ...(maxPrice !== undefined && [{ price: { lte: maxPrice } }]),
      ],
    };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
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
      this.prisma.course.count({ where }),
    ]);

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCourseCurriculum(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        curriculum: {
          include: {
            lessons: {
              orderBy: {
                title: 'asc',
              },
            },
          },
          orderBy: {
            title: 'asc',
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course.curriculum;
  }

  async addCourseModule(courseId: string, moduleData: any) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const module = await this.prisma.courseModule.create({
      data: {
        ...moduleData,
        courseId,
      },
      include: {
        lessons: true,
      },
    });

    return module;
  }

  async addLessonToModule(moduleId: string, lessonData: any) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        ...lessonData,
        moduleId,
      },
    });

    return lesson;
  }

  async updateCourseStats(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        reviews: true,
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Calculate average rating
    const averageRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : 0;

    // Update course with new stats
    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewsCount: course._count.reviews,
        students: course._count.enrollments.toString(),
      },
    });

    return updatedCourse;
  }
}
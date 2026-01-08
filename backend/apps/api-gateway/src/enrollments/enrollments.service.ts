import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICE_TOKENS } from '@shared/constants';
import { PrismaService } from '@shared/database/prisma.service';
import { ApiResponseUtil } from '@shared/utils';

@Injectable()
export class EnrollmentsService {
  constructor(
    private prisma: PrismaService,
    @Inject(MICROSERVICE_TOKENS.ENROLLMENT_SERVICE)
    private enrollmentServiceClient: ClientProxy,
  ) {}

  async enrollInCourse(userId: string, courseId: string) {
    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Already enrolled in this course');
    }

    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
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
        },
      },
    });

    // Create initial progress record
    await this.prisma.userProgress.create({
      data: {
        userId,
        courseId,
        progressPercentage: 0,
      },
    });

    // Emit enrollment event
    this.enrollmentServiceClient.emit('enrollment.created', {
      userId,
      courseId,
      enrollmentDate: enrollment.enrolledAt,
    });

    return ApiResponseUtil.success(enrollment);
  }

  async getUserEnrollments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
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
          },
        },
        user: {
          select: {
            progress: {
              where: { userId },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return ApiResponseUtil.success(enrollments);
  }

  async getCourseProgress(userId: string, courseId: string) {
    const progress = await this.prisma.userProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            curriculum: {
              include: {
                lessons: true,
              },
            },
          },
        },
        completedLessons: true,
      },
    });

    if (!progress) {
      throw new NotFoundException('Progress not found');
    }

    return ApiResponseUtil.success(progress);
  }

  async updateProgress(userId: string, courseId: string, progressData: { lessonId: string; completed: boolean }) {
    const { lessonId, completed } = progressData;

    // Find existing progress
    let progress = await this.prisma.userProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        completedLessons: true,
        course: {
          include: {
            curriculum: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('Progress not found');
    }

    // Update completed lessons
    if (completed) {
      await this.prisma.userProgress.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          completedLessons: {
            connect: { id: lessonId },
          },
        },
      });
    } else {
      await this.prisma.userProgress.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          completedLessons: {
            disconnect: { id: lessonId },
          },
        },
      });
    }

    // Recalculate progress percentage
    const totalLessons = progress.course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
    const completedCount = completed 
      ? progress.completedLessons.length + 1 
      : progress.completedLessons.length - 1;
    
    const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    // Update progress percentage
    const updatedProgress = await this.prisma.userProgress.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progressPercentage,
      },
      include: {
        completedLessons: true,
      },
    });

    return ApiResponseUtil.success(updatedProgress);
  }

  async getCourseStudents(courseId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    const students = enrollments.map(enrollment => ({
      ...enrollment.user,
      enrolledAt: enrollment.enrolledAt,
    }));

    return ApiResponseUtil.success(students);
  }
}
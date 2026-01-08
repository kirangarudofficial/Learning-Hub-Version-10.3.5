import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException,
  ForbiddenException 
} from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollUserInCourse(userId: string, courseId: string) {
    try {
      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, price: true }
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Check if user is already enrolled
      const existingEnrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (existingEnrollment) {
        throw new ConflictException('User is already enrolled in this course');
      }

      // Create enrollment
      const enrollment = await this.prisma.enrollment.create({
        data: {
          userId,
          courseId,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              image: true,
              price: true,
              level: true,
              category: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Initialize user progress
      await this.prisma.userProgress.create({
        data: {
          userId,
          courseId,
          progressPercentage: 0,
        },
      });

      return {
        success: true,
        data: enrollment,
        message: 'Successfully enrolled in course',
      };
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to enroll in course');
    }
  }

  async unenrollUserFromCourse(userId: string, courseId: string) {
    try {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (!enrollment) {
        throw new NotFoundException('Enrollment not found');
      }

      // Delete enrollment and related progress
      await this.prisma.$transaction([
        this.prisma.userProgress.deleteMany({
          where: {
            userId,
            courseId,
          },
        }),
        this.prisma.enrollment.delete({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        }),
      ]);

      return {
        success: true,
        message: 'Successfully unenrolled from course',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to unenroll from course');
    }
  }

  async getUserEnrollments(userId: string, params: any = {}) {
    const { page = 1, limit = 10, status } = params;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
              price: true,
              level: true,
              category: true,
              rating: true,
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
        orderBy: {
          enrolledAt: 'desc',
        },
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await this.prisma.userProgress.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId: enrollment.courseId,
            },
          },
        });

        return {
          ...enrollment,
          progress: progress?.progressPercentage || 0,
          lastAccessed: progress?.lastAccessed || null,
        };
      })
    );

    return {
      enrollments: enrollmentsWithProgress,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCourseEnrollments(courseId: string, params: any = {}) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { courseId },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      }),
      this.prisma.enrollment.count({ where: { courseId } }),
    ]);

    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const progress = await this.prisma.userProgress.findUnique({
          where: {
            userId_courseId: {
              userId: enrollment.userId,
              courseId,
            },
          },
        });

        return {
          ...enrollment,
          progress: progress?.progressPercentage || 0,
          lastAccessed: progress?.lastAccessed || null,
        };
      })
    );

    return {
      enrollments: enrollmentsWithProgress,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async checkEnrollmentStatus(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!enrollment) {
      return {
        isEnrolled: false,
        enrollment: null,
      };
    }

    // Get progress
    const progress = await this.prisma.userProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return {
      isEnrolled: true,
      enrollment: {
        ...enrollment,
        progress: progress?.progressPercentage || 0,
        lastAccessed: progress?.lastAccessed || null,
      },
    };
  }

  async getEnrollmentStats(courseId?: string, userId?: string) {
    if (courseId) {
      // Get stats for a specific course
      const [totalEnrollments, completedCount, averageProgress] = await Promise.all([
        this.prisma.enrollment.count({
          where: { courseId },
        }),
        this.prisma.userProgress.count({
          where: {
            courseId,
            progressPercentage: 100,
          },
        }),
        this.prisma.userProgress.aggregate({
          where: { courseId },
          _avg: {
            progressPercentage: true,
          },
        }),
      ]);

      return {
        totalEnrollments,
        completedCount,
        completionRate: totalEnrollments > 0 ? (completedCount / totalEnrollments) * 100 : 0,
        averageProgress: averageProgress._avg.progressPercentage || 0,
      };
    }

    if (userId) {
      // Get stats for a specific user
      const [totalEnrollments, completedCourses, totalProgress] = await Promise.all([
        this.prisma.enrollment.count({
          where: { userId },
        }),
        this.prisma.userProgress.count({
          where: {
            userId,
            progressPercentage: 100,
          },
        }),
        this.prisma.userProgress.aggregate({
          where: { userId },
          _sum: {
            progressPercentage: true,
          },
        }),
      ]);

      return {
        totalEnrollments,
        completedCourses,
        completionRate: totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0,
        averageProgress: totalEnrollments > 0 ? (totalProgress._sum.progressPercentage || 0) / totalEnrollments : 0,
      };
    }

    // Get global stats
    const [totalEnrollments, totalUsers, totalCourses, completedCount] = await Promise.all([
      this.prisma.enrollment.count(),
      this.prisma.enrollment.groupBy({
        by: ['userId'],
      }).then(result => result.length),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
      }).then(result => result.length),
      this.prisma.userProgress.count({
        where: {
          progressPercentage: 100,
        },
      }),
    ]);

    return {
      totalEnrollments,
      totalUsers,
      totalCourses,
      completedCount,
      completionRate: totalEnrollments > 0 ? (completedCount / totalEnrollments) * 100 : 0,
    };
  }

  async bulkEnroll(userIds: string[], courseId: string) {
    try {
      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true }
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // Filter out users who are already enrolled
      const existingEnrollments = await this.prisma.enrollment.findMany({
        where: {
          courseId,
          userId: { in: userIds },
        },
        select: { userId: true },
      });

      const enrolledUserIds = new Set(existingEnrollments.map(e => e.userId));
      const usersToEnroll = userIds.filter(userId => !enrolledUserIds.has(userId));

      if (usersToEnroll.length === 0) {
        return {
          success: true,
          message: 'All users are already enrolled',
          enrolled: 0,
          skipped: userIds.length,
        };
      }

      // Create enrollments and progress records
      const enrollmentData = usersToEnroll.map(userId => ({
        userId,
        courseId,
      }));

      const progressData = usersToEnroll.map(userId => ({
        userId,
        courseId,
        progressPercentage: 0,
      }));

      await this.prisma.$transaction([
        this.prisma.enrollment.createMany({
          data: enrollmentData,
        }),
        this.prisma.userProgress.createMany({
          data: progressData,
        }),
      ]);

      return {
        success: true,
        message: `Successfully enrolled ${usersToEnroll.length} users`,
        enrolled: usersToEnroll.length,
        skipped: enrolledUserIds.size,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to bulk enroll users');
    }
  }
}
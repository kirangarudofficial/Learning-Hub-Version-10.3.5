import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { CreateProgressDto, UpdateProgressDto } from '@shared/dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async create(createProgressDto: CreateProgressDto) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: createProgressDto.userId },
      });

      if (!user) {
        throw new BadRequestException(`User with ID ${createProgressDto.userId} not found`);
      }

      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: createProgressDto.courseId },
      });

      if (!course) {
        throw new BadRequestException(`Course with ID ${createProgressDto.courseId} not found`);
      }

      // Check if progress already exists for this user and course
      const existingProgress = await this.prisma.userProgress.findUnique({
        where: {
          userId_courseId: {
            userId: createProgressDto.userId,
            courseId: createProgressDto.courseId,
          },
        },
      });

      if (existingProgress) {
        throw new BadRequestException(
          `Progress already exists for user ${createProgressDto.userId} and course ${createProgressDto.courseId}`,
        );
      }

      // Set default values
      const progressData = {
        userId: createProgressDto.userId,
        courseId: createProgressDto.courseId,
        progressPercentage: createProgressDto.progressPercentage || 0,
      };

      // Create progress record
      const progress = await this.prisma.userProgress.create({
        data: progressData,
      });

      // If completed lessons are provided, connect them
      if (createProgressDto.completedLessonIds && createProgressDto.completedLessonIds.length > 0) {
        await this.prisma.userProgress.update({
          where: { id: progress.id },
          data: {
            completedLessons: {
              connect: createProgressDto.completedLessonIds.map(lessonId => ({ id: lessonId })),
            },
          },
        });

        // Fetch the updated progress with completed lessons
        return this.findOne(progress.id);
      }

      return {
        success: true,
        data: progress,
        message: 'Progress created successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create progress: ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const progresses = await this.prisma.userProgress.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        success: true,
        data: progresses,
        message: 'Progress records retrieved successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve progress records: ${error.message}`,
      );
    }
  }

  async findByUser(userId: string) {
    try {
      const progresses = await this.prisma.userProgress.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              image: true,
              level: true,
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        success: true,
        data: progresses,
        message: `Progress records for user ${userId} retrieved successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve progress records for user ${userId}: ${error.message}`,
      );
    }
  }

  async findByCourse(courseId: string) {
    try {
      const progresses = await this.prisma.userProgress.findMany({
        where: { courseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        success: true,
        data: progresses,
        message: `Progress records for course ${courseId} retrieved successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve progress records for course ${courseId}: ${error.message}`,
      );
    }
  }

  async findByUserAndCourse(userId: string, courseId: string) {
    try {
      const progress = await this.prisma.userProgress.findUnique({
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
              curriculum: {
                select: {
                  id: true,
                  title: true,
                  lessons: {
                    select: {
                      id: true,
                      title: true,
                      type: true,
                      duration: true,
                    },
                  },
                },
              },
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!progress) {
        throw new NotFoundException(
          `Progress not found for user ${userId} and course ${courseId}`,
        );
      }

      return {
        success: true,
        data: progress,
        message: `Progress for user ${userId} and course ${courseId} retrieved successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve progress for user ${userId} and course ${courseId}: ${error.message}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const progress = await this.prisma.userProgress.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!progress) {
        throw new NotFoundException(`Progress with ID ${id} not found`);
      }

      return {
        success: true,
        data: progress,
        message: `Progress with ID ${id} retrieved successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve progress with ID ${id}: ${error.message}`,
      );
    }
  }

  async update(id: string, updateProgressDto: UpdateProgressDto) {
    try {
      // Check if progress exists
      const existingProgress = await this.prisma.userProgress.findUnique({
        where: { id },
        include: {
          completedLessons: true,
        },
      });

      if (!existingProgress) {
        throw new NotFoundException(`Progress with ID ${id} not found`);
      }

      // Update progress data
      const updateData: any = {};

      if (updateProgressDto.progressPercentage !== undefined) {
        updateData.progressPercentage = updateProgressDto.progressPercentage;
      }

      if (updateProgressDto.lastAccessed) {
        updateData.lastAccessed = updateProgressDto.lastAccessed;
      }

      // Handle completed lessons if provided
      if (updateProgressDto.completedLessonIds && updateProgressDto.completedLessonIds.length > 0) {
        // Get existing completed lesson IDs
        const existingLessonIds = existingProgress.completedLessons.map(lesson => lesson.id);
        
        // Filter out lessons that are already completed
        const newLessonIds = updateProgressDto.completedLessonIds.filter(
          lessonId => !existingLessonIds.includes(lessonId),
        );

        if (newLessonIds.length > 0) {
          updateData.completedLessons = {
            connect: newLessonIds.map(lessonId => ({ id: lessonId })),
          };
        }
      }

      // Update the progress record
      const updatedProgress = await this.prisma.userProgress.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        success: true,
        data: updatedProgress,
        message: `Progress with ID ${id} updated successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update progress with ID ${id}: ${error.message}`,
      );
    }
  }

  async addCompletedLesson(id: string, lessonId: string) {
    try {
      // Check if progress exists
      const existingProgress = await this.prisma.userProgress.findUnique({
        where: { id },
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

      if (!existingProgress) {
        throw new NotFoundException(`Progress with ID ${id} not found`);
      }

      // Check if lesson is already completed
      const isLessonCompleted = existingProgress.completedLessons.some(
        lesson => lesson.id === lessonId,
      );

      if (isLessonCompleted) {
        return {
          success: true,
          data: existingProgress,
          message: `Lesson ${lessonId} is already marked as completed`,
        };
      }

      // Check if lesson exists in the course
      let lessonExists = false;
      let totalLessons = 0;

      for (const module of existingProgress.course.curriculum) {
        totalLessons += module.lessons.length;
        if (module.lessons.some(lesson => lesson.id === lessonId)) {
          lessonExists = true;
          break;
        }
      }

      if (!lessonExists) {
        throw new BadRequestException(
          `Lesson ${lessonId} does not exist in the course ${existingProgress.course.id}`,
        );
      }

      // Add lesson to completed lessons
      const updatedProgress = await this.prisma.userProgress.update({
        where: { id },
        data: {
          completedLessons: {
            connect: { id: lessonId },
          },
        },
        include: {
          completedLessons: true,
        },
      });

      // Calculate new progress percentage
      const completedLessonsCount = updatedProgress.completedLessons.length;
      const newProgressPercentage = (completedLessonsCount / totalLessons) * 100;

      // Update progress percentage
      const finalProgress = await this.prisma.userProgress.update({
        where: { id },
        data: {
          progressPercentage: newProgressPercentage,
          lastAccessed: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        success: true,
        data: finalProgress,
        message: `Lesson ${lessonId} marked as completed successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to mark lesson ${lessonId} as completed: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      // Check if progress exists
      const existingProgress = await this.prisma.userProgress.findUnique({
        where: { id },
      });

      if (!existingProgress) {
        throw new NotFoundException(`Progress with ID ${id} not found`);
      }

      // Delete progress record
      await this.prisma.userProgress.delete({
        where: { id },
      });

      return {
        success: true,
        message: `Progress with ID ${id} deleted successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete progress with ID ${id}: ${error.message}`,
      );
    }
  }

  async generateReport(courseId: string) {
    try {
      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        include: {
          curriculum: {
            include: {
              lessons: true,
            },
          },
        },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      // Get all progress records for the course
      const progresses = await this.prisma.userProgress.findMany({
        where: { courseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          completedLessons: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Calculate total lessons in the course
      let totalLessons = 0;
      for (const module of course.curriculum) {
        totalLessons += module.lessons.length;
      }

      // Generate report data
      const reportData = {
        courseId: course.id,
        courseTitle: course.title,
        totalStudents: progresses.length,
        totalLessons,
        averageProgress: progresses.length > 0
          ? progresses.reduce((sum, p) => sum + p.progressPercentage, 0) / progresses.length
          : 0,
        completionRate: progresses.length > 0
          ? (progresses.filter(p => p.progressPercentage >= 100).length / progresses.length) * 100
          : 0,
        studentProgress: progresses.map(p => ({
          userId: p.user.id,
          userName: p.user.name,
          userEmail: p.user.email,
          progressPercentage: p.progressPercentage,
          completedLessons: p.completedLessons.length,
          lastAccessed: p.lastAccessed,
        })),
      };

      return {
        success: true,
        data: reportData,
        message: `Progress report for course ${courseId} generated successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate progress report for course ${courseId}: ${error.message}`,
      );
    }
  }
}
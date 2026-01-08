import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructorProfile: true,
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                image: true,
              },
            },
          },
        },
        progress: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            notes: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { passwordHash, ...userProfile } = user;
    return userProfile;
  }

  async updateUserProfile(userId: string, updateData: any) {
    const allowedFields = ['name', 'avatar'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: filteredData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        instructorProfile: {
          select: {
            bio: true,
            rating: true,
            students: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAllUsers(params: any) {
    const { page = 1, limit = 10, search, role } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { role }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          createdAt: true,
          instructorProfile: {
            select: {
              bio: true,
              rating: true,
              students: true,
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
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            notes: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                price: true,
              },
            },
          },
        },
        progress: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate total spent
    const totalSpent = user.enrollments.reduce((sum, enrollment) => {
      return sum + enrollment.course.price;
    }, 0);

    // Calculate average progress
    const avgProgress = user.progress.length > 0
      ? user.progress.reduce((sum, p) => sum + p.progressPercentage, 0) / user.progress.length
      : 0;

    // Calculate completed courses
    const completedCourses = user.progress.filter(p => p.progressPercentage >= 100).length;

    return {
      totalEnrollments: user._count.enrollments,
      totalReviews: user._count.reviews,
      totalNotes: user._count.notes,
      totalSpent,
      averageProgress: Math.round(avgProgress),
      completedCourses,
      inProgressCourses: user.progress.length - completedCourses,
    };
  }
}
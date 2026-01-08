import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICE_TOKENS } from '@shared/constants';
import { PrismaService } from '@shared/database/prisma.service';
import { ApiResponseUtil } from '@shared/utils';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(MICROSERVICE_TOKENS.USER_SERVICE)
    private userServiceClient: ClientProxy,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        instructorProfile: true,
        enrollments: {
          include: {
            course: true,
          },
        },
        progress: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return ApiResponseUtil.success(user);
  }

  async updateProfile(userId: string, updateData: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateData.name,
        avatar: updateData.avatar,
      },
    });

    // Emit update event to user service
    this.userServiceClient.emit('user.updated', {
      userId: user.id,
      ...updateData,
    });

    return ApiResponseUtil.success(user);
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
        instructorProfile: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return ApiResponseUtil.success(user);
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        instructorProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponseUtil.success(users);
  }
}
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { CreateContentDto, UpdateContentDto, ContentStatus } from '@shared/dto/content.dto';
import { EVENTS } from '@shared/constants';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(createContentDto: CreateContentDto) {
    try {
      // Verify course exists
      const course = await this.prisma.course.findUnique({
        where: { id: createContentDto.courseId },
      });

      if (!course) {
        throw new BadRequestException(`Course with ID ${createContentDto.courseId} not found`);
      }

      // Verify module exists
      const module = await this.prisma.module.findUnique({
        where: { id: createContentDto.moduleId },
      });

      if (!module) {
        throw new BadRequestException(`Module with ID ${createContentDto.moduleId} not found`);
      }

      // If order is not provided, set it to the last position
      if (!createContentDto.order) {
        const lastContent = await this.prisma.content.findFirst({
          where: { moduleId: createContentDto.moduleId },
          orderBy: { order: 'desc' },
        });

        createContentDto.order = lastContent ? lastContent.order + 1 : 1;
      }

      // Set default values if not provided
      const contentData = {
        ...createContentDto,
        status: createContentDto.status || ContentStatus.DRAFT,
        isRequired: createContentDto.isRequired !== undefined ? createContentDto.isRequired : true,
        tags: createContentDto.tags || [],
      };

      const content = await this.prisma.content.create({
        data: contentData,
      });

      // Emit content created event (for future event-driven architecture)
      // this.eventEmitter.emit(EVENTS.CONTENT_CREATED, content);

      return {
        success: true,
        data: content,
        message: 'Content created successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create content: ${error.message}`,
      );
    }
  }

  async findAll(filters?: { type?: string; status?: ContentStatus }) {
    try {
      const where: any = {};

      if (filters?.type) {
        where.type = filters.type;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      const contents = await this.prisma.content.findMany({
        where,
        orderBy: [
          { moduleId: 'asc' },
          { order: 'asc' },
        ],
      });

      return {
        success: true,
        data: contents,
        message: 'Contents retrieved successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve contents: ${error.message}`,
      );
    }
  }

  async findByCourse(courseId: string) {
    try {
      const contents = await this.prisma.content.findMany({
        where: { courseId },
        orderBy: [
          { moduleId: 'asc' },
          { order: 'asc' },
        ],
      });

      return {
        success: true,
        data: contents,
        message: `Contents for course ${courseId} retrieved successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve contents for course ${courseId}: ${error.message}`,
      );
    }
  }

  async findByModule(moduleId: string) {
    try {
      const contents = await this.prisma.content.findMany({
        where: { moduleId },
        orderBy: { order: 'asc' },
      });

      return {
        success: true,
        data: contents,
        message: `Contents for module ${moduleId} retrieved successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve contents for module ${moduleId}: ${error.message}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!content) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      return {
        success: true,
        data: content,
        message: 'Content retrieved successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to retrieve content: ${error.message}`,
      );
    }
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    try {
      // Check if content exists
      const existingContent = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!existingContent) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      // If moduleId is changing, verify the new module exists
      if (updateContentDto.moduleId && updateContentDto.moduleId !== existingContent.moduleId) {
        const module = await this.prisma.module.findUnique({
          where: { id: updateContentDto.moduleId },
        });

        if (!module) {
          throw new BadRequestException(`Module with ID ${updateContentDto.moduleId} not found`);
        }
      }

      const updatedContent = await this.prisma.content.update({
        where: { id },
        data: updateContentDto,
      });

      // Emit content updated event (for future event-driven architecture)
      // this.eventEmitter.emit(EVENTS.CONTENT_UPDATED, updatedContent);

      return {
        success: true,
        data: updatedContent,
        message: 'Content updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update content: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    try {
      // Check if content exists
      const existingContent = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!existingContent) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      await this.prisma.content.delete({
        where: { id },
      });

      // Emit content deleted event (for future event-driven architecture)
      // this.eventEmitter.emit(EVENTS.CONTENT_DELETED, existingContent);

      return {
        success: true,
        message: 'Content deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete content: ${error.message}`,
      );
    }
  }

  async changeStatus(id: string, status: ContentStatus) {
    try {
      // Check if content exists
      const existingContent = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!existingContent) {
        throw new NotFoundException(`Content with ID ${id} not found`);
      }

      const updatedContent = await this.prisma.content.update({
        where: { id },
        data: { status },
      });

      return {
        success: true,
        data: updatedContent,
        message: `Content status changed to ${status} successfully`,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to change content status: ${error.message}`,
      );
    }
  }
}
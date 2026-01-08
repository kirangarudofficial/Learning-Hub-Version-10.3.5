import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { MediaService, FileUpload } from './media.service';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('upload_file')
  async uploadFile(@Payload() data: { file: FileUpload; userId: string; entityType?: string; entityId?: string }) {
    return this.mediaService.uploadFile(data.file, data.userId, data.entityType, data.entityId);
  }

  @MessagePattern('upload_multiple_files')
  async uploadMultipleFiles(@Payload() data: { files: FileUpload[]; userId: string; entityType?: string; entityId?: string }) {
    return this.mediaService.uploadMultipleFiles(data.files, data.userId, data.entityType, data.entityId);
  }

  @MessagePattern('get_all_media')
  async findAll(@Payload() params: any) {
    return this.mediaService.findAll(params);
  }

  @MessagePattern('get_media_by_user')
  async findByUser(@Payload() data: { userId: string; params?: any }) {
    return this.mediaService.findByUser(data.userId, data.params);
  }

  @MessagePattern('get_media_by_entity')
  async findByEntity(@Payload() data: { entityId: string; entityType: string; params?: any }) {
    return this.mediaService.findByEntity(data.entityId, data.entityType, data.params);
  }

  @MessagePattern('get_media_by_id')
  async findOne(@Payload() id: string) {
    return this.mediaService.findOne(id);
  }

  @MessagePattern('update_media_metadata')
  async updateMetadata(@Payload() data: { id: string; metadata: any }) {
    return this.mediaService.updateMetadata(data.id, data.metadata);
  }

  @MessagePattern('remove_media')
  async remove(@Payload() data: { id: string; hard?: boolean }) {
    return this.mediaService.remove(data.id, data.hard);
  }

  @MessagePattern('get_file_stream')
  async getFileStream(@Payload() id: string) {
    return this.mediaService.getFileStream(id);
  }

  @MessagePattern('generate_thumbnail')
  async generateThumbnail(@Payload() data: { id: string; width?: number; height?: number }) {
    return this.mediaService.generateThumbnail(data.id, data.width, data.height);
  }

  @MessagePattern('get_media_stats')
  async getStats(@Payload() data: { userId?: string }) {
    return this.mediaService.getStats(data.userId);
  }

  // Event handlers
  @EventPattern('course.created')
  async handleCourseCreated(@Payload() data: { courseId: string; instructorId: string }) {
    console.log('Course created event received for media service:', data);
    // Handle course creation - maybe create default folders or setup media structure
  }

  @EventPattern('course.deleted')
  async handleCourseDeleted(@Payload() data: { courseId: string }) {
    console.log('Course deleted event received for media service:', data);
    // Clean up all media associated with the deleted course
    // This would typically be handled by cascade delete, but we might want to clean up physical files
  }

  @EventPattern('user.deleted')
  async handleUserDeleted(@Payload() data: { userId: string }) {
    console.log('User deleted event received for media service:', data);
    // Clean up all media associated with the deleted user
  }

  @EventPattern('lesson.created')
  async handleLessonCreated(@Payload() data: { lessonId: string; courseId: string }) {
    console.log('Lesson created event received for media service:', data);
    // Handle lesson creation - setup for video/document uploads
  }
}

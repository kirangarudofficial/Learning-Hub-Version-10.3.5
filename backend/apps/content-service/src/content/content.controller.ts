import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto, ContentStatus } from '@shared/dto/content.dto';
import { PATTERNS } from '@shared/constants';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateContentDto })
  @ApiBearerAuth()
  async create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all content items' })
  @ApiResponse({ status: 200, description: 'Return all content items' })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  @ApiQuery({ name: 'moduleId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ContentStatus })
  @ApiBearerAuth()
  async findAll(
    @Query('courseId') courseId?: string,
    @Query('moduleId') moduleId?: string,
    @Query('type') type?: string,
    @Query('status') status?: ContentStatus,
  ) {
    if (courseId) {
      return this.contentService.findByCourse(courseId);
    }
    if (moduleId) {
      return this.contentService.findByModule(moduleId);
    }
    return this.contentService.findAll({ type, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Return content by ID' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update content' })
  @ApiResponse({ status: 200, description: 'Content successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateContentDto })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content' })
  @ApiResponse({ status: 200, description: 'Content successfully deleted' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Change content status' })
  @ApiResponse({ status: 200, description: 'Content status successfully changed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ schema: { properties: { status: { type: 'string', enum: Object.values(ContentStatus) } } } })
  @ApiBearerAuth()
  async changeStatus(@Param('id') id: string, @Body('status') status: ContentStatus) {
    return this.contentService.changeStatus(id, status);
  }

  // Microservice message patterns
  @MessagePattern(PATTERNS.CONTENT.FIND_ALL)
  async findAllContent(@Payload() filters: any) {
    return this.contentService.findAll(filters);
  }

  @MessagePattern(PATTERNS.CONTENT.FIND_BY_COURSE)
  async findContentByCourse(@Payload() courseId: string) {
    return this.contentService.findByCourse(courseId);
  }

  @MessagePattern(PATTERNS.CONTENT.FIND_BY_MODULE)
  async findContentByModule(@Payload() moduleId: string) {
    return this.contentService.findByModule(moduleId);
  }

  @MessagePattern(PATTERNS.CONTENT.FIND_ONE)
  async findOneContent(@Payload() id: string) {
    return this.contentService.findOne(id);
  }

  @MessagePattern(PATTERNS.CONTENT.CREATE)
  async createContent(@Payload() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @MessagePattern(PATTERNS.CONTENT.UPDATE)
  async updateContent(@Payload() data: { id: string; updateContentDto: UpdateContentDto }) {
    return this.contentService.update(data.id, data.updateContentDto);
  }

  @MessagePattern(PATTERNS.CONTENT.DELETE)
  async deleteContent(@Payload() id: string) {
    return this.contentService.remove(id);
  }

  @MessagePattern(PATTERNS.CONTENT.CHANGE_STATUS)
  async changeContentStatus(@Payload() data: { id: string; status: ContentStatus }) {
    return this.contentService.changeStatus(data.id, data.status);
  }
}
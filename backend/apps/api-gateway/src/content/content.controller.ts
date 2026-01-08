import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '@shared/auth';
import { MICROSERVICE_TOKENS, PATTERNS } from '@shared/constants';
import { CreateContentDto, UpdateContentDto, ContentStatus } from '@shared/dto/content.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(
    @Inject(MICROSERVICE_TOKENS.CONTENT_SERVICE)
    private readonly contentServiceClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.CREATE },
      createContentDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all content with optional filters' })
  @ApiResponse({ status: 200, description: 'Content list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query('type') type?: string, @Query('status') status?: ContentStatus) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.FIND_ALL },
      { type, status },
    );
  }

  @Get('course/:courseId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all content for a specific course' })
  @ApiResponse({ status: 200, description: 'Course content retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findByCourse(@Param('courseId') courseId: string) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.FIND_BY_COURSE },
      courseId,
    );
  }

  @Get('module/:moduleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all content for a specific module' })
  @ApiResponse({ status: 200, description: 'Module content retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  findByModule(@Param('moduleId') moduleId: string) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.FIND_BY_MODULE },
      moduleId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  findOne(@Param('id') id: string) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.FIND_ONE },
      id,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.UPDATE },
      { id, updateContentDto },
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  remove(@Param('id') id: string) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.DELETE },
      id,
    );
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'INSTRUCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change content status' })
  @ApiResponse({ status: 200, description: 'Content status changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  changeStatus(
    @Param('id') id: string,
    @Body('status') status: ContentStatus,
  ) {
    return this.contentServiceClient.send(
      { cmd: PATTERNS.CONTENT.CHANGE_STATUS },
      { id, status },
    );
  }
}
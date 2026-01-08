import { Controller, Get, Put, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { UpdateNotificationPreferencesDto } from '../dto/notification.dto';
import { JwtAuthGuard } from '@app/shared/auth/auth.guard';

/**
 * Controller for managing user notification preferences
 */
@ApiTags('Notification Preferences')
@ApiBearerAuth()
@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
    constructor(private readonly preferencesService: PreferencesService) { }

    @Get()
    @ApiOperation({ summary: 'Get user notification preferences' })
    @ApiResponse({ status: 200, description: 'Returns user preferences' })
    async getPreferences(@Req() req: any) {
        const userId = req.user.userId;
        return this.preferencesService.getPreferences(userId);
    }

    @Put()
    @ApiOperation({ summary: 'Update user notification preferences' })
    @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
    async updatePreferences(
        @Req() req: any,
        @Body() dto: UpdateNotificationPreferencesDto,
    ) {
        const userId = req.user.userId;
        return this.preferencesService.updatePreferences(userId, dto);
    }

    @Post('reset')
    @ApiOperation({ summary: 'Reset preferences to defaults' })
    @ApiResponse({ status: 200, description: 'Preferences reset successfully' })
    async resetPreferences(@Req() req: any) {
        const userId = req.user.userId;
        return this.preferencesService.resetPreferences(userId);
    }
}

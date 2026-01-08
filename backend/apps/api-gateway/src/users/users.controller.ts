import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { CurrentUser, Roles } from '@shared/decorators/user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
    return this.usersService.updateProfile(user.id, updateData);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get()
  @Roles('ADMIN')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
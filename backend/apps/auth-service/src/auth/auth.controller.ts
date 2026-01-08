import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetDto } from '@shared/dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and invalidate tokens' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Req() req) {
    return this.authService.logout(req.user.sub);
  }

  @Get('oauth/:provider')
  @ApiOperation({ summary: 'Initiate OAuth authentication flow' })
  @ApiResponse({ status: 302, description: 'Redirect to OAuth provider' })
  async oauthLogin(@Param('provider') provider: string) {
    return this.authService.initiateOAuthFlow(provider);
  }

  @Get('oauth/:provider/callback')
  @ApiOperation({ summary: 'OAuth provider callback' })
  @ApiResponse({ status: 200, description: 'OAuth authentication successful' })
  @ApiResponse({ status: 401, description: 'OAuth authentication failed' })
  async oauthCallback(
    @Param('provider') provider: string,
    @Query('code') code: string,
  ) {
    return this.authService.handleOAuthCallback(provider, code);
  }

  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiBody({ type: PasswordResetRequestDto })
  async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post('password-reset/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiBody({ type: PasswordResetDto })
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: PasswordResetDto,
  ) {
    return this.authService.resetPassword(token, dto.password);
  }

  // Microservice message patterns
  @MessagePattern('auth.validateToken')
  async validateToken(@Payload() payload: { token: string }) {
    return this.authService.validateToken(payload.token);
  }

  @MessagePattern('auth.getUserFromToken')
  async getUserFromToken(@Payload() payload: { token: string }) {
    return this.authService.getUserFromToken(payload.token);
  }
  
  @MessagePattern('auth.login')
  async loginMicroservice(@Payload() payload: LoginDto) {
    return this.authService.login(payload);
  }
  
  @MessagePattern('auth.register')
  async registerMicroservice(@Payload() payload: RegisterDto) {
    return this.authService.register(payload);
  }
  
  @MessagePattern('auth.refreshToken')
  async refreshTokenMicroservice(@Payload() payload: { refreshToken: string }) {
    return this.authService.refreshToken(payload.refreshToken);
  }
  
  @MessagePattern('auth.logout')
  async logoutMicroservice(@Payload() payload: { userId: string }) {
    return this.authService.logout(payload.userId);
  }
  
  @MessagePattern('auth.requestPasswordReset')
  async requestPasswordResetMicroservice(@Payload() payload: { email: string }) {
    return this.authService.requestPasswordReset(payload.email);
  }
  
  @MessagePattern('auth.resetPassword')
  async resetPasswordMicroservice(@Payload() payload: { token: string, password: string }) {
    return this.authService.resetPassword(payload.token, payload.password);
  }
}
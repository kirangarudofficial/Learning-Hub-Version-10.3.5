import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { 
  LoginDto, 
  RegisterDto, 
  RefreshTokenDto,
  ApiResponse as ApiResponseType 
} from '@shared/dto';
import { Public, CurrentUser, CorrelationId } from '@shared/decorators';
import { JwtAuthGuard } from '@shared/auth/auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password' 
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                avatar: { type: 'string' },
                role: { type: 'string', enum: ['USER', 'INSTRUCTOR', 'ADMIN'] },
              },
            },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Invalid credentials' },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @CorrelationId() correlationId: string,
  ) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Create a new user account' 
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @CorrelationId() correlationId: string,
  ) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Get a new access token using refresh token' 
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @CorrelationId() correlationId: string,
  ) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current user',
    description: 'Get the currently authenticated user profile' 
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getCurrentUser(
    @CurrentUser() user: any,
    @CorrelationId() correlationId: string,
  ) {
    return {
      success: true,
      data: user.user,
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Logout the current user (invalidate token on client)' 
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully logged out' },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  async logout(@CorrelationId() correlationId: string) {
    return {
      success: true,
      message: 'Successfully logged out',
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Verify token',
    description: 'Verify if the current token is valid' 
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            valid: { type: 'boolean', example: true },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
        timestamp: { type: 'string' },
        correlationId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  async verifyToken(
    @CurrentUser() user: any,
    @CorrelationId() correlationId: string,
  ) {
    return {
      success: true,
      data: {
        valid: true,
        user: {
          id: user.sub,
          email: user.email,
          role: user.role,
        },
      },
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }
}
import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICE_TOKENS, PATTERNS } from '@shared/constants';
import { LoginDto, RegisterDto, RefreshTokenDto, PasswordResetRequestDto, PasswordResetDto } from '@shared/dto';
import { ApiResponseUtil } from '@shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(MICROSERVICE_TOKENS.AUTH_SERVICE)
    private authServiceClient: ClientProxy,
    @Inject(MICROSERVICE_TOKENS.USER_SERVICE)
    private userServiceClient: ClientProxy,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const response = await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.LOGIN, loginDto)
      );
      
      return ApiResponseUtil.success(response);
    } catch (error) {
      if (error.status === 401) {
        throw new UnauthorizedException(error.message || 'Invalid credentials');
      }
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const response = await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.REGISTER, registerDto)
      );
      
      // Emit user creation event to user service for additional processing if needed
      this.userServiceClient.emit('user.created', {
        userId: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      });
      
      return ApiResponseUtil.success(response);
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException(error.message || 'User already exists');
      }
      throw error;
    }
  }
  
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const response = await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.REFRESH_TOKEN, refreshTokenDto)
      );
      
      return ApiResponseUtil.success(response);
    } catch (error) {
      if (error.status === 401) {
        throw new UnauthorizedException(error.message || 'Invalid refresh token');
      }
      throw error;
    }
  }
  
  async logout(refreshToken: string, userId: string) {
    try {
      await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.LOGOUT, { refreshToken, userId })
      );
      
      return ApiResponseUtil.success({ message: 'Logged out successfully' });
    } catch (error) {
      throw error;
    }
  }
  
  async requestPasswordReset(passwordResetRequestDto: PasswordResetRequestDto) {
    try {
      await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.REQUEST_PASSWORD_RESET, passwordResetRequestDto)
      );
      
      return ApiResponseUtil.success({ message: 'Password reset email sent' });
    } catch (error) {
      throw error;
    }
  }
  
  async resetPassword(token: string, passwordResetDto: PasswordResetDto) {
    try {
      await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.RESET_PASSWORD, { token, ...passwordResetDto })
      );
      
      return ApiResponseUtil.success({ message: 'Password reset successful' });
    } catch (error) {
      throw error;
    }
  }
  
  async validateToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.VALIDATE_TOKEN, { token })
      );
      
      return response;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  
  async getUserFromToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.authServiceClient.send(PATTERNS.AUTH.GET_USER_FROM_TOKEN, { token })
      );
      
      return response;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
      };

      const accessToken = this.jwtService.sign(payload);

      return ApiResponseUtil.success({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Registration failed');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload);

      return ApiResponseUtil.success({ accessToken });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
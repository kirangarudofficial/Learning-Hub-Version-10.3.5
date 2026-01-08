import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@shared/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto, LoginDto, AuthResponseDto, UserRole } from '@shared/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const passwordHash = await this.hashPassword(registerDto.password);

      const user = await this.prisma.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          passwordHash,
          role: registerDto.role || 'USER',
        },
      });

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Store refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
      });

      if (!user || !user.passwordHash) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.comparePasswords(
        loginDto.password,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Store refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET'),
      });

      // Check if token exists in database and is not revoked
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.sub,
          revoked: false,
        },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Revoke old refresh token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      // Store new refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Revoke all refresh tokens for user
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });

    return {
      success: true,
      message: 'Successfully logged out',
    };
  }

  async initiateOAuthFlow(provider: string) {
    // Implementation depends on OAuth provider
    switch (provider.toLowerCase()) {
      case 'google':
        const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const googleRedirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
        const googleScope = 'profile email';
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=${googleScope}`;
        return { redirectUrl: googleAuthUrl };
      
      case 'github':
        const githubClientId = this.configService.get<string>('GITHUB_CLIENT_ID');
        const githubRedirectUri = this.configService.get<string>('GITHUB_REDIRECT_URI');
        const githubScope = 'user:email';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=${githubScope}`;
        return { redirectUrl: githubAuthUrl };
      
      default:
        throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
    }
  }

  async handleOAuthCallback(provider: string, code: string) {
    try {
      let userInfo;

      // Exchange code for token and get user info
      switch (provider.toLowerCase()) {
        case 'google':
          userInfo = await this.exchangeGoogleCodeForUser(code);
          break;
        case 'github':
          userInfo = await this.exchangeGithubCodeForUser(code);
          break;
        default:
          throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
      }

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!user) {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.avatar,
            role: 'USER',
          },
        });
      }

      // Generate tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Store refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      };
    } catch (error) {
      throw new UnauthorizedException('OAuth authentication failed');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return {
        success: true,
        message: 'If your email is registered, you will receive a password reset link',
      };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token
    await this.prisma.passwordReset.create({
      data: {
        token: resetToken,
        expiresAt: resetTokenExpiry,
        user: { connect: { id: user.id } },
      },
    });

    // In a real implementation, send email with reset link
    // For now, just return the token for testing
    return {
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
      // Remove in production
      debug: { resetToken },
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find valid reset token
    const resetRecord = await this.prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        used: false,
      },
      include: { user: true },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await this.hashPassword(newPassword);

    // Update user password
    await this.prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    });

    // Mark token as used
    await this.prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // Revoke all refresh tokens for user
    await this.prisma.refreshToken.updateMany({
      where: { userId: resetRecord.userId },
      data: { revoked: true },
    });

    return {
      success: true,
      message: 'Password successfully reset',
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return {
        valid: true,
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      return { valid: false };
    }
  }

  async getUserFromToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        return { found: false };
      }

      return {
        found: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      return { found: false };
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async validateOAuthUser(userInfo: { email: string; name: string; googleId: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      // Create new user from OAuth data
      user = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          role: UserRole.USER,
          // Store OAuth provider ID if needed
          // googleId: userInfo.googleId,
        },
      });
    }

    // Remove sensitive data
    const { passwordHash, ...result } = user;
    return result;
  }

  // Helper methods
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    
    const accessToken = this.jwtService.sign(payload);
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token,
        expiresAt,
        user: { connect: { id: userId } },
      },
    });
  }

  private async exchangeGoogleCodeForUser(code: string) {
    // In a real implementation, exchange code for token and get user info
    // For now, return mock data
    return {
      email: 'google.user@example.com',
      name: 'Google User',
      avatar: 'https://example.com/avatar.jpg',
    };
  }

  private async exchangeGithubCodeForUser(code: string) {
    // In a real implementation, exchange code for token and get user info
    // For now, return mock data
    return {
      email: 'github.user@example.com',
      name: 'GitHub User',
      avatar: 'https://example.com/avatar.jpg',
    };
  }
}
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNotEmpty, Matches } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
}

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user (min 8 characters)',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    description: 'The role of the user',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
  })
  @IsString()
  @MinLength(8)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class PasswordResetRequestDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user requesting password reset',
  })
  @IsEmail()
  email: string;
}

export class PasswordResetDto {
  @ApiProperty({
    example: 'NewPassword123!',
    description: 'The new password (min 8 characters, must include uppercase, lowercase, number)',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: 3600,
    description: 'Token expiration time in seconds',
  })
  expiresIn: number;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'USER',
    },
    description: 'User information',
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
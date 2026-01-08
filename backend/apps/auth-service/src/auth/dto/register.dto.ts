import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

enum UserRole {
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
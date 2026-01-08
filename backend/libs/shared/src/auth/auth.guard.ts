import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { CORRELATION_ID_HEADER } from '../constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      
      // Add correlation ID if not present
      if (!request.headers[CORRELATION_ID_HEADER.toLowerCase()]) {
        request.headers[CORRELATION_ID_HEADER.toLowerCase()] = this.generateCorrelationId();
      }
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRequiredRole) {
      throw new ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Admin can access everything
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if user owns the resource
    const resourceUserId = params.userId || params.id;
    if (resourceUserId && resourceUserId !== user.sub) {
      throw new ForbiddenException('Access denied. You can only access your own resources');
    }

    return true;
  }
}

// Rate limiting guard
@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(
    private readonly limit: number = 100,
    private readonly windowMs: number = 60000, // 1 minute
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = this.getKey(request);
    const now = Date.now();

    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.limit) {
      throw new ForbiddenException('Rate limit exceeded');
    }

    record.count++;
    return true;
  }

  private getKey(request: any): string {
    return request.ip || request.connection.remoteAddress || 'unknown';
  }
}
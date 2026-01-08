import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | 'user' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    if (data === 'user') {
      return user.user; // Return the full user object from database
    }

    return data ? user[data] : user;
  },
);

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.sub;
  },
);

export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.role;
  },
);

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.email;
  },
);

export const CorrelationId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-correlation-id'] || 
           request.headers['X-Correlation-ID'] ||
           `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  },
);

export const RequestId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-request-id'] || 
           request.headers['X-Request-ID'] ||
           `req-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  },
);

export const TraceId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-trace-id'] || 
           request.headers['X-Trace-ID'] ||
           `trace-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  },
);
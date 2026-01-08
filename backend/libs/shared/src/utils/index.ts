import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

// Password utilities
export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

// API Response utility
export class ApiResponse<T = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  @IsOptional()
  data?: T;

  @ApiProperty()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsOptional()
  error?: string;

  @ApiProperty()
  @IsOptional()
  correlationId?: string;

  @ApiProperty()
  timestamp: string;
}

export class PaginatedResponse<T = any> extends ApiResponse<T[]> {
  @ApiProperty()
  pagination: {
    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    pages: number;

    @ApiProperty()
    hasNext: boolean;

    @ApiProperty()
    hasPrev: boolean;
  };
}

export class ApiResponseUtil {
  static success<T>(data: T, message?: string, correlationId?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  static error(error: string, correlationId?: string): ApiResponse {
    return {
      success: false,
      error,
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string,
    correlationId?: string
  ): PaginatedResponse<T> {
    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;

    return {
      success: true,
      data,
      message,
      correlationId,
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext,
        hasPrev,
      },
    };
  }
}

// UUID utilities
export class UuidUtils {
  static generate(): string {
    return uuidv4();
  }

  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

// Correlation ID utilities
export class CorrelationUtils {
  static generate(): string {
    return uuidv4();
  }

  static extractFromHeaders(headers: any): string | undefined {
    return headers['x-correlation-id'] || headers['X-Correlation-ID'];
  }
}

// Date utilities
export class DateUtils {
  static formatToISO(date: Date): string {
    return date.toISOString();
  }

  static isExpired(date: Date): boolean {
    return date < new Date();
  }

  static addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

// Validation utilities
export class ValidationUtils {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
  }
}

// Error handling utilities
export class ErrorUtils {
  static createErrorResponse(error: any, correlationId?: string) {
    const message = error?.message || 'An unexpected error occurred';
    const statusCode = error?.status || 500;
    
    return {
      success: false,
      error: message,
      statusCode,
      correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  static logError(error: any, context: string, correlationId?: string) {
    console.error(`[${context}] Error:`, {
      message: error?.message,
      stack: error?.stack,
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}

// Cache utilities
export class CacheUtils {
  static generateKey(prefix: string, ...params: string[]): string {
    return `${prefix}:${params.join(':')}`;
  }

  static parseTTL(ttl: string | number): number {
    if (typeof ttl === 'number') return ttl;
    
    const unit = ttl.slice(-1);
    const value = parseInt(ttl.slice(0, -1));
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: return value;
    }
  }
}

// Performance utilities
export class PerformanceUtils {
  static async measure<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      console.log(`${label} took ${end - start} milliseconds`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${label} failed after ${end - start} milliseconds`, error);
      throw error;
    }
  }

  static startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`${label} took ${end - start} milliseconds`);
    };
  }
}
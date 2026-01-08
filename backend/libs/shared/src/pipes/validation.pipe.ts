import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ValidationPipe.name);

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    });

    if (errors.length > 0) {
      const errorMessages = this.formatErrors(errors);
      this.logger.warn('Validation failed', { errors: errorMessages, value });
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): string[] {
    return errors.reduce((acc, error) => {
      if (error.constraints) {
        acc.push(...Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        acc.push(...this.formatErrors(error.children));
      }
      return acc;
    }, []);
  }
}

@Injectable()
export class ParseUUIDPipe implements PipeTransform {
  private readonly logger = new Logger(ParseUUIDPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('UUID parameter is required');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      this.logger.warn(`Invalid UUID format: ${value}`);
      throw new BadRequestException(`Invalid UUID format: ${value}`);
    }

    return value;
  }
}

@Injectable()
export class ParseIntPipe implements PipeTransform {
  private readonly logger = new Logger(ParseIntPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed = parseInt(value, 10);
    
    if (isNaN(parsed)) {
      this.logger.warn(`Invalid integer format: ${value}`);
      throw new BadRequestException(`Invalid integer format: ${value}`);
    }

    return parsed;
  }
}

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object' && value !== null) {
      return this.trimObject(value);
    }
    
    return value;
  }

  private trimObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.trimObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const trimmed: any = {};
      Object.keys(obj).forEach(key => {
        trimmed[key] = this.trimObject(obj[key]);
      });
      return trimmed;
    }

    if (typeof obj === 'string') {
      return obj.trim();
    }

    return obj;
  }
}
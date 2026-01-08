import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../libs/shared/database/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback(prismaService)),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Mock bcrypt functions
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock ConfigService
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'JWT_EXPIRATION') return 3600;
      if (key === 'REFRESH_TOKEN_EXPIRATION') return 604800;
      return 'test-value';
    });

    // Mock JwtService
    jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');
    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 'user-id' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockUser = {
        id: 'user-id',
        email: registerDto.email,
        name: registerDto.name,
        role: 'USER',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({ id: 'token-id', token: 'refresh-token', userId: 'user-id', expiresAt: new Date() });

      const result = await service.register(registerDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: 'hashedPassword',
          name: registerDto.name,
          role: 'USER',
        },
      });
      expect(result).toEqual({
        accessToken: 'test-token',
        refreshToken: expect.any(String),
        expiresIn: 3600,
        user: mockUser,
      });
    });

    it('should throw an error if user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 'existing-user-id',
        email: registerDto.email,
        name: 'Existing User',
        role: 'USER',
      } as any);

      await expect(service.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login a user and return tokens', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-id',
        email: loginDto.email,
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({ id: 'token-id', token: 'refresh-token', userId: 'user-id', expiresAt: new Date() });

      const result = await service.login(loginDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toEqual({
        accessToken: 'test-token',
        refreshToken: expect.any(String),
        expiresIn: 3600,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
    });

    it('should throw an error if user not found', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-id',
        email: loginDto.email,
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  // Add more tests for other methods as needed
});
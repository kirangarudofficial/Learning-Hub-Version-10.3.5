/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/auth-service/src/app.module.ts":
/*!*********************************************!*\
  !*** ./apps/auth-service/src/app.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const database_module_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/database.module'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./apps/auth-service/src/auth/auth.module.ts");
const health_module_1 = __webpack_require__(/*! ./health/health.module */ "./apps/auth-service/src/health/health.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local', '.env.development'],
                expandVariables: true,
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-secret-key',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION') || '24h',
                        issuer: configService.get('JWT_ISSUER') || 'learning-platform',
                        audience: configService.get('JWT_AUDIENCE') || 'learning-platform-users',
                    },
                    verifyOptions: {
                        issuer: configService.get('JWT_ISSUER') || 'learning-platform',
                        audience: configService.get('JWT_AUDIENCE') || 'learning-platform-users',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./apps/auth-service/src/auth/auth.controller.ts":
/*!*******************************************************!*\
  !*** ./apps/auth-service/src/auth/auth.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/auth-service/src/auth/auth.service.ts");
const auth_dto_1 = __webpack_require__(/*! @shared/dto/auth.dto */ "./libs/shared/dto/auth.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './guards/jwt-auth.guard'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const local_auth_guard_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './guards/local-auth.guard'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async refreshToken(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    async logout(req) {
        return this.authService.logout(req.user.sub);
    }
    async oauthLogin(provider) {
        return this.authService.initiateOAuthFlow(provider);
    }
    async oauthCallback(provider, code) {
        return this.authService.handleOAuthCallback(provider, code);
    }
    async requestPasswordReset(dto) {
        return this.authService.requestPasswordReset(dto.email);
    }
    async resetPassword(token, dto) {
        return this.authService.resetPassword(token, dto.password);
    }
    async validateToken(payload) {
        return this.authService.validateToken(payload.token);
    }
    async getUserFromToken(payload) {
        return this.authService.getUserFromToken(payload.token);
    }
    async loginMicroservice(payload) {
        return this.authService.login(payload);
    }
    async registerMicroservice(payload) {
        return this.authService.register(payload);
    }
    async refreshTokenMicroservice(payload) {
        return this.authService.refreshToken(payload.refreshToken);
    }
    async logoutMicroservice(payload) {
        return this.authService.logout(payload.userId);
    }
    async requestPasswordResetMicroservice(payload) {
        return this.authService.requestPasswordReset(payload.email);
    }
    async resetPasswordMicroservice(payload) {
        return this.authService.resetPassword(payload.token, payload.password);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.RegisterDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_dto_1.RegisterDto !== "undefined" && auth_dto_1.RegisterDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Login with email and password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully logged in' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.LoginDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof auth_dto_1.LoginDto !== "undefined" && auth_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token successfully refreshed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.RefreshTokenDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof auth_dto_1.RefreshTokenDto !== "undefined" && auth_dto_1.RefreshTokenDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user and invalidate tokens' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('oauth/:provider'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate OAuth authentication flow' }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to OAuth provider' }),
    __param(0, (0, common_1.Param)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oauthLogin", null);
__decorate([
    (0, common_1.Get)('oauth/:provider/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'OAuth provider callback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OAuth authentication successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'OAuth authentication failed' }),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oauthCallback", null);
__decorate([
    (0, common_1.Post)('password-reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset email sent' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.PasswordResetRequestDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof auth_dto_1.PasswordResetRequestDto !== "undefined" && auth_dto_1.PasswordResetRequestDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordReset", null);
__decorate([
    (0, common_1.Post)('password-reset/:token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password successfully reset' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired token' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.PasswordResetDto }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof auth_dto_1.PasswordResetDto !== "undefined" && auth_dto_1.PasswordResetDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.validateToken'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateToken", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.getUserFromToken'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserFromToken", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.login'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof auth_dto_1.LoginDto !== "undefined" && auth_dto_1.LoginDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginMicroservice", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.register'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof auth_dto_1.RegisterDto !== "undefined" && auth_dto_1.RegisterDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerMicroservice", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.refreshToken'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokenMicroservice", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.logout'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutMicroservice", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.requestPasswordReset'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasswordResetMicroservice", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.resetPassword'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPasswordMicroservice", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./apps/auth-service/src/auth/auth.module.ts":
/*!***************************************************!*\
  !*** ./apps/auth-service/src/auth/auth.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./apps/auth-service/src/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/auth-service/src/auth/auth.service.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./apps/auth-service/src/auth/strategies/jwt.strategy.ts");
const local_strategy_1 = __webpack_require__(/*! ./strategies/local.strategy */ "./apps/auth-service/src/auth/strategies/local.strategy.ts");
const oauth_strategy_1 = __webpack_require__(/*! ./strategies/oauth.strategy */ "./apps/auth-service/src/auth/strategies/oauth.strategy.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-secret-key',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION') || '24h',
                        issuer: configService.get('JWT_ISSUER') || 'learning-platform',
                        audience: configService.get('JWT_AUDIENCE') || 'learning-platform-users',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy, oauth_strategy_1.OAuthStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./apps/auth-service/src/auth/auth.service.ts":
/*!****************************************************!*\
  !*** ./apps/auth-service/src/auth/auth.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/prisma.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const auth_dto_1 = __webpack_require__(/*! @shared/dto/auth.dto */ "./libs/shared/dto/auth.dto.ts");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: registerDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('User already exists');
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
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Registration failed');
        }
    }
    async login(loginDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
            });
            if (!user || !user.passwordHash) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await this.comparePasswords(loginDto.password, user.passwordHash);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const tokens = await this.generateTokens(user.id, user.email, user.role);
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
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Login failed');
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET') || this.configService.get('JWT_SECRET'),
            });
            const storedToken = await this.prisma.refreshToken.findFirst({
                where: {
                    token: refreshToken,
                    userId: decoded.sub,
                    revoked: false,
                },
            });
            if (!storedToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const tokens = await this.generateTokens(user.id, user.email, user.role);
            await this.prisma.refreshToken.update({
                where: { id: storedToken.id },
                data: { revoked: true },
            });
            await this.storeRefreshToken(user.id, tokens.refreshToken);
            return {
                success: true,
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId },
            data: { revoked: true },
        });
        return {
            success: true,
            message: 'Successfully logged out',
        };
    }
    async initiateOAuthFlow(provider) {
        switch (provider.toLowerCase()) {
            case 'google':
                const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
                const googleRedirectUri = this.configService.get('GOOGLE_REDIRECT_URI');
                const googleScope = 'profile email';
                const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=${googleScope}`;
                return { redirectUrl: googleAuthUrl };
            case 'github':
                const githubClientId = this.configService.get('GITHUB_CLIENT_ID');
                const githubRedirectUri = this.configService.get('GITHUB_REDIRECT_URI');
                const githubScope = 'user:email';
                const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=${githubScope}`;
                return { redirectUrl: githubAuthUrl };
            default:
                throw new common_1.BadRequestException(`Unsupported OAuth provider: ${provider}`);
        }
    }
    async handleOAuthCallback(provider, code) {
        try {
            let userInfo;
            switch (provider.toLowerCase()) {
                case 'google':
                    userInfo = await this.exchangeGoogleCodeForUser(code);
                    break;
                case 'github':
                    userInfo = await this.exchangeGithubCodeForUser(code);
                    break;
                default:
                    throw new common_1.BadRequestException(`Unsupported OAuth provider: ${provider}`);
            }
            let user = await this.prisma.user.findUnique({
                where: { email: userInfo.email },
            });
            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        email: userInfo.email,
                        name: userInfo.name,
                        avatar: userInfo.avatar,
                        role: 'USER',
                    },
                });
            }
            const tokens = await this.generateTokens(user.id, user.email, user.role);
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
        }
        catch (error) {
            throw new common_1.UnauthorizedException('OAuth authentication failed');
        }
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return {
                success: true,
                message: 'If your email is registered, you will receive a password reset link',
            };
        }
        const resetToken = (0, uuid_1.v4)();
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        await this.prisma.passwordReset.create({
            data: {
                token: resetToken,
                expiresAt: resetTokenExpiry,
                user: { connect: { id: user.id } },
            },
        });
        return {
            success: true,
            message: 'If your email is registered, you will receive a password reset link',
            debug: { resetToken },
        };
    }
    async resetPassword(token, newPassword) {
        const resetRecord = await this.prisma.passwordReset.findFirst({
            where: {
                token,
                expiresAt: { gt: new Date() },
                used: false,
            },
            include: { user: true },
        });
        if (!resetRecord) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const passwordHash = await this.hashPassword(newPassword);
        await this.prisma.user.update({
            where: { id: resetRecord.userId },
            data: { passwordHash },
        });
        await this.prisma.passwordReset.update({
            where: { id: resetRecord.id },
            data: { used: true },
        });
        await this.prisma.refreshToken.updateMany({
            where: { userId: resetRecord.userId },
            data: { revoked: true },
        });
        return {
            success: true,
            message: 'Password successfully reset',
        };
    }
    async validateToken(token) {
        try {
            const decoded = this.jwtService.verify(token);
            return {
                valid: true,
                userId: decoded.sub,
                email: decoded.email,
                role: decoded.role,
            };
        }
        catch (error) {
            return { valid: false };
        }
    }
    async getUserFromToken(token) {
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
        }
        catch (error) {
            return { found: false };
        }
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.passwordHash) {
            return null;
        }
        const isPasswordValid = await this.comparePasswords(password, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }
        const { passwordHash, ...result } = user;
        return result;
    }
    async validateOAuthUser(userInfo) {
        let user = await this.prisma.user.findUnique({
            where: { email: userInfo.email },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: userInfo.email,
                    name: userInfo.name,
                    role: auth_dto_1.UserRole.USER,
                },
            });
        }
        const { passwordHash, ...result } = user;
        return result;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET') || this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
        });
        return { accessToken, refreshToken };
    }
    async storeRefreshToken(userId, token) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: {
                token,
                expiresAt,
                user: { connect: { id: userId } },
            },
        });
    }
    async exchangeGoogleCodeForUser(code) {
        return {
            email: 'google.user@example.com',
            name: 'Google User',
            avatar: 'https://example.com/avatar.jpg',
        };
    }
    async exchangeGithubCodeForUser(code) {
        return {
            email: 'github.user@example.com',
            name: 'GitHub User',
            avatar: 'https://example.com/avatar.jpg',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./apps/auth-service/src/auth/strategies/jwt.strategy.ts":
/*!***************************************************************!*\
  !*** ./apps/auth-service/src/auth/strategies/jwt.strategy.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const prisma_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/prisma.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, prismaService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
        this.prismaService = prismaService;
    }
    async validate(payload) {
        const user = await this.prismaService.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),

/***/ "./apps/auth-service/src/auth/strategies/local.strategy.ts":
/*!*****************************************************************!*\
  !*** ./apps/auth-service/src/auth/strategies/local.strategy.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_local_1 = __webpack_require__(/*! passport-local */ "passport-local");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./apps/auth-service/src/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'email' });
        this.authService = authService;
    }
    async validate(email, password) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),

/***/ "./apps/auth-service/src/auth/strategies/oauth.strategy.ts":
/*!*****************************************************************!*\
  !*** ./apps/auth-service/src/auth/strategies/oauth.strategy.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OAuthStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_google_oauth20_1 = __webpack_require__(/*! passport-google-oauth20 */ "passport-google-oauth20");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./apps/auth-service/src/auth/auth.service.ts");
let OAuthStrategy = class OAuthStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(configService, authService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile) {
        const { name, emails } = profile;
        const user = {
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
            googleId: profile.id,
        };
        return this.authService.validateOAuthUser(user);
    }
};
exports.OAuthStrategy = OAuthStrategy;
exports.OAuthStrategy = OAuthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], OAuthStrategy);


/***/ }),

/***/ "./apps/auth-service/src/health/health.controller.ts":
/*!***********************************************************!*\
  !*** ./apps/auth-service/src/health/health.controller.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const terminus_1 = __webpack_require__(/*! @nestjs/terminus */ "@nestjs/terminus");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
let HealthController = class HealthController {
    constructor(health, http, disk, memory, microservice, configService) {
        this.health = health;
        this.http = http;
        this.disk = disk;
        this.memory = memory;
        this.microservice = microservice;
        this.configService = configService;
    }
    check() {
        return this.health.check([
            () => this.http.pingCheck('api-gateway', 'http://localhost:3000/api/health'),
            () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
        ]);
    }
    liveness() {
        return this.health.check([]);
    }
    readiness() {
        return this.health.check([
            () => this.microservice.pingCheck('rabbitmq', {
                transport: microservices_1.Transport.RMQ,
                options: {
                    urls: [this.configService.get('RABBITMQ_URL')],
                    queue: 'auth_queue',
                },
            }),
        ]);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check service health' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('liveness'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kubernetes liveness probe' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "liveness", null);
__decorate([
    (0, common_1.Get)('readiness'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Kubernetes readiness probe' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "readiness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof terminus_1.HealthCheckService !== "undefined" && terminus_1.HealthCheckService) === "function" ? _a : Object, typeof (_b = typeof terminus_1.HttpHealthIndicator !== "undefined" && terminus_1.HttpHealthIndicator) === "function" ? _b : Object, typeof (_c = typeof terminus_1.DiskHealthIndicator !== "undefined" && terminus_1.DiskHealthIndicator) === "function" ? _c : Object, typeof (_d = typeof terminus_1.MemoryHealthIndicator !== "undefined" && terminus_1.MemoryHealthIndicator) === "function" ? _d : Object, typeof (_e = typeof terminus_1.MicroserviceHealthIndicator !== "undefined" && terminus_1.MicroserviceHealthIndicator) === "function" ? _e : Object, typeof (_f = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _f : Object])
], HealthController);


/***/ }),

/***/ "./apps/auth-service/src/health/health.module.ts":
/*!*******************************************************!*\
  !*** ./apps/auth-service/src/health/health.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const terminus_1 = __webpack_require__(/*! @nestjs/terminus */ "@nestjs/terminus");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const health_controller_1 = __webpack_require__(/*! ./health.controller */ "./apps/auth-service/src/health/health.controller.ts");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            terminus_1.TerminusModule,
            axios_1.HttpModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], HealthModule);


/***/ }),

/***/ "./libs/shared/dto/auth.dto.ts":
/*!*************************************!*\
  !*** ./libs/shared/dto/auth.dto.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthResponseDto = exports.PasswordResetDto = exports.PasswordResetRequestDto = exports.RefreshTokenDto = exports.LoginDto = exports.RegisterDto = exports.UserRole = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["INSTRUCTOR"] = "INSTRUCTOR";
})(UserRole || (exports.UserRole = UserRole = {}));
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'The name of the user',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'The email of the user',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Password123!',
        description: 'The password of the user (min 8 characters)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: UserRole,
        default: UserRole.USER,
        description: 'The role of the user',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserRole),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'The email of the user',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Password123!',
        description: 'The password of the user',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'The refresh token',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class PasswordResetRequestDto {
}
exports.PasswordResetRequestDto = PasswordResetRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'The email of the user requesting password reset',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], PasswordResetRequestDto.prototype, "email", void 0);
class PasswordResetDto {
}
exports.PasswordResetDto = PasswordResetDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'NewPassword123!',
        description: 'The new password (min 8 characters, must include uppercase, lowercase, number)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
    __metadata("design:type", String)
], PasswordResetDto.prototype, "password", void 0);
class AuthResponseDto {
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3600,
        description: 'Token expiration time in seconds',
    }),
    __metadata("design:type", Number)
], AuthResponseDto.prototype, "expiresIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'john.doe@example.com',
            name: 'John Doe',
            role: 'USER',
        },
        description: 'User information',
    }),
    __metadata("design:type", Object)
], AuthResponseDto.prototype, "user", void 0);


/***/ }),

/***/ "@nestjs/axios":
/*!********************************!*\
  !*** external "@nestjs/axios" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/microservices":
/*!****************************************!*\
  !*** external "@nestjs/microservices" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/terminus":
/*!***********************************!*\
  !*** external "@nestjs/terminus" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/terminus");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "passport-google-oauth20":
/*!******************************************!*\
  !*** external "passport-google-oauth20" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("passport-google-oauth20");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***************************************!*\
  !*** ./apps/auth-service/src/main.ts ***!
  \***************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/auth-service/src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
            queue: process.env.AUTH_QUEUE || 'auth_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    const httpApp = await core_1.NestFactory.create(app_module_1.AppModule);
    httpApp.setGlobalPrefix('api/auth');
    httpApp.enableCors();
    httpApp.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Auth Service API')
        .setDescription('Authentication and authorization service for Learning Hub platform')
        .setVersion('1.0')
        .addTag('auth')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(httpApp, config);
    swagger_1.SwaggerModule.setup('api/auth/docs', httpApp, document);
    await app.listen();
    await httpApp.listen(3010);
    console.log(`🚀 Auth Service is running on port 3010 and listening on RabbitMQ`);
}
bootstrap();

})();

/******/ })()
;
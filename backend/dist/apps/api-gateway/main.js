/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/api-gateway/src/app.module.ts":
/*!********************************************!*\
  !*** ./apps/api-gateway/src/app.module.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const database_module_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/database.module'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const auth_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/auth'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const interceptors_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/interceptors'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const middleware_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/middleware'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const monitoring_module_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/monitoring/monitoring.module'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const metrics_middleware_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/monitoring/metrics.middleware'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const circuit_breaker_interceptor_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/circuit-breaker/circuit-breaker.interceptor'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./apps/api-gateway/src/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./users/users.module */ "./apps/api-gateway/src/users/users.module.ts");
const courses_module_1 = __webpack_require__(/*! ./courses/courses.module */ "./apps/api-gateway/src/courses/courses.module.ts");
const enrollments_module_1 = __webpack_require__(/*! ./enrollments/enrollments.module */ "./apps/api-gateway/src/enrollments/enrollments.module.ts");
const payments_module_1 = __webpack_require__(/*! ./payments/payments.module */ "./apps/api-gateway/src/payments/payments.module.ts");
const media_module_1 = __webpack_require__(/*! ./media/media.module */ "./apps/api-gateway/src/media/media.module.ts");
const content_module_1 = __webpack_require__(/*! ./content/content.module */ "./apps/api-gateway/src/content/content.module.ts");
const notification_module_1 = __webpack_require__(/*! ./notification/notification.module */ "./apps/api-gateway/src/notification/notification.module.ts");
const health_module_1 = __webpack_require__(/*! ./health/health.module */ "./apps/api-gateway/src/health/health.module.ts");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.CorrelationMiddleware, middleware_1.LoggingMiddleware, middleware_1.PerformanceMiddleware, middleware_1.HealthCheckMiddleware, metrics_middleware_1.MetricsMiddleware)
            .forRoutes('*');
    }
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
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => [
                    {
                        name: 'short',
                        ttl: 1000,
                        limit: configService.get('THROTTLE_SHORT_LIMIT') || 10,
                    },
                    {
                        name: 'medium',
                        ttl: 10000,
                        limit: configService.get('THROTTLE_MEDIUM_LIMIT') || 20,
                    },
                    {
                        name: 'long',
                        ttl: 60000,
                        limit: configService.get('THROTTLE_LONG_LIMIT') || 100,
                    },
                ],
                inject: [config_1.ConfigService],
            }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: constants_1.MICROSERVICE_TOKENS.USER_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'user_queue',
                            queueOptions: {
                                durable: true,
                                arguments: {
                                    'x-message-ttl': 60000,
                                    'x-max-retries': 3,
                                },
                            },
                            socketOptions: {
                                keepAlive: true,
                                heartbeatIntervalInSeconds: 30,
                                reconnectTimeInSeconds: 1,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: constants_1.MICROSERVICE_TOKENS.COURSE_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'course_queue',
                            queueOptions: {
                                durable: true,
                                arguments: {
                                    'x-message-ttl': 60000,
                                    'x-max-retries': 3,
                                },
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: constants_1.MICROSERVICE_TOKENS.ENROLLMENT_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'enrollment_queue',
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: constants_1.MICROSERVICE_TOKENS.AUTH_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'auth_queue',
                            queueOptions: {
                                durable: true,
                                arguments: {
                                    'x-message-ttl': 60000,
                                    'x-max-retries': 3,
                                },
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: constants_1.MICROSERVICE_TOKENS.PAYMENT_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'payment_queue',
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: constants_1.MICROSERVICE_TOKENS.NOTIFICATION_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'notification_queue',
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: constants_1.MICROSERVICE_TOKENS.CONTENT_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'content_queue',
                            queueOptions: {
                                durable: true,
                                arguments: {
                                    'x-message-ttl': 60000,
                                    'x-max-retries': 3,
                                },
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: constants_1.MICROSERVICE_TOKENS.MEDIA_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'media_queue',
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
            database_module_1.DatabaseModule,
            monitoring_module_1.MonitoringModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            enrollments_module_1.EnrollmentsModule,
            payments_module_1.PaymentsModule,
            media_module_1.MediaModule,
            content_module_1.ContentModule,
            notification_module_1.NotificationModule,
            health_module_1.HealthModule,
        ],
        providers: [
            auth_1.JwtStrategy,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_1.RolesGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: interceptors_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.ResponseInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.CacheInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: circuit_breaker_interceptor_1.CircuitBreakerInterceptor,
            },
        ],
    })
], AppModule);


/***/ }),

/***/ "./apps/api-gateway/src/auth/auth.controller.ts":
/*!******************************************************!*\
  !*** ./apps/api-gateway/src/auth/auth.controller.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/api-gateway/src/auth/auth.service.ts");
const dto_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/dto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const decorators_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/decorators'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const auth_guard_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/auth/auth.guard'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, correlationId) {
        return this.authService.login(loginDto);
    }
    async register(registerDto, correlationId) {
        return this.authService.register(registerDto);
    }
    async refresh(refreshTokenDto, correlationId) {
        return this.authService.refresh(refreshTokenDto.refreshToken);
    }
    async getCurrentUser(user, correlationId) {
        return {
            success: true,
            data: user.user,
            correlationId,
            timestamp: new Date().toISOString(),
        };
    }
    async logout(correlationId) {
        return {
            success: true,
            message: 'Successfully logged out',
            correlationId,
            timestamp: new Date().toISOString(),
        };
    }
    async verifyToken(user, correlationId) {
        return {
            success: true,
            data: {
                valid: true,
                user: {
                    id: user.sub,
                    email: user.email,
                    role: user.role,
                },
            },
            correlationId,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Authenticate user with email and password'
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully authenticated',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                email: { type: 'string' },
                                name: { type: 'string' },
                                avatar: { type: 'string' },
                                role: { type: 'string', enum: ['USER', 'INSTRUCTOR', 'ADMIN'] },
                            },
                        },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                error: { type: 'string', example: 'Invalid credentials' },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof dto_1.LoginDto !== "undefined" && dto_1.LoginDto) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'User registration',
        description: 'Create a new user account'
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                email: { type: 'string' },
                                name: { type: 'string' },
                                role: { type: 'string' },
                            },
                        },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'User already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof dto_1.RegisterDto !== "undefined" && dto_1.RegisterDto) === "function" ? _c : Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh access token',
        description: 'Get a new access token using refresh token'
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.RefreshTokenDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid refresh token',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof dto_1.RefreshTokenDto !== "undefined" && dto_1.RefreshTokenDto) === "function" ? _d : Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user',
        description: 'Get the currently authenticated user profile'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Current user profile',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        avatar: { type: 'string' },
                        role: { type: 'string' },
                        createdAt: { type: 'string' },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'User logout',
        description: 'Logout the current user (invalidate token on client)'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully logged out',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Successfully logged out' },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    __param(0, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('verify'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify token',
        description: 'Verify if the current token is valid'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token is valid',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        valid: { type: 'boolean', example: true },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                email: { type: 'string' },
                                role: { type: 'string' },
                            },
                        },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid token',
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyToken", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./apps/api-gateway/src/auth/auth.module.ts":
/*!**************************************************!*\
  !*** ./apps/api-gateway/src/auth/auth.module.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const jwt_strategy_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/auth/jwt.strategy'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./apps/api-gateway/src/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/api-gateway/src/auth/auth.service.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN'),
                    },
                }),
            }),
            microservices_1.ClientsModule.register([
                {
                    name: constants_1.MICROSERVICE_TOKENS.USER_SERVICE,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: constants_1.RABBITMQ_QUEUES.USER_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);


/***/ }),

/***/ "./apps/api-gateway/src/auth/auth.service.ts":
/*!***************************************************!*\
  !*** ./apps/api-gateway/src/auth/auth.service.ts ***!
  \***************************************************/
/***/ (() => {

throw new Error("Module parse failed: 'return' outside of function (126:0)\nFile was processed with these loaders:\n * ./node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n|     __metadata(\"design:paramtypes\", [typeof (_a = typeof jwt_1.JwtService !== \"undefined\" && jwt_1.JwtService) === \"function\" ? _a : Object, typeof (_b = typeof microservices_1.ClientProxy !== \"undefined\" && microservices_1.ClientProxy) === \"function\" ? _b : Object, typeof (_c = typeof microservices_1.ClientProxy !== \"undefined\" && microservices_1.ClientProxy) === \"function\" ? _c : Object])\n| ], AuthService);\n> return utils_1.ApiResponseUtil.success({\n|     accessToken,\n|     user: {");

/***/ }),

/***/ "./apps/api-gateway/src/content/content.controller.ts":
/*!************************************************************!*\
  !*** ./apps/api-gateway/src/content/content.controller.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContentController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const auth_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/auth'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const content_dto_1 = __webpack_require__(/*! @shared/dto/content.dto */ "./libs/shared/dto/content.dto.ts");
let ContentController = class ContentController {
    constructor(contentServiceClient) {
        this.contentServiceClient = contentServiceClient;
    }
    create(createContentDto) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.CREATE }, createContentDto);
    }
    findAll(type, status) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.FIND_ALL }, { type, status });
    }
    findByCourse(courseId) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.FIND_BY_COURSE }, courseId);
    }
    findByModule(moduleId) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.FIND_BY_MODULE }, moduleId);
    }
    findOne(id) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.FIND_ONE }, id);
    }
    update(id, updateContentDto) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.UPDATE }, { id, updateContentDto });
    }
    remove(id) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.DELETE }, id);
    }
    changeStatus(id, status) {
        return this.contentServiceClient.send({ cmd: constants_1.PATTERNS.CONTENT.CHANGE_STATUS }, { id, status });
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, auth_1.Roles)('ADMIN', 'INSTRUCTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new content' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Content created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof content_dto_1.CreateContentDto !== "undefined" && content_dto_1.CreateContentDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all content with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content list retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof content_dto_1.ContentStatus !== "undefined" && content_dto_1.ContentStatus) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('course/:courseId'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all content for a specific course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course content retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "findByCourse", null);
__decorate([
    (0, common_1.Get)('module/:moduleId'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all content for a specific module' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module content retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Module not found' }),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "findByModule", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get content by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Content not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, auth_1.Roles)('ADMIN', 'INSTRUCTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Content not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof content_dto_1.UpdateContentDto !== "undefined" && content_dto_1.UpdateContentDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, auth_1.Roles)('ADMIN', 'INSTRUCTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Content not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, auth_1.Roles)('ADMIN', 'INSTRUCTOR'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change content status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Content status changed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Content not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof content_dto_1.ContentStatus !== "undefined" && content_dto_1.ContentStatus) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "changeStatus", null);
exports.ContentController = ContentController = __decorate([
    (0, swagger_1.ApiTags)('content'),
    (0, common_1.Controller)('content'),
    __param(0, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.CONTENT_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], ContentController);


/***/ }),

/***/ "./apps/api-gateway/src/content/content.module.ts":
/*!********************************************************!*\
  !*** ./apps/api-gateway/src/content/content.module.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContentModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const content_controller_1 = __webpack_require__(/*! ./content.controller */ "./apps/api-gateway/src/content/content.controller.ts");
let ContentModule = class ContentModule {
};
exports.ContentModule = ContentModule;
exports.ContentModule = ContentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: constants_1.MICROSERVICE_TOKENS.CONTENT_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL') || 'amqp://localhost:5672'],
                            queue: 'content_queue',
                            queueOptions: {
                                durable: true,
                                arguments: {
                                    'x-message-ttl': 60000,
                                    'x-max-retries': 3,
                                },
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [content_controller_1.ContentController],
    })
], ContentModule);


/***/ }),

/***/ "./apps/api-gateway/src/courses/courses.controller.ts":
/*!************************************************************!*\
  !*** ./apps/api-gateway/src/courses/courses.controller.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoursesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const courses_service_1 = __webpack_require__(/*! ./courses.service */ "./apps/api-gateway/src/courses/courses.service.ts");
const dto_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/dto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const auth_guard_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/auth/auth.guard'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const decorators_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/decorators'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const pipes_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/pipes'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async getAllCourses(paginationDto, correlationId) {
        return this.coursesService.getAllCourses(paginationDto);
    }
    async getCoursesByCategory(category, paginationDto, correlationId) {
        return this.coursesService.getCoursesByCategory(category, paginationDto);
    }
    async getCourseById(id, correlationId) {
        return this.coursesService.getCourseById(id);
    }
    async createCourse(createCourseDto, userId, correlationId) {
        return this.coursesService.createCourse(userId, createCourseDto);
    }
    async updateCourse(id, updateCourseDto, userId, correlationId) {
        return this.coursesService.updateCourse(id, userId, updateCourseDto);
    }
    async deleteCourse(id, userId, correlationId) {
        return this.coursesService.deleteCourse(id, userId);
    }
    async getInstructorCourses(instructorId, correlationId) {
        return this.coursesService.getCoursesByInstructor(instructorId);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all courses',
        description: 'Retrieve a paginated list of all courses with search and filter options'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, example: 'React' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String, example: 'createdAt' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['asc', 'desc'], example: 'desc' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Courses retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            price: { type: 'number' },
                            rating: { type: 'number' },
                            level: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] },
                            category: { type: 'string' },
                            instructor: {
                                type: 'object',
                                properties: {
                                    user: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            avatar: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        pages: { type: 'number' },
                        hasNext: { type: 'boolean' },
                        hasPrev: { type: 'boolean' },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof dto_1.PaginationDto !== "undefined" && dto_1.PaginationDto) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get courses by category',
        description: 'Retrieve courses filtered by category'
    }),
    (0, swagger_1.ApiParam)({ name: 'category', type: String, example: 'Programming' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Courses retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof dto_1.PaginationDto !== "undefined" && dto_1.PaginationDto) === "function" ? _c : Object, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByCategory", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get course by ID',
        description: 'Retrieve detailed information about a specific course'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        rating: { type: 'number' },
                        level: { type: 'string' },
                        category: { type: 'string' },
                        curriculum: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    lessons: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'string' },
                                                title: { type: 'string' },
                                                type: { type: 'string' },
                                                isFree: { type: 'boolean' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        instructor: {
                            type: 'object',
                            properties: {
                                user: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        avatar: { type: 'string' },
                                    },
                                },
                            },
                        },
                        reviews: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    rating: { type: 'number' },
                                    comment: { type: 'string' },
                                    user: {
                                        type: 'object',
                                        properties: {
                                            name: { type: 'string' },
                                            avatar: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Course not found',
    }),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseUUIDPipe)),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    (0, auth_guard_1.Roles)(client_1.Role.INSTRUCTOR, client_1.Role.ADMIN),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new course',
        description: 'Create a new course (requires instructor or admin role)'
    }),
    (0, swagger_1.ApiBody)({ type: dto_1.CreateCourseDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Course created successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        level: { type: 'string' },
                        category: { type: 'string' },
                        instructorId: { type: 'string' },
                    },
                },
                timestamp: { type: 'string' },
                correlationId: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.UserId)()),
    __param(2, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof dto_1.CreateCourseDto !== "undefined" && dto_1.CreateCourseDto) === "function" ? _d : Object, String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a course',
        description: 'Update an existing course (only course owner or admin)'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: dto_1.UpdateCourseDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Course updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Not the course owner',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Course not found',
    }),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.UserId)()),
    __param(3, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof dto_1.UpdateCourseDto !== "undefined" && dto_1.UpdateCourseDto) === "function" ? _e : Object, String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a course',
        description: 'Delete an existing course (only course owner or admin)'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Course deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Not the course owner',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Course not found',
    }),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseUUIDPipe)),
    __param(1, (0, decorators_1.UserId)()),
    __param(2, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('instructor/my-courses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get instructor courses',
        description: 'Get all courses created by the current instructor'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Instructor courses retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, decorators_1.UserId)()),
    __param(1, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getInstructorCourses", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [typeof (_a = typeof courses_service_1.CoursesService !== "undefined" && courses_service_1.CoursesService) === "function" ? _a : Object])
], CoursesController);


/***/ }),

/***/ "./apps/api-gateway/src/courses/courses.module.ts":
/*!********************************************************!*\
  !*** ./apps/api-gateway/src/courses/courses.module.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoursesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const courses_controller_1 = __webpack_require__(/*! ./courses.controller */ "./apps/api-gateway/src/courses/courses.controller.ts");
const courses_service_1 = __webpack_require__(/*! ./courses.service */ "./apps/api-gateway/src/courses/courses.service.ts");
let CoursesModule = class CoursesModule {
};
exports.CoursesModule = CoursesModule;
exports.CoursesModule = CoursesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: constants_1.MICROSERVICE_TOKENS.COURSE_SERVICE,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: constants_1.RABBITMQ_QUEUES.COURSE_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
        ],
        controllers: [courses_controller_1.CoursesController],
        providers: [courses_service_1.CoursesService],
    })
], CoursesModule);


/***/ }),

/***/ "./apps/api-gateway/src/courses/courses.service.ts":
/*!*********************************************************!*\
  !*** ./apps/api-gateway/src/courses/courses.service.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoursesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const prisma_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/prisma.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const utils_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let CoursesService = class CoursesService {
    constructor(prisma, courseServiceClient) {
        this.prisma = prisma;
        this.courseServiceClient = courseServiceClient;
    }
    async getAllCourses(paginationDto) {
        const { page = 1, limit = 10, search, sort = 'createdAt', order = 'desc' } = paginationDto;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { category: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [courses, total] = await Promise.all([
            this.prisma.course.findMany({
                where: where,
                skip,
                take: limit,
                orderBy: { [sort]: order },
                include: {
                    instructor: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            enrollments: true,
                            reviews: true,
                        },
                    },
                },
            }),
            this.prisma.course.count({ where }),
        ]);
        return utils_1.ApiResponseUtil.paginated(courses, total, page, limit);
    }
    async getCourseById(id) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                instructor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
                curriculum: {
                    include: {
                        lessons: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return utils_1.ApiResponseUtil.success(course);
    }
    async createCourse(userId, createCourseDto) {
        let instructor = await this.prisma.instructor.findUnique({
            where: { userId },
        });
        if (!instructor) {
            instructor = await this.prisma.instructor.create({
                data: {
                    userId,
                    bio: 'New instructor',
                },
            });
        }
        const course = await this.prisma.course.create({
            data: {
                ...createCourseDto,
                instructorId: instructor.id,
            },
            include: {
                instructor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
        this.courseServiceClient.emit('course.created', {
            courseId: course.id,
            instructorId: instructor.id,
            title: course.title,
        });
        return utils_1.ApiResponseUtil.success(course);
    }
    async updateCourse(id, userId, updateCourseDto) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                instructor: true,
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (course.instructor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own courses');
        }
        const updatedCourse = await this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
            include: {
                instructor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });
        this.courseServiceClient.emit('course.updated', {
            courseId: updatedCourse.id,
            changes: updateCourseDto,
        });
        return utils_1.ApiResponseUtil.success(updatedCourse);
    }
    async deleteCourse(id, userId) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                instructor: true,
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (course.instructor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own courses');
        }
        await this.prisma.course.delete({
            where: { id },
        });
        return utils_1.ApiResponseUtil.success({ message: 'Course deleted successfully' });
    }
    async getCoursesByInstructor(instructorId) {
        const courses = await this.prisma.course.findMany({
            where: {
                instructor: {
                    userId: instructorId,
                },
            },
            include: {
                instructor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        enrollments: true,
                        reviews: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return utils_1.ApiResponseUtil.success(courses);
    }
    async getCoursesByCategory(category, paginationDto) {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = paginationDto;
        const skip = (page - 1) * limit;
        const [courses, total] = await Promise.all([
            this.prisma.course.findMany({
                where: {
                    category: {
                        contains: category,
                        mode: 'insensitive',
                    },
                },
                skip,
                take: limit,
                orderBy: { [sort]: order },
                include: {
                    instructor: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            enrollments: true,
                            reviews: true,
                        },
                    },
                },
            }),
            this.prisma.course.count({
                where: {
                    category: {
                        contains: category,
                        mode: 'insensitive',
                    },
                },
            }),
        ]);
        return utils_1.ApiResponseUtil.paginated(courses, total, page, limit);
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.COURSE_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _b : Object])
], CoursesService);


/***/ }),

/***/ "./apps/api-gateway/src/enrollments/enrollments.controller.ts":
/*!********************************************************************!*\
  !*** ./apps/api-gateway/src/enrollments/enrollments.controller.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollmentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const user_decorator_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/decorators/user.decorator'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const enrollments_service_1 = __webpack_require__(/*! ./enrollments.service */ "./apps/api-gateway/src/enrollments/enrollments.service.ts");
let EnrollmentsController = class EnrollmentsController {
    constructor(enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }
    async enrollInCourse(user, courseId) {
        return this.enrollmentsService.enrollInCourse(user.id, courseId);
    }
    async getMyEnrollments(user) {
        return this.enrollmentsService.getUserEnrollments(user.id);
    }
    async getCourseProgress(user, courseId) {
        return this.enrollmentsService.getCourseProgress(user.id, courseId);
    }
    async updateProgress(user, courseId, progressData) {
        return this.enrollmentsService.updateProgress(user.id, courseId, progressData);
    }
    async getCourseStudents(courseId) {
        return this.enrollmentsService.getCourseStudents(courseId);
    }
};
exports.EnrollmentsController = EnrollmentsController;
__decorate([
    (0, common_1.Post)('enroll/:courseId'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "enrollInCourse", null);
__decorate([
    (0, common_1.Get)('my-courses'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "getMyEnrollments", null);
__decorate([
    (0, common_1.Get)(':courseId/progress'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "getCourseProgress", null);
__decorate([
    (0, common_1.Put)(':courseId/progress'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Get)('course/:courseId/students'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnrollmentsController.prototype, "getCourseStudents", null);
exports.EnrollmentsController = EnrollmentsController = __decorate([
    (0, common_1.Controller)('enrollments'),
    __metadata("design:paramtypes", [typeof (_a = typeof enrollments_service_1.EnrollmentsService !== "undefined" && enrollments_service_1.EnrollmentsService) === "function" ? _a : Object])
], EnrollmentsController);


/***/ }),

/***/ "./apps/api-gateway/src/enrollments/enrollments.module.ts":
/*!****************************************************************!*\
  !*** ./apps/api-gateway/src/enrollments/enrollments.module.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollmentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const enrollments_controller_1 = __webpack_require__(/*! ./enrollments.controller */ "./apps/api-gateway/src/enrollments/enrollments.controller.ts");
const enrollments_service_1 = __webpack_require__(/*! ./enrollments.service */ "./apps/api-gateway/src/enrollments/enrollments.service.ts");
let EnrollmentsModule = class EnrollmentsModule {
};
exports.EnrollmentsModule = EnrollmentsModule;
exports.EnrollmentsModule = EnrollmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: constants_1.MICROSERVICE_TOKENS.ENROLLMENT_SERVICE,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: constants_1.RABBITMQ_QUEUES.ENROLLMENT_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
        ],
        controllers: [enrollments_controller_1.EnrollmentsController],
        providers: [enrollments_service_1.EnrollmentsService],
    })
], EnrollmentsModule);


/***/ }),

/***/ "./apps/api-gateway/src/enrollments/enrollments.service.ts":
/*!*****************************************************************!*\
  !*** ./apps/api-gateway/src/enrollments/enrollments.service.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollmentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const prisma_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/prisma.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const utils_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma, enrollmentServiceClient) {
        this.prisma = prisma;
        this.enrollmentServiceClient = enrollmentServiceClient;
    }
    async enrollInCourse(userId, courseId) {
        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        if (existingEnrollment) {
            throw new common_1.ConflictException('Already enrolled in this course');
        }
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const enrollment = await this.prisma.enrollment.create({
            data: {
                userId,
                courseId,
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        await this.prisma.userProgress.create({
            data: {
                userId,
                courseId,
                progressPercentage: 0,
            },
        });
        this.enrollmentServiceClient.emit('enrollment.created', {
            userId,
            courseId,
            enrollmentDate: enrollment.enrolledAt,
        });
        return utils_1.ApiResponseUtil.success(enrollment);
    }
    async getUserEnrollments(userId) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        instructor: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                        curriculum: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        progress: {
                            where: { userId },
                        },
                    },
                },
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });
        return utils_1.ApiResponseUtil.success(enrollments);
    }
    async getCourseProgress(userId, courseId) {
        const progress = await this.prisma.userProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                course: {
                    include: {
                        curriculum: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
                completedLessons: true,
            },
        });
        if (!progress) {
            throw new common_1.NotFoundException('Progress not found');
        }
        return utils_1.ApiResponseUtil.success(progress);
    }
    async updateProgress(userId, courseId, progressData) {
        const { lessonId, completed } = progressData;
        let progress = await this.prisma.userProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                completedLessons: true,
                course: {
                    include: {
                        curriculum: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
            },
        });
        if (!progress) {
            throw new common_1.NotFoundException('Progress not found');
        }
        if (completed) {
            await this.prisma.userProgress.update({
                where: {
                    userId_courseId: {
                        userId,
                        courseId,
                    },
                },
                data: {
                    completedLessons: {
                        connect: { id: lessonId },
                    },
                },
            });
        }
        else {
            await this.prisma.userProgress.update({
                where: {
                    userId_courseId: {
                        userId,
                        courseId,
                    },
                },
                data: {
                    completedLessons: {
                        disconnect: { id: lessonId },
                    },
                },
            });
        }
        const totalLessons = progress.course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
        const completedCount = completed
            ? progress.completedLessons.length + 1
            : progress.completedLessons.length - 1;
        const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
        const updatedProgress = await this.prisma.userProgress.update({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            data: {
                progressPercentage,
            },
            include: {
                completedLessons: true,
            },
        });
        return utils_1.ApiResponseUtil.success(updatedProgress);
    }
    async getCourseStudents(courseId) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });
        const students = enrollments.map(enrollment => ({
            ...enrollment.user,
            enrolledAt: enrollment.enrolledAt,
        }));
        return utils_1.ApiResponseUtil.success(students);
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.ENROLLMENT_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _b : Object])
], EnrollmentsService);


/***/ }),

/***/ "./apps/api-gateway/src/health/health.controller.ts":
/*!**********************************************************!*\
  !*** ./apps/api-gateway/src/health/health.controller.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const health_service_1 = __webpack_require__(/*! ./health.service */ "./apps/api-gateway/src/health/health.service.ts");
const auth_guard_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/auth/auth.guard'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const decorators_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/decorators'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async healthCheck(correlationId) {
        return this.healthService.getHealthStatus(correlationId);
    }
    async detailedHealthCheck(correlationId) {
        return this.healthService.getDetailedHealthStatus(correlationId);
    }
    async readinessCheck(correlationId) {
        return this.healthService.getReadinessStatus(correlationId);
    }
    async livenessCheck(correlationId) {
        return {
            success: true,
            data: {
                status: 'alive',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            correlationId,
            timestamp: new Date().toISOString(),
        };
    }
    async getMetrics(correlationId) {
        return this.healthService.getMetrics(correlationId);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check',
        description: 'Check the overall health status of the API Gateway and connected services'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'System is healthy',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'healthy' },
                        timestamp: { type: 'string' },
                        uptime: { type: 'number' },
                        environment: { type: 'string' },
                        version: { type: 'string' },
                        services: {
                            type: 'object',
                            properties: {
                                database: { type: 'string', example: 'healthy' },
                                redis: { type: 'string', example: 'healthy' },
                                rabbitmq: { type: 'string', example: 'healthy' },
                            },
                        },
                        memory: {
                            type: 'object',
                            properties: {
                                rss: { type: 'number' },
                                heapTotal: { type: 'number' },
                                heapUsed: { type: 'number' },
                                external: { type: 'number' },
                                arrayBuffers: { type: 'number' },
                            },
                        },
                    },
                },
                correlationId: { type: 'string' },
                timestamp: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'System is unhealthy',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: false },
                data: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'unhealthy' },
                        issues: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                    },
                },
                correlationId: { type: 'string' },
                timestamp: { type: 'string' },
            },
        },
    }),
    __param(0, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "healthCheck", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)('detailed'),
    (0, swagger_1.ApiOperation)({
        summary: 'Detailed health check',
        description: 'Get detailed health information including all connected services and dependencies'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detailed health information',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        services: {
                            type: 'object',
                            additionalProperties: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string' },
                                    responseTime: { type: 'number' },
                                    lastCheck: { type: 'string' },
                                    details: { type: 'object' },
                                },
                            },
                        },
                        systemInfo: {
                            type: 'object',
                            properties: {
                                nodeVersion: { type: 'string' },
                                platform: { type: 'string' },
                                arch: { type: 'string' },
                                uptime: { type: 'number' },
                                memory: { type: 'object' },
                                cpu: { type: 'object' },
                            },
                        },
                    },
                },
                correlationId: { type: 'string' },
                timestamp: { type: 'string' },
            },
        },
    }),
    __param(0, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "detailedHealthCheck", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiOperation)({
        summary: 'Readiness check',
        description: 'Check if the service is ready to accept traffic'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service is ready',
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Service is not ready',
    }),
    __param(0, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readinessCheck", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({
        summary: 'Liveness check',
        description: 'Check if the service is alive and responding'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Service is alive',
    }),
    __param(0, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "livenessCheck", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, decorators_1.CorrelationId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getMetrics", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof health_service_1.HealthService !== "undefined" && health_service_1.HealthService) === "function" ? _a : Object])
], HealthController);


/***/ }),

/***/ "./apps/api-gateway/src/health/health.module.ts":
/*!******************************************************!*\
  !*** ./apps/api-gateway/src/health/health.module.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const health_controller_1 = __webpack_require__(/*! ./health.controller */ "./apps/api-gateway/src/health/health.controller.ts");
const health_service_1 = __webpack_require__(/*! ./health.service */ "./apps/api-gateway/src/health/health.service.ts");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
        providers: [health_service_1.HealthService],
    })
], HealthModule);


/***/ }),

/***/ "./apps/api-gateway/src/health/health.service.ts":
/*!*******************************************************!*\
  !*** ./apps/api-gateway/src/health/health.service.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.HealthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const prisma_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/prisma.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const utils_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let HealthService = class HealthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHealthStatus() {
        return utils_1.ApiResponseUtil.success({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'API Gateway',
            version: '1.0.0',
        });
    }
    async getDetailedHealthStatus() {
        const checks = {
            database: await this.checkDatabase(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString(),
        };
        const overallStatus = checks.database ? 'OK' : 'ERROR';
        return utils_1.ApiResponseUtil.success({
            status: overallStatus,
            checks,
        });
    }
    async checkDatabase() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], HealthService);


/***/ }),

/***/ "./apps/api-gateway/src/media/media.controller.ts":
/*!********************************************************!*\
  !*** ./apps/api-gateway/src/media/media.controller.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const user_decorator_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/decorators/user.decorator'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const media_service_1 = __webpack_require__(/*! ./media.service */ "./apps/api-gateway/src/media/media.service.ts");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async uploadSingleFile(user, file, metadata) {
        return this.mediaService.uploadSingleFile(user.id, file, metadata);
    }
    async uploadMultipleFiles(user, files, metadata) {
        return this.mediaService.uploadMultipleFiles(user.id, files, metadata);
    }
    async uploadVideo(user, file, metadata) {
        return this.mediaService.uploadVideo(user.id, file, metadata);
    }
    async getFile(id) {
        return this.mediaService.getFile(id);
    }
    async getUserFiles(userId) {
        return this.mediaService.getUserFiles(userId);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('upload/single'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof Express !== "undefined" && (_b = Express.Multer) !== void 0 && _b.File) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadSingleFile", null);
__decorate([
    (0, common_1.Post)('upload/multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Post)('upload/video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video')),
    (0, user_decorator_1.Roles)('INSTRUCTOR', 'ADMIN'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof Express !== "undefined" && (_d = Express.Multer) !== void 0 && _d.File) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Get)('file/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getFile", null);
__decorate([
    (0, common_1.Get)('user/:userId/files'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getUserFiles", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [typeof (_a = typeof media_service_1.MediaService !== "undefined" && media_service_1.MediaService) === "function" ? _a : Object])
], MediaController);


/***/ }),

/***/ "./apps/api-gateway/src/media/media.module.ts":
/*!****************************************************!*\
  !*** ./apps/api-gateway/src/media/media.module.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@app/shared/constants'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const media_controller_1 = __webpack_require__(/*! ./media.controller */ "./apps/api-gateway/src/media/media.controller.ts");
const media_service_1 = __webpack_require__(/*! ./media.service */ "./apps/api-gateway/src/media/media.service.ts");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: constants_1.MICROSERVICE_TOKENS.MEDIA_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL')],
                            queue: constants_1.MICROSERVICE_QUEUES.MEDIA_QUEUE,
                            queueOptions: {
                                durable: true,
                                'x-message-ttl': 60000,
                                'x-max-retries': 3,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [media_controller_1.MediaController],
        providers: [media_service_1.MediaService],
    })
], MediaModule);


/***/ }),

/***/ "./apps/api-gateway/src/media/media.service.ts":
/*!*****************************************************!*\
  !*** ./apps/api-gateway/src/media/media.service.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const constants_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@app/shared/constants'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const media_dto_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@app/shared/dto/media.dto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let MediaService = class MediaService {
    constructor(mediaServiceClient) {
        this.mediaServiceClient = mediaServiceClient;
    }
    async uploadSingleFile(userId, file, metadata) {
        try {
            const createMediaDto = {
                userId,
                type: this.determineMediaType(file.mimetype),
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                url: '',
                metadata: metadata || {},
                isPublic: metadata?.isPublic || false,
                entityId: metadata?.entityId,
                entityType: metadata?.entityType,
            };
            const uploadResult = await (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send('upload_file', {
                buffer: file.buffer,
                originalName: file.originalname,
                mimeType: file.mimetype,
            }));
            createMediaDto.url = uploadResult.url;
            return (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send(constants_1.PATTERNS.MEDIA.CREATE, createMediaDto));
        }
        catch (error) {
            throw error;
        }
    }
    async uploadMultipleFiles(userId, files, metadata) {
        try {
            const results = [];
            for (const file of files) {
                const result = await this.uploadSingleFile(userId, file, metadata);
                results.push(result);
            }
            return results;
        }
        catch (error) {
            throw error;
        }
    }
    async uploadVideo(userId, file, metadata) {
        try {
            const videoMetadata = {
                ...metadata,
                entityType: 'lesson',
                entityId: metadata.lessonId,
                title: metadata.title,
                isPublic: false,
            };
            return this.uploadSingleFile(userId, file, videoMetadata);
        }
        catch (error) {
            throw error;
        }
    }
    async getFile(fileId) {
        try {
            return (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send(constants_1.PATTERNS.MEDIA.FIND_ONE, fileId));
        }
        catch (error) {
            throw error;
        }
    }
    async getUserFiles(userId) {
        try {
            return (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send(constants_1.PATTERNS.MEDIA.FIND_BY_USER, userId));
        }
        catch (error) {
            throw error;
        }
    }
    determineMediaType(mimeType) {
        if (mimeType.startsWith('image/')) {
            return media_dto_1.MediaType.IMAGE;
        }
        else if (mimeType.startsWith('video/')) {
            return media_dto_1.MediaType.VIDEO;
        }
        else if (mimeType.startsWith('audio/')) {
            return media_dto_1.MediaType.AUDIO;
        }
        else if (mimeType === 'application/pdf' ||
            mimeType === 'application/msword' ||
            mimeType.includes('document') ||
            mimeType.includes('presentation') ||
            mimeType.includes('spreadsheet')) {
            return media_dto_1.MediaType.DOCUMENT;
        }
        else {
            return media_dto_1.MediaType.OTHER;
        }
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.MEDIA_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], MediaService);


/***/ }),

/***/ "./apps/api-gateway/src/notification/notification.controller.ts":
/*!**********************************************************************!*\
  !*** ./apps/api-gateway/src/notification/notification.controller.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../auth/guards/jwt-auth.guard'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const roles_guard_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../auth/guards/roles.guard'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const roles_decorator_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../auth/decorators/roles.decorator'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
const current_user_decorator_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '../auth/decorators/current-user.decorator'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const constants_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@app/shared/constants'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const notification_dto_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@app/shared/dto/notification.dto'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let NotificationController = class NotificationController {
    constructor(notificationServiceClient) {
        this.notificationServiceClient = notificationServiceClient;
    }
    create(createNotificationDto) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.CREATE, createNotificationDto);
    }
    findAll() {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.FIND_ALL, {});
    }
    findMyNotifications(user) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.FIND_BY_USER, user.id);
    }
    findOne(id) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.FIND_ONE, id);
    }
    update(id, updateNotificationDto) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.UPDATE, {
            id,
            updateNotificationDto,
        });
    }
    remove(id) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.REMOVE, id);
    }
    markAsRead(id) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.MARK_AS_READ, id);
    }
    markAllAsRead(user) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.MARK_ALL_AS_READ, user.id);
    }
    sendBulk(sendBulkNotificationsDto) {
        return this.notificationServiceClient.send(constants_1.PATTERNS.NOTIFICATION.SEND_BULK, sendBulkNotificationsDto);
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new notification' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The notification has been successfully created.',
        type: notification_dto_1.NotificationResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof notification_dto_1.CreateNotificationDto !== "undefined" && notification_dto_1.CreateNotificationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return all notifications',
        type: [notification_dto_1.NotificationResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user notifications' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return user notifications',
        type: [notification_dto_1.NotificationResponseDto],
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findMyNotifications", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a notification by id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return the notification',
        type: notification_dto_1.NotificationResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a notification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The notification has been successfully updated.',
        type: notification_dto_1.NotificationResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof notification_dto_1.UpdateNotificationDto !== "undefined" && notification_dto_1.UpdateNotificationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The notification has been successfully deleted.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/mark-as-read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a notification as read' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The notification has been marked as read.',
        type: notification_dto_1.NotificationResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('mark-all-as-read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all user notifications as read' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All notifications have been marked as read.',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Post)('send-bulk'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Send bulk notifications' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Bulk notifications have been sent.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof notification_dto_1.SendBulkNotificationsDto !== "undefined" && notification_dto_1.SendBulkNotificationsDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendBulk", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.NOTIFICATION_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], NotificationController);


/***/ }),

/***/ "./apps/api-gateway/src/notification/notification.module.ts":
/*!******************************************************************!*\
  !*** ./apps/api-gateway/src/notification/notification.module.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const notification_controller_1 = __webpack_require__(/*! ./notification.controller */ "./apps/api-gateway/src/notification/notification.controller.ts");
const constants_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@app/shared/constants'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: constants_1.MICROSERVICE_TOKENS.NOTIFICATION_SERVICE,
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('RABBITMQ_URL')],
                            queue: constants_1.MICROSERVICE_QUEUES.NOTIFICATION_QUEUE,
                            queueOptions: {
                                durable: true,
                                'x-message-ttl': 60000,
                                'x-max-retries': 3,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [notification_controller_1.NotificationController],
    })
], NotificationModule);


/***/ }),

/***/ "./apps/api-gateway/src/payments/payments.controller.ts":
/*!**************************************************************!*\
  !*** ./apps/api-gateway/src/payments/payments.controller.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const user_decorator_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/decorators/user.decorator'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const payments_service_1 = __webpack_require__(/*! ./payments.service */ "./apps/api-gateway/src/payments/payments.service.ts");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createPaymentIntent(user, body) {
        return this.paymentsService.createPaymentIntent(user.id, body.courseIds, body.amount);
    }
    async confirmPayment(user, body) {
        return this.paymentsService.confirmPayment(user.id, body.paymentIntentId, body.courseIds);
    }
    async stripeWebhook(signature, req) {
        return this.paymentsService.handleWebhook(signature, req.rawBody);
    }
    async refundPayment(body) {
        return this.paymentsService.refundPayment(body.paymentIntentId, body.reason);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create-payment-intent'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)('confirm-payment'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "confirmPayment", null);
__decorate([
    (0, user_decorator_1.Public)(),
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof common_1.RawBodyRequest !== "undefined" && common_1.RawBodyRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "stripeWebhook", null);
__decorate([
    (0, common_1.Post)('refund'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "refundPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [typeof (_a = typeof payments_service_1.PaymentsService !== "undefined" && payments_service_1.PaymentsService) === "function" ? _a : Object])
], PaymentsController);


/***/ }),

/***/ "./apps/api-gateway/src/payments/payments.module.ts":
/*!**********************************************************!*\
  !*** ./apps/api-gateway/src/payments/payments.module.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const payments_controller_1 = __webpack_require__(/*! ./payments.controller */ "./apps/api-gateway/src/payments/payments.controller.ts");
const payments_service_1 = __webpack_require__(/*! ./payments.service */ "./apps/api-gateway/src/payments/payments.service.ts");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: constants_1.MICROSERVICE_TOKENS.PAYMENT_SERVICE,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: constants_1.RABBITMQ_QUEUES.PAYMENT_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService],
    })
], PaymentsModule);


/***/ }),

/***/ "./apps/api-gateway/src/payments/payments.service.ts":
/*!***********************************************************!*\
  !*** ./apps/api-gateway/src/payments/payments.service.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const utils_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let PaymentsService = class PaymentsService {
    constructor(paymentServiceClient) {
        this.paymentServiceClient = paymentServiceClient;
    }
    async createPaymentIntent(userId, courseIds, amount) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.paymentServiceClient.send('create_payment_intent', {
                userId,
                courseIds,
                amount,
            }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
        }
    }
    async confirmPayment(userId, paymentIntentId, courseIds) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.paymentServiceClient.send('confirm_payment', {
                userId,
                paymentIntentId,
                courseIds,
            }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
        }
    }
    async handleWebhook(signature, rawBody) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.paymentServiceClient.send('stripe_webhook', {
                signature,
                rawBody,
            }));
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async refundPayment(paymentIntentId, reason) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.paymentServiceClient.send('refund_payment', {
                paymentIntentId,
                reason,
            }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.PAYMENT_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], PaymentsService);


/***/ }),

/***/ "./apps/api-gateway/src/users/users.controller.ts":
/*!********************************************************!*\
  !*** ./apps/api-gateway/src/users/users.controller.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const user_decorator_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/decorators/user.decorator'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const users_service_1 = __webpack_require__(/*! ./users.service */ "./apps/api-gateway/src/users/users.service.ts");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(user) {
        return this.usersService.getProfile(user.id);
    }
    async updateProfile(user, updateData) {
        return this.usersService.updateProfile(user.id, updateData);
    }
    async getUserById(id) {
        return this.usersService.getUserById(id);
    }
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)(),
    (0, user_decorator_1.Roles)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),

/***/ "./apps/api-gateway/src/users/users.module.ts":
/*!****************************************************!*\
  !*** ./apps/api-gateway/src/users/users.module.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./apps/api-gateway/src/users/users.controller.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./apps/api-gateway/src/users/users.service.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: constants_1.MICROSERVICE_TOKENS.USER_SERVICE,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: constants_1.RABBITMQ_QUEUES.USER_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),

/***/ "./apps/api-gateway/src/users/users.service.ts":
/*!*****************************************************!*\
  !*** ./apps/api-gateway/src/users/users.service.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const constants_1 = __webpack_require__(/*! @shared/constants */ "./libs/shared/constants/index.ts");
const prisma_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/database/prisma.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const utils_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let UsersService = class UsersService {
    constructor(prisma, userServiceClient) {
        this.prisma = prisma;
        this.userServiceClient = userServiceClient;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                instructorProfile: true,
                enrollments: {
                    include: {
                        course: true,
                    },
                },
                progress: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return utils_1.ApiResponseUtil.success(user);
    }
    async updateProfile(userId, updateData) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: updateData.name,
                avatar: updateData.avatar,
            },
        });
        this.userServiceClient.emit('user.updated', {
            userId: user.id,
            ...updateData,
        });
        return utils_1.ApiResponseUtil.success(user);
    }
    async getUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                createdAt: true,
                instructorProfile: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return utils_1.ApiResponseUtil.success(user);
    }
    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true,
                instructorProfile: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return utils_1.ApiResponseUtil.success(users);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.USER_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _b : Object])
], UsersService);


/***/ }),

/***/ "./libs/shared/constants/index.ts":
/*!****************************************!*\
  !*** ./libs/shared/constants/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PATTERNS = exports.EVENTS = exports.MICROSERVICE_QUEUES = exports.MICROSERVICE_TOKENS = void 0;
exports.MICROSERVICE_TOKENS = {
    USER_SERVICE: 'USER_SERVICE',
    COURSE_SERVICE: 'COURSE_SERVICE',
    ENROLLMENT_SERVICE: 'ENROLLMENT_SERVICE',
    PAYMENT_SERVICE: 'PAYMENT_SERVICE',
    AUTH_SERVICE: 'AUTH_SERVICE',
    CONTENT_SERVICE: 'CONTENT_SERVICE',
    NOTIFICATION_SERVICE: 'NOTIFICATION_SERVICE',
    MEDIA_SERVICE: 'MEDIA_SERVICE',
    PROGRESS_SERVICE: 'PROGRESS_SERVICE',
};
exports.MICROSERVICE_QUEUES = {
    USER_QUEUE: 'user_queue',
    COURSE_QUEUE: 'course_queue',
    ENROLLMENT_QUEUE: 'enrollment_queue',
    PAYMENT_QUEUE: 'payment_queue',
    AUTH_QUEUE: 'auth_queue',
    CONTENT_QUEUE: 'content_queue',
    NOTIFICATION_QUEUE: 'notification_queue',
    MEDIA_QUEUE: 'media_queue',
    PROGRESS_QUEUE: 'progress_queue',
};
exports.EVENTS = {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    COURSE_CREATED: 'course.created',
    COURSE_UPDATED: 'course.updated',
    COURSE_DELETED: 'course.deleted',
    ENROLLMENT_CREATED: 'enrollment.created',
    ENROLLMENT_UPDATED: 'enrollment.updated',
    ENROLLMENT_DELETED: 'enrollment.deleted',
    PAYMENT_CREATED: 'payment.created',
    PAYMENT_UPDATED: 'payment.updated',
    PAYMENT_DELETED: 'payment.deleted',
    CONTENT_CREATED: 'content.created',
    CONTENT_UPDATED: 'content.updated',
    CONTENT_DELETED: 'content.deleted',
    NOTIFICATION_CREATED: 'notification.created',
    NOTIFICATION_UPDATED: 'notification.updated',
    NOTIFICATION_DELETED: 'notification.deleted',
    MEDIA_CREATED: 'media.created',
    MEDIA_UPDATED: 'media.updated',
    MEDIA_DELETED: 'media.deleted',
    PROGRESS_CREATED: 'progress.created',
    PROGRESS_UPDATED: 'progress.updated',
    PROGRESS_DELETED: 'progress.deleted',
};
exports.PATTERNS = {
    AUTH: {
        VALIDATE_TOKEN: 'auth.validateToken',
        GET_USER_FROM_TOKEN: 'auth.getUserFromToken',
        LOGIN: 'auth.login',
        REGISTER: 'auth.register',
        REFRESH_TOKEN: 'auth.refreshToken',
        LOGOUT: 'auth.logout',
        REQUEST_PASSWORD_RESET: 'auth.requestPasswordReset',
        RESET_PASSWORD: 'auth.resetPassword',
    },
    USER: {
        FIND_ALL: 'user.findAll',
        FIND_ONE: 'user.findOne',
        CREATE: 'user.create',
        UPDATE: 'user.update',
        DELETE: 'user.delete',
    },
    COURSE: {
        FIND_ALL: 'course.findAll',
        FIND_ONE: 'course.findOne',
        CREATE: 'course.create',
        UPDATE: 'course.update',
        DELETE: 'course.delete',
    },
    ENROLLMENT: {
        FIND_ALL: 'enrollment.findAll',
        FIND_ONE: 'enrollment.findOne',
        CREATE: 'enrollment.create',
        UPDATE: 'enrollment.update',
        DELETE: 'enrollment.delete',
    },
    PAYMENT: {
        FIND_ALL: 'payment.findAll',
        FIND_ONE: 'payment.findOne',
        CREATE: 'payment.create',
        UPDATE: 'payment.update',
        DELETE: 'payment.delete',
        PROCESS: 'payment.process',
    },
    CONTENT: {
        FIND_ALL: 'content.findAll',
        FIND_BY_COURSE: 'content.findByCourse',
        FIND_BY_MODULE: 'content.findByModule',
        FIND_ONE: 'content.findOne',
        CREATE: 'content.create',
        UPDATE: 'content.update',
        DELETE: 'content.delete',
        CHANGE_STATUS: 'content.changeStatus',
    },
    NOTIFICATION: {
        FIND_ALL: 'notification.findAll',
        FIND_BY_USER: 'notification.findByUser',
        FIND_ONE: 'notification.findOne',
        CREATE: 'notification.create',
        UPDATE: 'notification.update',
        REMOVE: 'notification.remove',
        MARK_AS_READ: 'notification.markAsRead',
        MARK_ALL_AS_READ: 'notification.markAllAsRead',
        SEND_BULK: 'notification.sendBulk',
    },
    MEDIA: {
        FIND_ALL: 'media.findAll',
        FIND_BY_USER: 'media.findByUser',
        FIND_BY_ENTITY: 'media.findByEntity',
        FIND_ONE: 'media.findOne',
        CREATE: 'media.create',
        UPDATE: 'media.update',
        REMOVE: 'media.remove',
    },
    PROGRESS: {
        FIND_ALL: 'progress.findAll',
        FIND_BY_USER: 'progress.findByUser',
        FIND_BY_COURSE: 'progress.findByCourse',
        FIND_BY_USER_AND_COURSE: 'progress.findByUserAndCourse',
        FIND_ONE: 'progress.findOne',
        CREATE: 'progress.create',
        UPDATE: 'progress.update',
        DELETE: 'progress.delete',
        ADD_COMPLETED_LESSON: 'progress.addCompletedLesson',
        GENERATE_REPORT: 'progress.generateReport',
    },
};


/***/ }),

/***/ "./libs/shared/dto/content.dto.ts":
/*!****************************************!*\
  !*** ./libs/shared/dto/content.dto.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
exports.ContentResponseDto = exports.UpdateContentDto = exports.CreateContentDto = exports.ContentStatus = exports.ContentType = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
var ContentType;
(function (ContentType) {
    ContentType["TEXT"] = "TEXT";
    ContentType["VIDEO"] = "VIDEO";
    ContentType["AUDIO"] = "AUDIO";
    ContentType["PDF"] = "PDF";
    ContentType["QUIZ"] = "QUIZ";
    ContentType["ASSIGNMENT"] = "ASSIGNMENT";
    ContentType["CODE"] = "CODE";
    ContentType["PRESENTATION"] = "PRESENTATION";
})(ContentType || (exports.ContentType = ContentType = {}));
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "DRAFT";
    ContentStatus["PUBLISHED"] = "PUBLISHED";
    ContentStatus["ARCHIVED"] = "ARCHIVED";
    ContentStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
class CreateContentDto {
}
exports.CreateContentDto = CreateContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content title', example: 'Introduction to JavaScript' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content description', example: 'Learn the basics of JavaScript programming' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content type', enum: ContentType, example: ContentType.VIDEO }),
    (0, class_validator_1.IsEnum)(ContentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content data (URL, text, etc.)', example: 'https://example.com/video.mp4' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Course ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Module ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174001' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration in minutes (for video/audio)', example: 15, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateContentDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order within module', example: 1, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateContentDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is this content required to complete the module', example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateContentDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tags for the content', example: ['javascript', 'beginner'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateContentDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content status', enum: ContentStatus, example: ContentStatus.DRAFT, required: false }),
    (0, class_validator_1.IsEnum)(ContentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "status", void 0);
class UpdateContentDto {
}
exports.UpdateContentDto = UpdateContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content title', example: 'Introduction to JavaScript', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content description', example: 'Learn the basics of JavaScript programming', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content type', enum: ContentType, example: ContentType.VIDEO, required: false }),
    (0, class_validator_1.IsEnum)(ContentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content data (URL, text, etc.)', example: 'https://example.com/video.mp4', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Module ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174001', required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration in minutes (for video/audio)', example: 15, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateContentDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order within module', example: 1, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateContentDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is this content required to complete the module', example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateContentDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tags for the content', example: ['javascript', 'beginner'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateContentDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content status', enum: ContentStatus, example: ContentStatus.PUBLISHED, required: false }),
    (0, class_validator_1.IsEnum)(ContentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDto.prototype, "status", void 0);
class ContentResponseDto {
}
exports.ContentResponseDto = ContentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content ID', example: '123e4567-e89b-12d3-a456-426614174002' }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content title', example: 'Introduction to JavaScript' }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content description', example: 'Learn the basics of JavaScript programming' }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content type', enum: ContentType, example: ContentType.VIDEO }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content data (URL, text, etc.)', example: 'https://example.com/video.mp4' }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Course ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Module ID this content belongs to', example: '123e4567-e89b-12d3-a456-426614174001' }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration in minutes (for video/audio)', example: 15 }),
    __metadata("design:type", Number)
], ContentResponseDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order within module', example: 1 }),
    __metadata("design:type", Number)
], ContentResponseDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is this content required to complete the module', example: true }),
    __metadata("design:type", Boolean)
], ContentResponseDto.prototype, "isRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tags for the content', example: ['javascript', 'beginner'] }),
    __metadata("design:type", Array)
], ContentResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content status', enum: ContentStatus, example: ContentStatus.PUBLISHED }),
    __metadata("design:type", String)
], ContentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation date', example: '2023-01-01T00:00:00Z' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ContentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update date', example: '2023-01-02T00:00:00Z' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ContentResponseDto.prototype, "updatedAt", void 0);


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/microservices":
/*!****************************************!*\
  !*** external "@nestjs/microservices" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/microservices");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");

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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**************************************!*\
  !*** ./apps/api-gateway/src/main.ts ***!
  \**************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/api-gateway/src/app.module.ts");
const filters_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@shared/filters'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    const configService = app.get(config_1.ConfigService);
    app.use(new filters_1.SecurityHeadersMiddleware().use);
    app.use(new filters_1.LoggingMiddleware().use);
    app.use(new filters_1.PerformanceMiddleware().use);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        validationError: {
            target: false,
            value: false,
        },
    }));
    app.useGlobalFilters(new filters_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new filters_1.ResponseInterceptor());
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://yourdomain.com',
            /^https:\/\/.*\.yourdomain\.com$/,
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Correlation-ID',
            'X-Request-ID',
            'X-Trace-ID',
        ],
    });
    app.setGlobalPrefix('api', {
        exclude: ['/health', '/metrics'],
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Learning Platform API')
        .setDescription(`
      ## Learning Platform REST API Documentation
      
      This API provides comprehensive endpoints for managing a learning platform with:
      - User authentication and authorization
      - Course management and enrollment
      - Progress tracking and analytics
      - Payment processing
      - Real-time notifications
      
      ### Features
      - **JWT Authentication**: Secure token-based authentication
      - **Role-based Access Control**: User, Instructor, and Admin roles
      - **Rate Limiting**: Protection against abuse
      - **Request Tracing**: Full observability with correlation IDs
      - **Circuit Breakers**: Fault tolerance and resilience
      - **Caching**: Optimized performance for read operations
      
      ### Base URL
      - Development: \`http://localhost:3000/api\`
      - Production: \`https://api.yourdomain.com/api\`
      
      ### Authentication
      Most endpoints require a valid JWT token. Include it in the Authorization header:
      \`Authorization: Bearer <your-jwt-token>\`
      
      ### Error Handling
      All errors follow a consistent format:
      \`\`\`json
      {
        "success": false,
        "error": "Error message",
        "statusCode": 400,
        "correlationId": "uuid",
        "timestamp": "2024-01-01T00:00:00Z"
      }
      \`\`\`
      
      ### Rate Limits
      - Anonymous: 100 requests per minute
      - Authenticated: 1000 requests per minute
      - Admin: Unlimited
      
      ### Support
      For API support, contact: api-support@yourdomain.com
    `)
        .setVersion('1.0')
        .setContact('API Support', 'https://yourdomain.com/support', 'api-support@yourdomain.com')
        .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addServer('http://localhost:3000/api', 'Development Server')
        .addServer('https://api.yourdomain.com/api', 'Production Server')
        .addTag('Authentication', 'User authentication and authorization')
        .addTag('Users', 'User management and profiles')
        .addTag('Courses', 'Course management and content')
        .addTag('Enrollments', 'Course enrollment and progress')
        .addTag('Payments', 'Payment processing and billing')
        .addTag('Media', 'File upload and media management')
        .addTag('Health', 'System health and monitoring')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig, {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
        deepScanRoutes: true,
    });
    document.info['x-logo'] = {
        url: 'https://yourdomain.com/logo.png',
        altText: 'Learning Platform Logo'
    };
    swagger_1.SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Learning Platform API Documentation',
        customfavIcon: 'https://yourdomain.com/favicon.ico',
        customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info .title { color: #3b82f6; }
    `,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            docExpansion: 'none',
            filter: true,
            showRequestHeaders: true,
            tryItOutEnabled: true,
        },
    });
    app.getHttpAdapter().get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            services: {
                database: 'healthy',
                redis: 'healthy',
                rabbitmq: 'healthy',
            },
        });
    });
    const port = configService.get('API_GATEWAY_PORT') || 3000;
    const host = configService.get('API_GATEWAY_HOST') || '0.0.0.0';
    await app.listen(port, host);
    logger.log(`🚀 Learning Platform API Gateway running on http://${host}:${port}`);
    logger.log(`📚 API Documentation available at http://${host}:${port}/docs`);
    logger.log(`❤️  Health Check available at http://${host}:${port}/health`);
    logger.log(`📊 Metrics available at http://${host}:${port}/metrics`);
    logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});

})();

/******/ })()
;
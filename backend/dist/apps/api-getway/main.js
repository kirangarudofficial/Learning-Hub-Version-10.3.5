/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(3);
const core_1 = __webpack_require__(1);
const throttler_1 = __webpack_require__(5);
const database_module_1 = __webpack_require__(6);
const auth_guard_1 = __webpack_require__(9);
const auth_module_1 = __webpack_require__(11);
const users_module_1 = __webpack_require__(26);
const courses_module_1 = __webpack_require__(29);
const enrollments_module_1 = __webpack_require__(32);
const payments_module_1 = __webpack_require__(35);
const media_module_1 = __webpack_require__(39);
const health_module_1 = __webpack_require__(43);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            enrollments_module_1.EnrollmentsModule,
            payments_module_1.PaymentsModule,
            media_module_1.MediaModule,
            health_module_1.HealthModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(7);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], DatabaseModule);


/***/ }),
/* 7 */
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
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const client_1 = __webpack_require__(8);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async enableShutdownHooks(app) {
        process.on('SIGINT', async () => {
            await app.close();
        });
        process.on('SIGTERM', async () => {
            await app.close();
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 9 */
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
exports.RolesGuard = exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(10);
const core_1 = __webpack_require__(1);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role === role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_b = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _b : Object])
], RolesGuard);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(12);
const passport_1 = __webpack_require__(10);
const config_1 = __webpack_require__(3);
const microservices_1 = __webpack_require__(13);
const jwt_strategy_1 = __webpack_require__(14);
const constants_1 = __webpack_require__(16);
const auth_controller_1 = __webpack_require__(17);
const auth_service_1 = __webpack_require__(22);
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
/* 12 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

/***/ }),
/* 14 */
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
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(2);
const passport_1 = __webpack_require__(10);
const passport_jwt_1 = __webpack_require__(15);
const prisma_service_1 = __webpack_require__(7);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                instructorProfile: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            instructorProfile: user.instructorProfile,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.API_ROUTES = exports.REDIS_KEYS = exports.EVENTS = exports.RABBITMQ_QUEUES = exports.MICROSERVICE_TOKENS = void 0;
exports.MICROSERVICE_TOKENS = {
    USER_SERVICE: 'USER_SERVICE',
    COURSE_SERVICE: 'COURSE_SERVICE',
    ENROLLMENT_SERVICE: 'ENROLLMENT_SERVICE',
    PAYMENT_SERVICE: 'PAYMENT_SERVICE',
    NOTIFICATION_SERVICE: 'NOTIFICATION_SERVICE',
    MEDIA_SERVICE: 'MEDIA_SERVICE',
};
exports.RABBITMQ_QUEUES = {
    USER_QUEUE: 'user_queue',
    COURSE_QUEUE: 'course_queue',
    ENROLLMENT_QUEUE: 'enrollment_queue',
    PAYMENT_QUEUE: 'payment_queue',
    NOTIFICATION_QUEUE: 'notification_queue',
    MEDIA_QUEUE: 'media_queue',
};
exports.EVENTS = {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    COURSE_CREATED: 'course.created',
    COURSE_UPDATED: 'course.updated',
    ENROLLMENT_CREATED: 'enrollment.created',
    PAYMENT_COMPLETED: 'payment.completed',
    NOTIFICATION_SEND: 'notification.send',
    MEDIA_UPLOADED: 'media.uploaded',
};
exports.REDIS_KEYS = {
    USER_PROFILE: (userId) => `user:profile:${userId}`,
    COURSE_DETAILS: (courseId) => `course:details:${courseId}`,
    USER_COURSES: (userId) => `user:courses:${userId}`,
    COURSE_STUDENTS: (courseId) => `course:students:${courseId}`,
};
exports.API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
    },
    USERS: {
        BASE: '/users',
        PROFILE: '/users/profile',
        BY_ID: '/users/:id',
    },
    COURSES: {
        BASE: '/courses',
        BY_ID: '/courses/:id',
        ENROLL: '/courses/:id/enroll',
        CURRICULUM: '/courses/:id/curriculum',
    },
    ENROLLMENTS: {
        BASE: '/enrollments',
        BY_USER: '/enrollments/user/:userId',
        PROGRESS: '/enrollments/:id/progress',
    },
    PAYMENTS: {
        BASE: '/payments',
        CREATE_INTENT: '/payments/create-payment-intent',
        WEBHOOK: '/payments/webhook',
    },
    MEDIA: {
        BASE: '/media',
        UPLOAD: '/media/upload',
        BY_ID: '/media/:id',
    },
};


/***/ }),
/* 17 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const user_decorator_1 = __webpack_require__(18);
const dto_1 = __webpack_require__(19);
const auth_service_1 = __webpack_require__(22);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async refresh(body) {
        return this.authService.refresh(body.refreshToken);
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, user_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof dto_1.LoginDto !== "undefined" && dto_1.LoginDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, user_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof dto_1.RegisterDto !== "undefined" && dto_1.RegisterDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.Public = exports.CurrentUser = void 0;
const common_1 = __webpack_require__(2);
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),
/* 19 */
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
exports.PaginationDto = exports.UpdateCourseDto = exports.CreateCourseDto = exports.RegisterDto = exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(21);
const client_1 = __webpack_require__(8);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RegisterDto {
    constructor() {
        this.role = client_1.Role.USER;
    }
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Role),
    __metadata("design:type", typeof (_a = typeof client_1.Role !== "undefined" && client_1.Role) === "function" ? _a : Object)
], RegisterDto.prototype, "role", void 0);
class CreateCourseDto {
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "originalPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.CourseLevel),
    __metadata("design:type", typeof (_b = typeof client_1.CourseLevel !== "undefined" && client_1.CourseLevel) === "function" ? _b : Object)
], CreateCourseDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "badge", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCourseDto.prototype, "whatYouWillLearn", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCourseDto.prototype, "requirements", void 0);
class UpdateCourseDto {
}
exports.UpdateCourseDto = UpdateCourseDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCourseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCourseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCourseDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCourseDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCourseDto.prototype, "originalPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCourseDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.CourseLevel),
    __metadata("design:type", typeof (_c = typeof client_1.CourseLevel !== "undefined" && client_1.CourseLevel) === "function" ? _c : Object)
], UpdateCourseDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCourseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCourseDto.prototype, "badge", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateCourseDto.prototype, "whatYouWillLearn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateCourseDto.prototype, "requirements", void 0);
class PaginationDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.order = 'desc';
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaginationDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    __metadata("design:type", String)
], PaginationDto.prototype, "order", void 0);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 22 */
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(12);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const utils_1 = __webpack_require__(23);
const prisma_service_1 = __webpack_require__(7);
let AuthService = class AuthService {
    constructor(prisma, jwtService, userServiceClient) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.userServiceClient = userServiceClient;
    }
    async login(loginDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: loginDto.email },
                include: {
                    instructorProfile: true,
                },
            });
            if (!user || !user.passwordHash) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await utils_1.PasswordUtils.compare(loginDto.password, user.passwordHash);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const accessToken = this.jwtService.sign(payload);
            return utils_1.ApiResponseUtil.success({
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                    instructorProfile: user.instructorProfile,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Login failed');
        }
    }
    async register(registerDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: registerDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('User already exists');
            }
            const passwordHash = await utils_1.PasswordUtils.hash(registerDto.password);
            const user = await this.prisma.user.create({
                data: {
                    name: registerDto.name,
                    email: registerDto.email,
                    passwordHash,
                    role: registerDto.role || 'USER',
                },
            });
            this.userServiceClient.emit('user.created', {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            });
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const accessToken = this.jwtService.sign(payload);
            return utils_1.ApiResponseUtil.success({
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.ConflictException('Registration failed');
        }
    }
    async refresh(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };
            const accessToken = this.jwtService.sign(payload);
            return utils_1.ApiResponseUtil.success({ accessToken });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(constants_1.MICROSERVICE_TOKENS.USER_SERVICE)),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationUtils = exports.ApiResponseUtil = exports.IdUtils = exports.PasswordUtils = void 0;
const bcrypt = __webpack_require__(24);
const uuid_1 = __webpack_require__(25);
class PasswordUtils {
    static async hash(password) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }
    static async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
exports.PasswordUtils = PasswordUtils;
class IdUtils {
    static generate() {
        return (0, uuid_1.v4)();
    }
    static isValid(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
}
exports.IdUtils = IdUtils;
class ApiResponseUtil {
    static success(data, message) {
        return {
            success: true,
            data,
            message,
        };
    }
    static error(message, statusCode = 400) {
        return {
            success: false,
            error: message,
            statusCode,
        };
    }
    static paginated(data, total, page, limit) {
        return {
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.ApiResponseUtil = ApiResponseUtil;
class ValidationUtils {
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isStrongPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
}
exports.ValidationUtils = ValidationUtils;


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const users_controller_1 = __webpack_require__(27);
const users_service_1 = __webpack_require__(28);
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
/* 27 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(2);
const user_decorator_1 = __webpack_require__(18);
const users_service_1 = __webpack_require__(28);
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
/* 28 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const prisma_service_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(23);
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
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoursesModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const courses_controller_1 = __webpack_require__(30);
const courses_service_1 = __webpack_require__(31);
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
/* 30 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoursesController = void 0;
const common_1 = __webpack_require__(2);
const user_decorator_1 = __webpack_require__(18);
const dto_1 = __webpack_require__(19);
const courses_service_1 = __webpack_require__(31);
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async getAllCourses(paginationDto) {
        return this.coursesService.getAllCourses(paginationDto);
    }
    async getCourseById(id) {
        return this.coursesService.getCourseById(id);
    }
    async createCourse(user, createCourseDto) {
        return this.coursesService.createCourse(user.id, createCourseDto);
    }
    async updateCourse(id, user, updateCourseDto) {
        return this.coursesService.updateCourse(id, user.id, updateCourseDto);
    }
    async deleteCourse(id, user) {
        return this.coursesService.deleteCourse(id, user.id);
    }
    async getCoursesByInstructor(instructorId) {
        return this.coursesService.getCoursesByInstructor(instructorId);
    }
    async getCoursesByCategory(category, paginationDto) {
        return this.coursesService.getCoursesByCategory(category, paginationDto);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, user_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof dto_1.PaginationDto !== "undefined" && dto_1.PaginationDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, user_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.Post)(),
    (0, user_decorator_1.Roles)('INSTRUCTOR', 'ADMIN'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof dto_1.CreateCourseDto !== "undefined" && dto_1.CreateCourseDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, user_decorator_1.Roles)('INSTRUCTOR', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof dto_1.UpdateCourseDto !== "undefined" && dto_1.UpdateCourseDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, user_decorator_1.Roles)('INSTRUCTOR', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.Get)('instructor/:instructorId'),
    __param(0, (0, common_1.Param)('instructorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByInstructor", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, user_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof dto_1.PaginationDto !== "undefined" && dto_1.PaginationDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByCategory", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [typeof (_a = typeof courses_service_1.CoursesService !== "undefined" && courses_service_1.CoursesService) === "function" ? _a : Object])
], CoursesController);


/***/ }),
/* 31 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoursesService = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const prisma_service_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(23);
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
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollmentsModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const enrollments_controller_1 = __webpack_require__(33);
const enrollments_service_1 = __webpack_require__(34);
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
/* 33 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollmentsController = void 0;
const common_1 = __webpack_require__(2);
const user_decorator_1 = __webpack_require__(18);
const enrollments_service_1 = __webpack_require__(34);
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
/* 34 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollmentsService = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const prisma_service_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(23);
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
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const payments_controller_1 = __webpack_require__(36);
const payments_service_1 = __webpack_require__(37);
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
/* 36 */
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsController = void 0;
const common_1 = __webpack_require__(2);
const user_decorator_1 = __webpack_require__(18);
const payments_service_1 = __webpack_require__(37);
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
/* 37 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentsService = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const rxjs_1 = __webpack_require__(38);
const constants_1 = __webpack_require__(16);
const utils_1 = __webpack_require__(23);
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
/* 38 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaModule = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const constants_1 = __webpack_require__(16);
const media_controller_1 = __webpack_require__(40);
const media_service_1 = __webpack_require__(42);
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: constants_1.MICROSERVICE_TOKENS.MEDIA_SERVICE,
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL],
                        queue: constants_1.RABBITMQ_QUEUES.MEDIA_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
        ],
        controllers: [media_controller_1.MediaController],
        providers: [media_service_1.MediaService],
    })
], MediaModule);


/***/ }),
/* 40 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaController = void 0;
const common_1 = __webpack_require__(2);
const platform_express_1 = __webpack_require__(41);
const user_decorator_1 = __webpack_require__(18);
const media_service_1 = __webpack_require__(42);
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
/* 41 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),
/* 42 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MediaService = void 0;
const common_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(13);
const rxjs_1 = __webpack_require__(38);
const constants_1 = __webpack_require__(16);
const utils_1 = __webpack_require__(23);
let MediaService = class MediaService {
    constructor(mediaServiceClient) {
        this.mediaServiceClient = mediaServiceClient;
    }
    async uploadSingleFile(userId, file, metadata) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send('upload_single_file', {
                userId,
                file: {
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    buffer: file.buffer,
                },
                metadata,
            }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
        }
    }
    async uploadMultipleFiles(userId, files, metadata) {
        try {
            const fileData = files.map(file => ({
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                buffer: file.buffer,
            }));
            const result = await (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send('upload_multiple_files', {
                userId,
                files: fileData,
                metadata,
            }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
        }
    }
    async uploadVideo(userId, file, metadata) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send('upload_video', {
                userId,
                file: {
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    buffer: file.buffer,
                },
                metadata,
            }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
        }
    }
    async getFile(fileId) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send('get_file', { fileId }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
        }
    }
    async getUserFiles(userId) {
        try {
            const result = await (0, rxjs_1.firstValueFrom)(this.mediaServiceClient.send('get_user_files', { userId }));
            return utils_1.ApiResponseUtil.success(result);
        }
        catch (error) {
            throw error;
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
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(2);
const health_controller_1 = __webpack_require__(44);
const health_service_1 = __webpack_require__(45);
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
/* 44 */
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
exports.HealthController = void 0;
const common_1 = __webpack_require__(2);
const user_decorator_1 = __webpack_require__(18);
const health_service_1 = __webpack_require__(45);
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async getHealth() {
        return this.healthService.getHealthStatus();
    }
    async getDetailedHealth() {
        return this.healthService.getDetailedHealthStatus();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, user_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, user_decorator_1.Public)(),
    (0, common_1.Get)('detailed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDetailedHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof health_service_1.HealthService !== "undefined" && health_service_1.HealthService) === "function" ? _a : Object])
], HealthController);


/***/ }),
/* 45 */
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
exports.HealthService = void 0;
const common_1 = __webpack_require__(2);
const prisma_service_1 = __webpack_require__(7);
const utils_1 = __webpack_require__(23);
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


/***/ })
/******/ 	]);
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

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourdomain.com'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('API_GATEWAY_PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 API Gateway running on port ${port}`);
}
bootstrap();

})();

/******/ })()
;
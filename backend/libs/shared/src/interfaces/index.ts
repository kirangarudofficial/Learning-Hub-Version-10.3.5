import { Role } from '@prisma/client';

// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  deletedAt?: Date | null;
}

// User interfaces
export interface IUser extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  passwordHash?: string;
  role: Role;
  instructorProfile?: IInstructor;
}

export interface IUserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  createdAt: Date;
}

export interface IInstructor extends BaseEntity {
  bio?: string;
  rating?: number;
  students?: number;
  userId: string;
  user: IUser;
}

// Course interfaces
export interface ICourse extends BaseEntity {
  title: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  duration?: string;
  students?: string;
  level: string;
  category: string;
  badge?: string;
  whatYouWillLearn: string[];
  requirements: string[];
  instructorId: string;
  instructor: IInstructor;
}

export interface ICourseModule extends BaseEntity {
  title: string;
  duration?: string;
  courseId: string;
  course: ICourse;
  lessons: ILesson[];
}

export interface ILesson extends BaseEntity {
  title: string;
  duration?: string;
  type: string;
  videoUrl?: string;
  content?: string;
  isFree: boolean;
  moduleId: string;
  module: ICourseModule;
}

// Enrollment interfaces
export interface IEnrollment {
  enrolledAt: Date;
  userId: string;
  courseId: string;
  user: IUser;
  course: ICourse;
}

export interface IUserProgress extends BaseEntity {
  progressPercentage: number;
  lastAccessed: Date;
  userId: string;
  courseId: string;
  user: IUser;
  course: ICourse;
  completedLessons: ILesson[];
}

// Review interfaces
export interface IReview extends BaseEntity {
  rating: number;
  comment?: string;
  userId: string;
  courseId: string;
  user: IUser;
  course: ICourse;
}

// Note interfaces
export interface INote extends BaseEntity {
  content: string;
  timestamp?: number;
  userId: string;
  lessonId: string;
  user: IUser;
  lesson: ILesson;
}

// API Response interfaces
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  correlationId?: string;
  timestamp: string;
}

export interface IPaginatedResponse<T = any> extends IApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Event interfaces
export interface IUserCreatedEvent {
  userId: string;
  email: string;
  name: string;
  role: Role;
  timestamp: Date;
}

export interface IUserUpdatedEvent {
  userId: string;
  changes: Partial<IUser>;
  timestamp: Date;
}

export interface ICourseCreatedEvent {
  courseId: string;
  instructorId: string;
  title: string;
  timestamp: Date;
}

export interface ICourseUpdatedEvent {
  courseId: string;
  changes: Partial<ICourse>;
  timestamp: Date;
}

export interface IEnrollmentCreatedEvent {
  userId: string;
  courseId: string;
  enrolledAt: Date;
  timestamp: Date;
}

export interface IPaymentProcessedEvent {
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  timestamp: Date;
}

// Health check interfaces
export interface IHealthCheck {
  status: 'healthy' | 'unhealthy';
  service: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface IHealthResponse {
  status: 'healthy' | 'unhealthy';
  services: IHealthCheck[];
  timestamp: Date;
  uptime: number;
}

// Microservice interfaces
export interface IMicroserviceConfig {
  name: string;
  port?: number;
  queue: string;
  exchange?: string;
  routingKey?: string;
}

// Logging interfaces
export interface ILogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: string;
  correlationId?: string;
  requestId?: string;
  traceId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Performance monitoring interfaces
export interface IPerformanceMetric {
  operation: string;
  duration: number;
  status: 'success' | 'error';
  correlationId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Cache interfaces
export interface ICacheEntry<T = any> {
  key: string;
  value: T;
  ttl: number;
  createdAt: Date;
  expiresAt: Date;
}

// Search interfaces
export interface ISearchQuery {
  query: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface ISearchResult<T = any> {
  items: T[];
  total: number;
  query: ISearchQuery;
  executionTime: number;
}

// Notification interfaces
export interface INotification extends BaseEntity {
  type: 'email' | 'sms' | 'push' | 'in-app';
  recipient: string;
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  metadata?: Record<string, any>;
}

// Payment interfaces
export interface IPayment extends BaseEntity {
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  userId: string;
  courseId: string;
  metadata?: Record<string, any>;
}

// Analytics interfaces
export interface IAnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, any>;
  timestamp: Date;
}

export interface IAnalyticsQuery {
  eventType?: string;
  userId?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  groupBy?: string[];
  metrics?: string[];
}
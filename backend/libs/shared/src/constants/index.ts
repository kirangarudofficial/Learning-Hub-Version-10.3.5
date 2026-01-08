export const MICROSERVICE_TOKENS = {
  USER_SERVICE: 'USER_SERVICE',
  COURSE_SERVICE: 'COURSE_SERVICE',
  ENROLLMENT_SERVICE: 'ENROLLMENT_SERVICE',
  PAYMENT_SERVICE: 'PAYMENT_SERVICE',
  NOTIFICATION_SERVICE: 'NOTIFICATION_SERVICE',
  MEDIA_SERVICE: 'MEDIA_SERVICE',
  ANALYTICS_SERVICE: 'ANALYTICS_SERVICE',
  ASSESSMENT_SERVICE: 'ASSESSMENT_SERVICE',
} as const;

export const REDIS_KEYS = {
  USER_SESSION: 'user:session:',
  COURSE_CACHE: 'course:cache:',
  ENROLLMENT_CACHE: 'enrollment:cache:',
  RATE_LIMIT: 'rate_limit:',
} as const;

export const QUEUE_NAMES = {
  USER_QUEUE: 'user_queue',
  COURSE_QUEUE: 'course_queue',
  ENROLLMENT_QUEUE: 'enrollment_queue',
  PAYMENT_QUEUE: 'payment_queue',
  NOTIFICATION_QUEUE: 'notification_queue',
  MEDIA_QUEUE: 'media_queue',
} as const;

// Alias for backward compatibility
export const RABBITMQ_QUEUES = QUEUE_NAMES;

// Message patterns for microservice communication
export const PATTERNS = {
  USER_GET: 'user.get',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  AUTH_LOGIN: 'auth.login',
  AUTH_REGISTER: 'auth.register',
  AUTH_VERIFY: 'auth.verify',
  COURSE_GET: 'course.get',
  COURSE_CREATE: 'course.create',
  COURSE_UPDATE: 'course.update',
} as const;

export const EVENT_PATTERNS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  COURSE_CREATED: 'course.created',
  COURSE_UPDATED: 'course.updated',
  COURSE_PUBLISHED: 'course.published',
  ENROLLMENT_CREATED: 'enrollment.created',
  ENROLLMENT_COMPLETED: 'enrollment.completed',
  PAYMENT_PROCESSED: 'payment.processed',
  NOTIFICATION_SEND: 'notification.send',
} as const;

export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
} as const;

export const CORRELATION_ID_HEADER = 'X-Correlation-ID';
export const REQUEST_ID_HEADER = 'X-Request-ID';
export const TRACE_ID_HEADER = 'X-Trace-ID';
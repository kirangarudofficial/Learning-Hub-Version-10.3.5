# Learning Platform - Enterprise-Grade E-Learning System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)

A comprehensive, production-ready learning management system built with modern technologies and enterprise-grade architecture patterns.

## 🏗️ Architecture Overview

This platform follows a **microservices architecture** with clean separation of concerns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   React SPA     │    │   API Gateway    │    │   Microservices     │
│                 │◄──►│                  │◄──►│                     │
│ • TypeScript    │    │ • Authentication │    │ • User Service      │
│ • Tailwind CSS  │    │ • Rate Limiting  │    │ • Course Service    │
│ • React Router  │    │ • Load Balancing │    │ • Enrollment Svc    │
│ • Axios Client  │    │ • API Gateway    │    │ • Payment Service   │
└─────────────────┘    └──────────────────┘    │ • Media Service     │
                                               │ • Notification Svc  │
                                               └─────────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   CDN/Assets    │    │   Observability  │    │     Database        │
│                 │    │                  │    │                     │
│ • Static Files  │    │ • Distributed    │    │ • PostgreSQL        │
│ • Media Assets  │    │   Tracing        │    │ • Prisma ORM        │
│ • Image Opt.    │    │ • Structured     │    │ • Connection Pool   │
└─────────────────┘    │   Logging        │    │ • Migrations        │
                       │ • Health Checks  │    └─────────────────────┘
                       │ • Metrics        │
                       └──────────────────┘
```

## ✨ Key Features

### 🎓 Learning Management
- **Course Creation & Management**: Rich course builder with multimedia support
- **Interactive Content**: Video lessons, quizzes, assignments, and downloadable resources
- **Progress Tracking**: Detailed analytics and completion tracking
- **Certification System**: Automated certificate generation upon course completion
- **Multi-role Support**: Students, Instructors, Admins with role-based permissions

### 🏢 Enterprise Features
- **Microservices Architecture**: Scalable, maintainable, and fault-tolerant
- **API-First Design**: RESTful APIs with OpenAPI documentation
- **Real-time Features**: Live notifications and real-time progress updates
- **Advanced Security**: JWT authentication, rate limiting, input validation
- **Observability**: Distributed tracing, structured logging, health monitoring

### 🎨 Modern Frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Progressive Web App**: Offline support and installable experience
- **Performance Optimized**: Code splitting, lazy loading, caching strategies
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

### 🔧 Developer Experience
- **Type Safety**: Full TypeScript implementation across the stack
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Testing**: Comprehensive unit, integration, and E2E test suites
- **Docker Support**: Containerized development and deployment
- **CI/CD Ready**: GitHub Actions workflows for automated deployments

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 13.x or higher
- **Redis** 6.x or higher (optional, for caching)
- **RabbitMQ** 3.x or higher (for microservices communication)
- **Yarn** package manager

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/learning-platform.git
cd learning-platform

# Install backend dependencies
cd backend
yarn install

# Install frontend dependencies
cd ../frontend
yarn install
```

### 2. Environment Setup

Create environment files:

**Backend (.env):**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/learning_platform"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRATION="24h"
JWT_ISSUER="learning-platform"
JWT_AUDIENCE="learning-platform-users"

# API Gateway
API_GATEWAY_PORT=3000
API_GATEWAY_HOST=0.0.0.0

# Microservices Configuration
RABBITMQ_URL="amqp://localhost:5672"
REDIS_URL="redis://localhost:6379"

# Rate Limiting
THROTTLE_SHORT_LIMIT=10
THROTTLE_MEDIUM_LIMIT=20
THROTTLE_LONG_LIMIT=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DEST="./uploads"

# Email Configuration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment Integration (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Monitoring (optional)
SENTRY_DSN="https://your-sentry-dsn"
```

**Frontend (.env):**
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
REACT_APP_BACKEND_URL=http://localhost:3000/api

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Third-party Services
VITE_GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
VITE_SENTRY_DSN="https://your-frontend-sentry-dsn"
```

### 3. Database Setup

```bash
# Generate Prisma client
cd backend
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend services
cd backend
yarn start:dev

# Terminal 2: Start frontend
cd frontend
yarn dev

# Terminal 3: Start additional microservices (optional)
cd backend
yarn user:dev    # User service
yarn course:dev  # Course service
yarn enrollment:dev  # Enrollment service
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health
- **Metrics**: http://localhost:3000/metrics

## 📚 API Documentation

### Interactive Documentation

Visit http://localhost:3000/docs for comprehensive API documentation with:
- **Interactive Testing**: Try API calls directly from the browser
- **Authentication**: Built-in JWT token management
- **Request/Response Examples**: Complete examples for all endpoints
- **Schema Definitions**: Detailed data models and validation rules

### Core API Endpoints

#### Authentication
```http
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
POST   /api/auth/refresh        # Refresh JWT token
GET    /api/auth/me            # Get current user
POST   /api/auth/logout        # User logout
GET    /api/auth/verify        # Verify token
```

#### Courses
```http
GET    /api/courses                    # List all courses (paginated)
GET    /api/courses/:id               # Get course by ID
GET    /api/courses/category/:category # Get courses by category
POST   /api/courses                   # Create new course (instructor+)
PUT    /api/courses/:id              # Update course (owner only)
DELETE /api/courses/:id              # Delete course (owner only)
GET    /api/courses/instructor/my-courses # Get instructor's courses
```

#### Users
```http
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update user profile
GET    /api/users/:id             # Get user by ID
GET    /api/users                # List all users (admin only)
```

#### Enrollments
```http
POST   /api/enrollments           # Enroll in course
GET    /api/enrollments/my-enrollments # Get user enrollments
GET    /api/enrollments/:courseId/progress # Get course progress
PUT    /api/enrollments/:courseId/lessons/:lessonId/progress # Update progress
```

### API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional success message",
  "correlationId": "uuid-for-tracing",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "correlationId": "uuid-for-tracing",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🏛️ System Architecture

### Microservices Design

The platform is built using a microservices architecture with the following services:

#### API Gateway
- **Purpose**: Single entry point for all client requests
- **Responsibilities**: 
  - Authentication & authorization
  - Rate limiting & throttling
  - Request routing & load balancing
  - API documentation
  - CORS handling

#### User Service
- **Purpose**: User management and authentication
- **Responsibilities**:
  - User registration & profile management
  - Password management & recovery
  - Role-based access control
  - User preferences & settings

#### Course Service
- **Purpose**: Course content management
- **Responsibilities**:
  - Course CRUD operations
  - Content organization (modules, lessons)
  - Course categorization & search
  - Instructor course management

#### Enrollment Service
- **Purpose**: Student enrollment and progress tracking
- **Responsibilities**:
  - Course enrollment management
  - Progress tracking & analytics
  - Completion certificates
  - Learning path recommendations

#### Payment Service
- **Purpose**: Payment processing and billing
- **Responsibilities**:
  - Payment gateway integration
  - Subscription management
  - Invoice generation
  - Revenue analytics

#### Media Service
- **Purpose**: File upload and media management
- **Responsibilities**:
  - File upload & storage
  - Image processing & optimization
  - Video transcoding
  - CDN integration

#### Notification Service
- **Purpose**: Real-time notifications
- **Responsibilities**:
  - Email notifications
  - Push notifications
  - In-app notifications
  - Notification preferences

### Database Design

The system uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database access.

#### Key Models:

```typescript
// User & Authentication
User
Instructor
Role

// Course Content
Course
CourseModule
Lesson
Review

// Enrollment & Progress
Enrollment
UserProgress
Note

// Payments & Business
Payment
Subscription
```

### Security Architecture

#### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with secure token handling
- **Role-Based Access Control**: Multiple user roles with granular permissions
- **Token Refresh**: Automatic token refresh for seamless user experience
- **Session Management**: Secure session handling with proper logout

#### API Security
- **Rate Limiting**: Multiple tiers of rate limiting (short/medium/long term)
- **Input Validation**: Comprehensive validation using class-validator
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Security Headers**: Security headers for XSS, CSRF, and other protections

#### Data Protection
- **Password Hashing**: Bcrypt with salt rounds for password security
- **Data Encryption**: Sensitive data encryption at rest
- **SQL Injection Prevention**: Prisma ORM provides SQL injection protection
- **XSS Prevention**: Input sanitization and output encoding

### Observability & Monitoring

#### Distributed Tracing
- **Correlation IDs**: Request tracing across microservices
- **Request/Response Logging**: Comprehensive request lifecycle logging
- **Performance Monitoring**: Response time and performance metrics
- **Error Tracking**: Centralized error logging and alerting

#### Health Monitoring
- **Health Checks**: Multi-level health checks for all services
- **Circuit Breakers**: Fault tolerance with circuit breaker pattern
- **Metrics Collection**: System metrics for monitoring and alerting
- **Uptime Monitoring**: Service availability monitoring

#### Logging Strategy
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Log Levels**: Appropriate log levels (error, warn, info, debug)
- **Centralized Logging**: Aggregated logs for analysis
- **Log Retention**: Configurable log retention policies

## 🧪 Testing Strategy

### Backend Testing

#### Unit Tests
```bash
# Run all unit tests
yarn test

# Run tests with coverage
yarn test:cov

# Run tests in watch mode
yarn test:watch
```

#### Integration Tests
```bash
# Run integration tests
yarn test:e2e

# Run specific test suite
yarn test:e2e --testNamePattern="Auth"
```

#### API Testing
```bash
# Test API endpoints
yarn test:api

# Test specific endpoints
yarn test:api --grep "courses"
```

### Frontend Testing

#### Component Tests
```bash
# Run component tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run tests in watch mode
yarn test --watch
```

#### E2E Tests
```bash
# Run E2E tests
yarn test:e2e

# Run E2E tests in headless mode
yarn test:e2e:headless
```

### Testing Guidelines

#### Backend Testing Patterns
```typescript
// Unit test example
describe('CourseService', () => {
  it('should create a course', async () => {
    const courseData = { title: 'Test Course' };
    const result = await courseService.create(userId, courseData);
    expect(result.success).toBe(true);
  });
});

// Integration test example
describe('Course API', () => {
  it('GET /courses should return paginated courses', async () => {
    const response = await request(app)
      .get('/api/courses')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.pagination).toBeDefined();
  });
});
```

#### Frontend Testing Patterns
```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { CourseCard } from './CourseCard';

test('renders course card with title', () => {
  const course = { id: '1', title: 'Test Course' };
  render(<CourseCard course={course} />);
  
  expect(screen.getByText('Test Course')).toBeInTheDocument();
});

// Hook test example
import { renderHook } from '@testing-library/react-hooks';
import { useCourses } from './useCourses';

test('should fetch courses on mount', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useCourses());
  
  await waitForNextUpdate();
  expect(result.current.courses).toHaveLength(10);
});
```

## 🚢 Deployment

### Docker Deployment

#### Development with Docker
```bash
# Build and run all services
docker-compose up -d

# Build specific service
docker-compose build api-gateway

# View logs
docker-compose logs -f api-gateway
```

#### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]
```

### Kubernetes Deployment

#### Basic Kubernetes Setup
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learning-platform-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: learning-platform-api
  template:
    metadata:
      labels:
        app: learning-platform-api
    spec:
      containers:
      - name: api
        image: learning-platform:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### Cloud Deployment Options

#### AWS Deployment
- **EC2**: Traditional server deployment
- **ECS**: Containerized deployment with auto-scaling
- **EKS**: Kubernetes cluster deployment
- **Lambda**: Serverless functions for specific microservices
- **RDS**: Managed PostgreSQL database
- **ElastiCache**: Redis caching layer
- **CloudFront**: CDN for static assets

#### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Load balancer configured
- [ ] Monitoring and alerting setup
- [ ] Backup strategy implemented
- [ ] Security scanning completed
- [ ] Performance testing done

## 🔧 Configuration

### Environment Variables

#### Backend Configuration
```env
# Core Settings
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL="postgresql://user:pass@host:port/db"
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Authentication
JWT_SECRET="your-256-bit-secret"
JWT_EXPIRATION="24h"
JWT_REFRESH_EXPIRATION="7d"

# Redis (optional)
REDIS_URL="redis://host:port"
REDIS_PASSWORD="password"

# File Uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="jpg,jpeg,png,pdf,mp4"
UPLOAD_PATH="/app/uploads"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="email@example.com"
SMTP_PASS="password"

# External Services
STRIPE_SECRET_KEY="sk_live_..."
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="learning-platform-assets"

# Monitoring
SENTRY_DSN="https://..."
LOG_LEVEL="info"
ENABLE_METRICS=true
```

#### Frontend Configuration
```env
# API
VITE_API_URL=https://api.yourplatform.com/api

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=true

# Analytics
VITE_GA_TRACKING_ID="GA_MEASUREMENT_ID"
VITE_HOTJAR_ID="HOTJAR_ID"

# Third-party
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_..."
VITE_GOOGLE_MAPS_API_KEY="..."

# Development
VITE_DEBUG=false
VITE_MOCK_API=false
```

### Feature Flags

Control features through environment variables:
```typescript
// Feature flag utility
export const features = {
  analytics: process.env.VITE_ENABLE_ANALYTICS === 'true',
  chat: process.env.VITE_ENABLE_CHAT === 'true',
  payments: process.env.VITE_ENABLE_PAYMENTS === 'true',
  notifications: process.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  pwa: process.env.VITE_ENABLE_PWA === 'true',
};

// Usage in components
if (features.analytics) {
  // Enable analytics
}
```

## 🎯 Performance Optimization

### Backend Performance

#### Database Optimization
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Indexed queries and efficient joins
- **Caching Strategy**: Redis caching for frequently accessed data
- **Pagination**: Efficient pagination for large datasets

#### API Performance
- **Response Caching**: Cache API responses for improved performance
- **Compression**: Gzip compression for API responses
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Load Balancing**: Distribute traffic across multiple instances

### Frontend Performance

#### Bundle Optimization
- **Code Splitting**: Dynamic imports for route-based code splitting
- **Tree Shaking**: Remove unused code from bundles
- **Asset Optimization**: Compressed and optimized images
- **CDN Integration**: Serve static assets from CDN

#### Runtime Performance
- **Virtual Scrolling**: Efficient rendering of large lists
- **Memoization**: React.memo and useMemo for expensive computations
- **Lazy Loading**: Load components and images on demand
- **Service Workers**: Offline support and caching

### Monitoring & Metrics

#### Performance Metrics
```typescript
// Performance monitoring
export const performanceMonitor = {
  // Track API response times
  trackApiCall: (endpoint: string, duration: number) => {
    console.log(`API ${endpoint}: ${duration}ms`);
  },
  
  // Track component render times
  trackRender: (component: string, duration: number) => {
    console.log(`Render ${component}: ${duration}ms`);
  },
  
  // Track user interactions
  trackUserAction: (action: string, metadata: any) => {
    console.log(`Action ${action}:`, metadata);
  },
};
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Submit a pull request

### Coding Standards

#### TypeScript Guidelines
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type annotations
- Avoid `any` type usage

#### Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Write descriptive commit messages

#### Testing Requirements
- Write unit tests for all new functions
- Add integration tests for API endpoints
- Update E2E tests for new features
- Maintain test coverage above 80%

### Pull Request Process
1. Update documentation if needed
2. Add tests for new functionality
3. Ensure CI pipeline passes
4. Request review from maintainers
5. Address review feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS Team** - For the amazing backend framework
- **React Team** - For the excellent frontend library
- **Prisma Team** - For the type-safe database toolkit
- **Community Contributors** - For bug reports and feature suggestions

## 📞 Support

### Documentation
- **API Documentation**: http://localhost:3000/docs
- **GitHub Wiki**: [Project Wiki](https://github.com/your-org/learning-platform/wiki)
- **FAQ**: [Frequently Asked Questions](docs/FAQ.md)

### Community
- **Discord**: [Join our Discord](https://discord.gg/learning-platform)
- **GitHub Discussions**: [Project Discussions](https://github.com/your-org/learning-platform/discussions)
- **Stack Overflow**: Tag questions with `learning-platform`

### Commercial Support
For enterprise support, please contact: support@yourplatform.com

---

**Built with ❤️ by the Learning Platform Team**

*Making education accessible and engaging for everyone.*
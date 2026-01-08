# 🚀 Learning Platform Development Setup Guide

## Overview

This is a comprehensive NestJS microservices-based learning platform similar to Udemy/Coursera. The backend consists of 10 microservices with a centralized API Gateway.

## 🏗️ Architecture

### Microservices
- **API Gateway** (Port 3000) - Central routing and authentication
- **Auth Service** (Port 3010) - JWT authentication and user management
- **User Service** (Port 3001) - User profiles and management
- **Course Service** (Port 3003) - Course management and content
- **Enrollment Service** (Port 3004) - Course enrollments and progress
- **Payment Service** (Port 3005) - Stripe payment processing
- **Media Service** (Port 3006) - File uploads and media management
- **Notification Service** (Port 3007) - Email/SMS notifications
- **Progress Service** (Port 3008) - Learning progress tracking
- **Content Service** (Port 3009) - Content management

### Infrastructure
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: RabbitMQ for inter-service communication
- **Cache**: Redis (configured but optional)
- **File Storage**: Local file system (with cloud-ready architecture)
- **Payment**: Stripe integration
- **Email**: SMTP with Nodemailer

## 📋 Prerequisites

### Required Software
- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **RabbitMQ** >= 3.11.x

### Optional Software
- **Redis** >= 7.x (for caching)
- **Docker** & **Docker Compose** (for containerized development)

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Environment Configuration
Copy and update environment variables:
```bash
cp .env.example .env
```

Update the following key variables in `.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/learning_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"

# Email (Configure with your SMTP provider)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed
```

### 4. Start Development Services

#### Option A: Manual Start (Recommended for Development)
```bash
# Start API Gateway (main entry point)
npm run start:dev
# Start API Gateway
yarn gateway:dev

# In separate terminals, start individual microservices as needed:
npm run microservice:auth
npm run microservice:course
npm run microservice:enrollment
npm run microservice:payment
npm run microservice:media
npm run microservice:notification
npm run microservice:progress
npm run microservice:user
npm run microservice:content
yarn user:dev
yarn course:dev
yarn enrollment:dev
yarn payment:dev
yarn notification:dev
yarn media:dev
```

#### Option B: Docker Compose (Full Stack)
```bash
# Start all services with Docker
npm run docker:up

# Stop all services
npm run docker:down
```

### 5. Verify Installation
```bash
# Test API endpoints
node test-api.js

# Check API documentation
# Open: http://localhost:3000/docs

# Health check
curl http://localhost:3000/health
```

## 🔧 Development Workflow

### Starting Services for Development

1. **Essential Services** (minimum required):
   ```bash
   npm run start:dev                 # API Gateway
   npm run microservice:auth         # Authentication
   npm run microservice:course       # Course management
   ```

2. **Full Development Stack**:
   ```bash
   # Terminal 1: API Gateway
   npm run start:dev
   
   # Terminal 2: Auth Service
   npm run microservice:auth
   
   # Terminal 3: Course Service
   npm run microservice:course
   
   # Terminal 4: Enrollment Service
   npm run microservice:enrollment
   
   # Add other services as needed...
   ```

### Database Operations
```bash
# View database in Prisma Studio
npm run prisma:studio

# Reset database (⚠️ Destructive)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy
```

### Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format

# Testing
npm run test
npm run test:e2e
npm run test:cov
```

## 📡 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /docs` - Swagger API documentation
- `GET /metrics` - Application metrics
- `GET /api/courses` - List all courses
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/enrollments/enroll/:courseId` - Enroll in course
- `GET /api/enrollments/my-courses` - Get user's enrolled courses
- `PUT /api/enrollments/:courseId/progress` - Update progress

### Protected Endpoints
All other endpoints require JWT authentication:
```bash
Authorization: Bearer <your_jwt_token>
```

### Example API Calls
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "USER"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Get courses (with authentication)
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔐 Authentication Flow

1. **Registration**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns JWT token
3. **Access Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Token Refresh**: `POST /api/auth/refresh` with refresh token

### User Roles
- **USER**: Regular learners, can enroll in courses
- **INSTRUCTOR**: Can create and manage courses
- **ADMIN**: Full platform access

## 💳 Payment Integration

### Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the dashboard
3. Update `.env` with your Stripe keys
4. Configure webhooks for payment events

### Payment Flow
1. User selects course(s) to purchase
2. `POST /api/payments/create-intent` - Create payment intent
3. Frontend handles Stripe payment
4. `POST /api/payments/confirm` - Confirm payment
5. User is automatically enrolled in course(s)

## 📧 Email Notifications

### SMTP Configuration
Configure email settings in `.env`:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"  # Use App Password for Gmail
```

### Email Templates
Built-in templates for:
- Welcome emails
- Course enrollment confirmations
- Payment confirmations
- Course completion certificates

## 📁 File Upload System

### Configuration
```env
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DEST="./uploads"
ALLOWED_FILE_TYPES="jpg,jpeg,png,pdf,mp4,mov,avi,doc,docx,ppt,pptx"
```

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP
- **Videos**: MP4, AVI, MOV
- **Documents**: PDF, DOC, DOCX, PPT, PPTX
- **Audio**: MP3, WAV, OGG

### Features
- Automatic image thumbnail generation
- File validation and virus scanning
- Metadata extraction
- Cloud storage ready (AWS S3, Google Cloud Storage)

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find and kill process using port 3000
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Database Connection Failed**
   ```bash
   # Verify PostgreSQL is running
   # Check DATABASE_URL in .env
   # Ensure database exists
   createdb learning_platform
   ```

3. **Prisma Client Issues**
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   
   # Reset and reapply migrations
   npx prisma migrate reset
   ```

4. **RabbitMQ Connection Failed**
   ```bash
   # Start RabbitMQ service
   # Windows: Start RabbitMQ from Services
   # macOS: brew services start rabbitmq
   # Linux: sudo systemctl start rabbitmq-server
   ```

5. **Email Sending Failed**
   - Verify SMTP credentials
   - Check if less secure app access is enabled (Gmail)
   - Use app-specific passwords for Gmail

### Logs and Debugging
```bash
# View application logs
npm run start:debug

# Enable verbose logging
DEBUG=* npm run start:dev

# Check service health
curl http://localhost:3000/health
```

## 📊 Monitoring and Observability

### Health Checks
- `GET /health` - Overall system health
- Individual service health endpoints
- Database connection status
- External service availability

### Metrics
- `GET /metrics` - Application metrics
- Request/response times
- Error rates
- Resource usage

### Correlation IDs
All requests include correlation IDs for tracing across services.

## 🧪 Testing

### Manual API Testing
```bash
# Run the included test script
node test-api.js
```

### Automated Testing
```bash
# Unit tests
npm run test

# Integration tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Postman Collection
Import the included Postman collection for comprehensive API testing.

## 🚀 Production Deployment

### Environment Preparation
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production database
4. Set up proper SMTP service
5. Configure real Stripe keys
6. Set up SSL certificates
7. Configure reverse proxy (nginx)

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Additional Resources

### Documentation
- API Documentation: http://localhost:3000/docs
- Database Schema: Open `prisma/schema.prisma`
- Architecture Diagrams: See `/docs` folder

### External Services
- [Stripe Documentation](https://stripe.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)

### Support
- Check GitHub Issues for common problems
- Review error logs for debugging
- Use the included test scripts for verification

---

## 🎯 Next Steps After Setup

1. **Create Admin User**: Register with role "ADMIN"
2. **Create Sample Course**: Use the course creation endpoints
3. **Test Payment Flow**: Create a test payment
4. **Configure Email Templates**: Customize notification templates
5. **Set Up File Uploads**: Test media upload functionality
6. **Configure SSL**: Set up HTTPS for production

Happy coding! 🚀
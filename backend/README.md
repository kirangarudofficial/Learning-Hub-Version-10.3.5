# Learning Platform Backend - NestJS Microservices

A comprehensive NestJS microservices architecture for a learning platform similar to Udemy/Coursera.

## 🏗️ Architecture Overview

### Microservices
- **API Gateway** (Port 3000) - Central entry point, authentication, routing
- **User Service** (Port 3001) - User management, profiles, authentication
- **Course Service** (Port 3002) - Course CRUD, curriculum, search
- **Enrollment Service** (Port 3003) - Student enrollments, progress tracking
- **Payment Service** (Port 3004) - Stripe integration, transactions
- **Notification Service** (Port 3005) - Email notifications, real-time alerts
- **Media Service** (Port 3006) - File uploads, video processing

### Technology Stack
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Message Queue**: RabbitMQ
- **Cache**: Redis
- **Payment**: Stripe
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)
- RabbitMQ (or use Docker)

### Local Development

1. **Clone and install dependencies:**
```bash
cd backend
yarn install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Generate Prisma client:**
```bash
npx prisma generate
```

4. **Start infrastructure with Docker Compose:**
```bash
docker-compose up -d postgres redis rabbitmq
```

5. **Run database migrations:**
```bash
npx prisma db push
```

6. **Start services in development:**
```bash
# Start API Gateway
yarn gateway:dev

# Start microservices (in separate terminals)
yarn user:dev
yarn course:dev
yarn enrollment:dev
yarn payment:dev
yarn notification:dev
yarn media:dev
```

### Docker Development

```bash
# Start all services
docker-compose up

# Build and start specific service
docker-compose up --build api-gateway
```

## 📡 API Documentation

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

#### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users` - Get all users (Admin only)

#### Courses
- `GET /api/courses` - Get all courses (with pagination)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)
- `GET /api/courses/category/:category` - Get courses by category

#### Enrollments
- `POST /api/enrollments/enroll/:courseId` - Enroll in course
- `GET /api/enrollments/my-courses` - Get user's enrolled courses
- `GET /api/enrollments/:courseId/progress` - Get course progress
- `PUT /api/enrollments/:courseId/progress` - Update progress

#### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook (public)

#### Media
- `POST /api/media/upload/single` - Upload single file
- `POST /api/media/upload/multiple` - Upload multiple files
- `POST /api/media/upload/video` - Upload video (Instructor/Admin)

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/learning_platform?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Message Queue
RABBITMQ_URL="amqp://localhost:5672"
```

## 🐳 Docker Deployment

### Build Images
```bash
# Build all services
docker-compose build

# Build specific service
docker build -f apps/api-gateway/Dockerfile -t learning-platform/api-gateway .
```

### Production Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl configured
- NGINX Ingress Controller

### Deploy to Kubernetes

1. **Create namespaces:**
```bash
kubectl apply -f k8s/namespaces.yaml
```

2. **Deploy infrastructure:**
```bash
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/rabbitmq.yaml
```

3. **Configure secrets and config:**
```bash
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmaps.yaml
```

4. **Deploy backend services:**
```bash
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/microservices.yaml
```

5. **Set up ingress:**
```bash
kubectl apply -f k8s/ingress.yaml
```

### Monitoring
```bash
# Check pod status
kubectl get pods -n backend

# Check service logs
kubectl logs -f deployment/api-gateway-deployment -n backend

# Check service health
kubectl port-forward service/api-gateway-service 3000:3000 -n backend
curl http://localhost:3000/api/health
```

## 🧪 Testing

### Unit Tests
```bash
yarn test
```

### E2E Tests
```bash
yarn test:e2e
```

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "password"}'

# Test courses endpoint
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer <your-token>"
```

## 📊 Monitoring & Logging

### Health Checks
- API Gateway: `GET /api/health`
- Detailed Health: `GET /api/health/detailed`

### Logs
```bash
# Docker logs
docker-compose logs -f api-gateway

# Kubernetes logs
kubectl logs -f deployment/api-gateway-deployment -n backend
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Example)
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build and Push Images
      run: |
        docker build -t learning-platform/api-gateway .
        docker push learning-platform/api-gateway
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/api-gateway-deployment \
          api-gateway=learning-platform/api-gateway:${{ github.sha }} \
          -n backend
```

## 🛠️ Development Guidelines

### Project Structure
```
backend/
├── apps/                 # Microservices
│   ├── api-gateway/     # API Gateway service
│   ├── user-service/    # User management service
│   ├── course-service/  # Course management service
│   └── ...
├── libs/                # Shared libraries
│   └── shared/          # Common utilities, DTOs, guards
├── k8s/                 # Kubernetes manifests
├── prisma/              # Database schema
└── docker-compose.yml   # Local development setup
```

### Code Style
- Use TypeScript strict mode
- Follow NestJS conventions
- Use Prisma for database operations
- Implement proper error handling
- Add unit tests for services

### Database Schema
The Prisma schema includes:
- **Users**: Authentication and profiles
- **Courses**: Course content and metadata
- **Enrollments**: Student-course relationships
- **Progress**: Learning progress tracking
- **Reviews**: Course reviews and ratings
- **Notes**: Student notes and timestamps

## 🤝 Contributing

1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request

## 📝 License

MIT License - see LICENSE file for details
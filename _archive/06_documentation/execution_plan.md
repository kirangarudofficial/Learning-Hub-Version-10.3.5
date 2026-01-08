# Learning Platform - Execution Plan

> **Last Updated**: January 8, 2026  
> **Version**: 1.0  
> **Status**: Active

---

## 📋 Table of Contents

1. [Getting Started Guide](#-getting-started-guide)
2. [Deployment Plan](#-deployment-plan)
3. [Post-Deployment Verification](#-post-deployment-verification)
4. [Rollback Procedures](#-rollback-procedures)
5. [Troubleshooting](#-troubleshooting)

---

## 🚀 Getting Started Guide

### Overview

This Learning Platform is an enterprise-grade e-learning system built with microservices architecture. It provides complete course management, user enrollment tracking, payment processing, and real-time notifications.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | Runtime environment |
| PostgreSQL | 13.x or higher | Primary database |
| Redis | 6.x or higher | Caching layer (optional) |
| RabbitMQ | 3.x or higher | Message queue for microservices |
| Yarn | Latest | Package manager |
| Docker | 20.x or higher | Container runtime (optional) |
| Docker Compose | 2.x or higher | Multi-container orchestration (optional) |

### Step 1: Clone and Setup Repository

```bash
# Clone the repository
git clone https://github.com/your-org/learning-platform.git
cd learning-platform

# Verify project structure
ls -la
# Expected: backend/, frontend/, README.md, LICENSE
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
yarn install

# Verify installation
yarn --version
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
```

**Required Environment Variables:**

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/learning_platform"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
JWT_EXPIRATION="24h"
JWT_ISSUER="learning-platform"
JWT_AUDIENCE="learning-platform-users"

# API Gateway
API_GATEWAY_PORT=3000
API_GATEWAY_HOST=0.0.0.0

# Microservices (Optional but recommended)
RABBITMQ_URL="amqp://localhost:5672"
REDIS_URL="redis://localhost:6379"

# Rate Limiting
THROTTLE_SHORT_LIMIT=10
THROTTLE_MEDIUM_LIMIT=20
THROTTLE_LONG_LIMIT=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DEST="./uploads"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment Integration (Optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Monitoring (Optional)
SENTRY_DSN="https://your-sentry-dsn"
```

#### 2.3 Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Verify migration success
npx prisma migrate status

# Seed the database with initial data (optional)
npx prisma db seed
```

#### 2.4 Verify Backend Installation

```bash
# Run backend tests
yarn test

# Start backend in development mode
yarn start:dev

# Backend should be running on:
# - API Gateway: http://localhost:3000
# - API Docs: http://localhost:3000/docs
# - Health Check: http://localhost:3000/health
```

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install all dependencies
yarn install
```

#### 3.2 Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
# Copy example environment file
cp .env.example .env

# Edit with your configuration
```

**Required Frontend Environment Variables:**

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
REACT_APP_BACKEND_URL=http://localhost:3000/api

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Third-party Services (Optional)
VITE_GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
VITE_SENTRY_DSN="https://your-frontend-sentry-dsn"
```

#### 3.3 Start Frontend Development Server

```bash
# Start development server
yarn dev

# Frontend should be running on:
# http://localhost:5173
```

### Step 4: Access the Platform

Once both backend and frontend are running:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend Application | http://localhost:5173 | Main user interface |
| API Documentation | http://localhost:3000/docs | Interactive Swagger docs |
| API Gateway | http://localhost:3000/api | REST API endpoints |
| Health Check | http://localhost:3000/health | System health status |
| Metrics | http://localhost:3000/metrics | Performance metrics |

### Step 5: Test User Registration

1. **Navigate to the frontend**: http://localhost:5173
2. **Register a new user**:
   - Click "Sign Up" or "Register"
   - Fill in the registration form
   - Submit and verify email (if email is configured)
3. **Login with your credentials**
4. **Explore the platform**:
   - Browse available courses
   - Enroll in a course
   - Track your progress

### Step 6: API Testing

Test the API using the interactive documentation:

```bash
# Open Swagger docs
http://localhost:3000/docs

# Test authentication endpoint
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}

# Get courses (with JWT token)
GET /api/courses
Authorization: Bearer <your_jwt_token>
```

### Common Use Cases

#### As a Student:
1. Register and complete profile
2. Browse course catalog
3. Enroll in courses
4. Complete lessons and track progress
5. Download completion certificates

#### As an Instructor:
1. Register with instructor role
2. Create new courses
3. Add modules and lessons
4. Upload course materials
5. Monitor student progress

#### As an Administrator:
1. Manage users and roles
2. Monitor platform analytics
3. Configure system settings
4. Review and approve courses

---

## 🚢 Deployment Plan

### Deployment Overview

This plan covers multiple deployment scenarios:
- **Development**: Local development with hot-reload
- **Docker**: Containerized deployment for consistency
- **Kubernetes**: Production-grade orchestration
- **Cloud Platforms**: AWS, Azure, GCP deployment

---

### Phase 1: Pre-Deployment Preparation

#### 1.1 Code Review and Testing

```bash
# Run all backend tests
cd backend
yarn test
yarn test:e2e

# Run all frontend tests
cd frontend
yarn test
yarn test:e2e

# Check test coverage (should be >80%)
yarn test:cov
```

#### 1.2 Security Audit

```bash
# Check for vulnerabilities
cd backend
npm audit
yarn audit

cd frontend
npm audit
yarn audit

# Fix vulnerabilities
npm audit fix
yarn audit fix
```

#### 1.3 Build Verification

```bash
# Build backend
cd backend
yarn build

# Verify build output
ls -la dist/

# Build frontend
cd frontend
yarn build

# Verify build output
ls -la dist/
```

#### 1.4 Environment Preparation Checklist

- [ ] Production environment variables configured
- [ ] SSL certificates obtained
- [ ] Database backup created
- [ ] DNS records configured
- [ ] Monitoring tools setup
- [ ] CI/CD pipelines tested
- [ ] Security scanning completed
- [ ] Performance testing done
- [ ] Load testing completed
- [ ] Documentation updated

---

### Phase 2: Docker Deployment

#### 2.1 Build Docker Images

**Backend Dockerfile** (`backend/Dockerfile`):

```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN yarn build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies only
RUN yarn install --production --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose API port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["yarn", "start:prod"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production stage with Nginx
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2.2 Docker Compose Setup

**docker-compose.yml** (Root directory):

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: learning_platform_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: learning_platform
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - learning_platform_network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: learning_platform_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - learning_platform_network

  # RabbitMQ Message Queue
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: learning_platform_rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5
    networks:
      - learning_platform_network

  # Backend API Gateway
  api-gateway:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: learning_platform_api
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/learning_platform
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://admin:${RABBITMQ_PASSWORD}@rabbitmq:5672
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - learning_platform_network
    volumes:
      - ./backend/uploads:/app/uploads

  # Frontend Application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: learning_platform_frontend
    ports:
      - "80:80"
    depends_on:
      - api-gateway
    networks:
      - learning_platform_network

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:

networks:
  learning_platform_network:
    driver: bridge
```

#### 2.3 Deploy with Docker Compose

```bash
# Create .env file with required secrets
cat > .env << EOF
DB_PASSWORD=your_secure_db_password
RABBITMQ_PASSWORD=your_secure_rabbitmq_password
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
EOF

# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Stop all services
docker-compose down

# Stop and remove all data (CAUTION)
docker-compose down -v
```

#### 2.4 Verify Docker Deployment

```bash
# Check health of all services
docker-compose ps

# Test database connection
docker exec -it learning_platform_db psql -U postgres -d learning_platform -c "SELECT version();"

# Test Redis connection
docker exec -it learning_platform_redis redis-cli ping

# Test RabbitMQ
curl http://localhost:15672

# Test API Gateway
curl http://localhost:3000/health

# Test Frontend
curl http://localhost:80
```

---

### Phase 3: Kubernetes Deployment

#### 3.1 Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client

# Install Helm (optional but recommended)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

#### 3.2 Kubernetes Configuration Files

**Namespace** (`k8s/namespace.yaml`):

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: learning-platform
  labels:
    name: learning-platform
```

**ConfigMap** (`k8s/configmap.yaml`):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: learning-platform-config
  namespace: learning-platform
data:
  API_GATEWAY_PORT: "3000"
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  THROTTLE_SHORT_LIMIT: "10"
  THROTTLE_MEDIUM_LIMIT: "20"
  THROTTLE_LONG_LIMIT: "100"
```

**Secrets** (`k8s/secrets.yaml`):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: learning-platform-secrets
  namespace: learning-platform
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:password@postgres-service:5432/learning_platform"
  JWT_SECRET: "your-super-secret-jwt-key-minimum-32-characters"
  REDIS_URL: "redis://redis-service:6379"
  RABBITMQ_URL: "amqp://admin:password@rabbitmq-service:5672"
```

**PostgreSQL Deployment** (`k8s/postgres-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: learning-platform
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: "learning_platform"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: learning-platform-secrets
              key: DB_PASSWORD
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: learning-platform
spec:
  selector:
    app: postgres
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
  type: ClusterIP
```

**Backend API Deployment** (`k8s/api-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learning-platform-api
  namespace: learning-platform
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
        image: your-registry/learning-platform-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: learning-platform-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: learning-platform-secrets
              key: DATABASE_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: learning-platform-secrets
              key: JWT_SECRET
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: learning-platform-secrets
              key: REDIS_URL
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: learning-platform
spec:
  selector:
    app: learning-platform-api
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: LoadBalancer
```

**Frontend Deployment** (`k8s/frontend-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learning-platform-frontend
  namespace: learning-platform
spec:
  replicas: 2
  selector:
    matchLabels:
      app: learning-platform-frontend
  template:
    metadata:
      labels:
        app: learning-platform-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/learning-platform-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: learning-platform
spec:
  selector:
    app: learning-platform-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

**Ingress Configuration** (`k8s/ingress.yaml`):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: learning-platform-ingress
  namespace: learning-platform
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - yourplatform.com
    - api.yourplatform.com
    secretName: learning-platform-tls
  rules:
  - host: yourplatform.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
  - host: api.yourplatform.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 3000
```

#### 3.3 Deploy to Kubernetes

```bash
# Apply namespace
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMaps and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy Database
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml

# Deploy Redis
kubectl apply -f k8s/redis-deployment.yaml

# Deploy RabbitMQ
kubectl apply -f k8s/rabbitmq-deployment.yaml

# Wait for infrastructure to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n learning-platform --timeout=300s

# Run database migrations
kubectl exec -it deployment/postgres -n learning-platform -- psql -U postgres -d learning_platform -f /migrations/init.sql

# Deploy Backend API
kubectl apply -f k8s/api-deployment.yaml

# Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Apply Ingress
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get all -n learning-platform
```

#### 3.4 Verify Kubernetes Deployment

```bash
# Check all pods are running
kubectl get pods -n learning-platform

# Check services
kubectl get services -n learning-platform

# Check ingress
kubectl get ingress -n learning-platform

# View logs
kubectl logs -f deployment/learning-platform-api -n learning-platform

# Check pod health
kubectl describe pod <pod-name> -n learning-platform

# Test API from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- curl http://api-service:3000/health
```

---

### Phase 4: Cloud Platform Deployment

#### 4.1 AWS Deployment with EKS

```bash
# Install eksctl
curl --silent --location "https://github.com/weksctl/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create EKS cluster
eksctl create cluster \
  --name learning-platform \
  --version 1.28 \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 5 \
  --managed

# Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name learning-platform

# Deploy to EKS
kubectl apply -f k8s/

# Create RDS instance for production database
aws rds create-db-instance \
  --db-instance-identifier learning-platform-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourSecurePassword \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx

# Create ElastiCache for Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id learning-platform-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1

# Setup Application Load Balancer
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.6.0/docs/install/iam_policy.json
```

#### 4.2 Azure Deployment with AKS

```bash
# Create resource group
az group create --name learning-platform-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group learning-platform-rg \
  --name learning-platform-aks \
  --node-count 3 \
  --node-vm-size Standard_D2s_v3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group learning-platform-rg --name learning-platform-aks

# Deploy application
kubectl apply -f k8s/

# Create Azure Database for PostgreSQL
az postgres server create \
  --resource-group learning-platform-rg \
  --name learning-platform-db \
  --sku-name B_Gen5_1 \
  --storage-size 51200 \
  --admin-user postgres \
  --admin-password YourSecurePassword
```

#### 4.3 GCP Deployment with GKE

```bash
# Create GKE cluster
gcloud container clusters create learning-platform \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --region=us-central1

# Get credentials
gcloud container clusters get-credentials learning-platform --region=us-central1

# Deploy application
kubectl apply -f k8s/

# Create Cloud SQL instance
gcloud sql instances create learning-platform-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

---

### Phase 5: Production Deployment Checklist

#### 5.1 Pre-Deployment Verification

- [ ] All tests passing (unit, integration, E2E)
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Load testing completed
- [ ] Database migrations tested
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Alerting rules set up
- [ ] SSL certificates installed
- [ ] DNS records configured
- [ ] Rate limiting configured
- [ ] WAF rules configured (if applicable)

#### 5.2 Deployment Steps

```bash
# 1. Create database backup
pg_dump -U postgres learning_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run database migrations
npx prisma migrate deploy

# 3. Build and tag Docker images
docker build -t your-registry/learning-platform-api:v1.0.0 ./backend
docker build -t your-registry/learning-platform-frontend:v1.0.0 ./frontend

# 4. Push images to registry
docker push your-registry/learning-platform-api:v1.0.0
docker push your-registry/learning-platform-frontend:v1.0.0

# 5. Apply Kubernetes manifests
kubectl apply -f k8s/

# 6. Monitor deployment
kubectl rollout status deployment/learning-platform-api -n learning-platform
kubectl rollout status deployment/learning-platform-frontend -n learning-platform

# 7. Verify health checks
kubectl get pods -n learning-platform
curl https://api.yourplatform.com/health
```

#### 5.3 Post-Deployment Verification

- [ ] All pods running successfully
- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Frontend accessible
- [ ] Database connections working
- [ ] Redis cache working
- [ ] Message queue functional
- [ ] SSL/TLS working
- [ ] Monitoring data flowing
- [ ] Logs being collected
- [ ] Alerts configured
- [ ] Performance metrics normal

---

## ✅ Post-Deployment Verification

### Automated Health Checks

Create a health check script (`scripts/health-check.sh`):

```bash
#!/bin/bash

echo "=== Learning Platform Health Check ==="

# Check API Gateway
echo "Checking API Gateway..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ $API_STATUS -eq 200 ]; then
  echo "✅ API Gateway: Healthy"
else
  echo "❌ API Gateway: Unhealthy (Status: $API_STATUS)"
  exit 1
fi

# Check Frontend
echo "Checking Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)
if [ $FRONTEND_STATUS -eq 200 ]; then
  echo "✅ Frontend: Healthy"
else
  echo "❌ Frontend: Unhealthy (Status: $FRONTEND_STATUS)"
  exit 1
fi

# Check Database
echo "Checking Database..."
docker exec learning_platform_db psql -U postgres -d learning_platform -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Database: Healthy"
else
  echo "❌ Database: Unhealthy"
  exit 1
fi

# Check Redis
echo "Checking Redis..."
REDIS_STATUS=$(docker exec learning_platform_redis redis-cli ping)
if [ "$REDIS_STATUS" == "PONG" ]; then
  echo "✅ Redis: Healthy"
else
  echo "❌ Redis: Unhealthy"
  exit 1
fi

echo ""
echo "=== All Systems Operational ==="
```

### Manual Verification Tests

#### Test 1: User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Test 2: User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### Test 3: Get Courses

```bash
curl -X GET http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Performance Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test API performance (1000 requests, 10 concurrent)
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/courses

# Test frontend performance
ab -n 1000 -c 10 http://localhost:80/
```

---

## 🔄 Rollback Procedures

### Quick Rollback (Kubernetes)

```bash
# Rollback API deployment
kubectl rollout undo deployment/learning-platform-api -n learning-platform

# Rollback Frontend deployment
kubectl rollout undo deployment/learning-platform-frontend -n learning-platform

# Check rollback status
kubectl rollout status deployment/learning-platform-api -n learning-platform
```

### Database Rollback

```bash
# Restore from backup
psql -U postgres -d learning_platform < backup_YYYYMMDD_HHMMSS.sql

# Rollback specific migration
npx prisma migrate resolve --rolled-back "migration_name"
```

### Docker Rollback

```bash
# Stop current containers
docker-compose down

# Checkout previous version
git checkout tags/v1.0.0

# Rebuild and deploy
docker-compose build
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Database Connection Failed

**Symptoms:**
- API returns 500 errors
- Logs show "Connection refused" or "Connection timeout"

**Solutions:**
```bash
# Check database is running
docker ps | grep postgres

# Check database logs
docker logs learning_platform_db

# Test database connection
docker exec -it learning_platform_db psql -U postgres -d learning_platform -c "SELECT version();"

# Verify DATABASE_URL in .env
cat backend/.env | grep DATABASE_URL

# Restart database
docker-compose restart postgres
```

#### Issue 2: Frontend Cannot Connect to API

**Symptoms:**
- Frontend shows "Network Error"
- CORS errors in browser console

**Solutions:**
```bash
# Check API is running
curl http://localhost:3000/health

# Verify VITE_API_URL in frontend/.env
cat frontend/.env | grep VITE_API_URL

# Check CORS configuration in backend
# Ensure CORS_ORIGIN includes frontend URL

# Restart both services
docker-compose restart api-gateway frontend
```

#### Issue 3: Pod CrashLoopBackOff (Kubernetes)

**Symptoms:**
- Pod keeps restarting
- `kubectl get pods` shows CrashLoopBackOff status

**Solutions:**
```bash
# View pod logs
kubectl logs <pod-name> -n learning-platform

# Describe pod for events
kubectl describe pod <pod-name> -n learning-platform

# Check resource limits
kubectl top pods -n learning-platform

# Common fixes:
# 1. Increase memory/CPU limits
# 2. Fix environment variables
# 3. Ensure dependencies are ready
```

#### Issue 4: Slow Performance

**Symptoms:**
- API responses are slow
- High CPU/memory usage

**Solutions:**
```bash
# Check resource usage
docker stats

# For Kubernetes
kubectl top pods -n learning-platform
kubectl top nodes

# Check database performance
docker exec -it learning_platform_db psql -U postgres -d learning_platform -c "SELECT * FROM pg_stat_activity;"

# Enable query logging
# Check slow queries
# Add database indexes
# Implement caching
```

#### Issue 5: Failed Migrations

**Symptoms:**
- Database schema out of sync
- Migration errors

**Solutions:**
```bash
# Check migration status
npx prisma migrate status

# Reset database (DEVELOPMENT ONLY)
npx prisma migrate reset

# Mark migration as applied manually
npx prisma migrate resolve --applied "migration_name"

# Rollback and reapply
npx prisma migrate resolve --rolled-back "migration_name"
npx prisma migrate deploy
```

### Logging and Debugging

```bash
# View all container logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api-gateway

# For Kubernetes
kubectl logs -f deployment/learning-platform-api -n learning-platform

# View logs from all pods
kubectl logs -f -l app=learning-platform-api -n learning-platform

# Enable debug logging
# Set LOG_LEVEL=debug in .env
```

### Support Contacts

- **Technical Support**: support@yourplatform.com
- **Emergency Hotline**: +1-XXX-XXX-XXXX
- **Documentation**: https://docs.yourplatform.com
- **Status Page**: https://status.yourplatform.com

---

## 📊 Monitoring and Maintenance

### Monitoring Setup

```bash
# Install Prometheus
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# Install Grafana
kubectl apply -f k8s/grafana-deployment.yaml

# Access Grafana dashboard
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

### Regular Maintenance Tasks

| Task | Frequency | Command |
|------|-----------|---------|
| Database Backup | Daily | `pg_dump learning_platform > backup.sql` |
| Log Rotation | Weekly | `docker-compose logs --tail=1000 > logs.txt` |
| Security Updates | Monthly | `yarn audit && npm audit` |
| Performance Review | Monthly | Review metrics in Grafana |
| Dependency Updates | Quarterly | `yarn upgrade-interactive` |

---

## 📝 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial execution plan created |

---

## 📚 Additional Resources

- [API Documentation](http://localhost:3000/docs)
- [Architecture Overview](./ARCHITECTURE_SUMMARY.md)
- [Security Guidelines](./SECURITY.md)
- [Development Setup](../backend/DEVELOPMENT_SETUP.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

**Document Status**: ✅ Active  
**Last Reviewed**: January 8, 2026  
**Next Review**: April 8, 2026

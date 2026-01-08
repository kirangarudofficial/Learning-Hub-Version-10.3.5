# Service Port Mapping Registry

This document defines the standard port assignments for all microservices in the Learning Hub platform.

## Port Assignments

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| **API Gateway** | 3000 | HTTP | Main entry point for all client requests |
| **User Service** | 3001 | RabbitMQ | User management and profiles |
| **Auth Service** | 3002 | RabbitMQ + HTTP | Authentication and authorization (dual mode) |
| **Course Service** | 3003 | RabbitMQ | Course CRUD and content management |
| **Enrollment Service** | 3004 | RabbitMQ | Student enrollments and progress |
| **Payment Service** | 3005 | RabbitMQ | Stripe integration and payments |
| **Media Service** | 3006 | RabbitMQ | File uploads and media processing |
| **Notification Service** | 3007 | RabbitMQ | Email and push notifications |
| **Progress Service** | 3008 | RabbitMQ | Learning progress tracking |
| **Content Service** | 3009 | RabbitMQ | Learning content management |
| **Assessment Service** | 3010 | RabbitMQ | Quizzes and assignments |
| **Review Service** | 3011 | RabbitMQ | Course reviews and ratings |
| **Certificate Service** | 3012 | RabbitMQ | Certificate generation |
| **Gamification Service** | 3013 | RabbitMQ | Badges, points, leaderboards |
| **Admin Service** | 3014 | RabbitMQ | Admin operations |

## Infrastructure Services

| Service | Port | Purpose |
|---------|------|---------|
| **PostgreSQL** | 5432 | Primary database |
| **Redis** | 6379 | Caching and sessions |
| **RabbitMQ** | 5672 | Message queue (AMQP) |
| **RabbitMQ Management** | 15672 | RabbitMQ admin UI |

## Important Notes

1. **API Gateway Only**: Only the API Gateway (port 3000) should be exposed to external clients
2. **Microservices**: All other services communicate via RabbitMQ and should not be publicly accessible
3. **Auth Service**: Special case - runs both RabbitMQ listener and HTTP server for backward compatibility (consider refactoring)
4. **Development**: These ports are for local development. In production (EKS), use service discovery instead of hardcoded ports
5. **Docker Compose**: Always update `docker-compose.yml` when changing port assignments
6. **Environment Files**: Keep `.env` aligned with these port assignments

## Configuration Files to Update

When changing port assignments, update all of these files:
- ✅ `backend/.env` - Environment variables
- ✅ `backend/docker-compose.yml` - Docker service definitions
- ✅ `backend/k8s/*.yaml` - Kubernetes manifests (production)
- ✅ `README.md` - Documentation
- ✅ This file (`PORT_MAPPING.md`)

## Recent Changes

- **2026-01-07**: Fixed port inconsistencies
  - Course Service: 3002 → 3003
  - Auth Service: 3010 → 3002
  - Enrollment Service: 3003 → 3004
  - Payment Service: 3004 → 3005
  - Notification Service: 3005 → 3007

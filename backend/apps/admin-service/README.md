# Admin Service

The Admin Service provides backend management capabilities for the Learning Hub platform. It enables administrators to manage users, courses, content moderation, analytics, and platform settings.

## Features

- User management (CRUD operations, role assignments)
- Course management and moderation
- Content approval workflows
- Platform analytics and reporting
- System settings and configuration
- Financial oversight and reporting

## API Endpoints

### Admin User Management

- `GET /admin/users` - List all users with pagination and filtering
- `GET /admin/users/:id` - Get detailed user information
- `PUT /admin/users/:id` - Update user information
- `DELETE /admin/users/:id` - Delete a user
- `PUT /admin/users/:id/role` - Update user role

### Admin Course Management

- `GET /admin/courses` - List all courses with pagination and filtering
- `GET /admin/courses/:id` - Get detailed course information
- `PUT /admin/courses/:id` - Update course information
- `DELETE /admin/courses/:id` - Delete a course
- `PUT /admin/courses/:id/status` - Update course status (published, draft, archived)
- `GET /admin/courses/pending` - List courses pending approval

### Admin Analytics

- `GET /admin/analytics/users` - User registration and activity metrics
- `GET /admin/analytics/courses` - Course enrollment and completion metrics
- `GET /admin/analytics/revenue` - Revenue and financial metrics
- `GET /admin/analytics/platform` - Platform usage and performance metrics

### Admin Settings

- `GET /admin/settings` - Get platform settings
- `PUT /admin/settings` - Update platform settings

### Microservice Message Patterns

- `admin.users.list` - List users with filters
- `admin.users.get` - Get user details
- `admin.users.update` - Update user
- `admin.users.delete` - Delete user
- `admin.courses.list` - List courses with filters
- `admin.courses.get` - Get course details
- `admin.courses.update` - Update course
- `admin.courses.delete` - Delete course
- `admin.analytics.get` - Get analytics data

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | HTTP port for the service | `3090` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `RABBITMQ_URL` | RabbitMQ connection string | - |

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (create a `.env` file in the root directory)

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Start the service:
   ```bash
   npm run start:dev admin-service
   ```

## Docker Build and Run

```bash
# Build the Docker image
docker build -t learning-hub/admin-service -f apps/admin-service/Dockerfile .

# Run the container
docker run -p 3090:3090 --env-file .env learning-hub/admin-service
```

## Kubernetes Deployment

```bash
# Apply ConfigMap and Secrets first (create these separately)
kubectl apply -f apps/admin-service/k8s/secrets.yaml

# Apply the deployment
kubectl apply -f apps/admin-service/k8s/deployment.yaml
```

## Testing

```bash
# Run unit tests
npm run test admin-service

# Run e2e tests
npm run test:e2e admin-service
```
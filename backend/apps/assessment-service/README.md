# Assessment Service

The Assessment Service manages all types of assessments (quizzes, exams, assignments) for the Learning Hub platform. It handles assessment creation, submission, grading, and analytics.

## Features

- Multiple assessment types (quizzes, exams, assignments)
- Question bank management
- Automated grading for objective questions
- Manual grading for subjective questions
- Time-limited assessments
- Assessment analytics and reporting
- Certificate generation triggers

## API Endpoints

### Assessment Management

- `POST /assessments` - Create a new assessment
- `GET /assessments` - List assessments with pagination and filtering
- `GET /assessments/:id` - Get assessment details
- `PUT /assessments/:id` - Update assessment
- `DELETE /assessments/:id` - Delete assessment
- `PUT /assessments/:id/status` - Update assessment status (draft, published, archived)

### Question Management

- `POST /assessments/:id/questions` - Add question to assessment
- `GET /assessments/:id/questions` - List questions for an assessment
- `PUT /assessments/:id/questions/:questionId` - Update question
- `DELETE /assessments/:id/questions/:questionId` - Remove question

### Attempt Management

- `POST /assessments/:id/attempts` - Start an assessment attempt
- `PUT /assessments/:id/attempts/:attemptId` - Submit answers for an attempt
- `GET /assessments/:id/attempts/:attemptId` - Get attempt details
- `GET /assessments/:id/attempts` - List attempts for an assessment

### Grading

- `POST /assessments/:id/attempts/:attemptId/grade` - Grade an attempt (manual or auto)
- `PUT /assessments/:id/attempts/:attemptId/feedback` - Provide feedback on an attempt

### Analytics

- `GET /assessments/:id/analytics` - Get assessment analytics
- `GET /assessments/:id/questions/:questionId/analytics` - Get question analytics

### Microservice Message Patterns

- `assessment.create` - Create assessment
- `assessment.get` - Get assessment details
- `assessment.update` - Update assessment
- `assessment.delete` - Delete assessment
- `assessment.attempt.start` - Start assessment attempt
- `assessment.attempt.submit` - Submit assessment attempt
- `assessment.attempt.grade` - Grade assessment attempt
- `assessment.analytics.get` - Get assessment analytics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | HTTP port for the service | `3070` |
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
   npm run start:dev assessment-service
   ```

## Docker Build and Run

```bash
# Build the Docker image
docker build -t learning-hub/assessment-service -f apps/assessment-service/Dockerfile .

# Run the container
docker run -p 3070:3070 --env-file .env learning-hub/assessment-service
```

## Kubernetes Deployment

```bash
# Apply ConfigMap and Secrets first (create these separately)
kubectl apply -f apps/assessment-service/k8s/secrets.yaml

# Apply the deployment
kubectl apply -f apps/assessment-service/k8s/deployment.yaml
```

## Testing

```bash
# Run unit tests
npm run test assessment-service

# Run e2e tests
npm run test:e2e assessment-service
```
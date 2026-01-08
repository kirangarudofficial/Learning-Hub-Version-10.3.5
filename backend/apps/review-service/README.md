# Review Service

The Review Service manages course ratings, reviews, and testimonials for the Learning Hub platform. It enables users to provide feedback on courses and instructors.

## Features

- Course ratings and reviews
- Instructor ratings and reviews
- Review moderation and reporting
- Helpful/unhelpful votes on reviews
- Featured testimonials
- Review analytics

## API Endpoints

### Review Management

- `POST /reviews` - Create a new review
- `GET /reviews` - List reviews with pagination and filtering
- `GET /reviews/:id` - Get review details
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Course Reviews

- `GET /reviews/courses/:courseId` - Get reviews for a specific course
- `GET /reviews/courses/:courseId/summary` - Get review summary for a course

### Instructor Reviews

- `GET /reviews/instructors/:instructorId` - Get reviews for a specific instructor
- `GET /reviews/instructors/:instructorId/summary` - Get review summary for an instructor

### Review Moderation

- `PUT /reviews/:id/status` - Update review status (published, pending, rejected)
- `POST /reviews/:id/report` - Report a review
- `GET /reviews/reported` - Get reported reviews

### Review Voting

- `POST /reviews/:id/vote` - Vote on a review (helpful/unhelpful)
- `GET /reviews/:id/votes` - Get votes for a review

### Testimonials

- `GET /testimonials` - Get featured testimonials
- `PUT /reviews/:id/feature` - Feature a review as testimonial

### Microservice Message Patterns

- `review.create` - Create review
- `review.get` - Get review details
- `review.update` - Update review
- `review.delete` - Delete review
- `review.course.summary` - Get course review summary
- `review.instructor.summary` - Get instructor review summary

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | HTTP port for the service | `3060` |
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
   npm run start:dev review-service
   ```

## Docker Build and Run

```bash
# Build the Docker image
docker build -t learning-hub/review-service -f apps/review-service/Dockerfile .

# Run the container
docker run -p 3060:3060 --env-file .env learning-hub/review-service
```

## Kubernetes Deployment

```bash
# Apply ConfigMap and Secrets first (create these separately)
kubectl apply -f apps/review-service/k8s/secrets.yaml

# Apply the deployment
kubectl apply -f apps/review-service/k8s/deployment.yaml
```

## Testing

```bash
# Run unit tests
npm run test review-service

# Run e2e tests
npm run test:e2e review-service
```
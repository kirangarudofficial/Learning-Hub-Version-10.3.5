# Certificate Service

The Certificate Service manages course completion certificates for the Learning Hub platform. It handles certificate generation, verification, and management.

## Features

- Certificate generation for course completion
- Certificate templates and customization
- Certificate verification system
- Certificate sharing options
- Certificate analytics

## API Endpoints

### Certificate Management

- `POST /certificates` - Generate a new certificate
- `GET /certificates` - List certificates with pagination and filtering
- `GET /certificates/:id` - Get certificate details
- `DELETE /certificates/:id` - Revoke/delete certificate

### User Certificates

- `GET /certificates/users/:userId` - Get certificates for a specific user
- `GET /certificates/courses/:courseId/users/:userId` - Get user's certificate for a specific course

### Certificate Verification

- `GET /certificates/:id/verify` - Verify certificate authenticity
- `GET /certificates/verify/:verificationCode` - Verify certificate by verification code

### Certificate Templates

- `GET /certificates/templates` - List certificate templates
- `GET /certificates/templates/:id` - Get template details
- `POST /certificates/templates` - Create a new template
- `PUT /certificates/templates/:id` - Update template
- `DELETE /certificates/templates/:id` - Delete template

### Certificate Sharing

- `POST /certificates/:id/share` - Generate sharing link for certificate
- `GET /certificates/shared/:shareCode` - View shared certificate

### Microservice Message Patterns

- `certificate.generate` - Generate certificate
- `certificate.get` - Get certificate details
- `certificate.verify` - Verify certificate
- `certificate.user.list` - List user certificates
- `certificate.course.check` - Check if user has certificate for course

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | HTTP port for the service | `3050` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `RABBITMQ_URL` | RabbitMQ connection string | - |
| `STORAGE_BUCKET` | Cloud storage bucket for certificates | - |

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
   npm run start:dev certificate-service
   ```

## Docker Build and Run

```bash
# Build the Docker image
docker build -t learning-hub/certificate-service -f apps/certificate-service/Dockerfile .

# Run the container
docker run -p 3050:3050 --env-file .env learning-hub/certificate-service
```

## Kubernetes Deployment

```bash
# Apply ConfigMap and Secrets first (create these separately)
kubectl apply -f apps/certificate-service/k8s/secrets.yaml

# Apply the deployment
kubectl apply -f apps/certificate-service/k8s/deployment.yaml
```

## Testing

```bash
# Run unit tests
npm run test certificate-service

# Run e2e tests
npm run test:e2e certificate-service
```
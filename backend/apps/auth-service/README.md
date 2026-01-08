# Auth Service

The Auth Service is responsible for user authentication and authorization in the Learning Hub platform. It handles user registration, login, token management, OAuth integration, and password reset functionality.

## Features

- User registration and login
- JWT token issuance and verification
- Refresh token management
- OAuth integration (Google)
- Password reset functionality
- Role-based access control integration

## API Endpoints

### Public Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate a user and receive tokens
- `POST /auth/refresh` - Refresh an access token using a refresh token
- `POST /auth/logout` - Invalidate tokens
- `GET /auth/oauth/:provider` - Initiate OAuth flow with a provider
- `GET /auth/oauth/:provider/callback` - OAuth provider callback
- `POST /auth/password-reset/request` - Request a password reset
- `POST /auth/password-reset` - Reset password with token

### Microservice Message Patterns

- `auth.validateToken` - Validate a JWT token
- `auth.getUserFromToken` - Get user information from a token

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | HTTP port for the service | `3010` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret for signing JWT tokens | - |
| `JWT_EXPIRATION` | JWT token expiration time in seconds | `3600` |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiration time in seconds | `604800` |
| `RABBITMQ_URL` | RabbitMQ connection string | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | - |

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

4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the service:
   ```bash
   npm run start:dev auth-service
   ```

## Docker Build and Run

```bash
# Build the Docker image
docker build -t learning-hub/auth-service -f apps/auth-service/Dockerfile .

# Run the container
docker run -p 3010:3010 --env-file .env learning-hub/auth-service
```

## Kubernetes Deployment

```bash
# Apply ConfigMap and Secrets first (create these separately)
kubectl apply -f apps/auth-service/k8s/secrets.yaml

# Apply the deployment
kubectl apply -f apps/auth-service/k8s/deployment.yaml
```

## Testing

```bash
# Run unit tests
npm run test auth-service

# Run e2e tests
npm run test:e2e auth-service
```
# Gamification Service

The Gamification Service manages engagement features like XP, badges, achievements, and leaderboards for the Learning Hub platform. It helps increase user motivation and retention through game-like elements.

## Features

- Experience points (XP) system
- Levels and progression
- Badges and achievements
- Leaderboards (global, course-specific)
- Streaks and milestones
- Activity rewards

## API Endpoints

### XP Management

- `GET /gamification/users/:userId/xp` - Get user XP details
- `POST /gamification/users/:userId/xp` - Award XP to user
- `GET /gamification/users/:userId/level` - Get user level information

### Badge Management

- `GET /gamification/badges` - List all available badges
- `GET /gamification/users/:userId/badges` - List user's earned badges
- `POST /gamification/users/:userId/badges/:badgeId` - Award badge to user

### Achievement Management

- `GET /gamification/achievements` - List all achievements
- `GET /gamification/users/:userId/achievements` - List user's achievements
- `POST /gamification/users/:userId/achievements` - Record new achievement

### Leaderboard Management

- `GET /gamification/leaderboards` - List available leaderboards
- `GET /gamification/leaderboards/:id` - Get specific leaderboard
- `GET /gamification/leaderboards/:id/users/:userId` - Get user's position on leaderboard

### Streak Management

- `GET /gamification/users/:userId/streak` - Get user's current streak
- `POST /gamification/users/:userId/streak/increment` - Increment user's streak
- `POST /gamification/users/:userId/streak/reset` - Reset user's streak

### Microservice Message Patterns

- `gamification.xp.award` - Award XP to user
- `gamification.badge.award` - Award badge to user
- `gamification.achievement.record` - Record achievement
- `gamification.streak.increment` - Increment streak
- `gamification.leaderboard.update` - Update leaderboard
- `gamification.user.progress` - Get user's gamification progress

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | HTTP port for the service | `3080` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `RABBITMQ_URL` | RabbitMQ connection string | - |
| `REDIS_URL` | Redis connection string (for leaderboards) | - |

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
   npm run start:dev gamification-service
   ```

## Docker Build and Run

```bash
# Build the Docker image
docker build -t learning-hub/gamification-service -f apps/gamification-service/Dockerfile .

# Run the container
docker run -p 3080:3080 --env-file .env learning-hub/gamification-service
```

## Kubernetes Deployment

```bash
# Apply ConfigMap and Secrets first (create these separately)
kubectl apply -f apps/gamification-service/k8s/secrets.yaml

# Apply the deployment
kubectl apply -f apps/gamification-service/k8s/deployment.yaml
```

## Testing

```bash
# Run unit tests
npm run test gamification-service

# Run e2e tests
npm run test:e2e gamification-service
```
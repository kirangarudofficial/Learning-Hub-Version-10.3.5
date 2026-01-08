# Multi-stage build for Auth Service

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build auth-service

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files and install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist/apps/auth-service ./dist

# Copy necessary configuration files
COPY --from=build /app/nest-cli.json ./

# Expose the port the app runs on
EXPOSE 3010

# Command to run the application
CMD ["node", "dist/main.js"]
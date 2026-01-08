FROM node:18-alpine

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

# Build the application
RUN yarn build api-gateway

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/main"]
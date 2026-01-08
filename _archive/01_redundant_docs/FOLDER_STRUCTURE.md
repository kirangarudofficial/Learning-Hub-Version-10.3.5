# Project Folder Structure

This document provides an overview of the project's folder structure, focusing on the NestJS backend. A clear and consistent structure is crucial for scalability and maintainability.

## High-Level Overview

The repository is structured as a monorepo containing both the frontend and backend applications.

```
Lrarning-Hub-Frontend-Backend-API-2.01-main/
├── backend/         # NestJS Microservices and API Gateway
├── frontend/        # React SPA (Single Page Application)
├── KAFKA_README.md  # Documentation for the Kafka workflow
└── README.md        # Main project README
...
```

## Backend Structure (`/backend`)

The backend is a standard NestJS project. As the application grows, it's recommended to organize features into their own modules (e.g., `/src/users`, `/src/courses`).

```
backend/
├── src/
│   ├── app.controller.ts   # Root controller for basic routes
│   ├── app.module.ts       # Root module of the application
│   ├── app.service.ts      # Root service for basic business logic
│   ├── kafka.controller.ts # Controller for handling Kafka messages
│   └── main.ts             # Application entry point
│
├── test/
│   ├── app.e2e-spec.ts     # End-to-end tests
│   └── jest-e2e.json       # Jest configuration for E2E tests
│
├── .env                    # Environment variables (not committed)
├── .eslintrc.js            # ESLint configuration for code style
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript compiler configuration
└── tsconfig.build.json     # TypeScript build configuration
```

### Key Directories & Files

*   **`/src`**: This is where all the application source code resides.
    *   `main.ts`: The entry point of the application. It instantiates the NestJS application, creates the HTTP server, and sets up the Kafka microservice listener.
    *   `app.module.ts`: The root module of the application. It's responsible for wiring together controllers, services, and other modules. The `ClientsModule` for Kafka is registered here.
    *   `app.controller.ts`: A basic controller for handling HTTP requests. As the project grows, you should create feature-specific controllers (e.g., `users.controller.ts`).
    *   `app.service.ts`: A basic service that contains the business logic. It's a good place to inject the Kafka client to send messages.
    *   `kafka.controller.ts`: A dedicated controller to handle incoming messages from Kafka topics, using decorators like `@MessagePattern` and `@EventPattern`.

*   **`/dist`**: The output directory for the compiled JavaScript code. This directory is not committed to version control and is generated during the build process (`npm run build`). The production environment runs the code from this directory.

*   **`/test`**: Contains all testing files.
    *   `app.e2e-spec.ts`: An example of an end-to-end test file.

### Recommended Modular Structure

As you add features like "Users" or "Courses", you should create a new directory for each feature inside `/src`. This is a core concept in NestJS for building scalable applications.

```
/src
├── users/
│   ├── dto/                # Data Transfer Objects (for validation)
│   ├── entities/           # Database entities (e.g., for Prisma or TypeORM)
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
└── app.module.ts
...
```
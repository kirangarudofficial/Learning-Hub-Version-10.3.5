# Progress Service

The Progress Service is responsible for tracking and managing student progress through courses in the Learning Hub platform.

## Features

- Track student progress through courses
- Record completion status for lessons and modules
- Generate progress reports and analytics
- Support for marking lessons as completed
- Calculate progress percentages automatically

## API Endpoints

### REST API

- `POST /api/progress` - Create a new progress record
- `GET /api/progress` - Get all progress records (with optional filters)
- `GET /api/progress/:id` - Get progress by ID
- `PUT /api/progress/:id` - Update progress
- `PUT /api/progress/:id/lesson/:lessonId` - Mark lesson as completed
- `DELETE /api/progress/:id` - Delete progress
- `GET /api/progress/report/course/:courseId` - Generate progress report for a course

### Microservice Patterns

- `progress.findAll` - Find all progress records
- `progress.findByUser` - Find progress records by user ID
- `progress.findByCourse` - Find progress records by course ID
- `progress.findByUserAndCourse` - Find progress record by user ID and course ID
- `progress.findOne` - Find progress record by ID
- `progress.create` - Create a new progress record
- `progress.update` - Update a progress record
- `progress.delete` - Delete a progress record
- `progress.addCompletedLesson` - Mark a lesson as completed
- `progress.generateReport` - Generate a progress report for a course

## Configuration

The service runs on port 3012 and connects to RabbitMQ for microservice communication.

## Documentation

Swagger documentation is available at `/api/progress/docs`.
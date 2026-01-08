# Content Service

The Content Service is a microservice responsible for managing all content-related operations in the Learning Hub platform. It handles the creation, retrieval, updating, and deletion of various types of content (video, text, quiz, etc.) associated with courses and modules.

## Features

- Create, read, update, and delete content items
- Filter content by type, status, course, or module
- Change content status (draft, published, archived)
- Manage content ordering within modules

## API Endpoints

### HTTP Endpoints

- `POST /content` - Create new content
- `GET /content` - Get all content with optional filters
- `GET /content/:id` - Get content by ID
- `PATCH /content/:id` - Update content
- `DELETE /content/:id` - Delete content
- `PATCH /content/:id/status` - Change content status

### Microservice Message Patterns

- `CONTENT.FIND_ALL` - Find all content with optional filters
- `CONTENT.FIND_BY_COURSE` - Find content by course ID
- `CONTENT.FIND_BY_MODULE` - Find content by module ID
- `CONTENT.FIND_ONE` - Find content by ID
- `CONTENT.CREATE` - Create new content
- `CONTENT.UPDATE` - Update content
- `CONTENT.DELETE` - Delete content
- `CONTENT.CHANGE_STATUS` - Change content status

## Content Types

The service supports various content types:

- VIDEO
- TEXT
- QUIZ
- ASSIGNMENT
- DOCUMENT
- LINK
- IMAGE
- AUDIO

## Content Status

Content can have one of the following statuses:

- DRAFT
- PUBLISHED
- ARCHIVED

## Database Schema

The Content model includes the following fields:

- `id` - Unique identifier
- `title` - Content title
- `description` - Content description
- `type` - Content type (enum)
- `status` - Content status (enum)
- `url` - URL to the content (if applicable)
- `data` - JSON data specific to the content type
- `order` - Position in the module
- `duration` - Content duration (if applicable)
- `isRequired` - Whether the content is required
- `tags` - Array of tags
- `courseId` - Associated course ID
- `moduleId` - Associated module ID
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
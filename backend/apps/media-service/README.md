# Media Service

## Overview
The Media Service is responsible for managing all media files in the Learning Hub platform. It handles uploading, storing, retrieving, and managing various types of media including images, videos, audio, and documents.

## Features
- Upload and store media files
- Support for different media types (images, videos, audio, documents)
- Media metadata management
- Access control (public/private media)
- Entity association (link media to courses, lessons, etc.)
- Media status tracking

## API Endpoints

### Microservice Patterns

| Pattern | Description |
|---------|-------------|
| `media.create` | Create a new media record |
| `media.findAll` | Get all media files |
| `media.findByUser` | Get media files for a specific user |
| `media.findByEntity` | Get media files for a specific entity (course, lesson, etc.) |
| `media.findOne` | Get a specific media file by ID |
| `media.update` | Update a media record |
| `media.remove` | Remove a media file (soft delete) |
| `upload_file` | Upload a file to storage and get the URL |

## Data Models

### Media Types
- `IMAGE`: Image files (jpg, png, gif, etc.)
- `VIDEO`: Video files (mp4, webm, etc.)
- `AUDIO`: Audio files (mp3, wav, etc.)
- `DOCUMENT`: Document files (pdf, doc, etc.)
- `OTHER`: Other file types

### Media Status
- `PROCESSING`: Media is being processed
- `READY`: Media is ready for use
- `FAILED`: Media processing failed
- `DELETED`: Media has been deleted (soft delete)

### Database Schema

```prisma
model Media {
  id           String      @id @default(cuid())
  type         MediaType
  originalName String
  mimeType     String
  size         Int
  url          String
  userId       String
  entityId     String?
  entityType   String?
  metadata     Json?
  isPublic     Boolean     @default(false)
  status       MediaStatus @default(READY)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}
```

## Integration with Other Services

The Media Service integrates with:
- User Service: To associate media with users
- Course Service: For course-related media
- Content Service: For content-related media

## Storage Options

The Media Service can be configured to use different storage backends:
- Local file system (development)
- Amazon S3 (production)
- Google Cloud Storage
- Azure Blob Storage

## Future Enhancements

- Video transcoding for different resolutions
- Image resizing and optimization
- Content delivery network (CDN) integration
- Media analytics (views, downloads)
- Advanced search capabilities
- Media collections and organization
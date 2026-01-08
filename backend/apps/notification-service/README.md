# Notification Service

## Overview
The Notification Service is responsible for managing all notifications in the Learning Hub platform. It handles creating, sending, and tracking notifications across different channels (email, SMS, push, in-app).

## Features
- Create and send notifications to users
- Support for different notification types (email, SMS, push, in-app)
- Notification status tracking
- Bulk notification sending
- Template-based notifications
- Mark notifications as read/unread

## API Endpoints

### Microservice Patterns

| Pattern | Description |
|---------|-------------|
| `notification.create` | Create a new notification |
| `notification.findAll` | Get all notifications |
| `notification.findByUser` | Get notifications for a specific user |
| `notification.findOne` | Get a specific notification by ID |
| `notification.update` | Update a notification |
| `notification.remove` | Remove a notification |
| `notification.markAsRead` | Mark a notification as read |
| `notification.markAllAsRead` | Mark all notifications as read for a user |
| `notification.sendBulk` | Send bulk notifications to multiple users |

## Data Models

### Notification Types
- `EMAIL`: Email notifications
- `SMS`: SMS text messages
- `PUSH`: Push notifications
- `IN_APP`: In-app notifications

### Notification Status
- `PENDING`: Notification is queued for delivery
- `SENT`: Notification has been sent
- `DELIVERED`: Notification has been delivered
- `READ`: Notification has been read by the user
- `FAILED`: Notification delivery failed

### Database Schema

```prisma
model Notification {
  id           String             @id @default(cuid())
  type         NotificationType
  userId       String
  subject      String
  content      String
  data         Json?
  templateId   String?
  templateVars Json?
  status       NotificationStatus @default(PENDING)
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
}
```

## Integration with Other Services

The Notification Service integrates with:
- User Service: To get user information for sending notifications
- Course Service: For course-related notifications
- Enrollment Service: For enrollment-related notifications
- Payment Service: For payment-related notifications

## Future Enhancements

- Email delivery service integration (SendGrid, Mailgun, etc.)
- SMS delivery service integration (Twilio, etc.)
- Push notification service integration (Firebase, etc.)
- Real-time notifications using WebSockets
- Notification preferences and opt-out management
- Scheduled notifications
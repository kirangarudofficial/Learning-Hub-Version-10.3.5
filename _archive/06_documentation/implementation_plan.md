# Implementation Plan: Real-Time Notification System

## Overview

Implement a comprehensive real-time notification system using WebSockets (Socket.IO) to deliver instant updates to users about course activities, deadlines, and platform events.

## User Review Required

> [!IMPORTANT]
> **WebSocket Technology Choice**: Using Socket.IO (industry standard) instead of raw WebSockets for:
> - Automatic reconnection handling
> - Fallback to HTTP long-polling
> - Room/namespace support for targeted notifications
> - Built-in authentication integration

> [!IMPORTANT]
> **Database Changes**: Adding new tables for notification preferences and notification history. Existing `notification-service` will be enhanced, not replaced.

---

## Proposed Changes

### Backend Components

#### 1. Notification Service Enhancement

##### [MODIFY] [notification-service/src/main.ts](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/notification-service/src/main.ts)
- Add Socket.IO adapter
- Configure WebSocket gateway
- Add authentication middleware for WebSocket connections

##### [NEW] [notification-service/src/websocket/notification.gateway.ts](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/notification-service/src/websocket/notification.gateway.ts)
- WebSocket gateway with Socket.IO
- Handle client connections/disconnections
- Emit notifications to connected users
- Support notification rooms (user-specific, role-specific)

##### [NEW] [notification-service/src/preferences/preferences.controller.ts](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/notification-service/src/preferences/preferences.controller.ts)
- GET /preferences - Get user notification preferences
- PUT /preferences - Update notification preferences
- POST /preferences/reset - Reset to defaults

##### [NEW] [notification-service/src/preferences/preferences.service.ts](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/notification-service/src/preferences/preferences.service.ts)
- Business logic for notification preferences
- Default preference initialization
- Preference validation

##### [NEW] [notification-service/src/dto/notification.dto.ts](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/notification-service/src/dto/notification.dto.ts)
- CreateNotificationDto
- NotificationPreferencesDto
- NotificationResponseDto

---

#### 2. Database Schema Updates

##### [MODIFY] [prisma/schema.prisma](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/prisma/schema.prisma)

**Add UserNotificationPreferences model:**
```prisma
model UserNotificationPreferences {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Course notifications
  newCourseContent      Boolean @default(true)
  courseUpdates         Boolean @default(true)
  courseScheduleChanges Boolean @default(true)
  
  // Assignment & Assessment notifications
  assignmentDeadlines   Boolean @default(true)
  quizAvailable         Boolean @default(true)
  gradeReleased         Boolean @default(true)
  
  // Progress notifications
  milestoneAchieved     Boolean @default(true)
  certificateIssued     Boolean @default(true)
  courseCompletion      Boolean @default(true)
  
  // Social notifications
  newComment            Boolean @default(true)
  newReply              Boolean @default(false)
  instructorMessage     Boolean @default(true)
  
  // System notifications
  systemAnnouncements   Boolean @default(true)
  securityAlerts        Boolean @default(true)
  
  // Delivery preferences
  emailNotifications    Boolean @default(true)
  pushNotifications     Boolean @default(true)
  inAppNotifications    Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Add Notification history model:**
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  message   String
  data      Json?    // Additional data (courseId, assignmentId, etc.)
  
  read      Boolean  @default(false)
  readAt    DateTime?
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([userId, read])
  @@index([createdAt])
}

enum NotificationType {
  COURSE_NEW_CONTENT
  COURSE_UPDATE
  COURSE_SCHEDULE_CHANGE
  ASSIGNMENT_DEADLINE
  QUIZ_AVAILABLE
  GRADE_RELEASED
  MILESTONE_ACHIEVED
  CERTIFICATE_ISSUED
  COURSE_COMPLETED
  NEW_COMMENT
  NEW_REPLY
  INSTRUCTOR_MESSAGE
  SYSTEM_ANNOUNCEMENT
  SECURITY_ALERT
}
```

**Update User model:**
```prisma
model User {
  // ... existing fields
  notificationPreferences UserNotificationPreferences?
  notifications           Notification[]
}
```

---

#### 3. Service Integration

##### [MODIFY] [course-service](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/course-service/src/)
- Emit events when new content added
- Emit events when course updated
- Emit events when schedule changes

##### [MODIFY] [enrollment-service](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/enrollment-service/src/)
- Emit events for assignment deadlines
- Emit events for milestone achievements

##### [MODIFY] [assessment-service](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/assessment-service/src/)
- Emit events when quiz becomes available
- Emit events when grades released

##### [MODIFY] [certificate-service](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/certificate-service/src/)
- Emit events when certificate issued

**Event Pattern (RabbitMQ):**
```typescript
// Example event emission
{
  pattern: 'notification.send',
  data: {
    userId: 'user-id',
    type: 'COURSE_NEW_CONTENT',
    title: 'New Lesson Available',
    message: 'New lesson "Introduction to TypeScript" is now available',
    data: { courseId: 'course-id', lessonId: 'lesson-id' }
  }
}
```

---

#### 4. API Gateway Updates

##### [MODIFY] [api-gateway/src/main.ts](file:///e:/AntiGravityEdits/Learning%20Hub/Project/backend/apps/api-gateway/src/main.ts)
- Configure CORS to allow WebSocket connections
- Add Socket.IO adapter configuration
- Proxy WebSocket connections to notification-service

---

### Frontend Components

#### 1. Socket.IO Client Setup

##### [NEW] [frontend/src/services/socket.service.ts](file:///e:/AntiGravityEdits/Learning%20Hub/Project/frontend/src/services/socket.service.ts)
- Socket.IO client initialization
- Authentication with JWT token
- Event listeners
- Reconnection handling

---

#### 2. Notification Context

##### [NEW] [frontend/src/contexts/NotificationContext.tsx](file:///e:/AntiGravityEdits/Learning%20Hub/Project/frontend/src/contexts/NotificationContext.tsx)
- Global notification state management
- Real-time notification updates
- Notification count
- Mark as read functionality

---

#### 3. UI Components

##### [NEW] [frontend/src/components/notifications/NotificationBell.tsx](file:///e:/AntiGravityEdits/Learning%20Hub/Project/frontend/src/components/notifications/NotificationBell.tsx)
- Bell icon with unread count badge
- Dropdown with recent notifications
- Mark as read/unread
- View all notifications link

##### [NEW] [frontend/src/components/notifications/NotificationDropdown.tsx](file:///e:/AntiGravityEdits/Learning%20Hub/Project/frontend/src/components/notifications/NotificationDropdown.tsx)
- List of recent notifications (last 10)
- Notification item with icon, title, message, timestamp
- Click to navigate to related content
- Mark all as read button

##### [NEW] [frontend/src/components/notifications/NotificationPreferences.tsx](file:///e:/AntiGravityEdits/Learning%20Hub/Project/frontend/src/components/notifications/NotificationPreferences.tsx)
- Settings page for notification preferences
- Toggle switches for each notification type
- Email/Push/In-App delivery preferences
- Save/Reset buttons

##### [NEW] [frontend/src/pages/NotificationsPage.tsx](file:///e:/AntiGravityEdits/Learning%20Hub/Project/frontend/src/pages/NotificationsPage.tsx)
- Full page view of all notifications
- Filter by type, read/unread
- Pagination
- Bulk actions (mark all as read, delete)

---

## Package Dependencies

### Backend
```json
{
  "@nestjs/websockets": "^11.1.11",
  "@nestjs/platform-socket.io": "^11.1.11",
  "socket.io": "^4.8.1"
}
```

### Frontend
```json
{
  "socket.io-client": "^4.8.1"
}
```

---

## Notification Flow

### 1. User Action Triggers Event
```
Course Service → Create new lesson
  ↓
Emit RabbitMQ event: 'notification.send'
  ↓
Notification Service receives event
```

### 2. Notification Service Processing
```
Check user's notification preferences
  ↓
If preference enabled:
  - Save to database (Notification table)
  - Emit WebSocket event to user's room
  - Send email (if emailNotifications enabled)
  - Send push notification (if pushNotifications enabled)
```

### 3. Frontend Receives Notification
```
Socket.IO client receives event
  ↓
Update NotificationContext state
  ↓
Show toast/banner notification
  ↓
Update notification bell badge count
```

---

## API Endpoints

### Notification Preferences
- `GET /api/notifications/preferences` - Get current preferences
- `PUT /api/notifications/preferences` - Update preferences
- `POST /api/notifications/preferences/reset` - Reset to defaults

### Notifications
- `GET /api/notifications` - Get all notifications (paginated)
- `GET /api/notifications/unread` - Get unread notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### WebSocket Events
- `notification:new` - New notification received
- `notification:read` - Notification marked as read
- `notification:deleted` - Notification deleted

---

## Verification Plan

### Automated Tests

#### Backend Tests
```bash
# Test WebSocket gateway
npm test notification-service/websocket/notification.gateway.spec.ts

# Test preferences service
npm test notification-service/preferences/preferences.service.spec.ts

# Test event emission
npm test course-service/notification-events.spec.ts
```

#### E2E Tests
```bash
# Test real-time notification delivery
npm run test:e2e notification-realtime.e2e-spec.ts

# Test notification preferences
npm run test:e2e notification-preferences.e2e-spec.ts
```

### Manual Verification

1. **Connection Test**
   - Login to platform
   - Verify WebSocket connection established
   - Check browser console for connection logs

2. **Notification Delivery**
   - Trigger various events (new lesson, assignment deadline, etc.)
   - Verify instant notification appears
   - Check notification bell updates

3. **Preferences Test**
   - Disable specific notification types
   - Trigger those events
   - Verify notifications NOT received
   - Re-enable and verify they work again

4. **Multi-device Test**
   - Login from two different browsers/devices
   - Trigger notification
   - Verify both devices receive notification simultaneously

5. **Reconnection Test**
   - Disconnect internet
   - Wait 10 seconds
   - Reconnect
   - Verify auto-reconnection works
   - Verify missed notifications are synced

---

## Performance Considerations

- **Scalability**: Socket.IO supports Redis adapter for horizontal scaling
- **Connection Pooling**: Limit max connections per user
- **Notification Batching**: Group similar notifications within 5-minute windows
- **Database Indexing**: Indices on `userId`, `read`, `createdAt` for fast queries
- **Cleanup Job**: Delete old read notifications after 30 days

---

## Security Considerations

- **Authentication**: JWT token validation for WebSocket connections
- **Authorization**: Users can only receive their own notifications
- **Rate Limiting**: Limit notification emission rate to prevent spam
- **Input Validation**: Validate all notification data before saving
- **XSS Prevention**: Sanitize notification messages before display

---

## Timeline Estimate

- **Backend Implementation**: 2-3 days
- **Frontend Implementation**: 2 days
- **Testing & Bug Fixes**: 1 day
- **Documentation**: 0.5 day

**Total**: ~5-6 days

---

## Rollout Strategy

### Phase 1: Core Implementation
- WebSocket gateway
- Basic notification delivery
- Notification preferences

### Phase 2: Service Integration
- Course service notifications
- Assessment service notifications
- Enrollment service notifications

### Phase 3: UI Polish
- Notification animations
- Sound effects (optional)
- Mobile responsive design

### Phase 4: Production Deployment
- Load testing
- Monitoring setup
- Gradual rollout to users

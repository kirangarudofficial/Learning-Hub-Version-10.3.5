import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * WebSocket Gateway for Real-Time Notifications
 * Handles client connections, disconnections, and notification broadcasting
 */
@WebSocketGateway({
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    },
    namespace: '/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationGateway.name);
    private connectedClients = new Map<string, string>(); // userId -> socketId

    constructor(private jwtService: JwtService) { }

    /**
     * Handle client connection
     * Authenticate user via JWT token and join user-specific room
     */
    async handleConnection(client: Socket) {
        try {
            // Extract token from handshake auth
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                this.logger.warn(`Client ${client.id} connection rejected: No token provided`);
                client.disconnect();
                return;
            }

            // Verify JWT token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            const userId = payload.sub || payload.userId;

            if (!userId) {
                this.logger.warn(`Client ${client.id} connection rejected: Invalid token payload`);
                client.disconnect();
                return;
            }

            // Store client connection
            client.data.userId = userId;
            this.connectedClients.set(userId, client.id);

            // Join user-specific room
            await client.join(`user:${userId}`);

            this.logger.log(`User ${userId} connected with socket ${client.id}`);

            // Emit connection success
            client.emit('connected', { userId, message: 'Successfully connected to notification service' });
        } catch (error) {
            this.logger.error(`Connection error for client ${client.id}:`, error.message);
            client.disconnect();
        }
    }

    /**
     * Handle client disconnection
     */
    handleDisconnect(client: Socket) {
        const userId = client.data.userId;

        if (userId) {
            this.connectedClients.delete(userId);
            this.logger.log(`User ${userId} disconnected (socket ${client.id})`);
        } else {
            this.logger.log(`Unknown client ${client.id} disconnected`);
        }
    }

    /**
     * Send notification to specific user
     */
    sendNotificationToUser(userId: string, notification: any) {
        this.server.to(`user:${userId}`).emit('notification:new', notification);
        this.logger.debug(`Sent notification to user ${userId}: ${notification.title}`);
    }

    /**
     * Send notification to multiple users
     */
    sendNotificationToUsers(userIds: string[], notification: any) {
        userIds.forEach(userId => {
            this.sendNotificationToUser(userId, notification);
        });
    }

    /**
     * Broadcast notification to all connected clients
     */
    broadcastNotification(notification: any) {
        this.server.emit('notification:new', notification);
        this.logger.debug(`Broadcasted notification: ${notification.title}`);
    }

    /**
     * Handle client marking notification as read
     */
    @SubscribeMessage('notification:mark-read')
    handleMarkAsRead(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { notificationId: string },
    ) {
        const userId = client.data.userId;
        this.logger.debug(`User ${userId} marked notification ${data.notificationId} as read`);

        // Emit to all user's connected devices
        this.server.to(`user:${userId}`).emit('notification:read', data);
    }

    /**
     * Get connected clients count
     */
    getConnectedClientsCount(): number {
        return this.connectedClients.size;
    }

    /**
     * Check if user is online
     */
    isUserOnline(userId: string): boolean {
        return this.connectedClients.has(userId);
    }
}

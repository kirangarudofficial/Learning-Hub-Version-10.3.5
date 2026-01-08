import { io, Socket } from 'socket.io-client';

/**
 * Socket.IO Service for Real-Time Notifications
 * Handles WebSocket connection, authentication, and event listening
 */
class SocketService {
    private socket: Socket | null = null;
    private readonly url: string;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor() {
        this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3006';
    }

    /**
      * Connect to WebSocket server with JWT authentication
      */
    connect(token: string): void {
        if (this.socket?.connected) {
            console.log('[Socket] Already connected');
            return;
        }

        console.log('[Socket] Connecting to:', this.url);

        this.socket = io(`${this.url}/notifications`, {
            auth: {
                token,
            },
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
        });

        this.setupEventListeners();
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        if (this.socket) {
            console.log('[Socket] Disconnecting');
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Setup default event listeners
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('[Socket] Connected with ID:', this.socket?.id);
            this.reconnectAttempts = 0;
        });

        this.socket.on('connected', (data) => {
            console.log('[Socket] Authenticated:', data);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('[Socket] Max reconnection attempts reached');
            }
        });

        this.socket.on('error', (error) => {
            console.error('[Socket] Error:', error);
        });
    }

    /**
     * Listen for new notifications
     */
    onNotification(callback: (notification: any) => void): void {
        if (!this.socket) {
            console.warn('[Socket] Not connected, cannot listen for notifications');
            return;
        }

        this.socket.on('notification:new', callback);
    }

    /**
     * Listen for notification read events
     */
    onNotificationRead(callback: (data: any) => void): void {
        if (!this.socket) return;
        this.socket.on('notification:read', callback);
    }

    /**
     * Listen for notification deleted events
     */
    onNotificationDeleted(callback: (data: any) => void): void {
        if (!this.socket) return;
        this.socket.on('notification:deleted', callback);
    }

    /**
     * Emit notification mark as read
     */
    markAsRead(notificationId: string): void {
        if (!this.socket?.connected) {
            console.warn('[Socket] Not connected, cannot mark as read');
            return;
        }

        this.socket.emit('notification:mark-read', { notificationId });
    }

    /**
     * Remove all event listeners
     */
    removeAllListeners(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }

    /**
     * Remove specific event listener
     */
    off(event: string, callback?: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

import { io, Socket } from 'socket.io-client';

const NOTIFICATION_SERVICE_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3004'

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string, role?: string) {
    if (this.socket?.connected) {
      return;
    }

    this.userId = userId;
    
    this.socket = io(NOTIFICATION_SERVICE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      // Register user room and optional admin room
      this.socket?.emit('register', {
        userId,
        role,
      });
    });

    this.socket.on('disconnect', () => {
      // WebSocket disconnected
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('reconnect', () => {
      // Re-register user room after reconnection
      if (this.userId) {
        this.socket?.emit('register', {
          userId: this.userId,
          role: role,
        });
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  // Listen for order created events
  onOrderCreated(callback: (data: any) => void) {
    this.socket?.on('order:created', callback);
  }

  // Listen for order status updates
  onOrderStatusUpdated(callback: (data: any) => void) {
    this.socket?.on('order:status_updated', callback);
  }

  // Remove event listeners
  offOrderCreated(callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off('order:created', callback);
    } else {
      this.socket?.off('order:created');
    }
  }

  offOrderStatusUpdated(callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off('order:status_updated', callback);
    } else {
      this.socket?.off('order:status_updated');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();

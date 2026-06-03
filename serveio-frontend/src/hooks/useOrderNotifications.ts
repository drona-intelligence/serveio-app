import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { socketService } from '../services/socket.service';
import { addNotification } from '../App/slices/notificationSlice';
import { toast } from 'sonner';

interface OrderCreatedData {
  orderId: string;
  totalAmount: number;
  itemCount: number;
  message: string;
  timestamp: string;
}

interface OrderStatusUpdatedData {
  orderId: string;
  status: string;
  previousStatus?: string;
  updatedAt: string;
  message: string;
  timestamp: string;
}

export function useOrderNotifications() {
  const dispatch = useDispatch();

  const handleOrderCreated = useCallback((data: OrderCreatedData) => {
    // Add to Redux store
    dispatch(addNotification({
      type: 'order_created',
      orderId: data.orderId,
      message: data.message,
      totalAmount: data.totalAmount,
      itemCount: data.itemCount,
      timestamp: data.timestamp,
    }));

    // Show toast notification
    toast.success(data.message, {
      description: `Total: Nrs ${data.totalAmount.toFixed(2)} • ${data.itemCount} items`,
      duration: 5000,
    });
  }, [dispatch]);

  const handleOrderStatusUpdated = useCallback((data: OrderStatusUpdatedData) => {
    // Add to Redux store
    dispatch(addNotification({
      type: 'order_status_updated',
      orderId: data.orderId,
      message: data.message,
      status: data.status,
      timestamp: data.timestamp,
    }));

    const statusEmoji: Record<string, string> = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      PREPARING: '👨‍🍳',
      READY: '🔔',
      COMPLETED: '🎉',
      CANCELLED: '❌',
    };

    const emoji = statusEmoji[data.status] || '📋';
    
    // Show toast notification
    toast.info(`${emoji} ${data.message}`, {
      description: `Updated at ${new Date(data.updatedAt).toLocaleTimeString()}`,
      duration: 5000,
    });
  }, [dispatch]);

  useEffect(() => {
    // Register event listeners
    socketService.onOrderCreated(handleOrderCreated);
    socketService.onOrderStatusUpdated(handleOrderStatusUpdated);

    // Cleanup listeners on unmount
    return () => {
      socketService.offOrderCreated(handleOrderCreated);
      socketService.offOrderStatusUpdated(handleOrderStatusUpdated);
    };
  }, [handleOrderCreated, handleOrderStatusUpdated]);

  return {
    isConnected: socketService.isConnected(),
  };
}

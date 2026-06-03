import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../App/store/store';
import { socketService } from '../services/socket.service';
import { useOrderNotifications } from '../hooks/useOrderNotifications';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      socketService.connect(user.id.toString());
    }

    return () => {
      if (isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, user?.id]);

  // Use the order notifications hook
  useOrderNotifications();

  return <>{children}</>;
}

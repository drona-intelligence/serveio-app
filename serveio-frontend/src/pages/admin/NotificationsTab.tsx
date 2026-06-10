import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Info, CheckCircle2, Trash2, Package } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/App/hooks/hooks";
import {
  markAsRead,
  markAllAsRead,
  clearNotification,
} from "@/App/slices/notificationSlice";
import { formatDistanceToNow } from "date-fns";

const NotificationsTab = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order_created":
        return Bell;
      case "order_status_updated":
        return Package;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order_created":
        return "text-green-600";
      case "order_status_updated":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearNotification = (id: string) => {
    dispatch(clearNotification(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            System notifications and order updates
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {unreadCount > 0 && (
            <>
              <Badge variant="destructive" className="text-sm">
                {unreadCount} Unread
              </Badge>
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            </>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardHeader className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              System notifications will appear here
            </p>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const color = getNotificationColor(notification.type);
            
            return (
              <Card 
                key={notification.id}
                className={notification.read ? "opacity-60" : "border-l-4 border-l-green-600"}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {notification.message}
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-green-600" />
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Order #{notification.orderId}</span>
                          {notification.status && (
                            <Badge variant="outline" className="text-xs">
                              {notification.status}
                            </Badge>
                          )}
                        </div>
                        {notification.totalAmount && notification.itemCount && (
                          <p className="text-sm text-muted-foreground">
                            Nrs {notification.totalAmount.toFixed(2)} • {notification.itemCount} items
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleClearNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      <div className="text-center py-4 text-muted-foreground border-t">
        <p className="text-sm flex items-center justify-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications are synced in real-time via WebSocket
        </p>
      </div>
    </div>
  );
};

export default NotificationsTab;

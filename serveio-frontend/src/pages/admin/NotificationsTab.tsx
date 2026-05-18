import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, Info, CheckCircle2, Trash2 } from "lucide-react";

const NotificationsTab = () => {
  // Placeholder data - will be replaced with real API calls later
  const notifications = [
    {
      id: "1",
      type: "order",
      title: "New Order Received",
      message: "Order #ORD-005 has been placed by Sarah Wilson",
      time: "2 mins ago",
      read: false,
      icon: Bell,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "alert",
      title: "Low Stock Alert",
      message: "Chicken Wings inventory is running low (5 units remaining)",
      time: "15 mins ago",
      read: false,
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      id: "3",
      type: "info",
      title: "Menu Updated",
      message: "Summer Specials menu has been successfully updated",
      time: "1 hour ago",
      read: true,
      icon: Info,
      color: "text-green-600",
    },
    {
      id: "4",
      type: "success",
      title: "Order Completed",
      message: "Order #ORD-003 has been marked as completed",
      time: "2 hours ago",
      read: true,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      id: "5",
      type: "order",
      title: "Order Cancelled",
      message: "Order #ORD-004 was cancelled by the customer",
      time: "3 hours ago",
      read: true,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with your restaurant activities
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount} Unread
            </Badge>
          )}
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Card 
              key={notification.id}
              className={notification.read ? "opacity-60" : "border-l-4 border-l-green-600"}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 ${notification.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {notification.title}
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-green-600" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="text-center py-8 text-muted-foreground border-t">
        <p className="text-sm">
          Real-time notification system coming soon
        </p>
      </div>
    </div>
  );
};

export default NotificationsTab;

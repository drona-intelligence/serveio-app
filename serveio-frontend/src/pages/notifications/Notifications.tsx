import { useAppSelector, useAppDispatch } from '@/App/hooks/hooks';
import { 
  markAsRead, 
  markAllAsRead, 
  clearNotification, 
  clearAllNotifications 
} from '@/App/slices/notificationSlice';
import { BellOff, ShoppingBag, Package, Trash2, Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearNotification = (id: string) => {
    dispatch(clearNotification(id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      dispatch(clearAllNotifications());
    }
  };

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-purple-100 text-purple-800',
      READY: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-emerald-100 text-emerald-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return status ? colors[status] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusEmoji = (status?: string) => {
    const emojis: Record<string, string> = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      PREPARING: '👨‍🍳',
      READY: '🔔',
      COMPLETED: '🎉',
      CANCELLED: '❌',
    };
    return status ? emojis[status] || '📋' : '📋';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12">
            <BellOff size={64} className="mb-4 text-gray-400" />
            <h2 className="mb-2 text-xl font-semibold text-gray-700">No notifications yet</h2>
            <p className="text-gray-500">When you receive order updates, they'll appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group relative rounded-xl border-2 bg-white p-4 transition hover:shadow-md ${
                  notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
                }`}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                    notification.type === 'order_created' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {notification.type === 'order_created' ? (
                      <ShoppingBag className="text-green-600" size={24} />
                    ) : (
                      <Package className="text-blue-600" size={24} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{notification.message}</p>
                        <p className="mt-1 text-sm text-gray-600">Order #{notification.orderId}</p>
                      </div>

                      {/* Status badge */}
                      {notification.status && (
                        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(notification.status)}`}>
                          {getStatusEmoji(notification.status)} {notification.status}
                        </span>
                      )}
                    </div>

                    {/* Additional info */}
                    {notification.totalAmount && notification.itemCount && (
                      <div className="mt-2 flex gap-4 text-sm text-gray-600">
                        <span>💰 Nrs {notification.totalAmount.toFixed(2)}</span>
                        <span>📦 {notification.itemCount} items</span>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="mt-2 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-100 transition"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleClearNotification(notification.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

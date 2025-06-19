import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Filter,
  CheckCheck,
  Eye,
  EyeOff,
  AlertCircle,
  MessageSquare,
  CreditCard,
  Shield,
  Calendar,
  User,
  Briefcase
} from 'lucide-react';
import { useNotification } from '@/store/useNotificationStore';

const NotificationIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ElementType> = {
    welcome: User,
    new_rating: AlertCircle,
    new_message: MessageSquare,
    new_application: Briefcase,
    application_viewed: Eye,
    application_active: Briefcase,
    offer_received: CreditCard,
    offer_accepted: Check,
    offer_declined: EyeOff,
    milestone_completed: CheckCheck,
    milestone_approved: Check,
    milestone_disputed: AlertCircle,
    contract_started: Check,
    contract_ended: AlertCircle,
    payment_processed: Check,
    payment: CreditCard,
    system: Shield,
    reminder: Calendar,
    security_alert: Shield
  };

  const Icon = iconMap[type] || Bell;
  return <Icon className="w-5 h-5" />;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    welcome: 'bg-purple-50 text-purple-600 border-purple-200',
    new_rating: 'bg-green-50 text-green-600 border-green-200',
    new_message: 'bg-blue-50 text-blue-600 border-blue-200',
    new_application: 'bg-blue-50 text-blue-600 border-blue-200',
    application_viewed: 'bg-orange-50 text-orange-600 border-orange-200',
    application_active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    offer_received: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    offer_accepted: 'bg-green-50 text-green-600 border-green-200',
    offer_declined: 'bg-red-50 text-red-600 border-red-200',
    milestone_completed: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    milestone_approved: 'bg-green-50 text-green-600 border-green-200',
    milestone_disputed: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    payment: 'bg-green-50 text-green-600 border-green-200',
    system: 'bg-gray-50 text-gray-600 border-gray-200',
    reminder: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    security: 'bg-red-50 text-red-600 border-red-200'
  };
  return colors[type] || 'bg-gray-50 text-gray-600 border-gray-200';
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState<Set<string>>(new Set());

  // Use the real Zustand store
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount: number = notifications.filter((n: Notification) => !n.isRead).length;

  interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  }

  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return notification.type === filter;
  });

  const handleMarkAsRead = async (id: string) => {
    setLoadingNotifications(prev => new Set(prev).add(id));
    setIsLoading(true);
    try {
      await markAsRead(id);
    } finally {
      setLoadingNotifications(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    setIsLoading(true);
    try {
      await markAllAsRead();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLoadingNotifications(prev => new Set(prev).add(id));
    setIsLoading(true);
    try {
      await deleteNotification(id);
    } finally {
      setLoadingNotifications(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setIsLoading(false);
    }
  };

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read', label: 'Read', count: notifications.length - unreadCount }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-deepskyblue mb-2">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'You\'re all caught up! 🎉'
                }
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-deepskyblue text-white text-sm rounded-lg hover:bg-deepskyblue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 p-1 bg-white rounded-lg border border-deepskyblue">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            {filters.map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === filterOption.key
                    ? 'bg-deepskyblue/10 text-deepskyblue'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-deepskyblue">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'all'
                  ? "You don't have any notifications yet"
                  : `No ${filter} notifications found`
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification: Notification) => (
              <div
                key={notification._id}
                className={`group relative bg-white rounded-xl border transition-all hover:shadow-md cursor-pointer ${!notification.isRead
                    ? 'border-blue-200 bg-blue-50/30'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${getTypeColor(notification.type)}`}>
                      <NotificationIcon type={notification.type} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-deepskyblue ${!notification.isRead ? 'font-bold' : ''}`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-deepskyblue rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(notification.createdAt)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              disabled={loadingNotifications.has(notification._id) || isLoading}
                              className="cursor-pointer p-2 text-gray-400 hover:text-deepskyblue hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDelete(e, notification._id)}
                            disabled={loadingNotifications.has(notification._id) || isLoading}
                            className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
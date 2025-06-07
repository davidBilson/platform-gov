import useNotification from '@/store/useNotification';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline, IoCheckmarkOutline, IoEyeOutline, IoFilterOutline, IoCheckboxOutline, IoSquareOutline } from "react-icons/io5";

const Notifications = () => {

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const { 
    notifications, 
    markAsRead,
    deleteNotification,
    fetchNotifications
  }: { 
    notifications: { id: string; isRead: boolean; type: string; title: string; message: string; timestamp: string; priority: string }[], 
    markAsRead: (id: string) => void, 
    deleteNotification: (id: string) => void, 
    fetchNotifications: () => void 
  } = useNotification();


  useEffect(() => {
      fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  interface NotificationTypeColors {
    [key: string]: string;
  }

  const getTypeColor = (type: string): string => {
    const colors: NotificationTypeColors = {
      message: 'bg-blue-100 text-blue-800',
      payment: 'bg-green-100 text-green-800',
      system: 'bg-gray-100 text-gray-800',
      reminder: 'bg-yellow-100 text-yellow-800',
      welcome: 'bg-purple-100 text-purple-800',
      security: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return '🔴';
    if (priority === 'medium') return '🟡';
    return '🟢';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.isRead;
    if (selectedFilter === 'read') return notification.isRead;
    return notification.type === selectedFilter;
  });

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(notif => notif.id));
    }
  };

  const markSelectedAsRead = () => {
    selectedNotifications.forEach((id) => {
      markAsRead(id);
    });
    setSelectedNotifications([]);
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-deepskyblue">Notifications</h1>
              <p className="text-boldblue font-semibold text-sm my-2">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedNotifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                  onClick={markSelectedAsRead}
                  className="cursor-pointer px-3 py-2 bg-boldblue text-white rounded-lg hover:bg-boldblue/70 transition-colors flex items-center gap-2 text-sm"
                  >
                  <IoCheckmarkOutline />
                  Mark as Read
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <IoFilterOutline className="text-gray-500" />
            <span className="text-sm text-gray-600 mr-2">Filter by:</span>
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
              { key: 'read', label: 'Read', count: notifications.filter(n => n.isRead).length },
              { key: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
              { key: 'security', label: 'Security', count: notifications.filter(n => n.type === 'security').length },
              { key: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-boldblue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {filteredNotifications.length > 0 && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-white rounded-lg border">
              <button
                onClick={selectAllNotifications}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                {selectedNotifications.length === filteredNotifications.length ? 
                  <IoCheckboxOutline className="text-boldblue" /> : 
                  <IoSquareOutline />
                }
                {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
              </button>
              {selectedNotifications.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {selectedFilter === 'all' 
                  ? "You don't have any notifications yet." 
                  : `No ${selectedFilter} notifications found.`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelectNotification(notification.id)}
                    className="mt-1 text-gray-400 hover:text-boldblue"
                  >
                    {selectedNotifications.includes(notification.id) ? 
                      <IoCheckboxOutline className="text-boldblue" /> : 
                      <IoSquareOutline />
                    }
                  </button>

                  {/* Priority Indicator */}
                  <div className="mt-1">
                    {getPriorityIcon(notification.priority)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-boldblue rounded-full"></span>
                          )}
                        </div>
                        <p className={`text-sm mb-2 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">{notification.timestamp}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.isRead ? (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-boldblue hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <IoEyeOutline />
                          </button>
                        ) : (
                          <button
                            className="p-2 text-gray-400 hover:text-boldblue hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as unread"
                          >
                            <IoEyeOutline className="opacity-50" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <IoCloseOutline />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
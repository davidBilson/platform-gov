import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuth';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useNotification = create((set, get) => ({
  notifications: [],
  count: 0,
  isInitialized: false,
  socket: null,
  listenerCleanup: null,
  initializationId: null,

  lastNotificationId: null,
  setLastNotificationId: (id) => set({ lastNotificationId: id }),
  
  init: (socket) => {
    if (!socket) {
      console.error('❌ Cannot initialize notifications - socket is null');
      return () => {};
    }

    const state = get();
    const initId = `init_${Date.now()}`;
    
    if (state.isInitialized && state.initializationId) {
      return state.listenerCleanup || (() => {});
    }

    if (state.listenerCleanup) {
      state.listenerCleanup();
    }

    const handleNotification = (notification) => {
      set(state => {
        if (state.lastNotificationId === notification._id) return state;
        
        const updatedNotifications = [notification, ...state.notifications];
        const newCount = updatedNotifications.filter(n => !n.isRead).length;
        
        return {
          notifications: updatedNotifications,
          count: newCount,
          lastNotificationId: notification._id
        };
      });
    };

    const handleConnectionStatus = (status) => {
      console.log('🔌 Socket connection status changed:', status);
    };

    const handleNotificationError = (error) => {
      console.error('🚫 Notification error:', error);
    };

    socket.off('new-notification');
    socket.off('notification-error');
    socket.off('connection-status');

    socket.on('new-notification', handleNotification);
    socket.on('notification', handleNotification);
    socket.on('notification-error', handleNotificationError);
    socket.on('connection-status', handleConnectionStatus);

    const debugHandler = (eventName, ...args) => {
      if (eventName.includes('notification') || eventName === 'new-message') {
        
        if (eventName !== 'new-notification' && args[0] && typeof args[0] === 'object') {
          const data = args[0];
          if (data._id && data.title) {
            console.log(`🔄 Processing alternate notification event: ${eventName}`);
            handleNotification(data);
          }
        }
      }
    };
    
    socket.onAny(debugHandler);

    const notificationHandler = (notification) => {
      get().processNotification(notification);
    };
  
    socket.on('new-notification', notificationHandler);

    // Create cleanup function
    const cleanup = () => {
      console.log(`🧹 Cleaning up notification listeners (${initId})`);
      socket.off('new-notification', notificationHandler);
      socket.off('new-notification', handleNotification);
      socket.off('notification', handleNotification);
      socket.off('notification-error', handleNotificationError);
      socket.off('connection-status', handleConnectionStatus);
      socket.offAny(debugHandler);
    };

    // Update state
    set({ 
      socket,
      isInitialized: true,
      listenerCleanup: cleanup,
      initializationId: initId
    });
    
    // Fetch initial notifications
    get().fetchNotifications();

    // Return cleanup function
    return cleanup;
  },
  
  fetchNotifications: async () => {
    try {
      const { userId } = useAuthStore.getState();
      if (!userId) {
        console.error('❌ Cannot fetch notifications - User ID not available');
        return;
      }
      
      
      const res = await axios.get(`${API_URL}/api/notifications/get-notifications/${userId}`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const notifications = res.data || [];
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      set({
        notifications,
        count: unreadCount
      });
      
      return notifications;
    } catch (error) {
      console.error('🚫 Failed to fetch notifications:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      return [];
    }
  },
  
  markAsRead: async (id) => {
    if (!id) {
      console.error('❌ Cannot mark as read - ID is required');
      return;
    }

    try {
      console.log(`📖 Marking notification as read: ${id}`);
      
      await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      set(state => {
        const updated = state.notifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        );
        const newCount = updated.filter(n => !n.isRead).length;
        
        console.log(`✅ Notification marked as read. New unread count: ${newCount}`);
        
        return {
          notifications: updated,
          count: newCount
        };
      });
    } catch (error) {
      console.error('🚫 Failed to mark notification as read:', {
        id,
        message: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  markAllAsRead: async () => {
    try {
      const { userId } = useAuthStore.getState();
      if (!userId) {
        console.error('❌ Cannot mark all as read - User ID not available');
        return;
      }
      
      console.log(`📖 Marking all notifications as read for user: ${userId}`);
      
      await axios.put(`${API_URL}/api/notifications/read-all`, 
        { userId }, 
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      set(state => {
        const updated = state.notifications.map(n => ({ ...n, isRead: true }));
        
        console.log('✅ All notifications marked as read');
        
        return {
          notifications: updated,
          count: 0
        };
      });
    } catch (error) {
      console.error('🚫 Failed to mark all notifications as read:', {
        message: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  deleteNotification: async (id) => {
    if (!id) {
      console.error('❌ Cannot delete notification - ID is required');
      return;
    }

    try {
      console.log(`🗑️ Deleting notification: ${id}`);
      
      await axios.delete(`${API_URL}/api/notifications/delete/${id}`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      set(state => {
        const filtered = state.notifications.filter(n => n._id !== id);
        const newCount = filtered.filter(n => !n.isRead).length;
        
        console.log(`✅ Notification deleted. Remaining: ${filtered.length} (${newCount} unread)`);
        
        return {
          notifications: filtered,
          count: newCount
        };
      });
    } catch (error) {
      console.error('🚫 Failed to delete notification:', {
        id,
        message: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },
  
  // Add a single notification (for testing or manual addition)
  addNotification: (notification) => {
    set(state => {
      const exists = state.notifications.find(n => n._id === notification._id);
      if (exists) {
        // console.log('⚠️ Notification already exists:', notification._id);
        return state;
      }
      
      const updated = [notification, ...state.notifications];
      const newCount = updated.filter(n => !n.isRead).length;
      
      // console.log(`📝 Notification added manually. Total: ${updated.length}`);
      
      return {
        notifications: updated,
        count: newCount
      };
    });
  },
  
  // Force refresh notifications
  refresh: async () => {
    // console.log('🔄 Force refreshing notifications...');
    return await get().fetchNotifications();
  },
  
  // Get notification by ID
  getNotificationById: (id) => {
    const { notifications } = get();
    return notifications.find(n => n._id === id);
  },
  
  // Get unread notifications
  getUnreadNotifications: () => {
    const { notifications } = get();
    return notifications.filter(n => !n.isRead);
  },
  
  reset: () => {
    const state = get();
    
    // console.log(`🔄 Resetting notification store (${state.initializationId})`);
    
    // Cleanup listeners
    if (state.listenerCleanup) {
      state.listenerCleanup();
    }
    
    // Reset state
    set({ 
      notifications: [], 
      count: 0, 
      isInitialized: false,
      socket: null,
      listenerCleanup: null,
      initializationId: null
    });
    
    // console.log('✅ Notification store reset complete');
  },
  
  // Debug function to get current state
  getDebugInfo: () => {
    const state = get();
    return {
      notificationCount: state.notifications.length,
      unreadCount: state.count,
      isInitialized: state.isInitialized,
      hasSocket: !!state.socket,
      initializationId: state.initializationId,
      socketConnected: state.socket?.connected || false,
      socketId: state.socket?.id || null,
      latestNotification: state.notifications[0] || null
    };
  },
  processNotification: (notification) => {
    const state = get();
    if (state.lastNotificationId === notification._id) return;
    
    set({
      notifications: [notification, ...state.notifications],
      count: state.count + (notification.isRead ? 0 : 1),
      lastNotificationId: notification._id
    });
  }
}));
import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuth';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useNotification = create((set, get) => ({
  notifications: [],
  count: 0,
  isInitialized: false,
  
  init: (socket) => {
    if (!socket || get().isInitialized) return;
  
    const handleNotification = (notification) => {
      console.log('Received new notification:', notification);
      set(state => ({
        notifications: [notification, ...state.notifications],
        count: state.count + 1
      }));
    };
    
    // Clean up existing listeners
    socket.off('new-notification');
    
    // Add the new listener
    socket.on('new-notification', handleNotification);
    
    // Mark as initialized
    set({ isInitialized: true });
    
    // Fetch initial notifications
    get().fetchNotifications();
  
    return () => {
      socket.off('new-notification');
      set({ isInitialized: false });
    };
  },
  
  fetchNotifications: async () => {
    try {
      const { userId } = useAuthStore.getState();
      if (!userId) {
        console.error('User ID is not available for notifications!');
        return;
      }
      const res = await axios.get(`${API_URL}/api/notifications/get-notifications/${userId}`);
      console.log('Fetched notifications:', res.data);
      set({
        notifications: res.data,
        count: res.data.filter(n => !n.isRead).length
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },
  
  markAsRead: async (id) => {
    try {
      await axios.put(`${API_URL}/api/notifications/${id}/read`);
      set(state => {
        const updated = state.notifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        );
        return {
          notifications: updated,
          count: updated.filter(n => !n.isRead).length
        };
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },
  
  markAllAsRead: async () => {
    try {
      const { userId } = useAuthStore.getState();
      await axios.put(`${API_URL}/api/notifications/read-all`, { userId });
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        count: 0
      }));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },
  
  deleteNotification: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/delete/${id}`);
      set(state => {
        const filtered = state.notifications.filter(n => n._id !== id);
        return {
          notifications: filtered,
          count: filtered.filter(n => !n.isRead).length
        };
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },
  
  reset: () => set({ notifications: [], count: 0, isInitialized: false })
}));

export default useNotification;
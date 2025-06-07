import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuth';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useNotification = create((set, get) => ({
  notifications: [],
  count: 0,
  
  init: (socket) => {
    if (!socket) return;
  
    const handleNotification = (notification) => {
      set(state => ({
        notifications: [notification, ...state.notifications],
        count: state.count + 1
      }));
    };
    
    socket.off('new-notification');
    
    socket.on('new-notification', handleNotification);
    
    get().fetchNotifications();
  
    return () => {
      socket.off('new-notification');
    };
  },
  
  fetchNotifications: async () => {
    try {
      const { userId } = useAuthStore.getState();
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
      await axios.put(`${API_URL}/api/notifications/read-all`);
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
      await axios.delete(`${API_URL}/api/notifications/${id}`);
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
  
  reset: () => set({ notifications: [], count: 0 })
}));

export default useNotification;
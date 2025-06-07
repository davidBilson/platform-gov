import axios from 'axios';
import useAuthStore from '@/store/useAuth';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const { userId } = useAuthStore.getState();

export const getNotifications = () => axios.get(`${API_URL}/api/notifications/get-notifications/${userId}`);
export const markAsRead = (id: string) => axios.put(`${API_URL}/api/notifications/${id}/read`);
export const markAllAsRead = () => axios.put(`${API_URL}/api/notifications/read-all`);
export const deleteNotification = (id: string) => axios.delete(`${API_URL}/api/notifications/${id}`);
export const getUnreadCount = () => axios.get(`${API_URL}/api/notifications/unread-count`);
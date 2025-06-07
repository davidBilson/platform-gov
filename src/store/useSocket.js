import { create } from 'zustand';
import io from 'socket.io-client';
import useAuthStore from './useAuth';

const useSocket = create((set, get) => ({
  socket: null,
  isConnected: false,
  connectionError: null,

  connect: () => {
    console.log('Connecting to socket...');
    if (get().socket) return;

    setTimeout(() => {
      const { userId } = useAuthStore.getState();
      if (!userId) return;

      const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
          auth: {
              userId: userId
          },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      set({ socket, isConnected: false, connectionError: null });

      socket.on('connect', () => {
        set({ isConnected: true });
        socket.emit('join-room', userId);
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        set({ isConnected: false });
        console.log('Socket disconnected');
      });
  
      socket.on('connect_error', (error) => {
        console.error('Connection failed:', error);
        setTimeout(() => get().connect(), 5000); // Reconnect after 5s
      });
  
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

    }, 1000)
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinRoom: (room) => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.emit('join-room', room);
    }
  },

  leaveRoom: (room) => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.emit('leave-room', room);
    }
  },

  subscribe: (event, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.on(event, callback);
    }
  },

  unsubscribe: (event, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.off(event, callback);
    }
  },

  emit: (event, data) => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.emit(event, data);
    }
  }
}));

export default useSocket;
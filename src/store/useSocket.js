import { create } from 'zustand';
import io from 'socket.io-client';
import useAuthStore from './useAuth';

const useSocket = create((set, get) => ({
  // Core state
  socket: null,
  isConnected: false,
  connecting: false,
  connectionError: null,
  
  // Connection management
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  
  // Room management
  activeRooms: [],
  
  // Connect to socket
  connect: () => {
    const state = get();
    
    // Prevent duplicate connections
    if (state.socket || state.connecting) {
      return state.socket;
    }

    const { userId } = useAuthStore.getState();
    if (!userId) {
      console.log('❌ No userId available for socket connection');
      return null;
    }

    set({ connecting: true, connectionError: null });

    try {
      const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
        auth: { userId },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true
      });

      // Set socket immediately
      set({ 
        socket, 
        connecting: false,
        reconnectAttempts: 0 
      });

      // Connection handlers
      socket.on('connect', () => {
        console.log('✅ Socket connected');
        set({
          isConnected: true,
          connectionError: null,
          reconnectAttempts: 0
        });

        // Join user's notification room
        socket.emit('join-room', userId);
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        set({ isConnected: false });
      });

      socket.on('connect_error', (error) => {
        console.error('🚫 Connection error:', error.message);
        const attempts = get().reconnectAttempts + 1;
        
        set({
          connectionError: error.message,
          connecting: false,
          isConnected: false,
          reconnectAttempts: attempts
        });

        if (attempts >= get().maxReconnectAttempts) {
          console.error('❌ Max connection attempts reached');
          get().disconnect();
        }
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        set({
          isConnected: true,
          connectionError: null,
          reconnectAttempts: 0
        });

        // Rejoin notification room
        socket.emit('join-room', userId);
        console.log(`🏠 Rejoined notification room: ${userId}`);
      });

      // Debug: Log raw notification events
      socket.on('new-notification', (data) => {
        console.log('🔔 [SOCKET] Raw notification received:', data);
      });

      return socket;

    } catch (error) {
      console.error('❌ Error creating socket:', error);
      set({
        connecting: false,
        connectionError: error.message
      });
      return null;
    }
  },

  // Disconnect socket
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      console.log('🔌 Disconnecting socket...');
      socket.removeAllListeners();
      socket.disconnect();
      
      set({
        socket: null,
        isConnected: false,
        connecting: false,
        connectionError: null,
        reconnectAttempts: 0,
        activeRooms: []
      });
      
      console.log('✅ Socket disconnected and cleaned up');
    }
  },

  joinRoom: (room) => {
    const { socket, isConnected } = get();
    
    if (socket && isConnected) {
      socket.emit('join-room', room);
      console.log(`🏠 Joined room: ${room}`);
      
      // Add to active rooms
      set(state => ({
        activeRooms: [...new Set([...state.activeRooms, room])]
      }));
    }
  },

  // Leave room
  leaveRoom: (room) => {
    const { socket, isConnected } = get();
    
    if (socket && isConnected) {
      socket.emit('leave-room', room);
      console.log(`🚪 Left room: ${room}`);
    }
    
    // Remove from active rooms
    set(state => ({
      activeRooms: state.activeRooms.filter(r => r !== room)
    }));
  },

  // Subscribe to event
  subscribe: (event, callback) => {
    const { socket } = get();
    
    if (socket) {
      console.log(`📡 Subscribing to: ${event}`);
      socket.on(event, callback);
      
      return () => {
        socket.off(event, callback);
        console.log(`📡 Unsubscribed from: ${event}`);
      };
    }
    
    return () => {};
  },

  // Emit event
  emit: (event, data) => {
    const { socket, isConnected } = get();
    
    if (socket && isConnected) {
      socket.emit(event, data);
      console.log(`📤 Emitted ${event}:`, data);
      return true;
    }
    
    console.warn(`⚠️ Cannot emit ${event} - socket not connected`);
    return false;
  },

  // Check if socket is ready
  isReady: () => {
    const { socket, isConnected } = get();
    return !!(socket && isConnected && socket.connected);
  },

  // Get connection info
  getConnectionInfo: () => {
    const { socket, isConnected, connectionError, reconnectAttempts } = get();
    return {
      socketId: socket?.id || null,
      isConnected,
      connectionError,
      reconnectAttempts,
      isSocketActive: socket?.connected || false
    };
  }
}));

export default useSocket;
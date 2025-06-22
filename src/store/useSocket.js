import { create } from 'zustand';
import io from 'socket.io-client';
import useAuthStore from './useAuth';

const useSocket = create((set, get) => ({
  socket: null,
  isConnected: false,
  connectionError: null,
  connecting: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  activeRooms: [],
  connectionId: null, // Track connection instances

  rejoinRooms: () => {
    const { socket, isConnected, activeRooms } = get();
    const { userId } = useAuthStore.getState();

    if (socket && isConnected && userId) {
      // First join user's personal room
      socket.emit('join-room', userId);
      
      // Then rejoin other active rooms
      if (activeRooms.length > 0) {
        socket.emit('rejoin-rooms', activeRooms);
      }
      
      console.log(`Rejoined ${activeRooms.length + 1} rooms for user ${userId}`);
    }
  },

  connect: () => {
    const state = get();
    
    // Prevent duplicate connections
    if (state.socket || state.connecting) {
      console.log('Socket already exists or connecting, skipping...');
      return state.socket;
    }

    const { userId } = useAuthStore.getState();
    if (!userId) {
      console.log('No userId available, cannot connect socket');
      return null;
    }

    console.log('Initializing socket connection for user:', userId);
    set({ connecting: true, connectionError: null });

    try {
      // Create unique connection ID
      const connectionId = `${userId}_${Date.now()}`;
      
      const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
        auth: { 
          userId,
          connectionId 
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true,
        // Add query params for better identification
        query: {
          userId,
          timestamp: Date.now()
        }
      });

      // Set socket immediately to prevent race conditions
      set({ 
        socket, 
        connecting: false, 
        connectionId,
        reconnectAttempts: 0 
      });

      // Connection success handler
      socket.on('connect', () => {
        console.log('✅ Socket connected successfully:', socket.id);
        set({ 
          isConnected: true, 
          connectionError: null,
          reconnectAttempts: 0 
        });
        
        // Auto-join user's personal notification room
        socket.emit('join-room', userId);
        console.log(`🔔 Joined notification room for user: ${userId}`);
        
        // Rejoin previously active rooms
        get().rejoinRooms();
      });

      // Disconnection handler
      socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        set({ isConnected: false });
        
        // Handle different disconnect reasons
        if (reason === 'io server disconnect') {
          console.log('Server initiated disconnect - will not auto-reconnect');
        } else if (reason === 'io client disconnect') {
          console.log('Client initiated disconnect - manual disconnect');
        } else {
          console.log('Unexpected disconnect - auto-reconnect will handle');
        }
      });

      // Connection error handler
      socket.on('connect_error', (error) => {
        console.error('🚫 Socket connection error:', error.message);
        const attempts = get().reconnectAttempts + 1;
        set({ 
          connectionError: error.message,
          connecting: false,
          isConnected: false,
          reconnectAttempts: attempts
        });

        // If max attempts reached, cleanup
        if (attempts >= get().maxReconnectAttempts) {
          console.error('Max connection attempts reached, cleaning up...');
          get().disconnect();
        }
      });

      // Reconnection success handler
      socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        set({ 
          isConnected: true, 
          connectionError: null,
          reconnectAttempts: 0
        });
        
        // Critical: Immediately rejoin user's notification room after reconnection
        socket.emit('join-room', userId);
        console.log(`🔔 Rejoined notification room after reconnection: ${userId}`);
        
        // Rejoin other active rooms
        get().rejoinRooms();
      });

      // Reconnection attempt handler
      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
        set({ reconnectAttempts: attemptNumber });
      });

      // Reconnection error handler
      socket.on('reconnect_error', (error) => {
        console.error('🚫 Socket reconnection error:', error.message);
        set({ connectionError: error.message });
      });

      // Reconnection failed handler
      socket.on('reconnect_failed', () => {
        console.error('💥 Socket reconnection failed after maximum attempts');
        set({ 
          connectionError: 'Connection failed after maximum attempts',
          isConnected: false,
          reconnectAttempts: get().maxReconnectAttempts
        });
      });

      // Add notification-specific event debugging
      socket.on('new-notification', (data) => {
        console.log('🔔 Raw notification received:', data);
      });

      return socket;

    } catch (error) {
      console.error('💥 Error creating socket:', error);
      set({ 
        connecting: false,
        connectionError: error.message 
      });
      return null;
    }
  },

  disconnect: () => {
    const { socket, connectionId } = get();
    if (socket) {
      console.log(`🔌 Disconnecting socket (${connectionId})...`);
      
      // Remove all listeners to prevent memory leaks
      socket.removeAllListeners();
      socket.disconnect();
      
      set({ 
        socket: null, 
        isConnected: false, 
        connecting: false,
        connectionError: null,
        connectionId: null,
        reconnectAttempts: 0,
        activeRooms: [] // Clear active rooms on disconnect
      });
      
      console.log('🔌 Socket disconnected and cleaned up');
    }
  },

  // Enhanced room management
  joinRoom: (room) => {
    const { socket, isConnected } = get();
    
    if (socket && isConnected) {
      socket.emit('join-room', room);
      console.log(`🏠 Joined room: ${room}`);
      
      // Add to active rooms if not already present
      set((state) => ({
        activeRooms: [...new Set([...state.activeRooms, room])]
      }));
    } else {
      console.warn('⚠️ Cannot join room - socket not connected');
      
      // Still track the room for when connection is restored
      set((state) => ({
        activeRooms: [...new Set([...state.activeRooms, room])]
      }));
    }
  },

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

  // Enhanced subscription with automatic cleanup
  subscribe: (event, callback) => {
    const { socket } = get();
    
    if (socket) {
      console.log(`📡 Subscribing to event: ${event}`);
      socket.on(event, callback);
      
      // Return cleanup function
      return () => {
        console.log(`📡 Unsubscribing from event: ${event}`);
        socket.off(event, callback);
      };
    }
    
    console.warn(`⚠️ Cannot subscribe to ${event} - socket not available`);
    return () => {}; // Return empty cleanup if no socket
  },

  unsubscribe: (event, callback) => {
    const { socket } = get();
    
    if (socket) {
      if (callback) {
        socket.off(event, callback);
        console.log(`📡 Unsubscribed specific callback from: ${event}`);
      } else {
        socket.removeAllListeners(event);
        console.log(`📡 Removed all listeners for: ${event}`);
      }
    }
  },

  // Enhanced emit with retry logic
  emit: (event, data, retries = 3) => {
    const { socket, isConnected } = get();
    
    if (socket && isConnected) {
      socket.emit(event, data);
      console.log(`📤 Emitted ${event}:`, data);
      return true;
    } else {
      console.warn(`⚠️ Cannot emit ${event} - socket not connected`);
      
      // Retry logic for critical events
      if (retries > 0) {
        console.log(`🔄 Retrying emit in 1s... (${retries} attempts left)`);
        setTimeout(() => {
          get().emit(event, data, retries - 1);
        }, 1000);
      }
      
      return false;
    }
  },

  // Connection health check
  isReady: () => {
    const { socket, isConnected } = get();
    return !!(socket && isConnected && socket.connected);
  },

  // Force reconnection
  forceReconnect: () => {
    const { socket } = get();
    if (socket) {
      console.log('🔄 Forcing socket reconnection...');
      socket.disconnect().connect();
    } else {
      console.log('🔄 No socket to reconnect, creating new connection...');
      get().connect();
    }
  },

  // Get connection status info
  getConnectionInfo: () => {
    const { socket, isConnected, connectionError, reconnectAttempts, connectionId } = get();
    return {
      socketId: socket?.id || null,
      isConnected,
      connectionError,
      reconnectAttempts,
      connectionId,
      isSocketActive: socket?.connected || false
    };
  }
}));

export default useSocket;
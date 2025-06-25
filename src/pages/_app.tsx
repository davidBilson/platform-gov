"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import AOS from 'aos';
import { ToastContainer } from 'react-toastify';

import "@/styles/globals.css";
import 'aos/dist/aos.css';

import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import useAuthStore from "@/store/useAuth";
import useSocket from '@/store/useSocket';
import { useNotification } from '@/store/useNotificationStore';

import Navbar from "@/components/layout/navbar/navbar";
import NotificationToast from "@/components/notifications/notificationToast";

export default function App({ Component, pageProps }: AppProps) {
  
  const { socket, isConnected, connect, disconnect, isReady } = useSocket();
  const { userId } = useAuthStore();
  const { init, fetchNotifications, reset, getDebugInfo } = useNotification();

  const notifications = useNotification(state => state.notifications);
  const lastNotificationId = useNotification(state => state.lastNotificationId);
  const setLastNotificationId = useNotification(state => state.setLastNotificationId);

  const [toastNotification, setToastNotification] = useState(null);
  
  const socketInitialized = useRef(false);
  const notificationInitialized = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const connectionAttempts = useRef(0);
  const maxConnectionAttempts = 3;
  const aosInitialized = useRef(false);

  const performCleanup = useCallback(() => {
    console.log('🧹 Performing comprehensive cleanup...');
    
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    reset();
    socketInitialized.current = false;
    notificationInitialized.current = false;
    connectionAttempts.current = 0;
    setToastNotification(null);
    setLastNotificationId(null);
    
    console.log('✅ Cleanup completed');
  }, [reset]);

 useEffect(() => {
    const shouldConnect = userId && !socketInitialized.current;
    
    if (shouldConnect) {
      console.log('🔌 Initiating socket connection for user:', userId);
      socketInitialized.current = true;
      connectionAttempts.current += 1;
      
      const socketInstance = connect();
      
      if (socketInstance) {
        console.log('✅ Socket connection initiated');
      } else {
        console.error('❌ Failed to initiate socket connection');
        socketInitialized.current = false;
        
        if (connectionAttempts.current < maxConnectionAttempts) {
          const retryDelay = Math.pow(2, connectionAttempts.current) * 1000;
          console.log(`🔄 Retrying connection in ${retryDelay}ms (attempt ${connectionAttempts.current}/${maxConnectionAttempts})`);
          
          setTimeout(() => {
            socketInitialized.current = false;
          }, retryDelay);
        }
      }
    } else if (!userId) {
      if (socketInitialized.current) {
        console.log('🔌 User logged out or not authenticated, disconnecting socket');
        disconnect();
        performCleanup();
      }
    }

    // Cleanup on component unmount
    return () => {
      if (socketInitialized.current && socket) {
        console.log('🔌 Component unmounting, cleaning up socket connection');
        disconnect();
        performCleanup();
      }
    };
  }, [userId, connect, disconnect, performCleanup, socket]);


  useEffect(() => {
    const shouldInitializeNotifications = 
      socket && 
      isConnected && 
      userId && 
      !notificationInitialized.current;

    if (shouldInitializeNotifications) {
      console.log('🔔 Initializing notification system for user:', userId);
      
      try {
        const cleanup = init(socket);
        cleanupRef.current = cleanup;
        notificationInitialized.current = true;
        
        console.log('✅ Notification system initialized successfully');
        
        // Debug information
        setTimeout(() => {
          const debugInfo = getDebugInfo();
          console.log('📊 Notification Debug Info:', debugInfo);
        }, 1000);
        
      } catch (error) {
        console.error('❌ Error initializing notification system:', error);
        notificationInitialized.current = false;
      }
    } else if ((!socket || !isConnected || !userId) && notificationInitialized.current) {
      console.log('🔔 Conditions not met for notifications, cleaning up...');
      performCleanup();
    }

    // Cleanup function
    return () => {
      if (notificationInitialized.current && cleanupRef.current) {
        console.log('🔔 Cleaning up notification system on dependency change');
        cleanupRef.current();
        cleanupRef.current = null;
        notificationInitialized.current = false;
      }
    };
  }, [socket, isConnected, userId, init, performCleanup, getDebugInfo]);

  useEffect(() => {
    if (userId) {
      
      fetchNotifications()
        .then((notifications: Array<{ _id: string; title: string; isRead: boolean; createdAt: string }>) => {
          console.log(`✅ Initial fetch complete: ${notifications?.length || 0} notifications`);
        })
        .catch((error: unknown) => {
          console.error('❌ Failed to fetch initial notifications:', error);
        });
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    console.log('🔍 FULL NOTIFICATION STATE:', {
      notifications: notifications?.map((n: { _id: string; title: string; isRead: boolean; createdAt: string }) => ({
        id: n._id,
        title: n.title,
        isRead: n.isRead,
        createdAt: n.createdAt
      })),
      count: notifications?.length,
      lastId: lastNotificationId
    });
  }, [notifications, lastNotificationId]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      if (!latest.isRead) {
        setToastNotification(latest);
      }
    }
  }, [notifications]);

  useEffect(() => {
    console.log("Notification store updated", {
      count: useNotification.getState().count,
      lastId: useNotification.getState().lastNotificationId,
      notifications: useNotification.getState().notifications.map((n: { _id: string }) => n._id)
    });
  }, []);

  // Toast close handler
  const handleToastClose = useCallback(() => {
    console.log('🍞 Toast notification closed');
    setToastNotification(null);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const healthCheckInterval = setInterval(() => {
      const connectionInfo = {
        isReady: isReady(),
        isConnected,
        socketId: socket?.id,
        userId
      };
      
      console.log('💓 Connection Health Check:', connectionInfo);

      // If connection is unhealthy, attempt to reconnect
      if (!isReady() && userId) {
        console.log('⚠️ Unhealthy connection detected, attempting to reconnect...');
        socketInitialized.current = false;
        notificationInitialized.current = false;
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheckInterval);
  }, [socket, isReady, isConnected, userId]);

  // Initialize AOS only once
  useEffect(() => {
    if (!aosInitialized.current) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
      aosInitialized.current = true;
    }
  }, []);

  return (
    <>
      <Head>
        <title>GovLink Global</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <ReactQueryProvider>
        <Navbar />
        <AuthProvider>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className={'text-xs font-bold'}
            limit={3}
          />
          <Component {...pageProps} />

          {toastNotification && (
            <NotificationToast
              notification={toastNotification}
              onClose={handleToastClose}
              duration={4000}
            />
          )}
        </AuthProvider>
      </ReactQueryProvider>
    </>
  );
}
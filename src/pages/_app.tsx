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
      socketInitialized.current = true;
      connectionAttempts.current += 1;
      
      const socketInstance = connect();
      
      if (socketInstance) {
        console.log('Socket initiated');
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
      
      try {
        const cleanup = init(socket);
        cleanupRef.current = cleanup;
        notificationInitialized.current = true;
        
        console.log('✅ Notification system initialized successfully');
       
        
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
    if (notifications.length > 0) {
      const latest = notifications[0];
      if (!latest.isRead) {
        setToastNotification(latest);
      }
    }
  }, [notifications]);

  // Toast close handler
  const handleToastClose = useCallback(() => {
    setToastNotification(null);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const healthCheckInterval = setInterval(() => {
      const connectionInfo = {
        isReady: isReady(),
        isConnected,
        socketId: socket?.id,
      };
      
      console.log('💓 Connection Health Check');

      if (!isReady()) {
        console.log('⚠️ Unhealthy connection detected, attempting to reconnect...');
        socketInitialized.current = false;
        notificationInitialized.current = false;
      }
    }, 30000);

    return () => clearInterval(healthCheckInterval);
  }, [socket, isReady, isConnected]);

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
        
        {/* Favicon/Logo Meta Tags */}
        <link rel="icon" href="/favicon.ico" sizes="100" />
        <link rel="icon" type="image/png" href="/images/govlinklogo-nobg.png" />
        <link rel="apple-touch-icon" href="/images/govlinklogo-nobg.png" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="GovLink Global" />
        <meta property="og:description" content="Welcome to GovLink Global" />
        <meta property="og:image" content="/images/govlinklogo-nobg.png" />
        <meta property="og:url" content="https://platform-gov.onrender.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GovLink Global" />
        <meta name="twitter:description" content="Welcome to GovLink Global" />
        <meta name="twitter:image" content="/images/govlinklogo-nobg.png" />
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
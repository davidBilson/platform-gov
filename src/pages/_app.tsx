import 'aos/dist/aos.css';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"
import Head from "next/head";
import Navbar from "@/components/layout/navbar/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuth";
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';
import useNotification from '@/store/useNotification';
import useSocket from '@/store/useSocket';
import NotificationToast from "@/components/notifications/notificationToast";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userId, isLoading, initAuth, verificationStep } = useAuthStore();
  
  const publicRoutes = [
    '/account/sign-up',
    '/account/sign-in',
    '/account/forgot-password',
    '/account/reset-password',
    '/account/verification',
    '/privacy-policy',
    '/',
    '/admin'
  ];

  const isPublicRoute =
    publicRoutes.includes(router.pathname) ||
    publicRoutes.some(route => router.pathname.startsWith(route + '/'));

    const isVerificationPage = router.pathname === '/account/verification';
  
    useEffect(() => {
      initAuth();
    }, [initAuth]);

    // Connect socket when user is authenticated
    useEffect(() => {
      if (userId) {
        useSocket.getState().connect();
      }
    }, [userId]);
  
    useEffect(() => {
      if (!isLoading && !userId && !isPublicRoute) {
        router.replace('/account/sign-in');
      }
    }, [userId, isPublicRoute, isLoading, router]);
  

  useEffect(() => {
    if (!isLoading) {

      if (userId && router.pathname === '/account/sign-up') {

        if (verificationStep !== 'completed') {
          router.replace('/account/verification');
        } else {
          router.replace('/');
        }
        
      } 

      else if (isVerificationPage && !userId) {
        router.replace('/account/sign-up');
      }

      else if (userId && router.pathname === '/account/sign-in') {
        router.replace('/');
      }
    }
  }, [userId, router.pathname, isLoading, router, verificationStep, isVerificationPage]);

  return isPublicRoute || userId ? <>{children}</> : null;
}

export default function App({ Component, pageProps }: AppProps) {

  const socket = useSocket(state => state.socket);
  const isConnected = useSocket(state => state.isConnected);
  const { markAsRead, notifications, init, fetchNotifications, reset } = useNotification();
  const { userId } = useAuthStore();


   const [toastNotification, setToastNotification] = useState(null);
   const [lastNotificationId, setLastNotificationId] = useState(null);

  useEffect(() => {
    if (socket && isConnected && userId) {
      const cleanup = init(socket);
      return cleanup; 
    } else if (!userId) {
      reset();
      setToastNotification(null);
      setLastNotificationId(null);
    }
  }, [socket, isConnected, userId, init, reset]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]; // Newest notification is first
      
      // Only show toast if this is a new notification we haven't seen before
      if (latestNotification._id !== lastNotificationId) {
        setToastNotification(latestNotification);
        setLastNotificationId(latestNotification._id);
      }
    }
  }, [notifications, lastNotificationId]);

  const handleToastClose = () => {
    setToastNotification(null);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
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
        <AuthWrapper>
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
          />
          <Component {...pageProps} />

          <NotificationToast
            notification={toastNotification}
            onClose={handleToastClose}
            duration={4000}
          />
        </AuthWrapper>
      </ReactQueryProvider>
    </>
  );
}
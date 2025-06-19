import { useEffect, useState } from "react";
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
  const socket = useSocket(state => state.socket);
  const isConnected = useSocket(state => state.isConnected);
  const { notifications, init, fetchNotifications, reset } = useNotification();
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
      const latestNotification = notifications[0];

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

        <link rel="icon" href="/favicon.ico" sizes="100" />
        <link rel="icon" type="image/png" href="/images/govlinklogo-nobg.png" />
        <link rel="apple-touch-icon" href="/images/govlinklogo-nobg.png" />

        <meta property="og:title" content="GovLink Global" />
        <meta property="og:description" content="Welcome to GovLink Global" />
        <meta property="og:image" content="/images/govlinklogo-nobg.png" />
        <meta property="og:url" content="https://platform-gov.onrender.com" />
        <meta property="og:type" content="website" />

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
          />
          <Component {...pageProps} />

          <NotificationToast
            notification={toastNotification}
            onClose={handleToastClose}
            duration={4000}
          />
        </AuthProvider>
      </ReactQueryProvider>
    </>
  );
}
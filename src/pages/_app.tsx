// src/pages/_app.tsx or wherever your App component lives
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/layout/navbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { ToastContainer } from 'react-toastify';

// Auth protection wrapper
// Update this in your _app.tsx
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userId, isLoading, initAuth } = useAuthStore();  // Removed verificationStep import

  const publicRoutes = [
    '/auth/sign-up',
    '/auth/sign-in',
    '/auth/forgot-password',
    '/auth/verification',
    '/'
  ];

  const isPublicRoute =
    publicRoutes.includes(router.pathname) ||
    publicRoutes.some(route => router.pathname.startsWith(route + '/'));

  const isAuthPage = ['/auth/sign-in', '/auth/sign-up'].includes(router.pathname);

  // Initialize auth on first load
  useEffect(() => {
    initAuth();
  }, []);

  // Redirect if not authenticated and trying to access protected route
  useEffect(() => {
    if (!isLoading && !userId && !isPublicRoute) {
      router.push('/auth/sign-in');
    }
  }, [userId, isPublicRoute, isLoading, router]);

  // Redirect logged-in users away from login/signup pages
  // BUT MAKE EXCEPTION for verification page
  useEffect(() => {
    // Only redirect from auth pages if we're not on verification page
    if (!isLoading && userId && isAuthPage && router.pathname !== '/auth/verification') {
      router.push('/');
    }
  }, [userId, isAuthPage, isLoading, router]);

  // Gate rendering until auth check is done
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Lazy load children only when allowed
  return isPublicRoute || userId ? <>{children}</> : null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
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
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
    </>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/layout/navbar/navbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { ToastContainer } from 'react-toastify';
// import Logo from "@/components/ui/logo";


function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userId, isLoading, initAuth, verificationStep } = useAuthStore();  // Added verificationStep

  const publicRoutes = [
    '/auth/sign-up',
    '/auth/sign-in',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verification',
    '/'
  ];

  const isPublicRoute =
    publicRoutes.includes(router.pathname) ||
    publicRoutes.some(route => router.pathname.startsWith(route + '/'));

    // const isAuthPage = ['/auth/sign-in', '/auth/sign-up'].includes(router.pathname);
    const isVerificationPage = router.pathname === '/auth/verification';
  
    // Initialize auth on first load
    useEffect(() => {
      initAuth();
    }, [initAuth]);
  
    // Redirect if not authenticated and trying to access protected route
    useEffect(() => {
      if (!isLoading && !userId && !isPublicRoute) {
        router.replace('/auth/sign-in');
      }
    }, [userId, isPublicRoute, isLoading, router]);
  

  // Handle redirection for verification flow
  useEffect(() => {
    if (!isLoading) {
      // If user is logged in but still on signup page, redirect to verification or home
      if (userId && router.pathname === '/auth/sign-up') {
        // If verification is not completed, go to verification page
        if (verificationStep !== 'completed') {
          router.replace('/auth/verification');
        } else {
          router.replace('/');
        }
      } 
      // If user is on verification page but has no userId, redirect to signup
      else if (isVerificationPage && !userId) {
        router.replace('/auth/sign-up');
      }
      // If user is logged in and on login page, redirect to home
      else if (userId && router.pathname === '/auth/sign-in') {
        router.replace('/');
      }
    }
  }, [userId, router.pathname, isLoading, router, verificationStep]);

  // if (isLoading) {
  //   return <div className="fixed top-0 left-0 flex items-center justify-center h-screen animate-pulse">
  //           <Logo />
  //          </div>;
  // }

  // Lazy load children only when allowed
  return isPublicRoute || userId ? <>{children}</> : null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
      </Head>
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
      </AuthWrapper>
    </>
  );
}

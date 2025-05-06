import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/layout/navbar/navbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useAuthStore from "@/store/useAuth";
import { ToastContainer } from 'react-toastify';


function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userId, isLoading, initAuth, verificationStep } = useAuthStore();

  const publicRoutes = [
    '/auth/sign-up',
    '/auth/sign-in',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verification',
    '/privacy-policy',
    '/'
  ];

  const isPublicRoute =
    publicRoutes.includes(router.pathname) ||
    publicRoutes.some(route => router.pathname.startsWith(route + '/'));

    const isVerificationPage = router.pathname === '/auth/verification';
  
    useEffect(() => {
      initAuth();
    }, [initAuth]);
  
    useEffect(() => {
      if (!isLoading && !userId && !isPublicRoute) {
        router.replace('/auth/sign-in');
      }
    }, [userId, isPublicRoute, isLoading, router]);
  

  useEffect(() => {
    if (!isLoading) {

      if (userId && router.pathname === '/auth/sign-up') {

        if (verificationStep !== 'completed') {
          router.replace('/auth/verification');
        } else {
          router.replace('/');
        }
        
      } 

      else if (isVerificationPage && !userId) {
        router.replace('/auth/sign-up');
      }

      else if (userId && router.pathname === '/auth/sign-in') {
        router.replace('/');
      }
    }
  }, [userId, router.pathname, isLoading, router, verificationStep, isVerificationPage]);

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
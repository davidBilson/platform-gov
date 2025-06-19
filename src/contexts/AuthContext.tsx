import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/store/useAuth';
import useSocket from '@/store/useSocket';
import { checkIfUserIsSuspended } from '@/api/auth-api';

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
  verificationStep: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

  const router = useRouter();
  const { userId, isLoading, initAuth, verificationStep, resetAll } = useAuthStore();
  
  const handleSignOut = () => {
    resetAll();
    router.push('/account/sign-in');
  }

  const { data: isSuspended } = useQuery({
    queryKey: ['userSuspensionStatus', userId],
    queryFn: async () => {
      if (!userId) return false;
      return await checkIfUserIsSuspended(userId);
    },
    enabled: !!userId,
    refetchInterval: 2 * 60 * 1000,
    refetchIntervalInBackground: true,
    retry: 3, // Retry 3 times on failure
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 4 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuspended === true && userId) {
      handleSignOut();
    }
  }, [isSuspended, userId]);
  
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

  useEffect(() => {
    if (userId) {
      useSocket.getState().connect();
    }
  }, [userId]);
  
  // Fixed: Don't redirect from verification page when userId is missing
  useEffect(() => {
    if (!isLoading && !userId && !isPublicRoute) {
      router.replace('/account/sign-in');
    }
  }, [userId, isPublicRoute, isLoading, router]);
  
  // Consolidated navigation logic
  useEffect(() => {
    if (!isLoading) {
      // Handle verification page access
      if (isVerificationPage && !userId) {
        router.replace('/account/sign-up');
        return;
      }
      
      // Handle authenticated user on auth pages
      if (userId) {
        if (router.pathname === '/account/sign-up') {
          if (verificationStep !== 'completed') {
            router.replace('/account/verification');
          } else {
            router.replace('/');
          }
          return;
        }
        
        if (router.pathname === '/account/sign-in') {
          router.replace('/');
          return;
        }
      }
    }
  }, [userId, router.pathname, isLoading, router, verificationStep, isVerificationPage]);

  const contextValue: AuthContextType = {
    userId,
    isLoading,
    verificationStep
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isPublicRoute || userId ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
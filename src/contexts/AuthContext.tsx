import React, { createContext, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
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
  const initAuthCalled = useRef(false);
  const socketConnected = useRef(false);
  
  const { userId, isLoading, initAuth, verificationStep, resetAll } = useAuthStore();
  
  const handleSignOut = useCallback(() => {
    // Disconnect socket first
    useSocket.getState().disconnect();
    socketConnected.current = false;
    
    resetAll();
    router.push('/account/sign-in');
  }, [resetAll, router]);

  const { data: isSuspended } = useQuery({
    queryKey: ['userSuspensionStatus', userId],
    queryFn: async () => {
      if (!userId) return false;
      return await checkIfUserIsSuspended(userId);
    },
    enabled: !!userId,
    refetchInterval: 2 * 60 * 1000,
    refetchIntervalInBackground: true,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 4 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (isSuspended === true && userId) {
      handleSignOut();
    }
  }, [isSuspended, userId, handleSignOut]);
  
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
  
  // Initialize auth only once
  useEffect(() => {
    if (!initAuthCalled.current) {
      initAuthCalled.current = true;
      initAuth();
    }
  }, [initAuth]);

  // Handle socket connection with proper cleanup
  useEffect(() => {
    const { connect, disconnect, rejoinRooms } = useSocket.getState();
    
    if (userId && !socketConnected.current) {
      console.log('Connecting socket for authenticated user:', userId);
      connect();
      socketConnected.current = true;
    } else if (userId && socketConnected.current) {
      rejoinRooms();
    } else if (!userId && socketConnected.current) {
      console.log('Disconnecting socket - user not authenticated');
      disconnect();
      socketConnected.current = false;
    }
  }, [userId]);
  
  useEffect(() => {
    return () => {
      if (socketConnected.current) {
        useSocket.getState().disconnect();
        socketConnected.current = false;
      }
    };
  }, []);
  
  // Route protection
  useEffect(() => {
    if (!isLoading && !userId && !isPublicRoute) {
      router.replace('/account/sign-in');
    }
  }, [userId, isPublicRoute, isLoading, router]);
  
  // Navigation logic with reduced complexity
  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    
    const currentPath = router.pathname;
    
    // Handle verification page access
    if (isVerificationPage && !userId) {
      router.replace('/account/sign-up');
      return;
    }
    
    // Handle authenticated user on auth pages
    if (userId) {
      if (currentPath === '/account/sign-up') {
        const targetPath = verificationStep !== 'completed' 
          ? '/account/verification' 
          : '/';
        router.replace(targetPath);
        return;
      }
      
      if (currentPath === '/account/sign-in') {
        router.replace('/');
        return;
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
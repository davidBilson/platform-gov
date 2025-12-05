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
  const redirectInProgress = useRef(false);

  const { userId, isLoading, initAuth, verificationStep, resetAll } = useAuthStore();

  const handleSignOut = useCallback(() => {
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
    '/vetting', // Public vetting confirmation/rejection pages
    '/',
  ];

  const isPublicRoute =
    publicRoutes.includes(router.pathname) ||
    publicRoutes.some(route => router.pathname.startsWith(route + '/'));

  const isVerificationPage = router.pathname === '/account/verification';
  const isAdminRoute = router.pathname.startsWith('/admin');

  // Initialize auth only once
  useEffect(() => {
    if (!initAuthCalled.current) {
      initAuthCalled.current = true;
      initAuth();
    }
  }, [initAuth]);

  // Handle socket connection with proper cleanup
  // Only manage socket for authenticated users, skip on public routes
  useEffect(() => {
    // Skip socket management on public routes to prevent infinite loops
    if (isPublicRoute) {
      return;
    }

    const { connect, disconnect } = useSocket.getState();

    if (userId && !socketConnected.current) {
      connect();
      socketConnected.current = true;
    } else if (!userId && socketConnected.current) {
      console.log('Disconnecting socket - user not authenticated');
      disconnect();
      socketConnected.current = false;
    }
  }, [userId, isPublicRoute]);

  useEffect(() => {
    return () => {
      if (socketConnected.current) {
        useSocket.getState().disconnect();
        socketConnected.current = false;
      }
    };
  }, []);

  // Route protection - separated from navigation logic
  useEffect(() => {
    if (!isLoading && !userId && !isPublicRoute && !redirectInProgress.current) {
      redirectInProgress.current = true;
      router.replace('/account/sign-in').finally(() => {
        redirectInProgress.current = false;
      });
    }
  }, [userId, isPublicRoute, isLoading, router]);

  // Navigation logic with admin route optimization
  useEffect(() => {
    if (isLoading || redirectInProgress.current) return; // Wait for auth to load and no concurrent redirects

    const currentPath = router.pathname;

    // Handle verification page access
    if (isVerificationPage && !userId) {
      redirectInProgress.current = true;
      router.replace('/account/sign-up').finally(() => {
        redirectInProgress.current = false;
      });
      return;
    }

    if (userId) {
      // Skip navigation logic for admin routes to prevent interference
      if (isAdminRoute) {
        return;
      }

      if (currentPath === '/') {
        redirectInProgress.current = true;
        router.replace('/feed').finally(() => {
          redirectInProgress.current = false;
        });
        return;
      }

      if (currentPath === '/account/sign-up') {
        const targetPath = verificationStep !== 'completed'
          ? '/account/verification'
          : '/feed';
        redirectInProgress.current = true;
        router.replace(targetPath).finally(() => {
          redirectInProgress.current = false;
        });
        return;
      }

      if (currentPath === '/account/sign-in') {
        redirectInProgress.current = true;
        router.replace('/feed').finally(() => {
          redirectInProgress.current = false;
        });
        return;
      }
    }
  }, [userId, router.pathname, isLoading, router, verificationStep, isVerificationPage, isAdminRoute]);

  const contextValue: AuthContextType = {
    userId,
    isLoading,
    verificationStep
  };

  // Always render children for admin routes when user exists, regardless of loading state
  const shouldRenderChildren = isPublicRoute || userId || (isAdminRoute && !isLoading);

  return (
    <AuthContext.Provider value={contextValue}>
      {shouldRenderChildren ? children : null}
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
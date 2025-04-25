"use client"
import React from 'react';
import AdminNavbar from './_AdminNavbar';
import UserNavbar from './_userNavbar';
import GuestNavbar from './_guestNavbar';
import useAuthStore from '@/store/authStore';
import { usePathname } from 'next/navigation';

// Define user type constants to avoid string literals
type UserType = 'admin' | 'client' | 'contractor' | null;

const Navbar: React.FC = () => {
  // Get authentication state from the auth store
  const { userId, userType } = useAuthStore();
  const pathname = usePathname();
  
  // Ensure userType conforms to our defined type
  const typedUserType: UserType = userType as UserType;
  
  // Check if user is authenticated
  const isAuthenticated: boolean = !!userId;
  
  // Check if current path is the home page or an auth route
  const isHomeOrAuthRoute: boolean = pathname === '/' || pathname?.startsWith('/auth') || false;
  
  // Check if current path is an admin route
  const isAdminRoute: boolean = pathname?.startsWith('/admin') || false;
  
  // Determine which navbar to render based on user authentication, type, and route
  const shouldShowAdminNavbar: boolean = isAuthenticated && typedUserType === 'admin' && isAdminRoute;
  // const shouldShowUserNavbar: boolean = isAuthenticated && (typedUserType === 'client' || typedUserType === 'contractor');
  const shouldShowGuestNavbar: boolean = !isAuthenticated && isHomeOrAuthRoute;

  return (
    <>
      {
        shouldShowGuestNavbar?
        <GuestNavbar /> :
        shouldShowAdminNavbar ?
        <AdminNavbar /> :
        <UserNavbar />
      }

    </>
  );
};

export default Navbar;
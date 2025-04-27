"use client"
import React from 'react';
import AdminNavbar from './_adminNavbar';
import UserNavbar from './_userNavbar';
import GuestNavbar from './_guestNavbar';
import useAuthStore from '@/store/authStore';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const { userId, userType } = useAuthStore();
  const pathname = usePathname() || '';
  
  // Function to determine which navbar to render
  const renderNavbar = () => {
    // Special case for admin routes
    if (pathname.startsWith('/admin') && userId && userType === 'admin') {
      return <AdminNavbar />;
    }
    
    // Special case for privacy policy
    if (pathname === '/privacy-policy') {
      return userId ? <UserNavbar /> : <GuestNavbar />;
    }
    
    // For all other routes, authenticated users see UserNavbar, guests see GuestNavbar
    return userId ? <UserNavbar /> : <GuestNavbar />;
  };

  return renderNavbar();
};

export default Navbar;
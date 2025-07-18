"use client"
import React from 'react';
import AdminNavbar from './_adminNavbar';
import UserNavbar from './_userNavbar';
import GuestNavbar from './_guestNavbar';
import useAuthStore from '@/store/useAuth';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const { userId, role } = useAuthStore();
  const pathname = usePathname() || '';

  const renderNavbar = () => {
    // Special case for admin routes - Fixed: Use OR instead of AND
    if (pathname.startsWith('/admin') && userId && (role === 'admin' || role === 'superadmin')) {
      return <AdminNavbar />;
    }

    // For privacy policy page
    if (pathname === '/privacy-policy') {
      return userId && (role === 'client' || role === 'contractor') ? 
        <UserNavbar /> : 
        userId && (role === 'admin' || role === 'superadmin') ? 
          <AdminNavbar /> : 
          <GuestNavbar />;
    }

    // Default logic - Fixed: Added parentheses for proper grouping
    return userId && (role === 'client' || role === 'contractor') ? 
      <UserNavbar /> : 
      userId && (role === 'admin' || role === 'superadmin') ? 
        <AdminNavbar /> : 
        <GuestNavbar />;
  };

  return renderNavbar();
};

export default Navbar;
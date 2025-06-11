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
  
  // Function to determine which navbar to render
  const renderNavbar = () => {
    // Special case for admin routes
    if (pathname.startsWith('/admin') && userId && role === 'admin') {
      return <AdminNavbar />;
    } 
    
    if (pathname === '/privacy-policy') {
      return userId && (role === 'client' || role === 'contractor') ?  <UserNavbar /> : userId && role === 'admin' ? <AdminNavbar /> : <GuestNavbar />;
    }
    
    return userId && (role === 'client' || role === 'contractor') ? <UserNavbar /> : userId && role === 'admin' ? <AdminNavbar /> : <GuestNavbar />;
  };

  return renderNavbar();
};

export default Navbar;
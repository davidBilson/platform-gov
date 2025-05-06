"use client"
import React from 'react';
import Logo from "@/components/ui/logo"
import { FaBell } from "react-icons/fa6";
import { usePathname } from 'next/navigation';
import authStore from "@/store/useAuth";

const AdminNavbar: React.FC = () => {
  const pathname = usePathname();
  const { name } = authStore();
  
  // Check if current path is an auth route
  const isAuthRoute = pathname?.startsWith('/auth') || false;

  // Function to generate user initials
  const getUserInitials = (): string => {
    if (name) {
      const [first, last] = name.toUpperCase().split(" ");
      const initials = (first?.[0] || "") + (last?.[0] || "");
      return initials || "AD";
    }
    return "AD"; // Default for admin
  };

  // Auth route layout - only logo in the middle
  if (isAuthRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth flex items-center justify-center'>
          <Logo />
        </nav>
      </div>
    );
  }

  // Admin layout for all other routes
  return (
    <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
      <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
        {/* Logo on the left */}
        <Logo />
        
        {/* Admin text in the middle */}
        <div className="font-semibold text-sm text-black absolute left-1/2 transform -translate-x-1/2">
          Admin
        </div>
        
        {/* Bell and profile icon on the right */}
        <div className="flex items-center gap-4">
          <div className="text-boldblue">
            <FaBell color="#0B5F94" size={24} />
          </div>
          <div>
            <p className="w-12 h-12 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium">
              {getUserInitials()}
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavbar;
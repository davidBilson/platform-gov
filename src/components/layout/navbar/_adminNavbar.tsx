"use client"
import React, { useState } from 'react';
import Logo from "@/components/ui/logo"
// import { FaBell } from "react-icons/fa6";
import { usePathname } from 'next/navigation';
import authStore from "@/store/useAuth";
import useAdminStore from "@/store/useAdmin"; 
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AdminNavbar: React.FC = () => {

  const pathname = usePathname();
  const { name, resetAll } = authStore();
  const { activeTitle } = useAdminStore();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    resetAll();
    setShowDropdown(!showDropdown)
    router.push('/account/sign-in');
  }
  
  const isAuthRoute = pathname?.startsWith('/account') || false;

  // Function to generate user initials
  const getUserInitials = (): string => {
    if (name) {
      const [first, last] = name.toUpperCase().split(" ");
      const initials = (first?.[0] || "") + (last?.[0] || "");
      return initials || "AD";
    }
    return "AD";
  };

  if (isAuthRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth flex items-center justify-center'>
          <Logo />
        </nav>
      </div>
    );
  }

  return (
    <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
      <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
        <Logo />
        
        <div aria-label='Current Panel Title' className="font-semibold text-sm text-boldblue absolute left-1/2 transform -translate-x-1/2">
          {activeTitle}
        </div>
        
        <div className="flex items-center gap-4">
          {/* <div className="text-boldblue">
            <FaBell color="#0B5F94" size={24} />
          </div> */}

          <div className='relative'>
            <button onClick={() => setShowDropdown(!showDropdown)} className="w-12 h-12 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium cursor-pointer">
              {getUserInitials()}
            </button>

            { showDropdown && 
              <div className={`absolute top-full right-0 mt-2 w-40 bg-white border border-skyblue rounded shadow-md z-10 py-3`}>
                <Link href='/' className="block w-full text-left px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">Home</Link>
                <Link href='/admin' className="block w-full text-left px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">Admin</Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-red-500 font-semibold hover:bg-skyblue/20 cursor-pointer"
                >
                  Sign Out
                  <FiLogOut size={20} />
                </button>
              </div>
            }
          </div>
        </div>

      </nav>
    </div>
  );
};

export default AdminNavbar;
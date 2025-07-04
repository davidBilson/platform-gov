"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import authStore from '@/store/useAuth';

import Logo from '@/components/ui/logo';
import NotificationsDropdown from '@/components/notifications/notificationDropdown';
import ClientNavbar from './_clientNavbar';
import ContractorNavbar from './_contractorNavbar';

import { FaBell } from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import ProfilePicture from '@/components/profile/profilePicture';
import { fetchProfilePicture } from '../../../api/profile-api';
import NotificationCount from "@/components/notifications/notificationCount";

const UserNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  
  const profileDropdownRef = useRef(null);
  
  const router = useRouter();
  const pathname = router.pathname;
  const { name, role, resetAll, userId } = authStore();

  const { data: profilePicture } = useQuery({
    queryKey: ['profilePicture', userId],
    queryFn: () => fetchProfilePicture(userId),
    enabled: !!userId, 
    staleTime: Infinity
  });

  const handleSignOut = () => {
    resetAll();
    router.push('/account/sign-in');
  }

  const handleNavigation = (path: string) => {
    setActiveDropdown(null);
    
    if (router.pathname === '/' && path === '/') {
      router.replace('/', undefined, { shallow: true });
      return;
    }
    
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    setNotificationsOpen(false)
  };

  const isAuthRoute = pathname?.startsWith('/account');
  const isProfileCreateRoute = pathname === '/profile/edit';

  // Auth route navbar
  if (isAuthRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth flex items-center justify-center'>
            <Logo />
        </nav>
      </div>
    );
  }

  // Profile create route navbar
  if (isProfileCreateRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
          <Logo />
          
          <div className="font-semibold text-xl hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            Create Public Profile
          </div>
          
          <div className="font-semibold text-lg lg:hidden">
            Create Public Profile
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) {
                    setActiveDropdown(null);
                  }
                }}
                className="text-boldblue hover:text-deepskyblue transition-colors cursor-pointer"
              >
                  <FaBell size={24} />
                  <NotificationCount />
              </button>
              <NotificationsDropdown notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} />
            </div>

            <div ref={profileDropdownRef} className="relative">
              <div className='w-fit h-fit cursor-pointer' onClick={() => toggleDropdown('profile')}>
                {
                  profilePicture ? (
                    <ProfilePicture source={profilePicture} alt='user' dimension={48} />
                  ): (
                    <p 
                      className="w-12 h-12 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium cursor-pointer"
                    >
                      {name ? name.trim().split(/\s+/).map((n: string) => n[0].toUpperCase()).join('') : 'KD'}
                    </p>
                  )
                }
              </div>
              
              <div className={`absolute top-full right-0 mt-2 w-40 bg-white border border-skyblue rounded shadow-md z-10 ${activeDropdown === 'profile' ? 'block' : 'hidden'}`}>
                <button 
                  onClick={() => {
                    handleNavigation('/profile')
                  }} 
                  className="block w-full text-left px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
                  Profile
                </button>
                <a onClick={() => handleNavigation('/profile/edit')} className="block px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
                  Edit Profile
                </a>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-red-500 font-semibold hover:bg-skyblue/20 cursor-pointer"
                >
                  Sign Out
                  <FiLogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  // Conditional rendering based on user role
  if (role === 'client') {
    return <ClientNavbar />;
  } else {
    return <ContractorNavbar />;
  }
}

export default UserNavbar;
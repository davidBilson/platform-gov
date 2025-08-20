"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import authStore from '@/store/useAuth';
import { useFeedStore } from '@/store/useFeed';
import { useContractorFilter } from '@/store/useContractorFilter';
import { useJobFilter } from '@/store/useJobFilter';

import Logo from '@/components/ui/logo';
import NotificationsDropdown from '@/components/notifications/notificationDropdown';

import { FaBell } from 'react-icons/fa6';
import { Crown } from 'lucide-react';
import { FiLogOut, FiSearch } from 'react-icons/fi';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import ProfilePicture from '@/components/profile/profilePicture';
import { fetchProfilePicture } from '../../../api/profile-api';
import NotificationCount from "@/components/notifications/notificationCount";

const ContractorNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  
  const profileDropdownRef = useRef(null);
  const searchRef = useRef(null);
  
  const router = useRouter();
  const { setFeedType, feedType } = useFeedStore();
  const { name, resetAll, userId } = authStore();

  const { data: profilePicture } = useQuery({
    queryKey: ['profilePicture', userId],
    queryFn: () => fetchProfilePicture(userId),
    enabled: !!userId, 
    staleTime: Infinity
  });

  const { searchTerm: contractorSearchTerm, setSearchTerm: setContractorSearchTerm } = useContractorFilter();
  const { searchTerm: jobSearchTerm, setSearchTerm: setJobSearchTerm } = useJobFilter();

  const currentSearchTerm = feedType === "Jobs" ? jobSearchTerm : contractorSearchTerm;
  const currentSetSearchTerm = feedType === "Jobs" ? setJobSearchTerm : setContractorSearchTerm;

  const handleSignOut = () => {
    router.replace('/account/sign-in');
    resetAll();
  };
  

  const handleNavigation = (path: string, feedTypeValue?: string) => {
    if (feedTypeValue) setFeedType(feedTypeValue);
    
    setActiveDropdown(null);
    setMobileMenu(false);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    currentSetSearchTerm(e.target.value);
  };

  const jobAndContractorOptions = ["Jobs", "Consultants"];

  // Contractor Navigation Items
  const contractorNavItems = {
    main: [
      { 
        label: 'Find Jobs', 
        dropdown: [
          { label: 'Find Jobs', action: () => handleNavigation('/', 'Jobs') },
          { label: 'Saved Jobs', action: () => {} }
        ]
      },
      { 
        label: 'Manage Payment',
        dropdown: [
          // { label: 'Earnings', action: () => handleNavigation('/payment') },
          // { label: 'Withdraw Funds', action: () => handleNavigation('/payment/withdraw') },
          // { label: 'Manage Account', action: () => handleNavigation('/payment/payout-setup') },
          { label: 'Transaction History', action: () => handleNavigation('/payment/transaction-history') },
          { label: 'Manage Subscription', action: () => handleNavigation('/subscribe') }
        ]
      },
      { 
        label: 'Messages',
        dropdown: null,
        action: () => handleNavigation('/messages')
      },
      { 
        label: 'Contract Wizard',
        dropdown: null,
        action: () => handleNavigation('/contract-wizard'),
        hasLock: true // Added flag to identify this item needs a lock icon
      }
    ]
  };

  interface NavItem {
    label: string;
    dropdown?: { label: string; action: () => void }[] | null;
    action?: () => void;
    hasLock?: boolean; // Added optional hasLock property
  }

  const renderDesktopNavItem = (item: NavItem, index: number) => {
    const dropdownId = `desktop-${item.label.replace(' ', '-').toLowerCase()}`;
    
    return (
      <li key={index} className="flex items-center gap-1.25 cursor-pointer relative">
        <div 
          onClick={() => item.dropdown ? toggleDropdown(dropdownId) : item.action?.()}
          className="flex items-center gap-1.25 hover:text-deepskyblue"
        >
          <span className="flex items-center gap-1.5">
            {item.label}
            {item.hasLock && <Crown size={16} />}
          </span>
          {item.dropdown && (
            <span>
              {activeDropdown === dropdownId ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
            </span>
          )}
        </div>
        
        {item.dropdown && item.dropdown.length > 0 && (
          <div className={`absolute top-full left-0 mt-2 w-48 bg-white border border-skyblue rounded shadow-md z-10 ${activeDropdown === dropdownId ? 'block' : 'hidden'}`}>
            {item.dropdown.map((subItem: { label: string; action: () => void }, subIndex: number) => (
              <a 
                key={subIndex}
                onClick={subItem.action}
                className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer"
              >
                {subItem.label}
              </a>
            ))}
          </div>
        )}
      </li>
    );
  };

  const renderMobileNavItem = (item: NavItem, index: number) => {
    const dropdownId = `mobile-${item.label.replace(' ', '-').toLowerCase()}`;
    
    return (
      <li key={index} className="relative w-full text-center">
        <div 
          onClick={() => item.dropdown ? toggleDropdown(dropdownId) : item.action?.()}
          className="flex items-center justify-center gap-1.25"
        >
          <span className="flex items-center gap-1.5">
            {item.label}
            {item.hasLock && <Crown size={16} />}
          </span>
          {item.dropdown && (
            <span>
              {activeDropdown === dropdownId ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
            </span>
          )}
        </div>
        
        {item.dropdown && item.dropdown.length > 0 && (
          <div className={`mt-2 bg-white rounded shadow-md z-10 flex flex-col items-center ${activeDropdown === dropdownId ? 'block' : 'hidden'}`}>
            {item.dropdown.map((subItem: { label: string; action: () => void }, subIndex: number) => (
              <a 
                key={subIndex}
                onClick={subItem.action}
                className="py-2 text-sm text-boldblue hover:underline cursor-pointer"
              >
                {subItem.label}
              </a>
            ))}
          </div>
        )}
      </li>
    );
  };

  return (
    <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-100'>
      <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
        <Logo />
        
        <div className="lg:hidden flex items-center gap-4">
          <button onClick={() => {
            setMobileSearch(!mobileSearch);
            setMobileMenu(false);
            setActiveDropdown(null);
          }} className="text-boldblue">
            <FiSearch size={24} />
          </button>
          
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
          
          <button onClick={() => {
            setMobileMenu(!mobileMenu);
            setMobileSearch(false);
            setActiveDropdown(null);
          }} className="text-boldblue">
            <HiMenuAlt3 size={28} />
          </button>
        </div>

        <ul className="hidden lg:flex items-center gap-[13px] w-fit text-boldblue font-bold">
          {contractorNavItems.main.map((item, index) => renderDesktopNavItem(item, index))}
        </ul>

        <div className="hidden lg:flex w-full max-w-[250px] h-12.5 items-center py-1.25 pl-5 pr-1.25 border border-skyblue text-boldblue rounded-sm text-[14px]">
          <input 
            type='text' 
            placeholder="search" 
            className="outline-none w-1/2" 
            value={currentSearchTerm}
            onChange={handleSearchChange}
          />
          <div className="relative w-1/2">
            <button 
              className="w-full bg-skyblue border-none flex items-center justify-center p-2 rounded-full font-semibold"
              onClick={() => toggleDropdown('search')}
            >
              <span>{feedType}</span>
              <span>
                {activeDropdown === 'search' ? <IoMdArrowDropup size={15} /> : <IoMdArrowDropdown size={15} />}
              </span>
            </button>
            
            <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-skyblue rounded shadow-md z-10 ${activeDropdown === 'search' ? 'block' : 'hidden'}`}>
              {jobAndContractorOptions.map((option) => (
                <div 
                  key={option} 
                  className="px-4 py-2 hover:bg-skyblue cursor-pointer font-semibold"
                  onClick={() => {
                    setFeedType(option);
                    setActiveDropdown(null);
                    router.pathname !== '/feed' && router.push('/feed');
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
            
        <div className="relative hidden lg:block">
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

        <div className="hidden lg:block relative" ref={profileDropdownRef}>
          <div className='w-fit h-fit cursor-pointer' onClick={() => toggleDropdown('profile')}>
            {
              profilePicture ? (
                <ProfilePicture source={profilePicture} alt='user' dimension={48} />
              ) : (
                <p 
                  className="w-12 h-12 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium cursor-pointer"
                >
                  {name ? name.trim().split(/\s+/).map((n: string) => n[0].toUpperCase()).join('') : 'KD'}
                </p>
              )
            }
          </div>
          
          <div className={`absolute top-full right-0 mt-2 w-40 bg-white border border-skyblue rounded shadow-md z-10 ${activeDropdown === 'profile' ? 'block' : 'hidden'}`}>
            <button onClick={() => handleNavigation('/profile')} 
            className="block w-full text-left px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
              Profile
            </button>
            <span onClick={() => handleNavigation('/profile/edit')} className="block px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
              Edit Profile
            </span>
            <button onClick={handleSignOut} className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-red-500 font-semibold hover:bg-skyblue/20 cursor-pointer">
              Sign Out
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
        
        <div ref={searchRef} className={`lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40 ${mobileSearch ? 'block' : 'hidden'}`}>
          <div className="px-6">
            <div className="w-full h-12.5 flex items-center py-1.25 pl-5 pr-1.25 border border-skyblue text-boldblue rounded-sm text-[14px]">
              <input 
                type='text' 
                placeholder="search" 
                className="outline-none w-1/2" 
                autoFocus 
                value={currentSearchTerm}
                onChange={handleSearchChange}
              />
              <button 
                className="w-1/2 bg-skyblue border-none flex items-center justify-center p-2 rounded-full font-semibold"
                onClick={() => toggleDropdown('mobileSearch')}
              >
                <span>{feedType}</span>
                <span>
                  {activeDropdown === 'mobileSearch' ? <IoMdArrowDropup size={15} /> : <IoMdArrowDropdown size={15} />}
                </span>
              </button>
            </div>
            <div className={`mt-2 bg-white border border-skyblue rounded shadow-md z-10 ${activeDropdown === 'mobileSearch' ? 'block' : 'hidden'}`}>
              {jobAndContractorOptions.map((option) => (
                <div 
                  key={option} 
                  className="px-4 py-2 hover:bg-skyblue cursor-pointer font-semibold"
                  onClick={() => {
                    setFeedType(option);
                    setActiveDropdown(null);
                    router.pathname !== '/feed' && router.push('/feed');
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40 ${mobileMenu ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col items-center gap-5 text-boldblue font-bold text-[16px]">
            {contractorNavItems.main.map((item, index) => renderMobileNavItem(item, index))}
          </ul>
          
          <div className="mt-6 flex justify-center relative" ref={profileDropdownRef}>
            <div className='w-fit h-fit cursor-pointer' onClick={() => toggleDropdown('mobileProfile')}>
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
            
            <div className={`absolute top-full mt-2 w-40 bg-white border border-skyblue rounded shadow-md z-10 ${activeDropdown === 'mobileProfile' ? 'block' : 'hidden'}`}>
              <a onClick={() => handleNavigation('/profile')} className="block w-full text-left px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
                Profile
              </a>
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

export default ContractorNavbar;
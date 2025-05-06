"use client";
import React, { useState, useRef, useEffect } from 'react';
import { IoMdArrowDropdown } from "react-icons/io";
import { useFeedStore } from "@/store/useFeed";
import { usePathname } from 'next/navigation';
import { HiMenuAlt3 } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { useRouter } from 'next/router';
import Logo from '@/components/ui/logo';

// Define types for state and refs
type ContractorOption = "Jobs" | "Contractors";

const GuestNavbar: React.FC = () => {

  const router = useRouter();

  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [mobileSearch, setMobileSearch] = useState<boolean>(false);
  const [contractorsDropdown, setContractorsDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  
  const contractorOptions: ContractorOption[] = ["Jobs", "Contractors"];
  const [selectedOption, setSelectedOption] = useState<ContractorOption>("Jobs");

  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth') || false;
  const { setFeedType } = useFeedStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && event.target instanceof Node) {
        if (!dropdownRef.current.contains(event.target)) {
          setContractorsDropdown(false);
        }
      }
      
      if (searchRef.current && event.target instanceof Node) {
        if (!searchRef.current.contains(event.target)) {
          setMobileSearch(false);
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option: ContractorOption): void => {
    setSelectedOption(option);
    setContractorsDropdown(false);
  };

  const toggleMobileMenu = (): void => {
    setMobileMenu(!mobileMenu);
    // Close search if menu is opened
    if (!mobileMenu && mobileSearch) {
      setMobileSearch(false);
    }
  };

  const toggleMobileSearch = (): void => {
    setMobileSearch(!mobileSearch);
    // Close menu if search is opened
    if (!mobileSearch && mobileMenu) {
      setMobileMenu(false);
    }
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
  
  if (pathname === '/' || pathname === '/privacy-policy') {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
          <Logo />

          <div className="flex items-center">
            {/* Desktop search */}
            <div className="hidden lg:flex w-full max-w-[250px] h-12 items-center py-1 pl-5 pr-1 border border-skyblue rounded-sm text-sm mr-7">
              <input 
                type='text' 
                placeholder="search" 
                className="outline-none w-1/2" 
                aria-label="Search input"
              />
              <div className="relative w-1/2" ref={dropdownRef}>
                <button 
                  className="w-full bg-skyblue border-none flex items-center justify-center p-2 rounded-full"
                  onClick={() => setContractorsDropdown(!contractorsDropdown)}
                  type="button"
                  aria-expanded={contractorsDropdown}
                  aria-haspopup="listbox"
                >
                  <span>{selectedOption}</span>
                  <span><IoMdArrowDropdown size={15} /></span>
                </button>
                
                {contractorsDropdown && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-skyblue rounded shadow-md z-10"
                    role="listbox"
                  >
                    {contractorOptions.map((option) => (
                      <div 
                        key={option} 
                        className="px-4 py-2 hover:bg-skyblue cursor-pointer"
                        onClick={() => {
                          handleOptionSelect(option);
                          setFeedType(option);
                        }}
                        role="option"
                        aria-selected={selectedOption === option}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile search and hamburger icons */}
            <div className="lg:hidden flex items-center gap-4 mr-4">
              <button 
                onClick={toggleMobileSearch} 
                className="text-boldblue"
                type="button"
                aria-label="Toggle search"
                aria-expanded={mobileSearch}
              >
                <FiSearch size={24} />
              </button>
              
              <button 
                onClick={toggleMobileMenu} 
                className="text-boldblue"
                type="button"
                aria-label="Toggle menu"
                aria-expanded={mobileMenu}
              >
                <HiMenuAlt3 size={28} />
              </button>
            </div>

            {/* Sign up and sign in button (desktop) */}
            <div className='hidden lg:flex items-center gap-7'>
              <button 
                onClick={() => router.push('/auth/sign-in')}
                className='border-none outline-none w-fit p-0 text-boldblue font-semibold transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer'
                type="button"
              >
                Login
              </button>
              <button 
                onClick={() => router.push('/auth/sign-up')}
                className='bg-boldblue w-30 py-2.5 px-5 rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer'
                type="button"
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Mobile search dropdown */}
          {mobileSearch && (
            <div 
              ref={searchRef} 
              className="lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40"
              aria-label="Mobile search"
            >
              <div className="px-6">
                <div className="w-full h-12 flex items-center py-1 pl-5 pr-1 border border-skyblue rounded-sm text-sm">
                  <input 
                    type='text' 
                    placeholder="search" 
                    className="outline-none w-1/2" 
                    autoFocus 
                    aria-label="Search input"
                  />
                  <button 
                    className="w-1/2 bg-skyblue border-none flex items-center justify-center p-2 rounded-full"
                    type="button"
                  >
                    <span>{selectedOption}</span>
                    <span><IoMdArrowDropdown size={15} /></span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile menu */}
          {mobileMenu && (
            <div 
              className="lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40"
              aria-label="Mobile menu"
            >
              <ul className="flex flex-col items-center gap-5 mb-6">
                <li>
                  <button 
                    onClick={() => router.push('/auth/sign-in')}
                    className='border-none outline-none w-fit p-0 text-boldblue font-semibold transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer'
                    type="button"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => router.push('/auth/sign-up')}
                    className='bg-boldblue py-2 px-5 rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer'
                    type="button"
                  >
                    Sign up
                  </button>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    );
  }
  
  // Handle all other routes
  return null;
};

export default GuestNavbar;
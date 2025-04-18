"use client"
import Logo from "@/assets/logo.svg"
import Image from 'next/image'
import Link from 'next/link'
import { IoMdArrowDropdown } from "react-icons/io";
import { FaBell } from "react-icons/fa6";
import { useState, useRef, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [contractorsDropdown, setContractorsDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const contractorOptions = ["Contractors", "Businesses", "Both"];
  const [selectedOption, setSelectedOption] = useState("Contractors");

  // Check if current path is an auth route
  const isAuthRoute = pathname?.startsWith('/auth');
  
  // Check if current path is the profile creation route
  const isProfileCreateRoute = pathname === '/profile/create';

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

  // Auth route layout - only logo in the middle
  if (isAuthRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth flex items-center justify-center'>
          <Image src={Logo} width={80} height={90} alt="GovLink Platform" />
        </nav>
      </div>
    );
  }

  // Profile creation route layout
  if (isProfileCreateRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
          {/* Logo on the left */}
          <Image src={Logo} width={80} height={90} alt="GovLink Platform" />
          
          {/* Create Profile text in the middle */}
          <div className="text-boldblue font-bold text-xl hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            Create Profile
          </div>
          
          {/* Mobile view - Create Profile text */}
          <div className="text-boldblue font-bold text-lg lg:hidden">
            Create Profile
          </div>
          
          {/* Bell and profile icon on the right */}
          <div className="flex items-center gap-4">
            <div className="text-boldblue">
              <FaBell color="#0B5F94" size={24} />
            </div>
            <div>
              <p className="w-12 h-12 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium">
                {"KD"}
              </p>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  // Default layout for all other routes (original navbar)
  return (
    <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
            
            {/* Logo */}
            <Image src={Logo} width={80} height={90} alt="GovLink Platform" />
            
            {/* Mobile icons */}
            <div className="lg:hidden flex items-center gap-4">
              {/* Search icon */}
              <button onClick={() => setMobileSearch(!mobileSearch)} className="text-boldblue">
                <FiSearch size={24} />
              </button>
              
              {/* Bell icon */}
              <div className="text-boldblue">
                <FaBell color="#0B5F94" size={24} />
              </div>
              
              {/* Menu icon */}
              <button onClick={() => setMobileMenu(!mobileMenu)} className="text-boldblue">
                <HiMenuAlt3 size={28} />
              </button>
            </div>

            {/* Desktop navigation */}
            <ul className="hidden lg:flex items-center gap-[13px] w-fit text-boldblue font-bold text-[16px]">
                <li className="flex items-center gap-[5px] cursor-pointer">
                    <span>Jobs</span>
                    <span><IoMdArrowDropdown size={20} /></span>
                </li>
                <li className="flex items-center gap-[5px] cursor-pointer">
                    <span>Manage Contractors</span>
                    <span><IoMdArrowDropdown size={20} /></span>
                </li>
                <li className="flex items-center gap-[5px] cursor-pointer">
                    <span>Manage Contracts</span>
                    <span><IoMdArrowDropdown size={20} /></span>
                </li>
                <li className="cursor-pointer">
                    <Link href={"/"}>Messages</Link>
                </li>
            </ul>

            {/* Desktop search */}
            <div className="hidden lg:flex w-full max-w-[250px] h-[50px] items-center py-[5px] pl-[20px] pr-[5px] border border-[#E1F5FD] rounded-sm text-[14px]">
                <input type='text' placeholder="search" className="outline-none w-1/2" />
                <div className="relative w-1/2" ref={dropdownRef}>
                  <button 
                    className="w-full bg-[#E1F5FD] border-none flex items-center justify-center p-2 rounded-full"
                    onClick={() => setContractorsDropdown(!contractorsDropdown)}
                  >
                      <span>{selectedOption}</span>
                      <span><IoMdArrowDropdown size={15} /></span>
                  </button>
                  
                  {contractorsDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E1F5FD] rounded shadow-md z-10">
                      {contractorOptions.map((option) => (
                        <div 
                          key={option} 
                          className="px-4 py-2 hover:bg-[#E1F5FD] cursor-pointer"
                          onClick={() => {
                            setSelectedOption(option);
                            setContractorsDropdown(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            {/* Desktop bell icon */}
            <div className="hidden lg:block">
                <FaBell color="#0B5F94" size={32} />
            </div>

            {/* Desktop profile icon */}
            <div className="hidden lg:block">
                <p className="w-14 h-14 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium">
                    {"KD"}
                </p>
            </div>
            
            {/* Mobile search dropdown */}
            {mobileSearch && (
              <div ref={searchRef} className="lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40">
                <div className="px-6">
                  <div className="w-full h-[50px] flex items-center py-[5px] pl-[20px] pr-[5px] border border-[#E1F5FD] rounded-sm text-[14px]">
                    <input type='text' placeholder="search" className="outline-none w-1/2" autoFocus />
                    <button className="w-1/2 bg-[#E1F5FD] border-none flex items-center justify-center p-2 rounded-full">
                      <span>{selectedOption}</span>
                      <span><IoMdArrowDropdown size={15} /></span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile menu */}
            {mobileMenu && (
              <div className="lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40">
                <ul className="flex flex-col items-center gap-5 text-boldblue font-bold text-[16px]">
                  <li className="flex items-center gap-[5px]">
                      <span>Jobs</span>
                      <span><IoMdArrowDropdown size={20} /></span>
                  </li>
                  <li className="flex items-center gap-[5px]">
                      <span>Manage Contractors</span>
                      <span><IoMdArrowDropdown size={20} /></span>
                  </li>
                  <li className="flex items-center gap-[5px]">
                      <span>Manage Contracts</span>
                      <span><IoMdArrowDropdown size={20} /></span>
                  </li>
                  <li>
                      <Link href={"/"}>Messages</Link>
                  </li>
                </ul>
                
                <div className="mt-6 flex justify-center">
                  <div className="w-14 h-14 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium">
                    {"KD"}
                  </div>
                </div>
              </div>
            )}
        </nav>
    </div>
  );
}

export default Navbar;
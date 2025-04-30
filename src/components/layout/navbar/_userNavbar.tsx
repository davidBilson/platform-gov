"use client"
import Logo from "@/components/ui/logo"
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaBell } from "react-icons/fa6";
import { useState, useRef } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import authStore from "@/store/authStore";
import { useRouter } from "next/router";
import { useFeedStore } from "@/store/feedStore"
import { FiLogOut } from "react-icons/fi";

const UserNavbar = () => {
  const [contractorsDropdown, setContractorsDropdown] = useState(false);
  const [jobsDropdown, setJobsDropdown] = useState(false);
  const [contractsDropdown, setContractsDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const jobsDropdownRef = useRef(null);
  const contractsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const searchRef = useRef(null);
  
  const router = useRouter();
  const pathname = router.pathname;
  const { name, role, resetAll } = authStore();
  const { setFeedType, feedType } = useFeedStore();

  const handleSignOut = () => {
    resetAll();
    router.push('/auth/sign-in');
  }

  // Function to handle navigation with dropdown closing
  const handleNavigation = (path: string, feedTypeValue?: string) => {
    if (feedTypeValue) {
      setFeedType(feedTypeValue);
    }
    
    // Close all dropdowns
    setJobsDropdown(false);
    setContractsDropdown(false);
    setContractorsDropdown(false);
    setMobileMenu(false);

    if (router.pathname === '/' && path === '/') {
      router.replace('/', undefined, { shallow: true });
      return;
    }
    
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  const jobAndContractorOptions = ["Jobs", "Contractors"];
  const [, setSelectedOption] = useState(feedType);

  // Check if current path is an auth route
  const isAuthRoute = pathname?.startsWith('/auth');
  
  // Check if current path is the profile creation route
  const isProfileCreateRoute = pathname === '/profile/edit';

  if (isAuthRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth flex items-center justify-center'>
            <Logo />
        </nav>
      </div>
    );
  }

  if (isProfileCreateRoute) {
    return (
      <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
          {/* Logo on the left */}
          <Logo />
          
          {/* Create Profile text in the middle */}
          <div className=" font-semibold text-xl hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            Create Public Profile
          </div>
          
          {/* Mobile view - Create Profile text */}
          <div className=" font-semibold text-lg lg:hidden">
            Create Public Profile
          </div>
          
          {/* Bell and profile icon on the right */}
          <div className="flex items-center gap-4">
            <div className="text-boldblue">
              <FaBell color="#0B5F94" size={24} />
            </div>
            <div ref={profileDropdownRef} className="relative">
              <p 
                onClick={() => setProfileDropdown(!profileDropdown)} 
                className="w-12 h-12 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium cursor-pointer"
              >
              {(() => {
                  if (name) {
                    const [first, last] = name.toUpperCase().split(" ");
                    const initials = (first?.[0] || "") + (last?.[0] || "");
                    return initials || "KD";
                  }
                  return "KD";
                })()
              }
              </p>
              
              {/* Profile dropdown menu - always in DOM but hidden with CSS */}
              <div className={`absolute top-full right-0 mt-2 w-40 bg-white border border-skyblue rounded shadow-md z-10 ${profileDropdown ? 'block' : 'hidden'}`}>
                <button 
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation('/profile')
                  }} 
                  className="block px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
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

  // Default layout for all other routes (original navbar)
  return (
    <div className='fixed top-0 left-0 w-full h-28 overflow-visible flex items-center justify-center border-b-2 border-b-boldblue bg-white z-50'>
        <nav className='w-full max-w-maxWidth m-auto flex items-center justify-between px-6 lg:px-[45px] relative'>
            
            {/* Logo */}
            <Logo />
            
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
            <ul className="hidden lg:flex items-center gap-[13px] w-fit text-boldblue font-bold">
                {/* Jobs dropdown */}
                <li className="flex items-center gap-1.25 cursor-pointer relative" ref={jobsDropdownRef}>
                    <div onClick={() => setJobsDropdown(!jobsDropdown)} className="flex items-center gap-1.25">
                      <span>{role === 'contractor' ? 'Find Jobs' : 'Jobs'}</span>
                      <span>
                        {jobsDropdown ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
                      </span>
                    </div>
                    
                    {/* Jobs dropdown menu - always in DOM but hidden with CSS */}
                    <div className={`absolute top-full left-0 mt-2 w-48 bg-white border border-skyblue rounded shadow-md z-10 ${jobsDropdown ? 'block' : 'hidden'}`}>
                      <a onClick={() => handleNavigation('/', 'Jobs')} className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer">
                        Find Jobs
                      </a>
                      {role === 'client' && (
                        <a onClick={() => handleNavigation('/job/create')} className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer">
                          Create Job
                        </a>
                      )}
                    </div>
                </li>
                
                {/* Manage Contracts dropdown */}
                <li className="flex items-center gap-1.25 cursor-pointer relative" ref={contractsDropdownRef}>
                    <div onClick={() => setContractsDropdown(!contractsDropdown)} className="flex items-center gap-1.25">
                      <span>Manage Contracts</span>
                      <span>
                        {contractsDropdown ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
                      </span>
                    </div>
                    
                    {/* Contracts dropdown menu - always in DOM but hidden with CSS */}
                    <div className={`absolute top-full left-0 mt-2 w-48 bg-white border border-skyblue rounded shadow-md z-10 ${contractsDropdown ? 'block' : 'hidden'}`}>
                      <a 
                        onClick={() => handleNavigation('/proposals')}
                        className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer"
                      >
                        Proposals
                      </a>
                      <a 
                        onClick={() => handleNavigation('/contracts/active')} 
                        className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer"
                      >
                        Active Contracts
                      </a>
                      <a onClick={() => handleNavigation('/contracts/open')} className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer">
                        Open Contracts
                      </a>
                      <a onClick={() => handleNavigation('/contracts/pending')} className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer">
                        Pending Contracts
                      </a>
                      <a onClick={() => handleNavigation('/contracts/closed')} className="block px-4 py-3 text-sm text-boldblue hover:underline cursor-pointer">
                        Closed Contracts
                      </a>
                    </div>
                </li>

                <li className="flex items-center gap-1.25 cursor-pointer">
                    <span>Manage Contractors</span>
                    <span>
                      <IoMdArrowDropdown size={20} />
                    </span>
                </li>
                
                <li className="cursor-pointer">
                    <a onClick={() => handleNavigation('/')}>Messages</a>
                </li>
            </ul>

            {/* Desktop search */}
            <div className="hidden lg:flex w-full max-w-[250px] h-12.5 items-center py-1.25 pl-5 pr-1.25 border border-skyblue rounded-sm text-[14px]">
                <input type='text' placeholder="search" className="outline-none w-1/2" />
                <div className="relative w-1/2" ref={dropdownRef}>
                  <button 
                    className="w-full bg-skyblue border-none flex items-center justify-center p-2 rounded-full"
                    onClick={() => setContractorsDropdown(!contractorsDropdown)}
                  >
                      <span>{feedType}</span>
                      <span>
                        {contractorsDropdown ? <IoMdArrowDropup size={15} /> : <IoMdArrowDropdown size={15} />}
                      </span>
                  </button>
                  
                  {/* Search filter dropdown - always in DOM but hidden with CSS */}
                  <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-skyblue rounded shadow-md z-10 ${contractorsDropdown ? 'block' : 'hidden'}`}>
                    {jobAndContractorOptions.map((option) => (
                      <div 
                        key={option} 
                        className="px-4 py-2 hover:bg-skyblue cursor-pointer"
                        onClick={() => {
                          setSelectedOption(option);
                          setContractorsDropdown(false);
                          setFeedType(option);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
            </div>

            {/* Desktop bell icon */}
            <div className="hidden lg:block">
                <FaBell color="#0B5F94" size={32} />
            </div>

            {/* Desktop profile icon with dropdown */}
            <div className="hidden lg:block relative" ref={profileDropdownRef}>
                <p 
                  onClick={() => setProfileDropdown(!profileDropdown)} 
                  className="w-14 h-14 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium cursor-pointer"
                >
                {(() => {
                  if (name) {
                    const [first, last] = name.toUpperCase().split(" ");
                    const initials = (first?.[0] || "") + (last?.[0] || "");
                    return initials || "KD";
                  }
                  return "KD";
                  })()
                }
                </p>
                
                {/* Profile dropdown menu - always in DOM but hidden with CSS */}
                <div className={`absolute top-full right-0 mt-2 w-40 bg-white border border-skyblue rounded shadow-md z-10 ${profileDropdown ? 'block' : 'hidden'}`}>
                  <button onClick={() => handleNavigation('/profile')} className="block px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
                    Profile
                  </button>
                  <span onClick={() => handleNavigation('/profile/edit')} className="block px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
                    Edit Profile
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-red-500 font-semibold hover:bg-skyblue/20 cursor-pointer"
                  >
                    Sign Out
                    <FiLogOut size={20} />
                  </button>
                </div>
            </div>
            
            {/* Mobile search dropdown - always in DOM but hidden with CSS */}
            <div ref={searchRef} className={`lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40 ${mobileSearch ? 'block' : 'hidden'}`}>
              <div className="px-6">
                <div className="w-full h-12.5 flex items-center py-1.25 pl-5 pr-1.25 border border-skyblue rounded-sm text-[14px]">
                  <input type='text' placeholder="search" className="outline-none w-1/2" autoFocus />
                  <button 
                    className="w-1/2 bg-skyblue border-none flex items-center justify-center p-2 rounded-full"
                    onClick={() => setContractorsDropdown(!contractorsDropdown)}
                  >
                    <span>{feedType}</span>
                    <span>
                      {contractorsDropdown ? <IoMdArrowDropup size={15} /> : <IoMdArrowDropdown size={15} />}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile menu - always in DOM but hidden with CSS */}
            <div className={`lg:hidden fixed top-28 left-0 w-full bg-white border-b-2 border-b-boldblue shadow-md py-4 z-40 ${mobileMenu ? 'block' : 'hidden'}`}>
              <ul className="flex flex-col items-center gap-5 text-boldblue font-bold text-[16px]">
                {/* Mobile Jobs dropdown */}
                <li className="relative">
                  <div 
                    className="flex items-center gap-1.25"
                    onClick={() => setJobsDropdown(!jobsDropdown)}
                  >
                    <span>Jobs</span>
                    <span>
                      {jobsDropdown ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
                    </span>
                  </div>
                  
                  {/* Mobile jobs dropdown menu - always in DOM but hidden with CSS */}
                  <div className={`mt-2 bg-white rounded shadow-md z-10 flex flex-col items-center ${jobsDropdown ? 'block' : 'hidden'}`}>
                    <a onClick={() => handleNavigation('/', 'Jobs')} className="py-2 text-sm text-boldblue hover:underline cursor-pointer">
                      Find Jobs
                    </a>
                    {role === 'client' && (
                      <a onClick={() => handleNavigation('/job/create')} className="py-2 text-sm text-boldblue hover:underline cursor-pointer">
                        Create Job
                      </a>
                    )}
                  </div>
                </li>
                
                {/* Mobile Contracts dropdown */}
                <li className="relative">
                  <div 
                    className="flex items-center gap-1.25"
                    onClick={() => setContractsDropdown(!contractsDropdown)}
                  >
                    <span>Manage Contracts</span>
                    <span>
                      {contractsDropdown ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
                    </span>
                  </div>
                  
                  {/* Mobile contracts dropdown menu - always in DOM but hidden with CSS */}
                  <div className={`mt-2 bg-white rounded shadow-md z-10 flex flex-col items-center ${contractsDropdown ? 'block' : 'hidden'}`}>
                    <a onClick={() => handleNavigation('/proposals')} className="py-2 text-sm text-boldblue hover:underline cursor-pointer">
                      Proposals
                    </a>
                    <a onClick={() => handleNavigation('/contracts/active')} className="py-2 text-sm text-boldblue hover:underline cursor-pointer">
                      Active Contracts
                    </a>
                    <a onClick={() => handleNavigation('/contracts/open')} className="py-2 text-sm text-boldblue hover:underline cursor-pointer">
                      Open Contracts
                    </a>
                    <a onClick={() => handleNavigation('/contracts/pending')} className="py-2 text-sm text-boldblue hover:underline cursor-pointer">
                      Pending Contracts
                    </a>
                    <a onClick={() => handleNavigation('/contracts/closed')} className="py-2 text-sm text-boldblue hover:underline cursor-pointer">
                      Closed Contracts
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-1.25">
                    <span>Manage Contractors</span>
                    <span>
                      <IoMdArrowDropdown size={20} />
                    </span>
                </li>
                
                <li>
                    <a onClick={() => handleNavigation('/')} className="cursor-pointer">Messages</a>
                </li>
              </ul>
              
              <div className="mt-6 flex justify-center relative" ref={profileDropdownRef}>
                <div 
                  onClick={() => setProfileDropdown(!profileDropdown)} 
                  className="w-14 h-14 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium cursor-pointer"
                >
                {(() => {
                    if (name) {
                      const [first, last] = name.toUpperCase().split(" ");
                      const initials = (first?.[0] || "") + (last?.[0] || "");
                      return initials || "KD";
                    }
                    return "KD";
                  })()
                }
                </div>
                
                {/* Mobile profile dropdown menu - always in DOM but hidden with CSS */}
                <div className={`absolute top-full mt-2 w-40 bg-white border border-skyblue rounded shadow-md z-10 ${profileDropdown ? 'block' : 'hidden'}`}>
                  <a onClick={() => handleNavigation('/profile')} className="block px-4 py-3 text-sm text-boldblue hover:bg-skyblue/20 cursor-pointer">
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

export default UserNavbar;
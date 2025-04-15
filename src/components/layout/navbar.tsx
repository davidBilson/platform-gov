"use client"
import Logo from "@/assets/logo.svg"
import Image from 'next/image'
import Link from 'next/link'
import { IoMdArrowDropdown } from "react-icons/io";
import { FaBell } from "react-icons/fa6";
import { useState, useRef, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
  const [contractorsDropdown, setContractorsDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const contractorOptions = ["Contractors", "Businesses", "Both"];
  const [selectedOption, setSelectedOption] = useState("Contractors");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setContractorsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='fixed top-0 left-0 w-full h-28 overflow-hidden flex items-center justify-center border-b-2 border-b-[#0B5F94] bg-white z-50'>
        <nav className='w-full max-w-[1440px] m-auto flex items-center justify-evenly gap-12 px-[45px] relative'>
            
            <Image src={Logo} width={80} height={90} alt="GovLink Platform" />
            
            {/* Mobile menu toggle */}
            <div className="lg:hidden ml-auto">
              <button onClick={() => setMobileMenu(!mobileMenu)} className="text-[#0B5F94]">
                <HiMenuAlt3 size={32} />
              </button>
            </div>

            {/* Desktop navigation */}
            <ul className="hidden lg:flex items-center gap-[13px] w-fit text-[#0B5F94] font-bold text-[16px]">
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

            <div className="hidden lg:block">
                <FaBell color="#0B5F94" size={32} />
            </div>

            <div className="hidden lg:block">
                <p className="w-14 h-14 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium">
                    {"KD"}
                </p>
            </div>
            
            {/* Mobile menu */}
            {mobileMenu && (
              <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b-2 border-b-[#0B5F94] shadow-md py-4 z-50">
                <ul className="flex flex-col items-center gap-5 text-[#0B5F94] font-bold text-[16px]">
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
                  <div className="w-full max-w-[250px] h-[50px] flex items-center py-[5px] pl-[20px] pr-[5px] border border-[#E1F5FD] rounded-sm text-[14px]">
                    <input type='text' placeholder="search" className="outline-none w-1/2" />
                    <button className="w-1/2 bg-[#E1F5FD] border-none flex items-center justify-center p-2 rounded-full">
                      <span>{selectedOption}</span>
                      <span><IoMdArrowDropdown size={15} /></span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center gap-8">
                  <div>
                    <FaBell color="#0B5F94" size={32} />
                  </div>
                  <div>
                    <p className="w-14 h-14 bg-[#A0D9F6] flex items-center justify-center rounded-full text-xl text-[#333] font-medium">
                      {"KD"}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </nav>
    </div>
  )
}

export default Navbar
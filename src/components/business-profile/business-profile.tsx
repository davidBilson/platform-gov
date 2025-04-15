import React, { useState, useEffect } from 'react'
import { FaSearch } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";

const BusinessProfile = () => {
  const [specializations, setSpecializations] = useState(['Specializations 1', 'Specializations 2']);
  
    useEffect(() => {
        const falseVal = false;
        const falseCallSetter = () => {
            if (falseVal) {
                setSpecializations(['Specializations 1', 'Specializations 2']);
            }
        }
        falseCallSetter();
    }, [])

  return (
    <section className='p-6'>
      <section className='w-full max-w-[1100px] m-auto'>
        
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
            {/* Company Logo Upload */}
            <div className='relative w-22 h-22 bg-gray-300 border border-[#0b5f94] rounded-full flex items-center justify-center mx-auto sm:mx-0'>
              <div className='absolute flex items-center justify-center w-full h-full'>
                <IoMdImages size={40} className='text-white/70' />
              </div>
              <button className='absolute bottom-0 right-0 z-50 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-[#0b5f94]'>
                <MdEdit size={14} className='text-[#0b5f94]' />
              </button>
            </div>
            
            {/* Company Name */}
            <div className='w-full sm:max-w-[300px] mt-4 sm:mt-0'>
              <input 
                type="text" 
                placeholder="Company Name"
                value="Company Name"
                className='w-full border border-[#0b5f94] text-[#0b5f94] rounded p-4 text-sm pl-5 focus:outline-none focus:border-[#0b5f94]'
              />
            </div>
          </div>
          
          {/* Company Overview */}
          <div className='mb-8 flex items-center justify-center py-3.5 px-5 rounded-md border border-[#0b5f94]'>
            <p className='w-full text-[#0b5f94]'>Company Overview</p>
          </div>
        </div>
        
        <div className='border-t border-t-[#0b5f94] py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:w-full sm:max-w-[120px]'>Location</h2>
          
          <div className='w-full'>
            {/* Country */}
            <div className='mb-4'>
                <div className='relative'>
                <select className='w-full border border-[#0b5f94] rounded p-3 appearance-none text-[#0b5f94] focus:outline-none focus:border-[#0b5f94] '>
                    <option value="">Country</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                </select>
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
                    </svg>
                </div>
                </div>
            </div>
          
          {/* Address */}
          <div className='flex flex-col sm:flex-row gap-4 mb-4'>
            <input 
              type="text" 
              placeholder="Address 1"
              value={"Address 1"}
              className='flex-1 border border-[#0b5f94] text-[#0b5f94] rounded p-3 focus:outline-none focus:border-[#009DDE]'
            />
            <input 
              type="text" 
              placeholder="Address 2"
              value={"Address 2"}
              className='flex-1 border border-[#0b5f94] text-[#0b5f94] rounded p-3 focus:outline-none focus:border-[#009DDE]'
            />
          </div>
          
          {/* City, State, ZIP */}
          <div className='flex flex-col sm:flex-row gap-4 mb-4'>
            <div className='relative flex-1'>
              <input 
                type="text" 
                placeholder="City" 
                value={"City"}
                className='w-full border border-[#0b5f94] text-[#0b5f94] rounded p-3 pr-10 focus:outline-none focus:border-[#0b5f94]'
                />
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                <FaSearch size={14} className='text-[#0b5f94]' />
              </div>
            </div>
            
            <div className='relative flex-1'>
              <select className='w-full border border-[#0b5f94] text-[#0b5f94] rounded p-3 appearance-none focus:outline-none focus:border-[#009DDE]'>
                <option value="">State</option>
                <option value="ca">California</option>
                <option value="tx">Texas</option>
                <option value="ny">New York</option>
              </select>
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
                </svg>
              </div>
            </div>
            
            <input 
              type="text" 
              placeholder="ZIP Code"
              value={"ZIP Code"}
              className='flex-1 border border-[#0b5f94] text-[#0b5f94] rounded p-3 focus:outline-none focus:border-[#009DDE]'
              />
          </div>
            {/* Add Location Button */}
            <button className='bg-[#0B5F94] text-white font-bold py-2 px-4 rounded'>
                Add Location
            </button>
            </div>
          
        </div>
        
        <div className='border-y border-y-[#0b5f94] py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:max-w-[120px]'>Information</h2>
          
          <div className='w-full sm:w-auto'>
          {/* Industry */}
          <div className='mb-4'>
            <div className='relative'>
              <select className='w-full border border-[#0b5f94] text-[#0b5f94] rounded p-3 appearance-none focus:outline-none focus:border-[#0b5f94]'>
                <option value="">Industry</option>
                <option value="tech">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
              </select>
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Company Size */}
          <div className='mb-4'>
            <div className='relative'>
              <select className='w-full border border-[#0b5f94] text-[#0b5f94] rounded p-3 appearance-none focus:outline-none focus:border-[#0b5f94]'>
                <option value="">Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201+">201+ employees</option>
              </select>
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Specializations */}
          <div className='mb-4'>
            <div className='relative'>
              <input 
                type="text" 
                placeholder="Specializations"
                value="Specializations"
                className='w-full border border-[#0b5f94] text-[#0b5f94] rounded p-3 pr-10 focus:outline-none focus:border-[#009DDE]'
                />
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                <FaSearch size={14} className='text-[#0b5f94]' />
              </div>
            </div>
          </div>
          
          {/* Specialization Tags */}
          </div>
            <div className='flex flex-wrap gap-2 self-end mb-6'>
                {specializations.map((spec, index) => (
                    <div key={index} className='bg-[#009DDE] text-white font-bold py-1 px-4 rounded-full'>
                    {spec}
                </div>
                ))}
            </div>
        </div>
        
      </section>
    </section>
  )
}

export default BusinessProfile;
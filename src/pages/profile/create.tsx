// import React, { useState, useEffect } from 'react';
// import { FaSearch } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";
// import axios from 'axios';
// import Image from 'next/image';

const CreateProfile = () => {
  return (
    <main className='p-6'>
      <section className='w-full max-w-[1100px] m-auto'>
      <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
            {/* Company Logo Upload */}
            <div className='relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0'>
              <div className='absolute flex items-center justify-center w-full h-full'>
                {/* {business.logo ? (
                  <Image 
                    src={business.logo} 
                    alt={`${business.name} logo`} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : 
                (
                )} */}
                <IoMdImages size={40} className='text-white/70' />
              </div>
              <button className='absolute bottom-0 right-0 z-20 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue'>
                <MdEdit size={14} className='text-boldblue' />
              </button>
            </div>
            
            {/* Company Name */}
            <div className='w-full sm:max-w-[300px] mt-4 sm:mt-0'>
              <input 
                type="text" 
                placeholder="FirstName LastName"
                value={""}
                className='w-full border border-boldblue text-boldblue rounded p-4 text-sm pl-5 focus:outline-none focus:border-boldblue'
              />
            </div>
          </div>
          
          {/* Company Overview */}
          <div className='mb-8 flex items-center justify-center py-3.5 px-5 rounded-md border border-boldblue'>
            <p className='w-full text-boldblue'>{"About Me/Bio"}</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default CreateProfile;
import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import axios from 'axios';

const BusinessProfile = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch business data on component mount
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://platform-gov-backend.onrender.com/api/businesses/1');
        setBusiness(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch business data');
        setLoading(false);
        console.error('Error fetching business:', err);
      }
    };
    
    fetchBusiness();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading business profile...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!business) return <div className="p-6 text-center">No business data found</div>;

  return (
    <section className='p-6'>
      <section className='w-full max-w-275 m-auto'>
        
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
            {/* Company Logo Upload */}
            <div className='relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0'>
              <div className='absolute flex items-center justify-center w-full h-full'>
                {business.logo ? (
                  <img 
                    src={business.logo} 
                    alt={`${business.name} logo`} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <IoMdImages size={40} className='text-white/70' />
                )}
              </div>
              <button className='absolute bottom-0 right-0 z-20 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue'>
                <MdEdit size={14} className='text-boldblue' />
              </button>
            </div>
            
            {/* Company Name */}
            <div className='w-full sm:max-w-75 mt-4 sm:mt-0'>
              <input 
                type="text" 
                placeholder="Company Name"
                value={business.name || ""}
                className='w-full border border-boldblue text-boldblue rounded p-4 text-sm pl-5 focus:outline focus:outline-boldblue'
              />
            </div>
          </div>
          
          {/* Company Overview */}
          <div className='mb-8 flex items-center justify-center py-3.5 px-5 rounded-md border border-boldblue'>
            <p className='w-full text-boldblue'>{business.overview || "Company Overview"}</p>
          </div>
        </div>
        
        <div className='border-t border-t-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:w-full sm:max-w-[120px]'>Location</h2>
          
          <div className='w-full'>
            {/* Country */}
            <div className='mb-4'>
              <div className='relative'>
                <select 
                  className='w-full border border-boldblue rounded p-3 appearance-none text-boldblue focus:outline-none focus:border-boldblue'
                  defaultValue={business.locations && business.locations[0] ? business.locations[0].country : ""}
                >
                  <option value="">Country</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
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
                value={business.locations && business.locations[0] ? business.locations[0].address1 : ""}
                className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-deepskyblue'
              />
              <input 
                type="text" 
                placeholder="Address 2"
                value={business.locations && business.locations[0] ? business.locations[0].address2 : ""}
                className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-deepskyblue'
              />
            </div>
            
            {/* City, State, ZIP */}
            <div className='flex flex-col sm:flex-row gap-4 mb-4'>
              <div className='relative flex-1'>
                <input 
                  type="text" 
                  placeholder="City" 
                  value={business.locations && business.locations[0] ? business.locations[0].city : ""}
                  className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline-none focus:border-boldblue'
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <FaSearch size={14} className='text-boldblue' />
                </div>
              </div>
              
              <div className='relative flex-1'>
                <select 
                  className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-deepskyblue'
                  defaultValue={business.locations && business.locations[0] ? business.locations[0].state : ""}
                >
                  <option value="">State</option>
                  <option value="MA">Massachusetts</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="NY">New York</option>
                  <option value="IL">Illinois</option>
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
                value={business.locations && business.locations[0] ? business.locations[0].zipCode : ""}
                className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-deepskyblue'
              />
            </div>
            {/* Add Location Button */}
            <button className='bg-boldblue text-white font-bold py-2 px-4 rounded'>
              Add Location
            </button>
          </div>
        </div>
        
        <div className='border-y border-y-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:max-w-[120px]'>Information</h2>
          
          <div className='w-full sm:w-auto'>
            {/* Industry */}
            <div className='mb-4'>
              <div className='relative'>
                <select 
                  className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-boldblue'
                  defaultValue={business.industry || ""}
                >
                  <option value="">Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
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
                <select 
                  className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-boldblue'
                  defaultValue={business.size || ""}
                >
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
                  className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline-none focus:border-deepskyblue'
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <FaSearch size={14} className='text-boldblue' />
                </div>
              </div>
            </div>
          </div>
          
          {/* Specialization Tags */}
          <div className='flex flex-wrap gap-2 self-end mb-6'>
            {business.specializations && business.specializations.map((spec, index) => (
              <div key={index} className='bg-deepskyblue text-white font-bold py-1 px-4 rounded-full'>
                {spec}
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default BusinessProfile;
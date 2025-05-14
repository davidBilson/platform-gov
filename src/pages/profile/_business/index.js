import React, { useState, useEffect } from 'react';
import { IoMdImages } from "react-icons/io";
import OpenJobs from './_open-jobs';
import useAuthStore from '@/store/useAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

const BusinessProfile = () => {
  
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { userId } = useAuthStore();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  
  // Fetch client profile on component mount
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const apiEndpoint = process.env.NEXT_PUBLIC_FETCH_CLIENT_PROFILE?.replace(':id', userId);
        const response = await fetch(`${BASE_URL}${apiEndpoint}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setClient(data.data);
        }
      } catch (err) {
        console.error('Error fetching client profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [userId, BASE_URL]);

  useEffect(() => {
    if(!client && !loading) {
      toast.info('You are yet to create a profile!')
    }
  }, [client, loading]);

  // Handle the loading state
  if (loading) {
    return (
      <section className='h-screen w-full fixed top-0 left-0 z-50  flex items-center justify-end'>
        <section className='w-full h-screen  p-4 md:p-7.5 overflow-y-auto'>
          <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex items-center justify-center h-full'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className='p-5 pb-20 md:p-6'>
      <section className='w-full max-w-275 m-auto'>
        
        {/* Company Logo and Name */}
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
            {/* Company Logo */}
            <div className='relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0'>
              <div className='absolute flex items-center justify-center w-full h-full'>
                {client && client.logo ? (
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <IoMdImages size={40} className='text-white/70' />
                )}
              </div>
            </div>
            
            {/* Company Name */}
            <div className='w-full sm:max-w-75 mt-4 sm:mt-0'>
              <h1 className='text-boldblue text-xl font-semibold'>
                {client?.name || "Company Name"}
              </h1>
            </div>
          </div>
          
          {/* Company Overview */}
          <div className='mb-8 py-3.5 px-5 rounded-md border border-boldblue'>
            <p className='text-boldblue'>
              {client?.overview || "No company overview available."}
            </p>
          </div>
        </div>
        
        {/* Locations Section */}
        <div className='border-t border-t-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:w-full sm:max-w-[120px]'>Location</h2>
          
          <div className='w-full'>
            {client && client.locations && client.locations.length > 0 ? (
              client.locations.map((location, index) => (
                <div key={index} className={index > 0 ? 'mt-8 pt-4 border-t border-gray-200' : ''}>
                  {index > 0 && (
                    <h3 className="font-medium mb-2">Location {index + 1}</h3>
                  )}
                  
                  {/* Location Details */}
                  <div className='mb-4'>
                    <p className='text-boldblue font-medium'>
                      {location.country || "Country not specified"}
                    </p>
                  </div>
                  
                  {/* Address */}
                  <div className='mb-4'>
                    <p className='text-boldblue'>
                      {location.address1 && `${location.address1}, `}
                      {location.address2}
                    </p>
                  </div>
                  
                  {/* City, State, ZIP */}
                  <div className='mb-4'>
                    <p className='text-boldblue'>
                      {location.city && `${location.city}, `}
                      {location.state && `${location.state} `}
                      {location.zipCode}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-boldblue italic'>No locations specified.</p>
            )}
          </div>
        </div>
        
        {/* Information Section */}
        <div className='border-y border-y-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:max-w-[120px]'>Information</h2>
          
          <div className='w-full'>
            {/* Industry */}
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Industry</h3>
              <p className='text-boldblue'>
                {client?.industry || "Not specified"}
              </p>
            </div>

            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Security Clearance</h3>
              <p className='text-boldblue'>
                {client?.clearance || "Not specified"}
              </p>
            </div>
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Department / Agency</h3>
              <p className='text-boldblue'>
                {client?.department || "Not specified"}
              </p>
            </div>
            
            {/* Company Size */}
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Size</h3>
              <p className='text-boldblue'>
                {client?.size || "Not specified"}
              </p>
            </div>
            
            {/* Specializations */}
            <div className='mb-4'>
              <h3 className='font-medium mb-1'>Specializations</h3>
              <div className='flex flex-wrap gap-2'>
                {client?.specializations && client.specializations.length > 0 ? (
                  client.specializations.map((spec, index) => (
                    <div key={index} className='bg-deepskyblue text-white font-bold py-1 px-4 rounded-full'>
                      {spec}
                    </div>
                  ))
                ) : (
                  <p className='text-boldblue italic'>No specializations listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit Button at Bottom */}
        <div className='mt-8 flex justify-end'>
          <Link 
            href="/profile/edit" 
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
          >
            {client ? "Edit Profile" : "Create Profile"}
          </Link>
        </div>
      </section>
      
      <OpenJobs />
    </section>
  );
};

export default BusinessProfile;
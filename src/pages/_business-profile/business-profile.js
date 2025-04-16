// import React, { useState, useEffect } from 'react'
// import { FaSearch } from "react-icons/fa";
// import { IoMdImages } from "react-icons/io";
// import { MdEdit } from "react-icons/md";

// const BusinessProfile = () => {
//   const [specializations, setSpecializations] = useState(['Specializations 1', 'Specializations 2']);
  
//     useEffect(() => {
//         const falseVal = false;
//         const falseCallSetter = () => {
//             if (falseVal) {
//                 setSpecializations(['Specializations 1', 'Specializations 2']);
//             }
//         }
//         falseCallSetter();
//     }, [])

//   return (
//     <section className='p-6'>
//       <section className='w-full max-w-[1100px] m-auto'>
        
//         <div className='mb-6'>
//           <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
//             {/* Company Logo Upload */}
//             <div className='relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0'>
//               <div className='absolute flex items-center justify-center w-full h-full'>
//                 <IoMdImages size={40} className='text-white/70' />
//               </div>
//               <button className='absolute bottom-0 right-0 z-20 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue'>
//                 <MdEdit size={14} className='text-boldblue' />
//               </button>
//             </div>
            
//             {/* Company Name */}
//             <div className='w-full sm:max-w-[300px] mt-4 sm:mt-0'>
//               <input 
//                 type="text" 
//                 placeholder="Company Name"
//                 value="Company Name"
//                 className='w-full border border-boldblue text-boldblue rounded p-4 text-sm pl-5 focus:outline-none focus:border-boldblue'
//               />
//             </div>
//           </div>
          
//           {/* Company Overview */}
//           <div className='mb-8 flex items-center justify-center py-3.5 px-5 rounded-md border border-boldblue'>
//             <p className='w-full text-boldblue'>Company Overview</p>
//           </div>
//         </div>
        
//         <div className='border-t border-t-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
//           <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:w-full sm:max-w-[120px]'>Location</h2>
          
//           <div className='w-full'>
//             {/* Country */}
//             <div className='mb-4'>
//                 <div className='relative'>
//                 <select className='w-full border border-boldblue rounded p-3 appearance-none text-boldblue focus:outline-none focus:border-boldblue '>
//                     <option value="">Country</option>
//                     <option value="us">United States</option>
//                     <option value="ca">Canada</option>
//                     <option value="uk">United Kingdom</option>
//                 </select>
//                 <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
//                     <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
//                     </svg>
//                 </div>
//                 </div>
//             </div>
          
//           {/* Address */}
//           <div className='flex flex-col sm:flex-row gap-4 mb-4'>
//             <input 
//               type="text" 
//               placeholder="Address 1"
//               value={"Address 1"}
//               className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-brightblue'
//             />
//             <input 
//               type="text" 
//               placeholder="Address 2"
//               value={"Address 2"}
//               className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-brightblue'
//             />
//           </div>
          
//           {/* City, State, ZIP */}
//           <div className='flex flex-col sm:flex-row gap-4 mb-4'>
//             <div className='relative flex-1'>
//               <input 
//                 type="text" 
//                 placeholder="City" 
//                 value={"City"}
//                 className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline-none focus:border-boldblue'
//                 />
//               <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
//                 <FaSearch size={14} className='text-boldblue' />
//               </div>
//             </div>
            
//             <div className='relative flex-1'>
//               <select className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-brightblue'>
//                 <option value="">State</option>
//                 <option value="ca">California</option>
//                 <option value="tx">Texas</option>
//                 <option value="ny">New York</option>
//               </select>
//               <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
//                 <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
//                 </svg>
//               </div>
//             </div>
            
//             <input 
//               type="text" 
//               placeholder="ZIP Code"
//               value={"ZIP Code"}
//               className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-brightblue'
//               />
//           </div>
//             {/* Add Location Button */}
//             <button className='bg-boldblue text-white font-bold py-2 px-4 rounded'>
//                 Add Location
//             </button>
//             </div>
          
//         </div>
        
//         <div className='border-y border-y-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
//           <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:max-w-[120px]'>Information</h2>
          
//           <div className='w-full sm:w-auto'>
//           {/* Industry */}
//           <div className='mb-4'>
//             <div className='relative'>
//               <select className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-boldblue'>
//                 <option value="">Industry</option>
//                 <option value="tech">Technology</option>
//                 <option value="healthcare">Healthcare</option>
//                 <option value="finance">Finance</option>
//               </select>
//               <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
//                 <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           {/* Company Size */}
//           <div className='mb-4'>
//             <div className='relative'>
//               <select className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-boldblue'>
//                 <option value="">Size</option>
//                 <option value="1-10">1-10 employees</option>
//                 <option value="11-50">11-50 employees</option>
//                 <option value="51-200">51-200 employees</option>
//                 <option value="201+">201+ employees</option>
//               </select>
//               <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
//                 <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
//                 </svg>
//               </div>
//             </div>
//           </div>
          
//           {/* Specializations */}
//           <div className='mb-4'>
//             <div className='relative'>
//               <input 
//                 type="text" 
//                 placeholder="Specializations"
//                 value="Specializations"
//                 className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline-none focus:border-brightblue'
//                 />
//               <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
//                 <FaSearch size={14} className='text-boldblue' />
//               </div>
//             </div>
//           </div>
          
//           {/* Specialization Tags */}
//           </div>
//             <div className='flex flex-wrap gap-2 self-end mb-6'>
//                 {specializations.map((spec, index) => (
//                     <div key={index} className='bg-brightblue text-white font-bold py-1 px-4 rounded-full'>
//                     {spec}
//                 </div>
//                 ))}
//             </div>
//         </div>
        
//       </section>
//     </section>
//   )
// }

// export default BusinessProfile;


import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import axios from "axios";

const BusinessProfile = () => {
  // State to store business data
  const [business, setBusiness] = useState({
    id: '',
    name: '',
    overview: '',
    logo: null,
    locations: [{
      country: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: ''
    }],
    industry: '',
    size: '',
    specializations: []
  });

  // State for form inputs
  const [companyName, setCompanyName] = useState('');
  const [companyOverview, setCompanyOverview] = useState('');
  const [country, setCountry] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/businesses/1');
        
        if (response.data.success) {
          const businessData = response.data.data;
          setBusiness(businessData);
          
          // Set form values
          setCompanyName(businessData.name || '');
          setCompanyOverview(businessData.overview || '');
          
          if (businessData.locations && businessData.locations.length > 0) {
            const location = businessData.locations[0];
            setCountry(location.country || '');
            setAddress1(location.address1 || '');
            setAddress2(location.address2 || '');
            setCity(location.city || '');
            setState(location.state || '');
            setZipCode(location.zipCode || '');
          }
          
          setIndustry(businessData.industry || '');
          setSize(businessData.size || '');
        }
      } catch (err) {
        console.error('Error fetching business data:', err);
        setError('Failed to load business profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedData = {
        name: companyName,
        overview: companyOverview,
        country,
        address1,
        address2,
        city,
        state,
        zipCode,
        industry,
        size
      };

      const response = await axios.put(`http://localhost:5000/api/business-profile/1`, updatedData);
      
      if (response.data.success) {
        setBusiness(response.data.data);
        setSuccessMessage('Business profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating business profile:', err);
      setError('Failed to update business profile. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Add a new specialization
  const addSpecialization = async () => {
    if (!newSpecialization.trim()) return;
    
    try {
      const response = await axios.post(`http://localhost:5000/api/business-profile/1/specializations`, {
        specialization: newSpecialization,
        action: 'add'
      });
      
      if (response.data.success) {
        setBusiness(response.data.data);
        setNewSpecialization('');
      }
    } catch (err) {
      console.error('Error adding specialization:', err);
      setError('Failed to add specialization');
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Remove a specialization
  const removeSpecialization = async (specialization) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/business-profile/1/specializations`, {
        specialization,
        action: 'remove'
      });
      
      if (response.data.success) {
        setBusiness(response.data.data);
      }
    } catch (err) {
      console.error('Error removing specialization:', err);
      setError('Failed to remove specialization');
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await axios.put(`http://localhost:5000/api/business-profile/1`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setBusiness(response.data.data);
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo');
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Handle adding a new location
  const addLocation = async () => {
    if (!country || !city || !state) {
      setError('Country, city and state are required to add a location');
      
      setTimeout(() => {
        setError(null);
      }, 3000);
      
      return;
    }
    
    try {
      const newLocation = {
        country,
        address1,
        address2,
        city,
        state,
        zipCode
      };
      
      const response = await axios.post(`http://localhost:5000/api/business-profile/1/locations`, newLocation);
      
      if (response.data.success) {
        setBusiness(response.data.data);
        
        // Clear form fields after adding location
        setCountry('');
        setAddress1('');
        setAddress2('');
        setCity('');
        setState('');
        setZipCode('');
      }
    } catch (err) {
      console.error('Error adding location:', err);
      setError('Failed to add location');
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading business profile...</div>;
  }

  return (
    <section className='p-6'>
      <form onSubmit={handleSubmit}>
        <section className='w-full max-w-[1100px] m-auto'>
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}
          
          <div className='mb-6'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
              {/* Company Logo Upload */}
              <div className='relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0'>
                {business.logo ? (
                  <Image 
                    src={business.logo} 
                    alt="Company Logo" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className='absolute flex items-center justify-center w-full h-full'>
                    <IoMdImages size={40} className='text-white/70' />
                  </div>
                )}
                <label className='absolute bottom-0 right-0 z-20 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue cursor-pointer'>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoUpload}
                  />
                  <MdEdit size={14} className='text-boldblue' />
                </label>
              </div>
              
              {/* Company Name */}
              <div className='w-full sm:max-w-[300px] mt-4 sm:mt-0'>
                <input 
                  type="text" 
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className='w-full border border-boldblue text-boldblue rounded p-4 text-sm pl-5 focus:outline-none focus:border-boldblue'
                />
              </div>
            </div>
            
            {/* Company Overview */}
            <div className='mb-8 flex items-center justify-center py-3.5 px-5 rounded-md border border-boldblue'>
              <textarea 
                placeholder="Company Overview"
                value={companyOverview}
                onChange={(e) => setCompanyOverview(e.target.value)}
                className='w-full text-boldblue focus:outline-none resize-none min-h-[80px]'
              />
            </div>
          </div>
          
          <div className='border-t border-t-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
            <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:w-full sm:max-w-[120px]'>Location</h2>
            
            <div className='w-full'>
              {/* Existing Locations */}
              {business.locations && business.locations.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Current Locations:</h3>
                  {business.locations.map((location, index) => (
                    <div key={index} className="mb-3 p-3 border border-gray-200 rounded">
                      <p><strong>{location.city}, {location.state}</strong></p>
                      <p>{location.address1}{location.address2 && `, ${location.address2}`}</p>
                      <p>{location.country}, {location.zipCode}</p>
                    </div>
                  ))}
                </div>
              )}
            
              {/* Country */}
              <div className='mb-4'>
                <div className='relative'>
                  <select 
                    className='w-full border border-boldblue rounded p-3 appearance-none text-boldblue focus:outline-none focus:border-boldblue'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
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
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-brightblue'
                />
                <input 
                  type="text" 
                  placeholder="Address 2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-brightblue'
                />
              </div>
            
              {/* City, State, ZIP */}
              <div className='flex flex-col sm:flex-row gap-4 mb-4'>
                <div className='relative flex-1'>
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline-none focus:border-boldblue'
                  />
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    <FaSearch size={14} className='text-boldblue' />
                  </div>
                </div>
                
                <div className='relative flex-1'>
                  <select 
                    className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-brightblue'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="">State</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="NY">New York</option>
                    <option value="MA">Massachusetts</option>
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
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline-none focus:border-brightblue'
                />
              </div>
              {/* Add Location Button */}
              <button 
                type="button"
                onClick={addLocation}
                className='bg-boldblue text-white font-bold py-2 px-4 rounded'
              >
                Add Location
              </button>
            </div>
          </div>
          
          <div className='border-y border-y-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
            <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:max-w-[120px]'>Information</h2>
            
            <div className='w-full'>
              <div className='w-full sm:w-auto'>
                {/* Industry */}
                <div className='mb-4'>
                  <div className='relative'>
                    <select 
                      className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-boldblue'
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
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
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
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
                      placeholder="Add a specialization"
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSpecialization();
                        }
                      }}
                      className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline-none focus:border-brightblue'
                    />
                    <div 
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                      onClick={addSpecialization}
                    >
                      <FaSearch size={14} className='text-boldblue' />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specialization Tags */}
              <div className='flex flex-wrap gap-2 mb-6'>
                {business.specializations && business.specializations.map((spec, index) => (
                  <div key={index} className='bg-brightblue text-white font-bold py-1 px-4 rounded-full flex items-center'>
                    {spec}
                    <button 
                      type="button"
                      onClick={() => removeSpecialization(spec)}
                      className="ml-2 text-white hover:text-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Save Button */}
              <button 
                type="submit"
                className='bg-boldblue text-white font-bold py-2 px-6 rounded mt-4'
              >
                Save Profile
              </button>
            </div>
          </div>
        </section>
      </form>
    </section>
  );
};

export default BusinessProfile;
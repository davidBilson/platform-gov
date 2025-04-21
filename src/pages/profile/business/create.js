import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";


const CreateBusinessProfile = () => {
  const [business, setBusiness] = useState({
    name: "",
    overview: "",
    logo: "",
    industry: "",
    size: "",
    specializations: [],
    locations: [
      {
        country: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: ""
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState("");

  const { userId } = useAuthStore();
  const router = useRouter();
  
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch business profile on component mount
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const apiEndpoint = process.env.NEXT_PUBLIC_FETCH_BUSINESS_PROFILE?.replace(':id', userId);
        const response = await fetch(`${BASE_URL}${apiEndpoint}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setBusiness(data.data);
        } else {
          // No profile found, keep the default empty state
          console.log("No business profile found. Ready to create one.");
        }
      } catch (err) {
        console.error('Error fetching business profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [userId, BASE_URL]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusiness(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle location changes
  const handleLocationChange = (e, index = 0) => {
    const { name, value } = e.target;
    const updatedLocations = [...business.locations];
    
    if (!updatedLocations[index]) {
      updatedLocations[index] = {};
    }
    
    updatedLocations[index] = {
      ...updatedLocations[index],
      [name]: value
    };
    
    setBusiness(prev => ({
      ...prev,
      locations: updatedLocations
    }));
  };

  // Add a new specialization
  const handleAddSpecialization = () => {
    if (!newSpecialization.trim()) return;
    
    if (!business.specializations.includes(newSpecialization)) {
      setBusiness(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization]
      }));
    }
    
    setNewSpecialization("");
  };

  // Remove a specialization
  const handleRemoveSpecialization = (specialization) => {
    setBusiness(prev => ({
      ...prev,
      specializations: prev.specializations.filter(spec => spec !== specialization)
    }));
  };

  // Add a new location
  const handleAddLocation = () => {
    setBusiness(prev => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          country: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          zipCode: ""
        }
      ]
    }));
  };

  // Upload logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await fetch(`${BASE_URL}${process.env.NEXT_PUBLIC_POST_PROFILE_PIC}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setBusiness(prev => ({
          ...prev,
          logo: data.data.imagePath
        }));
      } else {
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!userId) {
      toast.error('User ID is required');
      return;
    }

    setIsLoading(true);
    
    try {
      const createApiEndpoint = process.env.NEXT_PUBLIC_CREATE_BUSINESS_PROFILE;
      const updateApiEndpoint = process.env.NEXT_PUBLIC_UPDATE_BUSINESS_PROFILE?.replace(':id', userId);

      const endpoint = business._id 
        ? `${BASE_URL}${updateApiEndpoint}`
        : `${BASE_URL}${createApiEndpoint}`;
      
      const method = business._id ? 'PUT' : 'POST';
      
      const payload = {
        ...business,
        userId: userId
      };
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the local state with the new/updated data
        setBusiness(data.data);
        if (business._id) {
          toast.success('Profile updated successfully!');
        } else {
          toast.success('Profile created successfully!');
        }
      } else {
        toast.error(data.message || 'Failed to save business profile');
      }
    } catch (err) {
      console.error('Error saving business profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleCancel = () => {
  //   // Confirm before canceling changes
  //   if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
  //     // Redirect or reset form
  //     router.back();
  //   }
  // };

  const handlePreview = () => {
    router.push('/profile/business')
  };

  // Handle specialization input with enter key
  const handleSpecializationKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecialization();
    }
  };

  if (loading) return <div className="p-6 text-center">Loading business profile...</div>;

  return (
    <section className='p-6'>
      <section className='w-full max-w-275 m-auto pb-32'>
        
        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
            {/* Company Logo Upload */}
            <div className='relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0'>
              <div className='absolute flex items-center justify-center w-full h-full'>
                {business.logo ? (
                  <img 
                    src={business.logo} 
                    alt={`${business.name || 'Company'} logo`} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <IoMdImages size={40} className='text-white/70' />
                )}
              </div>
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              <label htmlFor="logo-upload" className='absolute bottom-0 right-0 z-20 h-7 w-7 bg-white rounded-full flex items-center justify-center border border-boldblue cursor-pointer'>
                <MdEdit size={14} className='text-boldblue' />
              </label>
            </div>
            
            {/* Company Name */}
            <div className='w-full sm:max-w-75 mt-4 sm:mt-0'>
              <input 
                type="text" 
                name="name"
                placeholder="Company Name"
                value={business.name || ""}
                onChange={handleChange}
                className='w-full border border-boldblue text-boldblue rounded p-4 text-sm pl-5 focus:outline focus:outline-boldblue'
              />
            </div>
          </div>
          
          {/* Company Overview */}
          <div className='mb-8 border border-boldblue rounded-md'>
            <textarea
              name="overview"
              value={business.overview || ""}
              onChange={handleChange}
              placeholder="Company Overview"
              className='w-full py-3.5 px-5 text-boldblue resize-none focus:outline focus:outline-boldblue rounded-md min-h-[80px]'
            />
          </div>
        </div>
        
        <div className='border-t border-t-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:w-full sm:max-w-[120px]'>Location</h2>
          
          <div className='w-full'>
            {business.locations && business.locations.map((location, index) => (
              <div key={index} className={index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}>
                {index > 0 && (
                  <div className="flex justify-between mb-4">
                    <h3 className="font-medium">Location {index + 1}</h3>
                    <button 
                      onClick={() => {
                        const updatedLocations = [...business.locations];
                        updatedLocations.splice(index, 1);
                        setBusiness(prev => ({ ...prev, locations: updatedLocations }));
                      }}
                      className="text-red-500 text-sm transition transform active:scale-95 hover:opacity-70 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                {/* Country */}
                <div className='mb-4'>
                  <div className='relative'>
                    <select 
                      name="country"
                      className='w-full border border-boldblue rounded p-3 appearance-none text-boldblue focus:outline-none focus:border-boldblue'
                      value={location.country || ""}
                      onChange={(e) => handleLocationChange(e, index)}
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
                    name="address1"
                    placeholder="Address 1"
                    value={location.address1 || ""}
                    onChange={(e) => handleLocationChange(e, index)}
                    className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline focus:outline-boldblue'
                  />
                  <input 
                    type="text" 
                    name="address2"
                    placeholder="Address 2"
                    value={location.address2 || ""}
                    onChange={(e) => handleLocationChange(e, index)}
                    className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline focus:outline-boldblue'
                  />
                </div>
                
                {/* City, State, ZIP */}
                <div className='flex flex-col sm:flex-row gap-4 mb-4'>
                  <div className='relative flex-1'>
                    <input 
                      type="text" 
                      name="city"
                      placeholder="City" 
                      value={location.city || ""}
                      onChange={(e) => handleLocationChange(e, index)}
                      className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline focus:outline-boldblue'
                    />
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                      <FaSearch size={14} className='text-boldblue' />
                    </div>
                  </div>
                  
                  <div className='relative flex-1'>
                    <select 
                      name="state"
                      className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline focus:outline-boldblue'
                      value={location.state || ""}
                      onChange={(e) => handleLocationChange(e, index)}
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
                    name="zipCode"
                    placeholder="ZIP Code"
                    value={location.zipCode || ""}
                    onChange={(e) => handleLocationChange(e, index)}
                    className='flex-1 border border-boldblue text-boldblue rounded p-3 focus:outline focus:outline-boldblue'
                  />
                </div>
              </div>
            ))}
            
            {/* Add Location Button */}
            <button 
              onClick={handleAddLocation}
              className='text-sm px-4 py-[11px] bg-boldblue rounded-lg text-white font-semibold transition transform active:scale-95 hover:opacity-70 cursor-pointer'
            >
              Add Location
            </button>
          </div>
        </div>
        
        <div className='border-y border-y-boldblue py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-[60px]'>
          <h2 className='font-semibold text-xl mb-4 sm:mb-0 sm:max-w-[120px]'>Information</h2>
          
          <div className='w-full'>
            {/* Industry */}
            <div className='mb-4 w-full max-w-105'>
              <div className='relative'>
                <select 
                  name="industry"
                  className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-boldblue'
                  value={business.industry || ""}
                  onChange={handleChange}
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
            <div className='mb-4 w-full max-w-105'>
              <div className='relative'>
                <select 
                  name="size"
                  className='w-full border border-boldblue text-boldblue rounded p-3 appearance-none focus:outline-none focus:border-boldblue'
                  value={business.size || ""}
                  onChange={handleChange}
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
            <div className='mb-4 w-full max-w-105'>
              <div className='relative'>
                <input 
                  type="text" 
                  placeholder="Specializations"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  onKeyPress={handleSpecializationKeyPress}
                  className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline focus:outline-boldblue'
                />
                <button
                  onClick={handleAddSpecialization}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2'
                >
                  <FaSearch size={14} className='text-boldblue' />
                </button>
              </div>
            </div>
          </div>
          
          {/* Specialization Tags */}
          <div className='w-full  mb-7.5 h-full self-end place-self-end justify-self-end flex flex-wrap gap-2.5'>
            {business.specializations && business.specializations.map((spec, index) => (
              <div key={index} className='bg-deepskyblue text-white font-bold py-1 px-4 rounded-full flex items-center gap-1 w-fit'>
                {spec}
                <button 
                  onClick={() => handleRemoveSpecialization(spec)}
                  className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95 hover:text-red-500"
                
                >
                  <IoCloseOutline size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sticky bottom action buttons */}
      <section className="flex items-center justify-center gap-2.5 py-7.5 px-6 fixed bottom-0 left-0 bg-skyblue w-full border-t border-t-boldblue">
          <button 
            type="button"
            // onClick={handleCancel}
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handlePreview}
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out  py-3 px-5 border bg-white border-boldblue text-boldblue text-sm font-semibold rounded-lg"
          >
            Preview Public View
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </section>
    </section>
  );
};

export default CreateBusinessProfile;
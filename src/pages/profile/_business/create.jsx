import { clearanceLevels } from "@/utils/govtAgencyAndClearanceIndex/departmentAgenciesClearances";
import { countriesAndStates, countries } from "../../../utils/countryAndStates/_countriesAndStates";
import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import useAuthStore from '@/store/useAuth';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { GovernmentDepartmentsAndAgenciesByCountry } from "@/utils/feedFilter/GovernmentDepartmentsAndAgenciesByCountry";
import { BusinessIndustries } from "@/utils/feedFilter/BusinessIndustries";

const CreateBusinessProfile = () => {
  const [business, setBusiness] = useState({
    name: "",
    overview: "",
    logo: "",
    industry: "",
    size: "",
    department: [],
    clearance: "",
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
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState(""); // Added for department search
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showClearancesDropdown, setShowClearancesDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState({});
  const [showStateDropdown, setShowStateDropdown] = useState({});

  const { userId } = useAuthStore();
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch business profile on component mount
  const fetchBusinessProfile = async () => {
    if (!userId) return;

    try {
      // setLoading(true);
      const apiEndpoint = process.env.NEXT_PUBLIC_FETCH_CLIENT_PROFILE?.replace(':id', userId);
      const response = await fetch(`${BASE_URL}${apiEndpoint}`);
      const data = await response.json();

      if (data.success && data.data) {
        setBusiness(data.data);
        return data.data;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error fetching business profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBusinessProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusiness(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

    // If country changes, reset state
    if (name === 'country') {
      updatedLocations[index].state = '';
    }

    setBusiness(prev => ({
      ...prev,
      locations: updatedLocations
    }));
  };

  // Helper function to get states for a specific location
  const getStatesForLocation = (locationIndex) => {
    const location = business.locations[locationIndex];
    if (!location || !location.country) {
      return [];
    }
    return countriesAndStates[location.country] || [];
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

  const handleRemoveSpecialization = (specialization) => {
    setBusiness(prev => ({
      ...prev,
      specializations: prev.specializations.filter(spec => spec !== specialization)
    }));
  };

  // Add department functions
  const handleAddDepartment = (department) => {
    if (!business.department.includes(department)) {
      setBusiness(prev => ({
        ...prev,
        department: [...prev.department, department]
      }));
    }
    setDepartmentSearchTerm("");
    // setShowDepartmentDropdown(false);
  };

  const handleRemoveDepartment = (department) => {
    setBusiness(prev => ({
      ...prev,
      department: prev.department.filter(dept => dept !== department)
    }));
  };

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
      const createApiEndpoint = process.env.NEXT_PUBLIC_CREATE_CLIENT_PROFILE;
      const updateApiEndpoint = process.env.NEXT_PUBLIC_UPDATE_CLIENT_PROFILE?.replace(':id', userId);

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
        toast.error(data.message || 'Failed to save profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      return toast.error('Error saving profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (business.overview !== "" && business.logo !== "") {
      router.push('/profile');
    } else {
      toast.error("Please complete, and save your profile");
    }
  };

  // Handle specialization input with enter key
  const handleSpecializationKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecialization();
    }
  };

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
    <section className='p-6'>
      <section className='w-full max-w-275 m-auto pb-32'>

        <div className='mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-5 mb-[30px]'>
            {/* Company Logo Upload */}
            <div className='relative w-22 h-22 bg-gray-300 border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0'>
              <div className='w-22 h-22 border border-boldblue rounded-full overflow-hidden absolute flex items-center justify-center'>
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={`${business.name || 'Company'} logo`}
                    className="w-full h-full object-cover"
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
          <div className='mb-8 rounded-md'>
            <textarea
              name="overview"
              value={business.overview || ""}
              onChange={handleChange}
              placeholder="Company Overview"
              className='w-full py-3.5 px-5 text-boldblue resize-none border border-boldblue  focus:outline focus:outline-boldblue rounded-md min-h-[80px]'
            />
          </div>
          {/* Clearance */}
          <div className='mb-4 w-full max-w-105'>
            <div className='relative'>
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-3 text-sm text-boldblue">
                <input
                  type="text"
                  value={business.clearance || ""}
                  onChange={(e) => setBusiness({ ...business, clearance: e.target.value })}
                  onFocus={() => setShowClearancesDropdown(true)}
                  onBlur={() => setTimeout(() => setShowClearancesDropdown(false), 200)}
                  className="outline-none placeholder:font-semibold w-[80%]"
                  placeholder="Previously held clearances"
                />
                <IoIosSearch />
              </div>

              {showClearancesDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {clearanceLevels
                    .filter(clearance =>
                      business.clearance
                        ? clearance.toLowerCase().includes(business.clearance.toLowerCase())
                        : true
                    )
                    .map((clearance, idx) => (
                      <div
                        key={`clearance-option-${idx}`}
                        className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setBusiness({
                            ...business,
                            clearance: clearance
                          });
                          setShowClearancesDropdown(false);
                        }}
                      >
                        {clearance}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* Department/Agency Focus */}
          <div className='mb-8 w-full max-w-105'>
            <div className='relative'>
              <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-3 text-sm text-boldblue">
                <input
                  type="text"
                  value={departmentSearchTerm}
                  onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                  onFocus={() => setShowDepartmentDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDepartmentDropdown(false), 200)}
                  className="outline-none placeholder:font-semibold w-[80%]"
                  placeholder="Department/Agency Focus"
                />
                <IoIosSearch />
              </div>

              {showDepartmentDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {GovernmentDepartmentsAndAgenciesByCountry
                    .filter(dept => {
                      // Filter out already selected departments and apply search filter
                      const isNotSelected = !business.department.includes(dept);
                      const matchesSearch = departmentSearchTerm
                        ? dept.toLowerCase().includes(departmentSearchTerm.toLowerCase())
                        : true;
                      return isNotSelected && matchesSearch;
                    })
                    .map((dept, idx) => (
                      <div
                        key={`dept-option-${idx}`}
                        className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddDepartment(dept);
                        }}
                      >
                        {dept}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Department Tags */}
            <div className='flex flex-wrap gap-2.5 mt-4'>
              {business.department && business.department.map((dept, index) => (
                <div key={index} className='bg-deepskyblue text-white font-bold py-1 px-4 rounded-full flex items-center gap-1 w-fit'>
                  {dept}
                  <button
                    onClick={() => handleRemoveDepartment(dept)}
                    className="font-semibold text-sm ml-1 focus:outline-none cursor-pointer transition transform active:scale-95 hover:text-red-500"
                  >
                    <IoCloseOutline size={16} />
                  </button>
                </div>
              ))}
            </div>
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
                    <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-3 text-sm text-boldblue">
                      <input
                        type="text"
                        value={location.country || ""}
                        onChange={(e) => {
                          const updatedLocations = [...business.locations];
                          updatedLocations[index] = {
                            ...updatedLocations[index],
                            country: e.target.value,
                            state: '' // Reset state when country changes
                          };
                          setBusiness(prev => ({ ...prev, locations: updatedLocations }));
                        }}
                        onFocus={() => setShowCountryDropdown({ ...showCountryDropdown, [index]: true })}
                        onBlur={() => setTimeout(() => setShowCountryDropdown({ ...showCountryDropdown, [index]: false }), 200)}
                        className="outline-none placeholder:font-semibold w-[80%]"
                        placeholder="Country"
                      />
                      <IoIosSearch />
                    </div>

                    {showCountryDropdown[index] && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {countries
                          .filter(country =>
                            location.country
                              ? country.toLowerCase().includes(location.country.toLowerCase())
                              : true
                          )
                          .map((country, idx) => (
                            <div
                              key={`country-option-${idx}`}
                              className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const updatedLocations = [...business.locations];
                                updatedLocations[index] = {
                                  ...updatedLocations[index],
                                  country: country,
                                  state: '' // Reset state when country changes
                                };
                                setBusiness(prev => ({ ...prev, locations: updatedLocations }));
                                setShowCountryDropdown({ ...showCountryDropdown, [index]: false });
                              }}
                            >
                              {country}
                            </div>
                          ))
                        }
                      </div>
                    )}
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

                  {/* State Dropdown */}
                  <div className='relative flex-1'>
                    <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-3 text-sm text-boldblue">
                      <input
                        type="text"
                        value={location.state || ""}
                        onChange={(e) => {
                          const updatedLocations = [...business.locations];
                          updatedLocations[index] = {
                            ...updatedLocations[index],
                            state: e.target.value
                          };
                          setBusiness(prev => ({ ...prev, locations: updatedLocations }));
                        }}
                        onFocus={() => setShowStateDropdown({ ...showStateDropdown, [index]: true })}
                        onBlur={() => setTimeout(() => setShowStateDropdown({ ...showStateDropdown, [index]: false }), 200)}
                        className="outline-none placeholder:font-semibold w-[80%]"
                        placeholder="State/Province"
                        disabled={!location.country}
                      />
                      <IoIosSearch />
                    </div>

                    {showStateDropdown[index] && location.country && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {getStatesForLocation(index)
                          .filter(state =>
                            location.state
                              ? state.toLowerCase().includes(location.state.toLowerCase())
                              : true
                          )
                          .map((state, idx) => (
                            <div
                              key={`state-option-${idx}`}
                              className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const updatedLocations = [...business.locations];
                                updatedLocations[index] = {
                                  ...updatedLocations[index],
                                  state: state
                                };
                                setBusiness(prev => ({ ...prev, locations: updatedLocations }));
                                setShowStateDropdown({ ...showStateDropdown, [index]: false });
                              }}
                            >
                              {state}
                            </div>
                          ))
                        }
                      </div>
                    )}
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
    <div className="flex justify-between border border-boldblue rounded-lg w-full px-5 py-3 text-sm text-boldblue">
      <input
        type="text"
        value={business.industry || ""}
        onChange={(e) => setBusiness({ ...business, industry: e.target.value })}
        onFocus={() => setShowIndustryDropdown(true)}
        onBlur={() => setTimeout(() => setShowIndustryDropdown(false), 200)}
        className="outline-none placeholder:font-semibold w-[80%]"
        placeholder="Industry"
      />
      <IoIosSearch />
    </div>

    {showIndustryDropdown && (
      <div className="absolute z-20 w-full mt-1 bg-white border border-boldblue rounded-lg shadow-lg max-h-48 overflow-y-scroll dropdown-scrollbar"
        onMouseDown={(e) => e.preventDefault()}
      >
        {BusinessIndustries
          .filter(industry =>
            business.industry
              ? industry.toLowerCase().includes(business.industry.toLowerCase())
              : true
          )
          .map((industry, idx) => (
            <div
              key={`industry-option-${idx}`}
              className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                setBusiness({
                  ...business,
                  industry: industry
                });
                setShowIndustryDropdown(false);
              }}
            >
              {industry}
            </div>
          ))
        }
        {/* Add "Other" option */}
        <div
          className="px-4 py-2 hover:bg-deepskyblue hover:text-white cursor-pointer text-sm border-t border-gray-200"
          onMouseDown={(e) => {
            e.preventDefault();
            setBusiness({
              ...business,
              industry: "Other"
            });
            setShowIndustryDropdown(false);
          }}
        >
          Other
        </div>
      </div>
    )}
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
                  onKeyDown={handleSpecializationKeyPress}
                  className='w-full border border-boldblue text-boldblue rounded p-3 pr-10 focus:outline focus:outline-boldblue'
                />
                <button
                  onClick={handleAddSpecialization}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-boldblue'
                >
                  Add
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
          onClick={() => router.push('/')}
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
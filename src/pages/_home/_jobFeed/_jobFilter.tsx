import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
// icons
import { IoMdArrowDropdown, IoMdSearch } from 'react-icons/io';
import { RxReset } from "react-icons/rx";
// types
import { Jobs } from '@/types/jobs';
// store
import { useFeedStore } from '@/store/useFeed';
import { useJobFilter } from '@/store/useJobFilter';
// utils
import { ProfessionalFieldsAndAreasOfExpertise152 } from '@/utils/feedFilter/152ProfessionalFieldsAndAreasOfExpertise';
import { certificatesAndEducationList } from '@/utils/feedFilter/CertificatesAndEducationList';
import { GovernmentDepartmentsAndAgenciesByCountry } from '@/utils/feedFilter/GovernmentDepartmentsAndAgenciesByCountry';
import { securityClearances } from '@/utils/feedFilter/SecurityClearances';

import { getAllCountries, getSpecificCountryStates, getUSStates } from '@/utils/getLocations/getAllCountriesAndStates';
import { MdDeleteForever } from "react-icons/md";

type Country = string;
type StateWithCountry = [string, string];
type USState = string;

interface JobFilterProps { jobs: Jobs[]; onFilterChange: (filteredJobs: Jobs[]) => void; loading: boolean; }

const JobFilter = ({ jobs, onFilterChange, loading }: JobFilterProps) => {

  const {
    addSavedSearch,
    getSavedSearchesByFeedType,
    removeSavedSearch
  } = useFeedStore();

  const jobSavedSearches = getSavedSearchesByFeedType('Jobs');

  const {
    searchTerm, setSearchTerm,
    jobType, setJobType,
    securityClearance, setSecurityClearance,
    skillsAndExpertise, setSkillsAndExpertise,
    certifications, setCertifications,
    governmentType, setGovernmentType,
    department, setDepartment,
    location, setLocation,
    domainFocus, setDomainFocus,
    domainDetail, setDomainDetail,
    setActiveFilters,
    resetFilters
  } = useJobFilter();

  const [selectedSavedSearch, setSelectedSavedSearch] = useState('');

  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);

  const [showDomainDetailsDropdown, setShowDomainDetailsDropdown] = useState(false);
  const [domainDetailOptions, setDomainDetailOptions] = useState<string[]>([]);

  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<string[]>(ProfessionalFieldsAndAreasOfExpertise152);
  const [skillsClickTime, setSkillsClickTime] = useState<number>(0);

  const [filteredCertifications, setFilteredCertifications] = useState<string[]>(certificatesAndEducationList);


  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationClickTime, setLocationClickTime] = useState<number>(0);

  const [showClearanceDropdown, setShowClearanceDropdown] = useState(false);
  const [clearanceClickTime, setClearanceClickTime] = useState<number>(0);

  const [showCertificationsDropdown, setShowCertificationsDropdown] = useState(false);
  const [certificationsClickTime, setCertificationsClickTime] = useState<number>(0);

  const [showDomainFocusDropdown, setShowDomainFocusDropdown] = useState(false);
  const [domainFocusClickTime, setDomainFocusClickTime] = useState<number>(0);

  const [showSavedSearchesDropdown, setShowSavedSearchesDropdown] = useState(false);

  const skillsInputRef = useRef<HTMLInputElement>(null);
  const skillsDropdownRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const clearanceInputRef = useRef<HTMLInputElement>(null);
  const clearanceDropdownRef = useRef<HTMLDivElement>(null);
  const certificationsInputRef = useRef<HTMLInputElement>(null);
  const certificationsDropdownRef = useRef<HTMLDivElement>(null);
  const domainFocusInputRef = useRef<HTMLInputElement>(null);
  const domainFocusDropdownRef = useRef<HTMLDivElement>(null);
  const savedSearchesInputRef = useRef<HTMLInputElement>(null);
  const savedSearchesDropdownRef = useRef<HTMLDivElement>(null);
  const departmentInputRef = useRef<HTMLInputElement>(null);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);
  const domainDetailInputRef = useRef<HTMLInputElement>(null);
  const domainDetailDropdownRef = useRef<HTMLDivElement>(null);

  const [availableJobTypes, setAvailableJobTypes] = useState<string[]>([]);
  const [availableCertifications, setAvailableCertifications] = useState<string[]>([]);
  const [availableClearances, setAvailableClearances] = useState<string[]>([]);

  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [statesWithCountries, setStatesWithCountries] = useState<StateWithCountry[]>([]);
  const [usStates, setUsStates] = useState<USState[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesData, statesData, usStatesData] = await Promise.all([
          getAllCountries(),
          getSpecificCountryStates(),
          getUSStates()
        ]);

        setAllCountries(countriesData);
        setStatesWithCountries(statesData.map(([state, country]) => [state, country] as StateWithCountry));
        setUsStates(usStatesData);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      const jobTypes = Array.from(new Set(jobs.map(job => job.employmentType)));
      setAvailableJobTypes([...jobTypes, 'Retainer', 'Hourly', 'Milestone', 'Commission']);

      setAvailableCertifications(Array.from(new Set(certificatesAndEducationList)));

      setAvailableClearances(Array.from(new Set(securityClearances)));
    }
  }, [jobs]);

  useEffect(() => {
    if (domainFocus === 'US Federal Government') {
      setDomainDetailOptions([]);
    } else if (domainFocus === 'US State Government') {
      setDomainDetailOptions(usStates);
    } else if (domainFocus === 'International Government') {
      setDomainDetailOptions(allCountries);
    } else {
      setDomainDetailOptions([]);
    }

    setDomainDetail('');
  }, [domainFocus, usStates, allCountries]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Location dropdown
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }

      // Skills dropdown
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node) &&
        skillsInputRef.current && !skillsInputRef.current.contains(event.target as Node)) {
        setShowSkillsDropdown(false);
      }

      // Clearance dropdown
      if (clearanceDropdownRef.current && !clearanceDropdownRef.current.contains(event.target as Node) &&
        clearanceInputRef.current && !clearanceInputRef.current.contains(event.target as Node)) {
        setShowClearanceDropdown(false);
      }

      // Certifications dropdown
      if (certificationsDropdownRef.current && !certificationsDropdownRef.current.contains(event.target as Node) &&
        certificationsInputRef.current && !certificationsInputRef.current.contains(event.target as Node)) {
        setShowCertificationsDropdown(false);
      }

      // Domain focus dropdown
      if (domainFocusDropdownRef.current && !domainFocusDropdownRef.current.contains(event.target as Node) &&
        domainFocusInputRef.current && !domainFocusInputRef.current.contains(event.target as Node)) {
        setShowDomainFocusDropdown(false);
      }

      // Department dropdown
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target as Node) &&
        departmentInputRef.current && !departmentInputRef.current.contains(event.target as Node)) {
        setShowDepartmentDropdown(false);
      }

      // Domain detail dropdown
      if (domainDetailDropdownRef.current && !domainDetailDropdownRef.current.contains(event.target as Node) &&
        domainDetailInputRef.current && !domainDetailInputRef.current.contains(event.target as Node)) {
        setShowDomainDetailsDropdown(false);
      }

      // Saved searches dropdown
      if (savedSearchesDropdownRef.current && !savedSearchesDropdownRef.current.contains(event.target as Node) &&
        savedSearchesInputRef.current && !savedSearchesInputRef.current.contains(event.target as Node)) {
        setShowSavedSearchesDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDomainDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomainDetail(value);

    if (domainFocus) {
      setDomainDetailOptions(
        domainDetailOptions.filter(detail => detail.toLowerCase().includes(value.toLowerCase()))
      );
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsAndExpertise(value);

    const filtered = ProfessionalFieldsAndAreasOfExpertise152.filter(skill =>
      skill.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSkills(filtered);
    setShowSkillsDropdown(true);
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCertifications(value);
    
    const filtered = certificatesAndEducationList.filter(cert =>
      cert.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCertifications(filtered);
  };

  // Add this function to select a certification
  const selectCertification = (cert: string) => {
    setCertifications(cert);
    setShowCertificationsDropdown(false);
  };

  const selectSkill = (skill: string) => {
    setSkillsAndExpertise(skill);
    setShowSkillsDropdown(false);
  };

  const selectDomainDetail = (detail: string) => {
    setDomainDetail(detail);
    setShowDomainDetailsDropdown(false);
  };

  // Apply filters to jobs
  useEffect(() => {
    if (loading) return;

    let filtered = [...jobs];
    const activeFiltersList: Array<{ id: string, name: string }> = [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by job type
    if (jobType) {
      filtered = filtered.filter(job => job.employmentType === jobType);
      activeFiltersList.push({ id: 'jobType', name: `Job Type: ${jobType}` });
    }

    if (securityClearance) {
      filtered = filtered.filter(job =>
        job.clientClearance &&
        typeof job.clientClearance === 'string' && job.clientClearance.toLowerCase().includes(securityClearance.toLowerCase())
      );
      activeFiltersList.push({ id: 'securityClearance', name: `Clearance: ${securityClearance}` });
    }

    // Filter by skills
    if (skillsAndExpertise) {
      filtered = filtered.filter(job =>
        job.requiredSkills.includes(skillsAndExpertise) ||
        typeof job.experienceLevel === 'string' && job.experienceLevel.toLowerCase().includes(skillsAndExpertise.toLowerCase())
      );
      activeFiltersList.push({ id: 'skills', name: `Skills & Expertise: ${skillsAndExpertise}` });
    }

    // Filter by certifications
    if (certifications) {
      filtered = filtered.filter(job => job.requiredCertifications.includes(certifications));
      activeFiltersList.push({ id: 'certifications', name: `Certifications: ${certifications}` });
    }

    // Filter by government type (independent of department)
    if (governmentType) {
      filtered = filtered.filter(job => job.clientIndustry?.includes(governmentType.toLowerCase()));
      activeFiltersList.push({ id: 'govtType', name: `${governmentType} Government` });
    }

    if (department) {
      filtered = filtered.filter(job =>
        job.clientDepartment &&
        typeof job.clientDepartment === 'string' && job.clientDepartment.toLowerCase().includes(department.toLowerCase())
      );
      activeFiltersList.push({ id: 'department', name: `Department: ${department}` });
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
      activeFiltersList.push({ id: 'location', name: `Location: ${location}` });
    }

    // Filter by domain focus
    if (domainFocus) {
      const domainFilter = domainFocus.toLowerCase();
      filtered = filtered.filter(job =>
        job.clientIndustry?.toLowerCase().includes(domainFilter)
      );

      let domainFilterName = `Domain: ${domainFocus}`;
      if (domainDetail) {
        filtered = filtered.filter(job =>
          job.clientName.toLowerCase().includes(domainDetail.toLowerCase()) ||
          job.location?.toLowerCase().includes(domainDetail.toLowerCase())
        );
        domainFilterName += ` - ${domainDetail}`;
      }

      activeFiltersList.push({ id: 'domainFocus', name: domainFilterName });
    }

    setActiveFilters(activeFiltersList);
    onFilterChange(filtered);
  }, [searchTerm, jobType, securityClearance, skillsAndExpertise, certifications, governmentType, department, location, domainFocus, domainDetail, jobs, loading]);

  const handleSavedSearchSelect = (id: string) => {
    const searchId = id;
    setSelectedSavedSearch(searchId);

    if (searchId) {
      const savedSearch = jobSavedSearches.find((search: { id: { toString: () => string; }; }) => search.id.toString() === searchId);

      if (savedSearch && savedSearch.filters) {
        const filters = JSON.parse(savedSearch.filters);
        setSearchTerm(filters.searchTerm || '');
        setJobType(filters.jobType || '');
        setSecurityClearance(filters.securityClearance || '');
        setSkillsAndExpertise(filters.skills || '');
        setCertifications(filters.certifications || '');
        setGovernmentType(filters.governmentType || '');
        setDepartment(filters.department || '');
        setLocation(filters.location || '');
        setDomainFocus(filters.domainFocus || '');
        setDomainDetail(filters.domainDetail || '');
      }
    }
  };

  const saveSearch = () => {
    if (!searchTerm && !jobType && !securityClearance && !skillsAndExpertise &&
      !certifications && !governmentType && !location && !domainFocus) {
      return;
    }

    let searchName = searchTerm ? `"${searchTerm}"` : 'All Jobs';
    if (jobType) searchName += ` - ${jobType}`;
    if (skillsAndExpertise) searchName += ` - ${skillsAndExpertise}`;

    const filters = {
      searchTerm,
      jobType,
      securityClearance,
      skillsAndExpertise,
      certifications,
      governmentType,
      department,
      location,
      domainFocus,
      domainDetail
    };

    const added = addSavedSearch({
      query: searchTerm,
      feedType: 'Jobs',
      name: searchName,
      filters: JSON.stringify(filters)
    });

    if (added) {
      toast.success('Saved successfully!');
    } else {
      toast.info('Search exists!');
    }
  };

  return (
    <main>
      <div className="grid md:grid-cols-8 items-center gap-3 lg:gap-6 mb-8">
        <div className="md:col-span-4 lg:col-span-5 relative">
          <input
            type="text"
            placeholder="Search Jobs"
            className="h-12.5 text-boldblue border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue placeholder:text-boldblue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-boldblue">
            <IoMdSearch />
          </button>
        </div>

        <div className="md:col-span-2 lg:col-span-2 relative w-full">
          <input
            ref={locationInputRef}
            type="text"
            placeholder="Saved Searches"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={selectedSavedSearch ? jobSavedSearches.find((search: { id: string; name: string }) => search.id === selectedSavedSearch)?.name || '' : ''}
            onChange={() => { }}
            onFocus={() => {
              if (!showSavedSearchesDropdown) {
                setShowSavedSearchesDropdown(true);
              }
            }}
            readOnly
            onClick={(e) => {
              e.stopPropagation();
              setShowSavedSearchesDropdown(true);
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setShowSavedSearchesDropdown(!showSavedSearchesDropdown);
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {showSavedSearchesDropdown && (
            <div
              ref={savedSearchesDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setSelectedSavedSearch('');
                  setShowSavedSearchesDropdown(false);
                  resetFilters();
                }}
              >
                Saved Searches
              </div>
              {jobSavedSearches.map((search: { id: string; name: string; filters?: string }) => (
                <div key={search.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100">
                  <div
                    className="flex-grow cursor-pointer text-sm"
                    onClick={() => {
                      handleSavedSearchSelect(search.id);
                      setShowSavedSearchesDropdown(false);
                    }}
                  >
                    {search.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedSearch(search.id);
                      if (selectedSavedSearch === search.id) {
                        resetFilters();
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                  >
                    <MdDeleteForever color='red' size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="md:col-span-2 lg:col-span-1 h-12.5 bg-boldblue text-white px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer"
          onClick={saveSearch}
        >
          Save Search
        </button>
      </div>

      <h3 className="text-gray-700 mb-3">Filter by</h3>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {/* Job Type filter */}
        <div className="relative w-full">
          <select
            className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Job Type</option>
            {availableJobTypes.map((type, index) => (
              <option key={`type-${index}`} value={type}>{type}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>

        {/* Security Clearance filter */}
        <div className="relative w-full">
          <input
            ref={clearanceInputRef}
            type="text"
            placeholder="Security Clearance"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={securityClearance}
            onChange={(e) => {
              setSecurityClearance(e.target.value);
            }}
            onClick={(e) => {
              e.stopPropagation();
              const now = Date.now();
              if (now - clearanceClickTime > 100) {
                setShowClearanceDropdown(!showClearanceDropdown);
                setClearanceClickTime(now);
              }
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setShowClearanceDropdown(!showClearanceDropdown);
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {showClearanceDropdown && (
            <div
              ref={clearanceDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {availableClearances.map((clearance, index) => (
                <div
                  key={`clearance-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSecurityClearance(clearance);
                    setShowClearanceDropdown(false);
                  }}
                >
                  {clearance}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills filter with dropdown */}
        <div className="relative w-full">
          <input
            ref={skillsInputRef}
            type="text"
            placeholder="Skills & Expertise"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={skillsAndExpertise}
            onChange={handleSkillsChange}
            onClick={(e) => {
              e.stopPropagation();
              const now = Date.now();
              if (now - skillsClickTime > 100) {
                setShowSkillsDropdown(true);
                setFilteredSkills(ProfessionalFieldsAndAreasOfExpertise152);
                setSkillsClickTime(now);
              }
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setShowSkillsDropdown(!showSkillsDropdown);
              if (!showSkillsDropdown) {
                setFilteredSkills(ProfessionalFieldsAndAreasOfExpertise152);
              }
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {showSkillsDropdown && (
            <div
              ref={skillsDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <div
                    key={`skill-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => selectSkill(skill)}
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No skills found</div>
              )}
            </div>
          )}
        </div>

        {/* Certifications filter */}
        <div className="relative w-full">
          <input
            ref={certificationsInputRef}
            type="text"
            placeholder="Cert & Ed."
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={certifications}
            onChange={handleCertificationsChange}
            onClick={(e) => {
              e.stopPropagation();
              const now = Date.now();
              if (now - certificationsClickTime > 100) {
                setShowCertificationsDropdown(true);
                setFilteredCertifications(certificatesAndEducationList);
                setCertificationsClickTime(now);
              }
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setShowCertificationsDropdown(!showCertificationsDropdown);
              if (!showCertificationsDropdown) {
                setFilteredCertifications(certificatesAndEducationList); // Reset list when opening
              }
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {showCertificationsDropdown && (
            <div
              ref={certificationsDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredCertifications.length > 0 ? (
                filteredCertifications.map((cert, index) => (
                  <div
                    key={`cert-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => selectCertification(cert)}
                  >
                    {cert}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No certifications found</div>
              )}
            </div>
          )}
        </div>

        {/* Location filter */}
        <div className="relative w-full">
          <input
            ref={locationInputRef}
            type="text"
            placeholder="Select Location"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowLocationDropdown(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              const now = Date.now();
              if (now - locationClickTime > 100) {
                setShowLocationDropdown(!showLocationDropdown);
                setLocationClickTime(now);
              }
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setShowLocationDropdown(!showLocationDropdown);
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {showLocationDropdown && (
            <div
              ref={locationDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {statesWithCountries.length > 0 ? (
                statesWithCountries
                  .filter(([state, country]) =>
                    state.toLowerCase().includes(location.toLowerCase()) ||
                    country.toLowerCase().includes(location.toLowerCase())
                  )
                  .map(([state, country], index) => (
                    <div
                      key={`loc-${index}`}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setLocation(`${state}`);
                        setShowLocationDropdown(false);
                      }}
                    >
                      {state}, {country}
                    </div>
                  ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No locations found</div>
              )}
            </div>
          )}
        </div>

        {/* Domain Focus  */}
        <div className="relative w-full h-fit">
          <input
            type="text"
            placeholder="Domain Focus"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={domainFocus}
            onChange={(e) => {
              setDomainFocus(e.target.value);
              setShowDomainFocusDropdown(false);
            }}
            onClick={(e) => {
              e.stopPropagation();
              const now = Date.now();
              if (now - domainFocusClickTime > 100) {
                setShowDomainFocusDropdown(!showDomainFocusDropdown);
                setDomainFocusClickTime(now);
              }
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              setShowDomainFocusDropdown(!showDomainFocusDropdown);
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {showDomainFocusDropdown && (
            <div
              ref={domainFocusDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {[
                'US Federal Government',
                'US State Government',
                'International Government'
              ].map((domain, index) => (
                <div
                  key={`domain-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setDomainFocus(domain);
                    setShowDomainFocusDropdown(false);
                  }}
                >
                  {domain}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Domain Detail input (appears when Domain Focus is selected) */}
        {domainFocus && domainFocus !== 'US Federal Government' && (
          <div className="relative w-full h-fit">
            <input
              ref={domainDetailInputRef}
              type="text"
              placeholder={domainFocus === 'US State Government' ? "Select State" : "Select Country"}
              className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
              value={domainDetail}
              onChange={handleDomainDetailChange}
              onFocus={() => setShowDomainDetailsDropdown(true)}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown for domain details */}
            {showDomainDetailsDropdown && (
              <div
                ref={domainDetailDropdownRef}
                className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {domainDetailOptions.length > 0 ? (
                  domainDetailOptions.map((detail, index) => (
                    <div
                      key={`detail-${index}`}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectDomainDetail(detail)}
                    >
                      {detail}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No options found</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="relative w-full md:col-span-2 mb-6">
          <input
            ref={departmentInputRef}
            type="text"
            placeholder="Department/Agency Expertise/Focus"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={department}
            onChange={(e) => {
              const value = e.target.value;
              setDepartment(value);
              const allDepts = [
                ...GovernmentDepartmentsAndAgenciesByCountry
              ];
              setFilteredDepartments(
                allDepts.filter(dept =>
                  dept.toLowerCase().includes(value.toLowerCase())
                ));
            }}
            onFocus={() => {
              setShowDepartmentDropdown(true);
              const allDepts = [
                ...GovernmentDepartmentsAndAgenciesByCountry
              ];
              setFilteredDepartments(allDepts);
            }}
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDepartmentDropdown && (
            <div
              ref={departmentDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredDepartments.map((dept, index) => (
                <div
                  key={`dept-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setDepartment(dept);
                    setShowDepartmentDropdown(false);
                  }}
                >
                  {dept}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {(searchTerm || jobType || securityClearance || skillsAndExpertise || certifications || governmentType || department || location || domainFocus || domainDetail || selectedSavedSearch)
        && (
          <button
            onClick={resetFilters}
            title="reset"
            className='mb-3.5 text-center text-boldblue text-sm font-semibold ml-3 cursor-pointer hover:text-deepskyblue flex items-center justify-center gap-2.5 bg-skyblue px-2 py-1 rounded-full'
          >
            Reset Filters <RxReset />
          </button>
        )}
    </main>
  );
};

export default JobFilter;



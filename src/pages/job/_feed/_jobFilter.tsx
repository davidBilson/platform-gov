import React, { useState, useEffect, useRef, useMemo } from 'react';
import { IoMdArrowDropdown, IoMdSearch } from 'react-icons/io';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { Jobs } from '@/types/jobs';
import { useFeedStore } from '@/store/feedStore';
import { RxReset } from "react-icons/rx";
import { australiaDepartments } from '@/utils/govDeptAgency/australia'
import { canadaDepartments } from '@/utils/govDeptAgency/canada'
import { ukDepartments } from '@/utils/govDeptAgency/uk'
import { usCongressional, usIntelligenceAndOversight, usInnovationAndIP, usScienceAgencies, usDepartments } from '@/utils/govDeptAgency/us'

interface JobFilterProps {
  jobs: Jobs[];
  onFilterChange: (filteredJobs: Jobs[]) => void;
  setActiveFilters: (filters: Array<{id: string, name: string}>) => void;
  loading: boolean;
}

const JobFilter: React.FC<JobFilterProps> = ({ jobs, onFilterChange, setActiveFilters, loading }) => {

  const mergedAgencyDeptArray = useMemo(() => [
    ...australiaDepartments,
    ...canadaDepartments,
    ...ukDepartments,
    ...usCongressional,
    ...usIntelligenceAndOversight,
    ...usInnovationAndIP,
    ...usScienceAgencies,
    ...usDepartments,
  ], [
    australiaDepartments,
    canadaDepartments,
    ukDepartments,
    usCongressional,
    usIntelligenceAndOversight,
    usInnovationAndIP,
    usScienceAgencies,
    usDepartments,
  ]);
  useEffect(() => {
    console.log(mergedAgencyDeptArray)
  }, [])

  // Mock data for new filters
  const mockLocations = ['Remote', 'Hybrid', 'On-site', 'Washington DC', 'New York', 'California', 'Texas', 'Florida', 'Illinois', 'Virginia', 'Maryland'];
  
  const mockUSStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  
  const mockCountries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'France', 'Germany', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'South Africa', 'Nigeria', 'Russia', 'South Korea', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Poland', 'Ukraine', 'Turkey', 'Israel', 'Saudi Arabia', 'UAE', 'Qatar', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'New Zealand'];

  // Access the feed store
  const { 
    addSavedSearch, 
    getSavedSearchesByFeedType 
  } = useFeedStore();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [securityClearance, setSecurityClearance] = useState('');
  const [skillsAndExpertise, setSkillsAndExpertise] = useState('');
  const [certifications, setCertifications] = useState('');
  const [requirePrevGovtExp, setRequirePrevGovtExp] = useState(false);
  const [governmentType, setGovernmentType] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedSavedSearch, setSelectedSavedSearch] = useState('');
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);
  
  // New filter states
  const [location, setLocation] = useState('');
  const [domainFocus, setDomainFocus] = useState('');
  const [showDomainDetailsDropdown, setShowDomainDetailsDropdown] = useState(false);
  const [domainDetailOptions, setDomainDetailOptions] = useState<string[]>([]);
  const [domainDetail, setDomainDetail] = useState('');
  
  // Refs
  const departmentInputRef = useRef<HTMLInputElement>(null);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);
  const domainDetailInputRef = useRef<HTMLInputElement>(null);
  const domainDetailDropdownRef = useRef<HTMLDivElement>(null);
  
  // Get job-specific saved searches
  const jobSavedSearches = getSavedSearchesByFeedType('Jobs');
  
  // Unique values for filters
  const [availableJobTypes, setAvailableJobTypes] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableCertifications, setAvailableCertifications] = useState<string[]>([]);
  const [availableClearances, setAvailableClearances] = useState<string[]>([]);

  // Extract unique values for filter options from jobs data
  useEffect(() => {
    if (jobs.length > 0) {
      // Extract job types
      const jobTypes = Array.from(new Set(jobs.map(job => job.employmentType)));
      setAvailableJobTypes(jobTypes);

      const allSkills = jobs.flatMap(job => job.requiredSkills);

      const combinedSkillsAndExpertise = [
        ...Array.from(new Set(allSkills)),
        'Beginner', 'Intermediate', 'Expert', 'Advanced'
      ];
      setAvailableSkills(combinedSkillsAndExpertise);

      // Extract certifications
      const allCerts = jobs.flatMap(job => job.requiredCertifications);
      setAvailableCertifications(Array.from(new Set(allCerts)));
      
      setAvailableClearances(['Secret', 'Top Secret', 'Confidential', 'Public Trust']);
    }
  }, [jobs]);

  // Set domain detail options based on domain focus selection
  useEffect(() => {
    if (domainFocus === 'US Federal Government') {
      setDomainDetailOptions([]);
    } else if (domainFocus === 'US State Government') {
      setDomainDetailOptions(mockUSStates);
    } else if (domainFocus === 'International Government') {
      setDomainDetailOptions(mockCountries);
    } else {
      setDomainDetailOptions([]);
    }
    
    // Reset domain detail when domain focus changes
    setDomainDetail('');
  }, [domainFocus]);

  useEffect(() => {
    if (governmentType && departmentInputRef.current) {
      // Use the imported arrays directly based on government type
      let depts: string[] = [];
      if (governmentType === 'Federal') {
        depts = [...usCongressional, ...usIntelligenceAndOversight, ...usInnovationAndIP, ...usScienceAgencies, ...usDepartments];
      } else if (governmentType === 'State') {
        depts = [...australiaDepartments, ...canadaDepartments, ...ukDepartments];
      }
      setFilteredDepartments(depts);
    }
  }, [governmentType]);

  // Handle clicks outside the department dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target as Node) &&
          departmentInputRef.current && !departmentInputRef.current.contains(event.target as Node)) {
        setShowDepartmentDropdown(false);
      }
      
      if (domainDetailDropdownRef.current && !domainDetailDropdownRef.current.contains(event.target as Node) &&
          domainDetailInputRef.current && !domainDetailInputRef.current.contains(event.target as Node)) {
        setShowDomainDetailsDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   // Handle department input change
   const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepartment(value);
    
    if (governmentType) {
      // Use the imported arrays directly based on government type
      let depts: string[] = [];
      if (governmentType === 'Federal') {
        depts = [...usCongressional, ...usIntelligenceAndOversight, ...usInnovationAndIP, ...usScienceAgencies, ...usDepartments];
      } else if (governmentType === 'State') {
        depts = [...australiaDepartments, ...canadaDepartments, ...ukDepartments];
      }
      setFilteredDepartments(
        depts.filter(dept => dept.toLowerCase().includes(value.toLowerCase()))
      );
    }
  };

  // Handle domain detail input change
  const handleDomainDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomainDetail(value);
    
    if (domainFocus) {
      setDomainDetailOptions(
        domainDetailOptions.filter(detail => detail.toLowerCase().includes(value.toLowerCase()))
      );
    }
  };

  // Select department from dropdown
  const selectDepartment = (dept: string) => {
    setDepartment(dept);
    setShowDepartmentDropdown(false);
  };

  // Select domain detail from dropdown
  const selectDomainDetail = (detail: string) => {
    setDomainDetail(detail);
    setShowDomainDetailsDropdown(false);
  };

  // Apply filters to jobs
  useEffect(() => {
    if (loading) return;
    
    let filtered = [...jobs];
    const activeFiltersList: Array<{id: string, name: string}> = [];

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

    // Filter by security clearance
    if (securityClearance) {
      filtered = filtered.filter(job => 
        typeof job.securityClearance === 'string' && job.securityClearance.toLowerCase().includes(securityClearance.toLowerCase())
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
      activeFiltersList.push({ id: 'certifications', name: `Certs & Education: ${certifications}` });
    }

    // Filter by government experience
    if (requirePrevGovtExp) {
      filtered = filtered.filter(job => job.userRole?.includes('government'));
      activeFiltersList.push({ id: 'govtExp', name: 'Previous Govt. Experience' });
    }

    // Filter by government type and department
    if (governmentType) {
      filtered = filtered.filter(job => job.clientIndustry?.includes(governmentType.toLowerCase()));
      activeFiltersList.push({ id: 'govtType', name: `${governmentType} Government` });
      
      if (department) {
        filtered = filtered.filter(job => job.clientName.includes(department));
        activeFiltersList.push({ id: 'department', name: `Department: ${department}` });
      }
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

    // Update active filters and filtered jobs
    setActiveFilters(activeFiltersList);
    onFilterChange(filtered);
  }, [searchTerm, jobType, securityClearance, skillsAndExpertise, certifications, requirePrevGovtExp, governmentType, department, location, domainFocus, domainDetail, jobs, loading]);

  // Handle saved search selection
  const handleSavedSearchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchId = e.target.value;
    setSelectedSavedSearch(searchId);
    
    if (searchId) {
      const savedSearch = jobSavedSearches.find((search: { id: { toString: () => string; }; }) => search.id.toString() === searchId);
      
      if (savedSearch && savedSearch.filters) {
        // Restore saved search filters
        const filters = JSON.parse(savedSearch.filters);
        setSearchTerm(filters.searchTerm || '');
        setJobType(filters.jobType || '');
        setSecurityClearance(filters.securityClearance || '');
        setSkillsAndExpertise(filters.skills || '');
        setCertifications(filters.certifications || '');
        setRequirePrevGovtExp(filters.requirePrevGovtExp || false);
        setGovernmentType(filters.governmentType || '');
        setDepartment(filters.department || '');
        setLocation(filters.location || '');
        setDomainFocus(filters.domainFocus || '');
        setDomainDetail(filters.domainDetail || '');
      }
    }
  };

  // Save current search
  const saveSearch = () => {
    if (!searchTerm && !jobType && !securityClearance && !skillsAndExpertise && !certifications && !requirePrevGovtExp && !governmentType && !location && !domainFocus) {
      return;
    }

    let searchName = searchTerm ? `"${searchTerm}"` : 'All Jobs';
    
    if (jobType) searchName += ` - ${jobType}`;
    if (skillsAndExpertise) searchName += ` - ${skillsAndExpertise}`;
    
    // Create filters object
    const filters = {
      searchTerm,
      jobType,
      securityClearance,
      skillsAndExpertise,
      certifications,
      requirePrevGovtExp,
      governmentType,
      department,
      location,
      domainFocus,
      domainDetail
    };

    // Add to store
    const added = addSavedSearch({
      query: searchTerm,
      feedType: 'jobs',
      name: searchName,
      filters: JSON.stringify(filters)
    });

    if (added) {
      // Optionally provide feedback to user that search was saved
      alert('Search saved successfully!');
    } else {
      alert('This search already exists in your saved searches.');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setJobType('');
    setSecurityClearance('');
    setSkillsAndExpertise('');
    setCertifications('');
    setRequirePrevGovtExp(false);
    setGovernmentType('');
    setDepartment('');
    setLocation('');
    setDomainFocus('');
    setDomainDetail('');
    setSelectedSavedSearch('');
    setActiveFilters([]);
    onFilterChange(jobs);
  };

  return (
    <main>
      <div className="flex flex-wrap items-center gap-8.25 mb-8">
        <div className="relative flex-grow">
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

        <div className="relative flex-grow">
          <select 
            className="h-12.5 border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={selectedSavedSearch}
            onChange={handleSavedSearchSelect}
          >
            <option value="">Saved Searches</option>
            {jobSavedSearches.map((search: { id: string; name: string }) => (
              <option key={search.id} value={search.id}>{search.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>

        {/* Save Search button */}
        <button 
          className="h-12.5 bg-boldblue text-white px-6 py-3 rounded-lg text-sm font-semibold"
          onClick={saveSearch}
        >
          Save Search
        </button>
      </div>

        <h3 className="text-gray-700 mb-3">Filter by</h3>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Job Type filter */}
          <div className="relative w-full sm:w-64">
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
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={securityClearance}
              onChange={(e) => setSecurityClearance(e.target.value)}
            >
              <option value="">Security Clearance</option>
              {availableClearances.map((clearance, index) => (
                <option key={`clearance-${index}`} value={clearance}>{clearance}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Skills filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={skillsAndExpertise}
              onChange={(e) => setSkillsAndExpertise(e.target.value)}
            >
              <option value="">Skills & Expertise</option>
              {availableSkills.map((skill, index) => (
                <option key={`skill-${index}`} value={skill}>{skill}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Certifications filter - renamed to "Certs & Education" */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
            >
              <option value="">Certs & Education</option>
              {availableCertifications.map((cert, index) => (
                <option key={`cert-${index}`} value={cert}>{cert}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* New Location filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Location</option>
              {mockLocations.map((loc, index) => (
                <option key={`loc-${index}`} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* New Domain Focus filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={domainFocus}
              onChange={(e) => setDomainFocus(e.target.value)}
            >
              <option value="">Domain Focus</option>
              <option value="US Federal Government">US Federal Government</option>
              <option value="US State Government">US State Government</option>
              <option value="International Government">International Government</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Domain Detail input (appears when Domain Focus is selected) */}
          {domainFocus && domainFocus !== 'US Federal Government' && (
            <div className="relative w-full sm:w-64">
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
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Previous government employment checkbox */}
          <div className="flex items-center mr-4">
            {requirePrevGovtExp ? (
              <MdOutlineRadioButtonChecked 
                size={20} 
                color='#0b5f94' 
                onClick={() => setRequirePrevGovtExp(false)}
                className="cursor-pointer"
              />
            ) : (
              <MdOutlineRadioButtonUnchecked 
                size={20} 
                color='#0b5f94' 
                onClick={() => setRequirePrevGovtExp(true)}
                className="cursor-pointer"
              />
            )}
            <label className="ml-2 text-gray-700 text-sm cursor-pointer" onClick={() => setRequirePrevGovtExp(!requirePrevGovtExp)}>
              Require previous government employment
            </label>
          </div>
          
          {/* Government type radio buttons moved from skyblue container */}
          <div className="flex items-center mr-4">
            <input 
              type="radio" 
              name="govt" 
              id="state" 
              checked={governmentType === 'State'}
              onChange={() => {
                setGovernmentType('State'); 
                setDepartment('');
              }}
              className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue" 
            />
            <label htmlFor="state" className="ml-2 text-gray-700 text-sm">State</label>
          </div>
          
          <div className="flex items-center mr-4">
            <input 
              type="radio" 
              name="govt" 
              id="federal" 
              checked={governmentType === 'Federal'}
              onChange={() => {
                setGovernmentType('Federal');
                setDepartment('');
              }}
              className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue" 
            />
            <label htmlFor="federal" className="ml-2 text-gray-700 text-sm">Federal</label>
          </div>
          
          {/* Department/Agency selector moved from skyblue container */}
          {governmentType && (
            <div className="relative flex-grow w-full max-w-125">
              <input 
                ref={departmentInputRef}
                type="text" 
                placeholder="Select departments or agencies" 
                className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
                value={department}
                onChange={handleDepartmentChange}
                onFocus={() => setShowDepartmentDropdown(true)}
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown for departments */}
            {showDepartmentDropdown && governmentType && (
              <div 
                ref={departmentDropdownRef}
                className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept, index) => (
                    <div
                      key={`dept-${index}`}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectDepartment(dept)}
                    >
                      {dept}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No departments found</div>
                )}
              </div>
            )}
          </div>
        )}
        
        {(
            searchTerm ||
            jobType ||
            securityClearance ||
            skillsAndExpertise ||
            certifications ||
            requirePrevGovtExp ||
            governmentType ||
            department ||
            location ||
            domainFocus ||
            domainDetail ||
            selectedSavedSearch
          ) && (
            <button 
              onClick={resetFilters} 
              title="reset" 
              className='mb-3.5 text-center text-boldblue text-sm font-semibold ml-3 cursor-pointer hover:text-deepskyblue flex items-center justify-center gap-2.5 bg-skyblue px-2 py-1 rounded-full'
            >
              Reset Filters <RxReset />
            </button>
          )}

          </div>
          </main>
        );
      };

export default JobFilter;
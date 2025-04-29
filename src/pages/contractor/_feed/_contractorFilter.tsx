import React, { useState, useEffect, useRef } from 'react';
import { IoMdArrowDropdown, IoMdSearch } from 'react-icons/io';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { RxReset } from "react-icons/rx";

export interface FilterOptions {
  searchTerm: string;
  profession: string;
  securityClearance: string;
  skillsAndExpertise: string;
  certifications: string;
  requireGovtExperience: boolean;
  governmentType: string;
  department: string;
  location: string;
  domainFocus: string;
  domainDetail: string;
}

interface ContractorFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  setActiveFilters: (filters: Array<{id: string, name: string}>) => void;
  savedSearches: Array<{ id: string; name: string; filters: string }>;
  onSaveSearch: (search: { query: string; feedType: string; name: string; filters: string }) => boolean;
  loading: boolean;
}

const ContractorFilter: React.FC<ContractorFilterProps> = ({ 
  onFilterChange, 
  savedSearches = [],
  onSaveSearch,
  loading
}) => {
  // Mock data for filters
  const mockProfessions = ['Software Developer', 'Project Manager', 'Data Analyst', 'Cybersecurity Specialist', 'Systems Architect', 'DevOps Engineer'];
  const mockSkillsAndExpertise = ['React', 'Java', 'Python', 'TypeScript', 'Project Management', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science', 'Cloud Architecture', 'Beginner', 'Intermediate', 'Expert', 'Advanced'];
  const mockCertifications = ['AWS', 'PMP', 'CISSP', 'Azure', 'Scrum Master', 'CompTIA Security+', 'ITIL', 'CCNA', 'CEH'];
  const mockClearances = ['Secret', 'Top Secret', 'Confidential', 'Public Trust', 'SCI'];
  const mockLocations = ['Remote', 'Hybrid', 'On-site', 'Washington DC', 'New York', 'California', 'Texas', 'Florida', 'Illinois', 'Virginia', 'Maryland'];
  const mockUSStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  const mockCountries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'France', 'Germany', 'Japan', 'China', 'India', 'Brazil', 'Mexico', 'South Africa', 'Nigeria', 'Russia', 'South Korea', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Poland', 'Ukraine', 'Turkey', 'Israel', 'Saudi Arabia', 'UAE', 'Qatar', 'Singapore', 'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'New Zealand'];
  
  // Mock departments based on government type
  const usFederalDepartments = ['Department of Defense', 'Department of State', 'Department of Justice', 'Department of Treasury', 'Department of Homeland Security', 'Department of Energy'];
  const stateAndInternationalDepartments = ['UK Ministry of Defence', 'Australian Department of Foreign Affairs', 'Canada Revenue Agency', 'Department of Education NSW', 'Ontario Ministry of Health'];

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [profession, setProfession] = useState('');
  const [securityClearance, setSecurityClearance] = useState('');
  const [skillsAndExpertise, setSkillsAndExpertise] = useState('');
  const [certifications, setCertifications] = useState('');
  const [requireGovtExperience, setRequireGovtExperience] = useState(false);
  const [governmentType, setGovernmentType] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedSavedSearch, setSelectedSavedSearch] = useState('');
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);
  
  // New filter states (matching JobFilter)
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
      let depts: string[] = [];
      if (governmentType === 'Federal') {
        depts = usFederalDepartments;
      } else if (governmentType === 'State') {
        depts = stateAndInternationalDepartments;
      }
      setFilteredDepartments(depts);
    }
  }, [governmentType]);

  // Handle clicks outside the dropdowns
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
      let depts: string[] = [];
      if (governmentType === 'Federal') {
        depts = usFederalDepartments;
      } else if (governmentType === 'State') {
        depts = stateAndInternationalDepartments;
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

  // Apply filters
  useEffect(() => {
    if (loading) return;
    
    const activeFiltersList: Array<{id: string, name: string}> = [];

    // Add active filters to list
    if (searchTerm) {
      activeFiltersList.push({ id: 'searchTerm', name: `Search: ${searchTerm}` });
    }

    if (profession) {
      activeFiltersList.push({ id: 'profession', name: `Profession: ${profession}` });
    }

    if (securityClearance) {
      activeFiltersList.push({ id: 'securityClearance', name: `Clearance: ${securityClearance}` });
    }

    if (skillsAndExpertise) {
      activeFiltersList.push({ id: 'skills', name: `Skills & Expertise: ${skillsAndExpertise}` });
    }

    if (certifications) {
      activeFiltersList.push({ id: 'certifications', name: `Certs & Education: ${certifications}` });
    }

    if (requireGovtExperience) {
      activeFiltersList.push({ id: 'govtExp', name: 'Previous Govt. Experience' });
    }

    if (governmentType) {
      activeFiltersList.push({ id: 'govtType', name: `${governmentType} Government` });
      
      if (department) {
        activeFiltersList.push({ id: 'department', name: `Department: ${department}` });
      }
    }
    
    if (location) {
      activeFiltersList.push({ id: 'location', name: `Location: ${location}` });
    }
    
    if (domainFocus) {
      let domainFilterName = `Domain: ${domainFocus}`;
      if (domainDetail) {
        domainFilterName += ` - ${domainDetail}`;
      }
      
      activeFiltersList.push({ id: 'domainFocus', name: domainFilterName });
    }

    // Update active filters
    // setActiveFilters(activeFiltersList);
    
    // Pass filters to parent component
    onFilterChange({
      searchTerm,
      profession,
      securityClearance,
      skillsAndExpertise,
      certifications,
      requireGovtExperience,
      governmentType,
      department,
      location,
      domainFocus,
      domainDetail
    });
  }, [searchTerm, profession, securityClearance, skillsAndExpertise, certifications, requireGovtExperience, governmentType, department, location, domainFocus, domainDetail, loading]);

  // Handle saved search selection
  const handleSavedSearchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchId = e.target.value;
    setSelectedSavedSearch(searchId);
    
    if (searchId) {
      const savedSearch = savedSearches.find(search => search.id.toString() === searchId);
      
      if (savedSearch && savedSearch.filters) {
        // Restore saved search filters
        const filters = JSON.parse(savedSearch.filters);
        setSearchTerm(filters.searchTerm || '');
        setProfession(filters.profession || '');
        setSecurityClearance(filters.securityClearance || '');
        setSkillsAndExpertise(filters.skillsAndExpertise || '');
        setCertifications(filters.certifications || '');
        setRequireGovtExperience(filters.requireGovtExperience || false);
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
    if (!searchTerm && !profession && !securityClearance && !skillsAndExpertise && !certifications && !requireGovtExperience && !governmentType && !location && !domainFocus) {
      return;
    }

    let searchName = searchTerm ? `"${searchTerm}"` : 'All Contractors';
    
    if (profession) searchName += ` - ${profession}`;
    if (skillsAndExpertise) searchName += ` - ${skillsAndExpertise}`;
    
    // Create filters object
    const filters = {
      searchTerm,
      profession,
      securityClearance,
      skillsAndExpertise,
      certifications,
      requireGovtExperience,
      governmentType,
      department,
      location,
      domainFocus,
      domainDetail
    };

    // Add to store
    const added = onSaveSearch({
      query: searchTerm,
      feedType: 'contractors',
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
    setProfession('');
    setSecurityClearance('');
    setSkillsAndExpertise('');
    setCertifications('');
    setRequireGovtExperience(false);
    setGovernmentType('');
    setDepartment('');
    setLocation('');
    setDomainFocus('');
    setDomainDetail('');
    setSelectedSavedSearch('');
    // setActiveFilters([]);
    onFilterChange({
      searchTerm: '',
      profession: '',
      securityClearance: '',
      skillsAndExpertise: '',
      certifications: '',
      requireGovtExperience: false,
      governmentType: '',
      department: '',
      location: '',
      domainFocus: '',
      domainDetail: ''
    });
  };

  return (
    <main>
      <div className="flex flex-wrap items-center gap-8.25 mb-8">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search Contractors" 
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
            {savedSearches.map((search) => (
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
        {/* Title/Profession filter */}
        <div className="relative w-full sm:w-64">
          <select 
            className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          >
            <option value="">Title/Profession</option>
            {mockProfessions.map((type, index) => (
              <option key={`profession-${index}`} value={type}>{type}</option>
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
            {mockClearances.map((clearance, index) => (
              <option key={`clearance-${index}`} value={clearance}>{clearance}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>
        
        {/* Skills & Expertise filter (combined) */}
        <div className="relative w-full sm:w-64">
          <select 
            className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={skillsAndExpertise}
            onChange={(e) => setSkillsAndExpertise(e.target.value)}
          >
            <option value="">Skills & Expertise</option>
            {mockSkillsAndExpertise.map((skill, index) => (
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
            {mockCertifications.map((cert, index) => (
              <option key={`cert-${index}`} value={cert}>{cert}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>
        
        {/* Location filter */}
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
        
        {/* Domain Focus filter */}
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
          {requireGovtExperience ? (
            <MdOutlineRadioButtonChecked 
              size={20} 
              color='#0b5f94' 
              onClick={() => setRequireGovtExperience(false)}
              className="cursor-pointer"
            />
          ) : (
            <MdOutlineRadioButtonUnchecked 
              size={20} 
              color='#0b5f94' 
              onClick={() => setRequireGovtExperience(true)}
              className="cursor-pointer"
            />
          )}
          <label className="ml-2 text-gray-700 text-sm cursor-pointer" onClick={() => setRequireGovtExperience(!requireGovtExperience)}>
            Require previous government employment
          </label>
        </div>
        
        {/* Government type radio buttons */}
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
        
        {/* Department/Agency selector */}
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
      </div>
      
      {/* Reset Filters button */}
      {(
        searchTerm ||
        profession ||
        securityClearance ||
        skillsAndExpertise ||
        certifications ||
        requireGovtExperience ||
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
    </main>
  );
};

export default ContractorFilter;
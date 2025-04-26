import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown, IoMdSearch } from 'react-icons/io';
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { Jobs } from '@/types/jobs';
import { useFeedStore } from '@/store/feedStore';

interface JobFilterProps {
  jobs: Jobs[];
  onFilterChange: (filteredJobs: Jobs[]) => void;
  setActiveFilters: (filters: Array<{id: string, name: string}>) => void;
  loading: boolean;
}

const JobFilter: React.FC<JobFilterProps> = ({ jobs, onFilterChange, setActiveFilters, loading }) => {
  // Access the feed store
  const { 
    addSavedSearch, 
    getSavedSearchesByFeedType 
  } = useFeedStore();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [securityClearance, setSecurityClearance] = useState('');
  const [skills, setSkills] = useState('');
  const [expertise, setExpertise] = useState('');
  const [certifications, setCertifications] = useState('');
  const [requirePrevGovtExp, setRequirePrevGovtExp] = useState(false);
  const [governmentType, setGovernmentType] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedSavedSearch, setSelectedSavedSearch] = useState('');
  
  // Get job-specific saved searches
  const jobSavedSearches = getSavedSearchesByFeedType('Jobs');
  
  // Unique values for filters
  const [availableJobTypes, setAvailableJobTypes] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableCertifications, setAvailableCertifications] = useState<string[]>([]);

  // Extract unique values for filter options from jobs data
  useEffect(() => {
    if (jobs.length > 0) {
      // Extract job types
      const jobTypes = Array.from(new Set(jobs.map(job => job.employmentType)));
      setAvailableJobTypes(jobTypes);

      // Extract skills
      const allSkills = jobs.flatMap(job => job.requiredSkills);
      setAvailableSkills(Array.from(new Set(allSkills)));

      // Extract certifications
      const allCerts = jobs.flatMap(job => job.requiredCertifications);
      setAvailableCertifications(Array.from(new Set(allCerts)));
    }
  }, [jobs]);

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

    // Filter by skills
    if (skills) {
      filtered = filtered.filter(job => job.requiredSkills.includes(skills));
      activeFiltersList.push({ id: 'skills', name: `Skill: ${skills}` });
    }

    // Filter by certifications
    if (certifications) {
      filtered = filtered.filter(job => job.requiredCertifications.includes(certifications));
      activeFiltersList.push({ id: 'certifications', name: `Certification: ${certifications}` });
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

    // Update active filters and filtered jobs
    setActiveFilters(activeFiltersList);
    onFilterChange(filtered);
  }, [searchTerm, jobType, securityClearance, skills, expertise, certifications, requirePrevGovtExp, governmentType, department, jobs, loading]);

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
        setSkills(filters.skills || '');
        setExpertise(filters.expertise || '');
        setCertifications(filters.certifications || '');
        setRequirePrevGovtExp(filters.requirePrevGovtExp || false);
        setGovernmentType(filters.governmentType || '');
        setDepartment(filters.department || '');
      }
    }
  };

  // Save current search
  const saveSearch = () => {
    if (!searchTerm && !jobType && !securityClearance && !skills && !expertise && !certifications && !requirePrevGovtExp && !governmentType) {
      // Don't save empty searches
      return;
    }

    // Create a descriptive name for the search
    let searchName = searchTerm ? `"${searchTerm}"` : 'All Jobs';
    
    if (jobType) searchName += ` - ${jobType}`;
    if (skills) searchName += ` - ${skills}`;
    
    // Create filters object
    const filters = {
      searchTerm,
      jobType,
      securityClearance,
      skills,
      expertise,
      certifications,
      requirePrevGovtExp,
      governmentType,
      department
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
    setSkills('');
    setExpertise('');
    setCertifications('');
    setRequirePrevGovtExp(false);
    setGovernmentType('');
    setDepartment('');
    setSelectedSavedSearch('');
    setActiveFilters([]);
    onFilterChange(jobs);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-8.25 mb-8">
        {/* Search input */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search Jobs" 
            className="h-12.5 border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue placeholder:text-boldblue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-boldblue">
            <IoMdSearch />
          </button>
        </div>

        {/* Filter button - Added reset functionality */}
        <button 
          className="h-12.5 w-12.5 flex items-center justify-center bg-boldblue text-white rounded-lg p-2"
          onClick={resetFilters}
          title="Reset Filters"
        >
          <TbAdjustmentsHorizontal size={25} />
        </button>

        {/* Saved Searches dropdown */}
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

      {/* Filter by section */}
      <div className="mb-6">
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
              <option value="Secret">Secret</option>
              <option value="Top Secret">Top Secret</option>
              <option value="Confidential">Confidential</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Skills filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            >
              <option value="">Skills</option>
              {availableSkills.map((skill, index) => (
                <option key={`skill-${index}`} value={skill}>{skill}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Expertise filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
            >
              <option value="">Expertise</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Certifications filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
            >
              <option value="">Certifications</option>
              {availableCertifications.map((cert, index) => (
                <option key={`cert-${index}`} value={cert}>{cert}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
        </div>
        
        {/* Previous government employment checkbox */}
        <div className="flex items-center mb-4">
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
      </div>
      
      {/* Department/Agency search section with blue background */}
      <div className="bg-skyblue p-5 rounded-lg mb-8">
        <h3 className="text-gray-700 mb-4">Search within departments and agencies only</h3>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Radio buttons */}
          <div className="flex items-center">
            <input 
              type="radio" 
              name="govt" 
              id="state" 
              checked={governmentType === 'State'}
              onChange={() => setGovernmentType('State')}
              className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue" 
            />
            <label htmlFor="state" className="ml-2 text-gray-700 text-sm">State</label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="radio" 
              name="govt" 
              id="federal" 
              checked={governmentType === 'Federal'}
              onChange={() => setGovernmentType('Federal')}
              className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue" 
            />
            <label htmlFor="federal" className="ml-2 text-gray-700 text-sm">Federal</label>
          </div>
          
          {/* Department search input */}
          <div className="relative flex-grow w-full max-w-125">
            <input 
              type="text" 
              placeholder="Select departments or agencies" 
              className="border border-boldblue text-boldblue placeholder:text-boldblue bg-white rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={!governmentType}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-boldblue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Apply button */}
          <button 
            className="bg-boldblue text-white px-6 py-3 rounded-lg text-sm font-semibold"
            onClick={() => {
              // Apply government filter is handled in useEffect
            }}
            disabled={!governmentType}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default JobFilter;
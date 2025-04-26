import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdSearch } from 'react-icons/io';
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";

export interface FilterOptions {
  searchTerm: string;
  profession: string;
  securityClearance: string;
  skills: string;
  expertise: string;
  certifications: string;
  requireGovtExperience: boolean;
  govtType: 'state' | 'federal' | null;
  department: string;
}

interface ContractorFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSaveSearch: (searchName: string) => void;
  savedSearches: string[];
}

const ContractorFilter: React.FC<ContractorFilterProps> = ({ 
  onFilterChange, 
  onSaveSearch,
  savedSearches = []
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    profession: '',
    securityClearance: '',
    skills: '',
    expertise: '',
    certifications: '',
    requireGovtExperience: false,
    govtType: null,
    department: ''
  });
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [selectedSavedSearch, setSelectedSavedSearch] = useState('');

  const handleInputChange = (field: keyof FilterOptions, value: string | boolean) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleApplyDepartmentFilter = () => {
    onFilterChange(filters);
  };

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      onSaveSearch(searchName);
      setShowSaveDialog(false);
      setSearchName('');
    }
  };

  const handleLoadSavedSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchName = e.target.value;
    setSelectedSavedSearch(searchName);
    // In a real implementation, you would load the saved search data here
    // For now, we'll just simulate this behavior
    if (searchName && searchName !== 'Saved Searches') {
      // This would normally come from your saved searches database/state
      const mockSavedSearch: FilterOptions = {
        searchTerm: searchName, // Using search name as the term for demo purposes
        profession: 'Software Developer',
        securityClearance: 'Top Secret',
        skills: 'React',
        expertise: 'Frontend',
        certifications: 'AWS',
        requireGovtExperience: true,
        govtType: 'federal',
        department: 'DOD'
      };
      
      setFilters(mockSavedSearch);
      onFilterChange(mockSavedSearch);
    }
  };

  return (
    <>
    <div className="flex flex-wrap items-center gap-8.25 mb-8">
        {/* Search input */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search Contractors" 
            value={filters.searchTerm}
            onChange={(e) => handleInputChange('searchTerm', e.target.value)}
            className="h-12.5 border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue placeholder:text-boldblue"
          />
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-boldblue"
            onClick={() => onFilterChange(filters)}
          >
            <IoMdSearch />
          </button>
        </div>

        {/* Filter button */}
        <button className="h-12.5 w-12.5 flex items-center justify-center bg-boldblue text-white rounded-lg p-2">
          <TbAdjustmentsHorizontal size={25} />
        </button>

        {/* Saved Searches dropdown */}
        <div className="relative flex-grow">
          <select 
            className="h-12.5 border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={selectedSavedSearch}
            onChange={handleLoadSavedSearch}
          >
            <option>Saved Searches</option>
            {savedSearches.map((search, index) => (
              <option key={index} value={search}>{search}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>

        {/* Save Search button */}
        <button 
          onClick={() => setShowSaveDialog(true)}
          className="h-12.5 bg-boldblue text-white px-6 py-3 rounded-lg text-sm font-semibold"
        >
          Save Search
        </button>
      </div>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="mb-4 p-4 border border-boldblue rounded-lg">
          <h4 className="text-boldblue mb-2">Save this search</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter search name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-boldblue rounded-lg py-2 px-3 text-sm flex-grow"
            />
            <button
              onClick={handleSaveSearch}
              className="bg-boldblue text-white px-4 py-2 rounded-lg text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="border border-boldblue text-boldblue px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter by section */}
      <div className="mb-6">
        <h3 className="text-gray-700 mb-3">Filter by</h3>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Job Type filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={filters.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
            >
              <option value="">Title/Profession</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Security Clearance filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={filters.securityClearance}
              onChange={(e) => handleInputChange('securityClearance', e.target.value)}
            >
              <option value="">Security Clearance</option>
              <option value="Top Secret">Top Secret</option>
              <option value="Secret">Secret</option>
              <option value="Confidential">Confidential</option>
              <option value="Public Trust">Public Trust</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Skills filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={filters.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
            >
              <option value="">Skills</option>
              <option value="React">React</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Project Management">Project Management</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Expertise filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={filters.expertise}
              onChange={(e) => handleInputChange('expertise', e.target.value)}
            >
              <option value="">Expertise</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="DevOps">DevOps</option>
              <option value="Data Science">Data Science</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
          
          {/* Certifications filter */}
          <div className="relative w-full sm:w-64">
            <select 
              className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
              value={filters.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
            >
              <option value="">Certifications</option>
              <option value="AWS">AWS</option>
              <option value="PMP">PMP</option>
              <option value="CISSP">CISSP</option>
              <option value="Azure">Azure</option>
              <option value="Scrum Master">Scrum Master</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <IoMdArrowDropdown size={20} className="text-boldblue" />
            </div>
          </div>
        </div>
        
        {/* Previous government employment checkbox */}
        <div className="flex items-center mb-4">
            <div className="cursor-pointer" onClick={() => handleInputChange('requireGovtExperience', !filters.requireGovtExperience)}>
              {filters.requireGovtExperience ? 
                <MdOutlineRadioButtonChecked size={20} color='#0b5f94' /> : 
                <MdOutlineRadioButtonUnchecked size={20} color='#0b5f94' />
              }
            </div>
          <label 
            className="ml-2 text-gray-700 text-sm cursor-pointer"
            onClick={() => handleInputChange('requireGovtExperience', !filters.requireGovtExperience)}
          >
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
              className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue"
              checked={filters.govtType === 'state'}
              onChange={() => handleInputChange('govtType', 'state')}
            />
            <label htmlFor="state" className="ml-2 text-gray-700 text-sm">State</label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="radio" 
              name="govt" 
              id="federal" 
              className="h-4 w-4 text-deepskyblue border-gray-300 focus:ring-deepskyblue"
              checked={filters.govtType === 'federal'}
              onChange={() => handleInputChange('govtType', 'federal')}
            />
            <label htmlFor="federal" className="ml-2 text-gray-700 text-sm">Federal</label>
          </div>
          
          {/* Department search input */}
          <div className="relative flex-grow w-full max-w-125">
            <input 
              type="text" 
              placeholder="Select departments or agencies" 
              className="border border-boldblue text-boldblue placeholder:text-boldblue bg-white rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
              value={filters.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
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
            onClick={handleApplyDepartmentFilter}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default ContractorFilter;
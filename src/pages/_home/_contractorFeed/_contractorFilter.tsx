import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
// icons
import { IoMdArrowDropdown, IoMdSearch } from 'react-icons/io';
import { RxReset } from "react-icons/rx";
import { MdDeleteForever } from "react-icons/md";

// store
import { useFeedStore } from '@/store/useFeed';
import { useContractorFilter } from '@/store/useContractorFilter';

// utils
import { ProfessionalFieldsAndAreasOfExpertise152 } from '@/utils/feedFilter/152ProfessionalFieldsAndAreasOfExpertise';
import { certificatesAndEducationList } from '@/utils/feedFilter/CertificatesAndEducationList';
import { securityClearances } from '@/utils/feedFilter/SecurityClearances';
import { GovernmentDepartmentsAndAgenciesByCountry } from '@/utils/feedFilter/GovernmentDepartmentsAndAgenciesByCountry';

import { australiaDepartments } from '@/utils/govtAgencyAndClearanceIndex/australia';
import { canadaDepartments } from '@/utils/govtAgencyAndClearanceIndex/canada';
import { ukDepartments } from '@/utils/govtAgencyAndClearanceIndex/uk';
import { getAllCountries, getSpecificCountryStates, getUSStates } from '@/utils/getLocations/getAllCountriesAndStates';

type Country = string;
type StateWithCountry = [string, string];
type USState = string;

export interface FilterOptions {
  searchTerm: string;
  profession: string;
  clearance: string;
  skillsAndExpertise: string;
  certifications: string;
  requireGovtExperience: boolean;
  governmentType: string;
  department: string;
  location: string;
  domainFocus: string;
  domainDetail: string;
}

const ContractorFilter = () => {

  const {
    searchTerm, setSearchTerm,
    profession, setProfession,
    clearance, setClearance,
    skillsAndExpertise, setSkillsAndExpertise,
    certifications, setCertifications,
    requireGovtExperience, setRequireGovtExperience,
    governmentType, setGovernmentType,
    department, setDepartment,
    location, setLocation,
    domainFocus, setDomainFocus,
    domainDetail, setDomainDetail,
    resetFilters
  } = useContractorFilter();


  const [selectedSavedSearch, setSelectedSavedSearch] = useState('');
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);
  const [showDomainDetailsDropdown, setShowDomainDetailsDropdown] = useState(false);
  const [domainDetailOptions, setDomainDetailOptions] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSavedSearchesDropdown, setShowSavedSearchesDropdown] = useState(false);
  const [locationClickTime, setLocationClickTime] = useState<number>(0);

  // Location data
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [statesWithCountries, setStatesWithCountries] = useState<StateWithCountry[]>([]);
  const [usStates, setUsStates] = useState<USState[]>([]);

  // Refs
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const savedSearchesDropdownRef = useRef<HTMLDivElement>(null);
  const departmentInputRef = useRef<HTMLInputElement>(null);
  const departmentDropdownRef = useRef<HTMLDivElement>(null);
  const domainDetailInputRef = useRef<HTMLInputElement>(null);
  const domainDetailDropdownRef = useRef<HTMLDivElement>(null);

  const { addSavedSearch, removeSavedSearch, getSavedSearchesByFeedType } = useFeedStore();

  const savedSearches: { id: string; name: string; filters?: string }[] = getSavedSearchesByFeedType('Contractors');

  // Fetch location data
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
        console.error('Error fetching location data:', err);
      }
    };

    fetchData();
  }, []);

  // Set domain detail options based on domain focus
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

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Location dropdown
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
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
      if (savedSearchesDropdownRef.current &&
        !savedSearchesDropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)) {
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

  const selectDepartment = (dept: string) => {
    setDepartment(dept);
    setShowDepartmentDropdown(false);
  };

  const selectDomainDetail = (detail: string) => {
    setDomainDetail(detail);
    setShowDomainDetailsDropdown(false);
  };

  const handleSavedSearchSelect = (searchId: string) => {
    setSelectedSavedSearch(searchId);

    if (searchId) {
      const savedSearch = savedSearches.find((search: { id: string; name: string; filters?: string }) => search.id.toString() === searchId);

      if (savedSearch && savedSearch.filters) {
        const filters = JSON.parse(savedSearch.filters);
        setSearchTerm(filters.searchTerm || '');
        setProfession(filters.profession || '');
        setClearance(filters.clearance || '');
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

  const saveSearch = () => {
    if (!searchTerm && !profession && !clearance && !skillsAndExpertise &&
      !certifications && !requireGovtExperience && !governmentType &&
      !location && !domainFocus) {
      return;
    }

    let searchName = searchTerm ? `"${searchTerm}"` : 'All Contractors';
    if (profession) searchName += ` - ${profession}`;
    if (skillsAndExpertise) searchName += ` - ${skillsAndExpertise}`;

    const filters = { searchTerm, profession, clearance, skillsAndExpertise, certifications, requireGovtExperience, governmentType, department, location, domainFocus, domainDetail };

    const added = addSavedSearch({
      query: searchTerm,
      feedType: 'Contractors',
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
      <div className="grid grid-cols-8 items-center gap-6 mb-8">
        <div className="relative col-span-5">
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

        <div className="relative w-full col-span-2">
          <input
            ref={locationInputRef}
            type="text"
            placeholder="Saved Searches"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
            value={selectedSavedSearch ? savedSearches.find((search: { id: string; name: string }) => search.id === selectedSavedSearch)?.name || '' : ''}
            onChange={() => { }}
            onFocus={() => setShowSavedSearchesDropdown(true)}
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
              // Only the arrow button should toggle
              setShowSavedSearchesDropdown(!showSavedSearchesDropdown);
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {showSavedSearchesDropdown && (
            <div
              ref={savedSearchesDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
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
              {savedSearches.map((search: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                <div key={search.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100">
                  <div
                    className="flex-grow cursor-pointer text-sm"
                    onClick={() => {
                      if (search.id) handleSavedSearchSelect(search.id.toString());
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

        <button className="col-span-1 h-12.5 bg-boldblue text-white px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer"
          onClick={saveSearch}
        >
          Save Search
        </button>
      </div>

      <h3 className="text-gray-700 mb-3">Filter by</h3>

      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6">

        {/* Industry Sector filter */}
        <div className="relative w-full">
          <input
            // ref={professionInputRef}
            type="text"
            placeholder="Industry Sector"
            className="border border-boldblue text-boldblue placeholder:text-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue"
          // value={profession}
          // onChange={handleProfessionChange}
          // onFocus={() => {
          //   setShowProfessionDropdown(true);
          //   setFilteredProfessions(professions);
          // }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            onClick={(e) => {
              e.stopPropagation();
              // setShowProfessionDropdown(!showProfessionDropdown);
            }}
          >
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </button>

          {/* {showProfessionDropdown && (
            <div
              ref={professionDropdownRef}
              className="dropdown-scrollbar absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredProfessions.length > 0 ? (
                filteredProfessions.map((prof, index) => (
                  <div
                    key={`prof-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => selectProfession(prof)}
                  >
                    {prof}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No professions found</div>
              )}
            </div>
          )} */}
        </div>

        {/* Security Clearance filter */}
        <div className="relative w-full">
          <select
            className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={clearance}
            onChange={(e) => setClearance(e.target.value)}
          >
            <option value="">Security Clearance</option>
            {securityClearances.map((clearance, index) => (
              <option key={`clearance-${index}`} value={clearance}>{clearance}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>

        {/* Skills & Expertise filter */}
        <div className="relative w-full">
          <select
            className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={skillsAndExpertise}
            onChange={(e) => setSkillsAndExpertise(e.target.value)}
          >
            <option value="">Skills & Expertise</option>
            {ProfessionalFieldsAndAreasOfExpertise152.map((skill, index) => (
              <option key={`skill-${index}`} value={skill}>{skill}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
        </div>

        {/* Certifications filter */}
        <div className="relative w-full">
          <select
            className="border border-boldblue rounded-lg py-3 px-4 w-full text-sm focus:outline-none focus:border-boldblue appearance-none text-boldblue"
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
          >
            <option value="">Cert & Ed.</option>
            {certificatesAndEducationList.map((cert, index) => (
              <option key={`cert-${index}`} value={cert}>{cert}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <IoMdArrowDropdown size={20} className="text-boldblue" />
          </div>
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

        {/* Domain Focus filter */}
        <div className="relative w-full h-fit">
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

        {/* Domain Detail input */}
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

        <div className="relative w-full lg:col-span-2 mb-6">
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
                ...GovernmentDepartmentsAndAgenciesByCountry['United States'],
                ...GovernmentDepartmentsAndAgenciesByCountry['United Kingdom'],
                ...GovernmentDepartmentsAndAgenciesByCountry['Canada'],
                ...GovernmentDepartmentsAndAgenciesByCountry['Australia'],
              ];
              setFilteredDepartments(
                allDepts.filter(dept =>
                  dept.toLowerCase().includes(value.toLowerCase())
                )
              );
            }}
            onFocus={() => {
              setShowDepartmentDropdown(true);
              const allDepts = [
                ...GovernmentDepartmentsAndAgenciesByCountry['United States'],
                ...GovernmentDepartmentsAndAgenciesByCountry['United Kingdom'],
                ...GovernmentDepartmentsAndAgenciesByCountry['Canada'],
                ...GovernmentDepartmentsAndAgenciesByCountry['Australia'],
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
              <div className="px-4 py-2 font-semibold bg-gray-100 text-sm">US Federal Agencies</div>
              {filteredDepartments.map((dept, index) => (
                <div
                  key={`dept-fed-${index}`}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    selectDepartment(dept);
                  }}
                >
                  {dept}
                </div>
              ))}

              <div className="px-4 py-2 font-semibold bg-gray-100 text-sm">International Agencies</div>
              {filteredDepartments
                .filter(dept =>
                  australiaDepartments.includes(dept) ||
                  canadaDepartments.includes(dept) ||
                  ukDepartments.includes(dept)
                )
                .map((dept, index) => (
                  <div
                    key={`dept-intl-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      selectDepartment(dept);
                    }}
                  >
                    {dept}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>


      {/* Reset Filters button */}
      {(searchTerm || profession || clearance || skillsAndExpertise ||
        certifications || requireGovtExperience || governmentType || department ||
        location || domainFocus || domainDetail || selectedSavedSearch) && (
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
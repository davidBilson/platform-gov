import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import ContractorList from './_contractorList';
import ContractorFilter, { FilterOptions } from './_contractorFilter';
import ContractorCountFilters from './_contractorCountFilters';
import { ContractorProfile, ContractorApiResponse } from '@/types/contractors';

const ContractorFeed: React.FC = () => {
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<{id: string, name: string, value: string}[]>([]);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
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

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axios.get<ContractorApiResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FETCH_ALL_CONTRACTORS}`
        );
        
        if (response.data.success) {
          setContractors(response.data.data);
          setFilteredContractors(response.data.data);
        } else {
          setError('Failed to fetch contractors');
        }
      } catch (err) {
        setError('Error fetching contractors');
        console.error('Error fetching contractors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  // Apply filtering when filters change
  useEffect(() => {
    if (!contractors || contractors.length === 0) return;
    
    applyFilters(currentFilters);
  }, [currentFilters, contractors]);

  const applyFilters = (filters: FilterOptions) => {
    let filtered = [...contractors];
    const newActiveFilters: {id: string, name: string, value: string}[] = [];
  
    // Search Term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(contractor => 
        contractor.user.name.toLowerCase().includes(searchLower) ||
        contractor.primaryPosition?.toLowerCase().includes(searchLower) ||
        contractor.bio.toLowerCase().includes(searchLower)
      );
      newActiveFilters.push({ 
        id: 'searchTerm', 
        name: 'Search', 
        value: filters.searchTerm 
      });
    }
  
    // Profession
    if (filters.profession) {
      filtered = filtered.filter(contractor => 
        contractor.primaryPosition?.toLowerCase() === filters.profession.toLowerCase()
      );
      newActiveFilters.push({ 
        id: 'profession', 
        name: 'Profession', 
        value: filters.profession 
      });
    }
  
    // Security Clearance
    if (filters.securityClearance) {
      filtered = filtered.filter(contractor => 
        contractor.securityClearance?.toLowerCase() === filters.securityClearance.toLowerCase()
      );
      newActiveFilters.push({ 
        id: 'securityClearance', 
        name: 'Clearance', 
        value: filters.securityClearance 
      });
    }
  
    // Skills & Expertise
    if (filters.skillsAndExpertise) {
      const searchLower = filters.skillsAndExpertise.toLowerCase();
      filtered = filtered.filter(contractor => 
        contractor.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        contractor.expertise.some(exp => exp.toLowerCase().includes(searchLower))
      );
      newActiveFilters.push({ 
        id: 'skillsAndExpertise', 
        name: 'Skills', 
        value: filters.skillsAndExpertise 
      });
    }
  
    // Certifications
    if (filters.certifications) {
      filtered = filtered.filter(contractor => 
        contractor.certifications.some(cert => 
          cert.toLowerCase().includes(filters.certifications.toLowerCase())
        )
      );
      newActiveFilters.push({ 
        id: 'certifications', 
        name: 'Certifications', 
        value: filters.certifications 
      });
    }
  
    // Government Experience
    if (filters.requireGovtExperience) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.departmentType === 'Government' ||
          job.department?.toLowerCase().includes('government')
        )
      );
      newActiveFilters.push({ 
        id: 'requireGovtExperience', 
        name: 'Govt Experience', 
        value: 'Required' 
      });
    }
  
    // Government Type
    if (filters.governmentType) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.departmentType?.toLowerCase() === filters.governmentType.toLowerCase()
        )
      );
      newActiveFilters.push({ 
        id: 'governmentType', 
        name: 'Govt Type', 
        value: filters.governmentType 
      });
    }
  
    // Department
    if (filters.department) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.department?.toLowerCase().includes(filters.department.toLowerCase())
        )
      );
      newActiveFilters.push({ 
        id: 'department', 
        name: 'Department', 
        value: filters.department 
      });
    }
  
    // Location
    if (filters.location) {
      filtered = filtered.filter(contractor => 
        contractor.location?.state.toLowerCase().includes(filters.location.toLowerCase()) ||
        contractor.location?.country.toLowerCase().includes(filters.location.toLowerCase())
      );
      newActiveFilters.push({ 
        id: 'location', 
        name: 'Location', 
        value: filters.location 
      });
    }
  
    // Domain Focus
    if (filters.domainFocus) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.departmentType?.toLowerCase().includes(filters.domainFocus.toLowerCase())
        )
      );
      newActiveFilters.push({ 
        id: 'domainFocus', 
        name: 'Domain', 
        value: filters.domainFocus 
      });
    }
  
    // Domain Detail
    if (filters.domainDetail) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.department?.toLowerCase().includes(filters.domainDetail.toLowerCase()) ||
          job.location?.toLowerCase().includes(filters.domainDetail.toLowerCase())
        )
      );
      newActiveFilters.push({ 
        id: 'domainDetail', 
        name: 'Domain Detail', 
        value: filters.domainDetail 
      });
    }
  
    setFilteredContractors(filtered);
    setActiveFilters(newActiveFilters);
  };

  const handleFilterChange = useCallback((filters: FilterOptions) => {
    setCurrentFilters(filters);
  }, []);
  
  const handleRemoveFilter = (filterId: string) => {
    const updatedFilters = { ...currentFilters };
    
    switch (filterId) {
      case 'searchTerm':
        updatedFilters.searchTerm = '';
        break;
      case 'profession':
        updatedFilters.profession = '';
        break;
      case 'securityClearance':
        updatedFilters.securityClearance = '';
        break;
      case 'skillsAndExpertise':
        updatedFilters.skillsAndExpertise = '';
        break;
      case 'certifications':
        updatedFilters.certifications = '';
        break;
      case 'requireGovtExperience':
        updatedFilters.requireGovtExperience = false;
        break;
      case 'governmentType':
        updatedFilters.governmentType = '';
        updatedFilters.department = ''; // Also clear department when government type is removed
        break;
      case 'department':
        updatedFilters.department = '';
        break;
      case 'location':
        updatedFilters.location = '';
        break;
      case 'domainFocus':
        updatedFilters.domainFocus = '';
        updatedFilters.domainDetail = ''; // Also clear domain detail when focus is removed
        break;
      case 'domainDetail':
        updatedFilters.domainDetail = '';
        break;
      default:
        break;
    }
    
    setCurrentFilters(updatedFilters);
    applyFilters(updatedFilters); // Explicitly apply filters after update
  };
  

  return (
    <main className="container mx-auto p-6">
      <ContractorFilter 
        loading={loading}
        onFilterChange={handleFilterChange} 
      />
      <ContractorCountFilters 
        contractors={contractors} 
        filteredCount={filteredContractors.length}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
      />
      {loading ? (
        <div>Loading contractors...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <ContractorList contractors={filteredContractors} />
      )}
    </main>
  );
};

export default ContractorFeed;
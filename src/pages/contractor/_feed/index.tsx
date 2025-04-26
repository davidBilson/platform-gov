import React, { useEffect, useState } from 'react';
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
  const [savedSearches, setSavedSearches] = useState<string[]>(['Government IT', 'Cybersecurity Experts']);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
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
    // Start with all contractors
    let filtered = [...contractors];
    const newActiveFilters: {id: string, name: string, value: string}[] = [];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(contractor => 
        contractor.user.name.toLowerCase().includes(searchLower) ||
        contractor.primaryPosition?.toLowerCase().includes(searchLower) ||
        contractor.bio.toLowerCase().includes(searchLower) ||
        contractor.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        contractor.expertise.some(exp => exp.toLowerCase().includes(searchLower)) ||
        contractor.certifications.some(cert => cert.toLowerCase().includes(searchLower))
      );
      newActiveFilters.push({ id: 'searchTerm', name: 'Search', value: filters.searchTerm });
    }
    
    // Apply profession filter
    if (filters.profession) {
      filtered = filtered.filter(contractor => 
        contractor.primaryPosition?.toLowerCase() === filters.profession.toLowerCase()
      );
      newActiveFilters.push({ id: 'profession', name: 'Profession', value: filters.profession });
    }
    
    // Apply security clearance filter - This would need work history data to filter properly
    if (filters.securityClearance) {
      // For demo purposes, just add it to the active filters
      newActiveFilters.push({ id: 'securityClearance', name: 'Security Clearance', value: filters.securityClearance });
    }
    
    // Apply skills filter
    if (filters.skills) {
      filtered = filtered.filter(contractor => 
        contractor.skills.some(skill => 
          skill.toLowerCase() === filters.skills.toLowerCase()
        )
      );
      newActiveFilters.push({ id: 'skills', name: 'Skill', value: filters.skills });
    }
    
    // Apply expertise filter
    if (filters.expertise) {
      filtered = filtered.filter(contractor => 
        contractor.expertise.some(exp => 
          exp.toLowerCase() === filters.expertise.toLowerCase()
        )
      );
      newActiveFilters.push({ id: 'expertise', name: 'Expertise', value: filters.expertise });
    }
    
    // Apply certifications filter
    if (filters.certifications) {
      filtered = filtered.filter(contractor => 
        contractor.certifications.some(cert => 
          cert.toLowerCase() === filters.certifications.toLowerCase()
        )
      );
      newActiveFilters.push({ id: 'certifications', name: 'Certification', value: filters.certifications });
    }
    
    // Apply government experience filter
    if (filters.requireGovtExperience) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory.some(job => 
          job.departmentType === 'Government' || 
          job.department?.toLowerCase().includes('government')
        )
      );
      newActiveFilters.push({ id: 'govtExperience', name: 'Government Experience', value: '' });
    }
    
    // Apply government type filter
    if (filters.govtType) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory.some(job => 
          job.departmentType?.toLowerCase() === filters.govtType?.toLowerCase()
        )
      );
      newActiveFilters.push({ id: 'govtType', name: 'Government Type', value: filters.govtType });
    }
    
    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory.some(job => 
          job.department?.toLowerCase().includes(filters.department.toLowerCase())
        )
      );
      newActiveFilters.push({ id: 'department', name: 'Department', value: filters.department });
    }
    
    setFilteredContractors(filtered);
    setActiveFilters(newActiveFilters);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setCurrentFilters(filters);
  };
  
  const handleRemoveFilter = (filterId: string) => {
    const updatedFilters = { ...currentFilters };
    
    // Reset the appropriate filter
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
      case 'skills':
        updatedFilters.skills = '';
        break;
      case 'expertise':
        updatedFilters.expertise = '';
        break;
      case 'certifications':
        updatedFilters.certifications = '';
        break;
      case 'govtExperience':
        updatedFilters.requireGovtExperience = false;
        break;
      case 'govtType':
        updatedFilters.govtType = null;
        break;
      case 'department':
        updatedFilters.department = '';
        break;
      default:
        break;
    }
    
    setCurrentFilters(updatedFilters);
  };
  
  const handleSaveSearch = (searchName: string) => {
    if (!savedSearches.includes(searchName)) {
      setSavedSearches([...savedSearches, searchName]);
      // In a real app, you would also save the current filter state associated with this name
    }
  };

  return (
    <main className="container mx-auto p-6">
      <ContractorFilter 
        onFilterChange={handleFilterChange} 
        onSaveSearch={handleSaveSearch}
        savedSearches={savedSearches}
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
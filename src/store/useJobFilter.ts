import { create } from 'zustand';

interface JobFilterState {
  // Filter states
  searchTerm: string;
  jobType: string;
  securityClearance: string;
  skillsAndExpertise: string;
  certifications: string;
  requirePrevGovtExp: boolean;
  governmentType: string;
  department: string;
  location: string;
  domainFocus: string;
  domainDetail: string;
  activeFilters: Array<{ id: string; name: string }>;
  
  // Setters
  setSearchTerm: (term: string) => void;
  setJobType: (type: string) => void;
  setSecurityClearance: (clearance: string) => void;
  setSkillsAndExpertise: (skills: string) => void;
  setCertifications: (certs: string) => void;
  setRequirePrevGovtExp: (value: boolean) => void;
  setGovernmentType: (type: string) => void;
  setDepartment: (dept: string) => void;
  setLocation: (loc: string) => void;
  setDomainFocus: (focus: string) => void;
  setDomainDetail: (detail: string) => void;
  setActiveFilters: (filters: Array<{ id: string; name: string }>) => void;
  
  // Actions
  resetFilters: () => void;
  removeFilter: (filterId: string) => void;
}

export const useJobFilter = create<JobFilterState>((set) => ({
  // Initial state
  searchTerm: '',
  jobType: '',
  securityClearance: '',
  skillsAndExpertise: '',
  certifications: '',
  requirePrevGovtExp: false,
  governmentType: '',
  department: '',
  location: '',
  domainFocus: '',
  domainDetail: '',
  activeFilters: [],
  
  // Setters
  setSearchTerm: (term) => set({ searchTerm: term }),
  setJobType: (type) => set({ jobType: type }),
  setSecurityClearance: (clearance) => set({ securityClearance: clearance }),
  setSkillsAndExpertise: (skills) => set({ skillsAndExpertise: skills }),
  setCertifications: (certs) => set({ certifications: certs }),
  setRequirePrevGovtExp: (value) => set({ requirePrevGovtExp: value }),
  setGovernmentType: (type) => set({ governmentType: type, department: '' }), // Reset department when gov type changes
  setDepartment: (dept) => set({ department: dept }),
  setLocation: (loc) => set({ location: loc }),
  setDomainFocus: (focus) => set({ domainFocus: focus, domainDetail: '' }), // Reset detail when focus changes
  setDomainDetail: (detail) => set({ domainDetail: detail }),
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  
  // Actions
  resetFilters: () => set({
    searchTerm: '',
    jobType: '',
    securityClearance: '',
    skillsAndExpertise: '',
    certifications: '',
    requirePrevGovtExp: false,
    governmentType: '',
    department: '',
    location: '',
    domainFocus: '',
    domainDetail: '',
    activeFilters: []
  }),
  
  removeFilter: (filterId) => set((state) => {
    const updatedFilters = state.activeFilters.filter(filter => filter.id !== filterId);
    
    // Reset the corresponding input based on filterId
    const resetState: Partial<JobFilterState> = { activeFilters: updatedFilters };
    
    switch(filterId) {
      case 'jobType': resetState.jobType = ''; break;
      case 'securityClearance': resetState.securityClearance = ''; break;
      case 'skills': resetState.skillsAndExpertise = ''; break;
      case 'certifications': resetState.certifications = ''; break;
      case 'govtExp': resetState.requirePrevGovtExp = false; break;
      case 'govtType': 
        resetState.governmentType = ''; 
        resetState.department = ''; 
        break;
      case 'department': resetState.department = ''; break;
      case 'location': resetState.location = ''; break;
      case 'domainFocus': 
        resetState.domainFocus = ''; 
        resetState.domainDetail = ''; 
        break;
    }
    
    return resetState;
  })
}));
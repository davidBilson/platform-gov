import { create } from 'zustand';
import { ContractorProfile } from '@/types/contractors';

interface ContractorFilterState {
  // Filter states
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
  activeFilters: Array<{ id: string; name: string; value: string }>;
  
  // Setters
  setSearchTerm: (term: string) => void;
  setProfession: (profession: string) => void;
  setClearance: (clearance: string) => void;
  setSkillsAndExpertise: (skills: string) => void;
  setCertifications: (certs: string) => void;
  setRequireGovtExperience: (value: boolean) => void;
  setGovernmentType: (type: string) => void;
  setDepartment: (dept: string) => void;
  setLocation: (loc: string) => void;
  setDomainFocus: (focus: string) => void;
  setDomainDetail: (detail: string) => void;
  
  // Actions
  resetFilters: () => void;
  removeFilter: (filterId: string) => void;
  applyFilters: (contractors: ContractorProfile[]) => ContractorProfile[];
  updateActiveFilters: () => void;
}

export const useContractorFilter = create<ContractorFilterState>((set, get) => ({
  searchTerm: '',
  profession: '',
  clearance: '',
  skillsAndExpertise: '',
  certifications: '',
  requireGovtExperience: false,
  governmentType: '',
  department: '',
  location: '',
  domainFocus: '',
  domainDetail: '',
  activeFilters: [],
  
  // Setters - now updating activeFilters after each setter
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().updateActiveFilters();
  },
  setProfession: (profession) => {
    set({ profession });
    get().updateActiveFilters();
  },
  setClearance: (clearance) => {
    set({ clearance: clearance });
    get().updateActiveFilters();
  },
  setSkillsAndExpertise: (skills) => {
    set({ skillsAndExpertise: skills });
    get().updateActiveFilters();
  },
  setCertifications: (certs) => {
    set({ certifications: certs });
    get().updateActiveFilters();
  },
  setRequireGovtExperience: (value) => {
    set({ requireGovtExperience: value });
    get().updateActiveFilters();
  },
  setGovernmentType: (type) => {
    set({ governmentType: type });
    get().updateActiveFilters();
  },
  setDepartment: (dept) => {
    set({ department: dept });
    get().updateActiveFilters();
  },
  setLocation: (loc) => {
    set({ location: loc });
    get().updateActiveFilters();
  },
  setDomainFocus: (focus) => {
    set({ domainFocus: focus, domainDetail: '' });
    get().updateActiveFilters();
  },
  setDomainDetail: (detail) => {
    set({ domainDetail: detail });
    get().updateActiveFilters();
  },
  
  // Actions
  resetFilters: () => {
    set({
      searchTerm: '',
      profession: '',
      clearance: '',
      skillsAndExpertise: '',
      certifications: '',
      requireGovtExperience: false,
      governmentType: '',
      department: '',
      location: '',
      domainFocus: '',
      domainDetail: '',
      activeFilters: []
    });
  },
  
  removeFilter: (filterId) => {
    set((state) => {
      const updatedFilters = state.activeFilters.filter(filter => filter.id !== filterId);
      
      // Reset the corresponding input based on filterId
      const resetState: Partial<ContractorFilterState> = { activeFilters: updatedFilters };
      
      switch(filterId) {
        case 'searchTerm': resetState.searchTerm = ''; break;
        case 'profession': resetState.profession = ''; break;
        case 'clearance': resetState.clearance = ''; break;
        case 'skillsAndExpertise': resetState.skillsAndExpertise = ''; break;
        case 'certifications': resetState.certifications = ''; break;
        case 'requireGovtExperience': resetState.requireGovtExperience = false; break;
        case 'governmentType': resetState.governmentType = ''; break;
        case 'department': resetState.department = ''; break;
        case 'location': resetState.location = ''; break;
        case 'domainFocus': 
          resetState.domainFocus = ''; 
          resetState.domainDetail = ''; 
          break;
        case 'domainDetail': resetState.domainDetail = ''; break;
      }
      
      return resetState;
    });
  },
  
  // Separate function to update active filters based on current state
  updateActiveFilters: () => {
    const state = get();
    const newActiveFilters: Array<{ id: string; name: string; value: string }> = [];

    if (state.searchTerm) {
      newActiveFilters.push({
        id: "searchTerm",
        name: "Search",
        value: state.searchTerm,
      });
    }

    if (state.profession) {
      newActiveFilters.push({
        id: "profession",
        name: "Profession",
        value: state.profession,
      });
    }

    if (state.clearance) {
      newActiveFilters.push({ 
        id: 'clearance', 
        name: 'Clearance', 
        value: state.clearance 
      });
    }

    if (state.skillsAndExpertise) {
      newActiveFilters.push({ 
        id: 'skillsAndExpertise', 
        name: 'Skills', 
        value: state.skillsAndExpertise 
      });
    }

    if (state.certifications) {
      newActiveFilters.push({ 
        id: 'certifications', 
        name: 'Certifications', 
        value: state.certifications 
      });
    }

    if (state.requireGovtExperience) {
      newActiveFilters.push({ 
        id: 'requireGovtExperience', 
        name: 'Govt Experience', 
        value: 'Required' 
      });
    }

    if (state.governmentType) {
      newActiveFilters.push({ 
        id: 'governmentType', 
        name: 'Govt Type', 
        value: state.governmentType 
      });
    }

    if (state.department) {
      newActiveFilters.push({ 
        id: 'department', 
        name: 'Department', 
        value: state.department 
      });
    }

    if (state.location) {
      newActiveFilters.push({
        id: "location",
        name: "Location",
        value: state.location,
      });
    }

    if (state.domainFocus) {
      newActiveFilters.push({ 
        id: 'domainFocus', 
        name: 'Domain', 
        value: state.domainFocus 
      });
    }

    if (state.domainDetail) {
      newActiveFilters.push({ 
        id: 'domainDetail', 
        name: 'Domain Detail', 
        value: state.domainDetail 
      });
    }

    set({ activeFilters: newActiveFilters });
  },
  
  applyFilters: (contractors) => {
    const state = get();
    let filtered = [...contractors];

    filtered = filtered.filter(contractor => !contractor.user.isSuspended);

    // SEARCH TERM
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter((contractor) =>
        contractor.user?.name?.toLowerCase().includes(searchLower) ||
        contractor.primaryPosition?.toLowerCase().includes(searchLower) ||
        contractor.profession?.toLowerCase().includes(searchLower) || // Added profession to search
        contractor.bio?.toLowerCase().includes(searchLower)
      );
    }
  
    if (state.profession) {
      const professionLower = state.profession.toLowerCase();
      filtered = filtered.filter((contractor) =>
        contractor.primaryPosition?.toLowerCase().includes(professionLower) ||
        contractor.profession?.toLowerCase().includes(professionLower)
      );
    }
  
    // Security Clearance
    if (state.clearance) {
      filtered = filtered.filter(contractor => 
        typeof contractor.clearance === 'string' && contractor.clearance.toLowerCase() === state.clearance.toLowerCase()
      );
    }
  
    // Skills & Expertise
    if (state.skillsAndExpertise) {
      const searchLower = state.skillsAndExpertise.toLowerCase();
      filtered = filtered.filter(contractor => 
        contractor.skills.some(skill => skill.toLowerCase().includes(searchLower))
        //  || contractor.expertise.some(exp => exp.toLowerCase().includes(searchLower))
      );
    }
  
    // Certifications
    if (state.certifications) {
      filtered = filtered.filter(contractor => 
        contractor.certifications.some(cert => 
          cert.toLowerCase().includes(state.certifications.toLowerCase())
        )
      );
    }
  
    // Government Experience
    if (state.requireGovtExperience) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.departmentType === 'Government' ||
          job.department?.toLowerCase().includes('government')
        )
      );
    }
  
    // Government Type
    if (state.governmentType) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.departmentType?.toLowerCase() === state.governmentType.toLowerCase()
        )
      );
    }
  
    // Department
    if (state.department) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.department?.toLowerCase().includes(state.department.toLowerCase())
        )
      );
    }
  
    if (state.location) {
      filtered = filtered.filter((contractor) => {
        const locationState = contractor.location?.state?.toLowerCase() || "";
        const locationCountry = contractor.location?.country?.toLowerCase() || "";
        const filterLocation = state.location.toLowerCase();
        return (
          locationState.includes(filterLocation) ||
          locationCountry.includes(filterLocation)
        );
      });
    }
  
    // Domain Focus
    if (state.domainFocus) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.departmentType?.toLowerCase().includes(state.domainFocus.toLowerCase())
        )
      );
    }
  
    // Domain Detail
    if (state.domainDetail) {
      filtered = filtered.filter(contractor => 
        contractor.workHistory?.some(job => 
          job.department?.toLowerCase().includes(state.domainDetail.toLowerCase()) ||
          job.location?.toLowerCase().includes(state.domainDetail.toLowerCase())
        )
      );
    }
    
    return filtered;
  }
}));


export const useContractorSearchTerm = () => useContractorFilter(state => state.searchTerm);
export const useSetContractorSearchTerm = () => useContractorFilter(state => state.setSearchTerm);
export const useContractorActiveFilters = () => useContractorFilter(state => state.activeFilters);
export const useContractorRemoveFilter = () => useContractorFilter(state => state.removeFilter);
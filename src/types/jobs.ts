// /job/create
export interface Milestone {
    id: number;
    description: string;
    price: number;
    dueDate: Date | null;
  }
  
  export interface JobFormData {
    userId: string;
    location: string;
    jobCategory: string;
    jobTitle: string;
    description: string;
    requiredSkills: string[];
    requiredCertifications: string[];
    requiresRegisteredLobbyist: boolean;
    employmentType: 'full-time' | 'part-time';
    paymentType: 'hourly' | 'fixed-price' | 'retainer';
    price: number;
    milestones: Milestone[];
    startDate: Date | null;
    retainerAmount: number;
    retainerFrequency: string;
    retainerDuration: number;
}

export interface JobList {
  _id: string;
  jobTitle: string;
  description: string;
  location: string;
  paymentType: 'hourly' | 'fixed-price' | 'retainer';
  price: number;
  employmentType: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  userRole: string;
  createdAt: string;
  retainerAmount?: number;
  retainerFrequency?: string;

  // New client-related fields
  clientName: string;
  clientLogo: string;
  clientIndustry: string;
  clientCompanySize: string;
  clientSpecializations: string[]; // Assuming it's always an array of strings
  clientLocation: string[];        // Also assuming it's an array of strings
  clientAccountAge: string;        // ISO string format
}

export interface JobListProps {
  job: JobList;
}

export interface Jobs {
    // New client-related fields
    clientName: string;
    clientLogo: string;
    clientIndustry: string;
    clientCompanySize: string;
    clientSpecializations: string[]; // Assuming it's always an array of strings
    clientLocation: string[];        // Also assuming it's an array of strings
    clientAccountAge: string; 
    
  _id: string;
  jobTitle: string;
  description: string;
  location: string;
  paymentType: 'hourly' | 'fixed-price' | 'retainer';
  price: number;
  employmentType: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  userRole: string;
  createdAt: string;
  retainerAmount?: number;
  retainerFrequency?: string;
  milestones?: Array<{
    id: number;
    description: string;
    price: number;
    dueDate: string | null;
    _id: string;
  }>;
  startDate?: string | null;
  status?: string;
  updatedAt?: string;
  userId?: string | null;
  requiresRegisteredLobbyist?: boolean;
  retainerDuration?: number;
  [key: string]: string | number | boolean | null | undefined | Array<unknown> | Record<string, unknown>;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface JobsResponse {
  success: boolean;
  data: Jobs[];
  pagination: PaginationInfo;
}
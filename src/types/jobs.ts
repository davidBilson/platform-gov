// jobs.ts

export interface ClientLocation {
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  _id: string;
}

export interface Milestone {
  id: number;
  description: string;
  price: number;
  dueDate: string | null;
  _id?: string;
}

export interface Job {
  _id: string;
  userId: string;
  clientName: string;
  clientLogo: string;
  clientIndustry: string;
  clientCompanySize: string;
  clientSpecializations: string[];
  clientLocation: ClientLocation[];
  clientAccountAge: string;
  userRole: string;
  location: string;
  jobCategory: string;
  jobTitle: string;
  description: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  requiresRegisteredLobbyist: boolean;
  employmentType: string;
  paymentType: string;
  price: number;
  milestones: Milestone[];
  startDate: string;
  retainerAmount: number;
  retainerFrequency: string;
  retainerDuration: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  proposalsCount: number;
}

export interface ApiResponse {
  success: boolean;
  data: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Existing types from jobs.ts
export interface JobFormData {
  userId: string;
  location: string;
  jobCategory: string;
  jobTitle: string;
  description: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  requiresRegisteredLobbyist: boolean;
  employmentType: string;
  paymentType: string;
  price: number;
  startDate: Date | null;
  retainerAmount: number;
  retainerFrequency: string;
  retainerDuration: number | null;
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
  clientName: string;
  clientLogo: string;
  clientIndustry: string;
  clientCompanySize: string;
  clientSpecializations: string[];
  clientLocation: string[];
  clientAccountAge: string;
}

export interface JobListProps {
  job: JobList;
}

export interface Jobs {
  clientName: string;
  clientLogo: string;
  clientIndustry: string;
  clientCompanySize: string;
  clientSpecializations: string[];
  clientLocation: string[];
  clientAccountAge: string;
  _id: string;
  jobTitle: string;
  jobCategory: string;
  description: string;
  location: string;
  paymentType: 'hourly' | 'fixed-price' | 'retainer';
  price: number;
  employmentType: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  userRole: string;
  createdAt: string;
  retainerAmount: number;
  retainerFrequency: string;
  milestones: Array<{
    id: number;
    description: string;
    price: number;
    dueDate: string | null;
    _id: string;
  }>;
  startDate: string | null;
  status: string;
  updatedAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  requiresRegisteredLobbyist: boolean;
  retainerDuration: number;
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

export interface ApplicationDraft {
  _id: string;
  jobId: string | { _id: string; [key: string]: string };
  freelancerId: string;
  coverLetter?: string;
  proposedRate?: string | number;
  certificationAcknowledgment?: boolean;
  attachments?: Array<{
    filename: string;
    originalName: string;
    fileSize: number;
    fileType: string;
    fileUrl: string;
  }>;
  status: 'draft';
  createdAt: string;
  updatedAt: string;
}
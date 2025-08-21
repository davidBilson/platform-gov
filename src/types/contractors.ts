// contractors.types.ts
export interface UserDetails {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isSuspended: boolean;
  isHighPriority: boolean;
  isSubscribed: boolean;
}

export interface WorkHistory {
  id: string;
  title: string;
  department: string;
  departmentType: string;
  experienceLevel: string;
  location: string;
  fromDate: string;
  toDate: string;
  _id: string;
}

export interface Degree {
  id: string;
  degree: string;
  institution: string;
  yearCompleted: string;
  _id: string;
}

export interface ContractorProfile {
  [x: string]: unknown;
  _id: string;
  user: UserDetails; // Changed from string to UserDetails object
  bio: string;
  profileImage: string;
  ratePerHour: number;
  profession: string;
  primaryPosition: string;
  skills: string[];
  expertise: string[];
  certifications: string[];
  workHistory: WorkHistory[];
  degrees: Degree[];
  securityClearance?: string;
  firmAffiliation: string; // 'independent' or firm name
    location: {
      country: string;
      state: string;
    };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ContractorApiResponse {
  success: boolean;
  count: number;
  data: ContractorProfile[];
}

export interface ContractorListProps {
  contractors: ContractorProfile[];
}
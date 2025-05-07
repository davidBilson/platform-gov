export interface JobDetailsProps {
    jobId?: string | string[];
  }
  
  export interface WorkHistoryItem {
    id: string;
    title?: string;
    department?: string;
    departmentType?: string;
    experienceLevel?: string;
    location?: string;
    fromDate?: string;
    toDate?: string;
  }
  
  export interface FreelancerProfile {
    profileImage: string;
    user?: {
      name: string;
    };
    primaryPosition?: string;
    skills?: string[];
    expertise?: string[];
    certifications?: string[];
    location?: {
      state?: string;
      country?: string;
    };
  }
  
  export interface JobApplication {
    _id: string;
    jobId: string;
    freelancerId: string;
    freelancerProfileId: FreelancerProfile;
    coverLetter?: string;
    proposedRate?: number;
  }
  
  export interface ProposalData {
    applicationId: string;
    jobId: string;
    contractorId: string;
    contractorName: string;
    contractorProfilePicture: string;
    name: string;
    title: string;
    skills: string[];
    expertise: string[];
    certifications: string[];
    primaryPosition: string;
    location: string;
    coverLetter: string;
    proposedRate: number;
    workHistory: WorkHistoryItem[];
  }
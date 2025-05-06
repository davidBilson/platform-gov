export interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface JobDetails {
  _id: string;
  userId: string;
  clientId?: string;
  clientName: string;
  clientLogo: string;
  location: string;
  jobCategory: string;
  jobTitle: string;
  description: string;
  employmentType: string;
  paymentType: string;
  price: number;
  retainerAmount: number;
  retainerFrequency: string;
  retainerDuration: number;
  status: string;
  createdAt: string;
}

export interface ProposedMilestone {
  description: string;
  price: number;
  dueDate: string;
}

export interface Interview {
  scheduledDate: string;
  meetingLink: string;
  notes: string;
  completed: boolean;
}

export interface FreelancerUser {
  _id: string;
  name: string;
}

export interface FreelancerProfileLocation {
  country: string;
  state: string;
}

export interface FreelancerProfile {
  _id: string;
  user: FreelancerUser;
  location: FreelancerProfileLocation;
  profileImage: string;
  ratePerHour: number;
  primaryPosition: string;
  skills: string[];
  expertise: string[];
  certifications: string[];
  name: string;
}

export interface Application {
  _id: string;
  jobId: string | JobDetails;
  freelancerId: string;
  freelancerProfileId: FreelancerProfile;
  coverLetter: string;
  proposedRate: number;
  availability: 'immediate' | 'one_week' | 'two_weeks' | 'one_month' | 'custom' | string;
  relevantSkills: string[];
  attachments: Attachment[];
  certificationAcknowledgment: boolean;
  status: 'draft' | 'pending' | 'viewed' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected' | 'withdrawn' | 'active' | string;
  proposedMilestones: ProposedMilestone[];
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
  lastStatusChangeAt: string;
  draftExpiresAt: string | null;
  __v?: number;
}

export interface JobApplicationsResponse {
  success: boolean;
  count: number;
  data: Application[];
  message?: string;
}
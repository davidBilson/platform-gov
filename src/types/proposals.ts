// types.ts - Shared TypeScript interfaces for the application

// Common interfaces
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
  
  export interface Application {
    _id: string;
    jobId: JobDetails | string;
    freelancerId: string;
    freelancerProfileId?: string;
    coverLetter?: string;
    proposedRate?: number;
    proposedMilestones?: ProposedMilestone[];
    proposedRetainerAmount?: number;
    proposedRetainerFrequency?: 'Hour' | 'Day' | 'Week' | 'Month' | string;
    proposedRetainerDuration?: number;
    availableStartDate?: string | Date;
    availability?: 'immediate' | 'one_week' | 'two_weeks' | 'one_month' | 'custom' | string;
    customAvailabilityNote?: string;
    relevantSkills?: string[];
    relevantExperience?: string;
    attachments?: Attachment[];
    certificationAcknowledgment?: boolean;
    status: 'draft' | 'pending' | 'viewed' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected' | 'withdrawn' | 'active' | string;
    clientNotes?: string;
    interviews?: Interview[];
    messageThreadId?: string;
    createdAt: string;
    updatedAt?: string;
    viewedAt?: string;
    lastStatusChangeAt?: string;
    draftExpiresAt?: string | null;
  }
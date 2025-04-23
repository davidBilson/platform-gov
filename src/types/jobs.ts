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



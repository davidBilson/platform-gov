
export interface Milestone {
  name: string;
  description: string;
  dueDate: Date;
  amount: number;
  status: string;
  _id: string;
}

export interface Timesheet {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: string;
  _id: string;
}

export interface Retainer {
  recurringAmount: number;
  frequency: string;
  nextPaymentDate?: Date;
  paymentHistory: [];
}

export interface JobInfo {
  _id: string;
  jobTitle: string;
  description: string;
  location: string;
  employmentType: string;
  paymentType: string;
  price: number;
  clientName?: string;
  clientLogo?: string;
}

export interface ClientInfo {
  _id: string;
  name: string;
  email: string;
  profile?: {
    logo?: string;
    overview?: string;
    industry?: string;
  };
}

export interface Contract {
  _id: string;
  hiringId: string;
  jobId: JobInfo | string;
  contractorId: string;
  clientId: ClientInfo | string;
  startDate: Date;
  endDate?: Date;
  status: string;
  paymentStructure: string;
  milestones?: Milestone[];
  timesheets?: Timesheet[];
  retainer?: Retainer;
  createdAt: Date;
  updatedAt: Date;
}
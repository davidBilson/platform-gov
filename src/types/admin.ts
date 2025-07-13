
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  

// # ============ USERS ============ # 

  export interface GetUsersResponse {
    success: boolean;
    message: string;
    data: {
      users: User[];
      pagination: PaginationInfo;
    };
  }
  
  export interface ApiError {
    success: false;
    message: string;
    error?: string;
  }
  
  export interface AdminRequest {
    adminId: string;
  }
  
export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: 'contractor' | 'client' | 'admin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isSuspended: boolean;
  isHighPriority: boolean;
  createdAt: string;
  updatedAt: string;
  jobsCreated?: number;
  contracts?: number;
  jobs?: number;
  appliedContracts?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'contractor' | 'client' | 'admin';
  search?: string;
}

// # ============ JOBS ============ # 

export interface GetJobParams {
  page?: number;
  limit?: number;
  search?: string;
}
export interface Job {
  _id: string;
  jobTitle: string;
  clientName: string;
  location: string;
  createdAt: string;
  employmentType: string;
  paymentType: string;
  price: number;
  status: string;
}

export interface JobStats {
  totalJobs: number;
  jobsByStatus: {
    open: number;
    active: number;
    closed: number;
    completed: number;
  };
  jobsByPaymentType: {
    hourly: number;
    fixedPrice: number;
    retainer: number;
  };
  recentJobs: number;
}


// # ============ CONTRACT ============ # 


// Contract Stats
export interface ContractStats {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  disputedContracts: number;
  averageContractValue: number;
}

// Contract
export interface Contract {
  _id: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
  };
  contractorId: {
    _id: string;
    name: string;
    email: string;
  };
  jobId: {
    _id: string;
    jobTitle: string;
  };
  startDate: Date;
  endDate?: Date;
  totalValue: number;
  amount: string;
  status: 'active' | 'completed' | 'disputed' | 'cancelled';
  paymentStructure: 'milestone' | 'timesheet' | 'retainer' | 'commission';
  milestones?: Milestone[];
  timesheets?: Timesheet[];
  retainer: {
    recurringAmount: number;
  }
}

export interface Milestone {
  name: string;
  amount: number;
  status: 'pending' | 'completed' | 'approved' | 'paid';
  description: string;
}

export interface Timesheet {
  startTime: Date;
  endTime: Date;
  duration: number;
  amount: number;
  status: 'pending' | 'approved' | 'disputed' | 'paid';
}

// Get Contracts Params
export interface GetContractsParams {
  page?: number;
  limit?: number;
  status?: string;
}


// # ============ FEE SETTINGS ============ #
export interface FeeSettings {
  freelancerServiceFee: number;
  clientServiceFee: number;
  minimumWithdrawal: number;
  payoutDelay: number;
}

export interface FeeSettingsResponse {
  success: boolean;
  data: FeeSettings;
  message?: string;
}


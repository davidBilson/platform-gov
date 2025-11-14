export interface WorkHistory {
    id: string;
    title: string;
    department?: string;
    departmentType?: "state" | "federal" | "";
    experienceLevel?: string;
    location?: string;
    fromDate: string;
    toDate: string;
  }
  
  export interface Degree {
    id: string;
    degree: string;
    institution: string;
    yearCompleted: string;
    gpa?: string;
  }
  
  export interface ProfileFormData {
    bio: string;
    ratePerHour: string;
    secondRate?: string;
    primaryPosition?: string;
    profession?: string;
    clearance?: string;
    skills: string[];
    expertise?: string[];
    certifications: string[];
    departments: string[];
    workHistory: WorkHistory[];
    degrees: Degree[];
    profileImage?: File | null;
    profileImageUrl?: string;
    firmAffiliation: string;
    location: {
      country: string;
      state: string;
    };
  }
  
  export interface CreateProfileProps {
    userId: string;
    initialData?: Partial<ProfileFormData>;
    onSuccess?: () => void;
    onCancel?: () => void;
    onPreview?: (data: ProfileFormData) => void;
  }

// /profile/_freelancer/index
export interface WorkHistoryItem {
  jobTitle: string;
  dates: string;
  rating: number;
  amount: string;
}

export interface ProfileData {
  name?: string;
  profileImage?: string;
  primaryPosition?: string;
  profession?: string;
  clearance?: string;
  workHistory?: Array<{
    location?: string;
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
  }>;
  user: {
    bankAccounts: Array<{}>;
    isSubscribed?: boolean;
  },
  ratePerHour?: number;
  secondRate?: number;
  skills?: string[];
  expertise?: string[];
  certifications?: string[];
  bio?: string;
  rating?: number;
  firmAffiliation?: string; // 'independent' or firm name
  location: {
    country: string;
    state: string;
  };
}

export interface FetchResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

// Define props if needed (for future extensibility)
export interface ProfileProps {
  initialProfileId?: string;
}
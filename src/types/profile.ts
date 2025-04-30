// Types for all profile data

export interface WorkHistory {
    id: string;
    title: string;
    department: string;
    departmentType: "state" | "federal" | "";
    experienceLevel: string;
    location: string;
    fromDate: string;
    toDate: string;
  }
  
  export interface Degree {
    id: string;
    degree: string;
    institution: string;
    yearCompleted: string;
  }
  
  export interface ProfileFormData {
    bio: string;
    ratePerHour: string;
    primaryPosition: string;
    skills: string[];
    expertise: string[];
    certifications: string[];
    workHistory: WorkHistory[];
    degrees: Degree[];
    profileImage?: File | null;
    profileImageUrl?: string;
    firmAffiliation: string; // 'independent' or firm name
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
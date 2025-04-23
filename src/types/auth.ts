// @/types/auth.ts

export type UserType = 'contractor' | 'client';

export interface SignupFormData {
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  userId?: string;
}

export interface SignupApiResponse {
  status: string;
  message: string;
  data?: {
    name?: string;
    role?: string;
    userId: string;
    email?: string;
    phoneNumber?: string;
  };
}

export interface ErrorResponse {
  message?: string;
}

// ✅ SignIn Specific Types

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignInApiResponse {
  status: string;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      phoneNumber: string;
      role: UserType;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    };
  };
}

// ✅ Unified AuthStore type for both SignUp and SignIn
export interface AuthStore {
  setFormData: (data: {
    role?: UserType;
    name?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    userId?: string;
  }) => void;
  setUserId: (id: string) => void;
  setVerificationStep?: (step: string) => void;
  setEmailVerified?: (status: boolean) => void;
  setPhoneVerified?: (status: boolean) => void;
}


export type role = 'contractor' | 'client' | 'admin' | 'superadmin';

// ************* SIGN UP *************
export interface SignupFormData {
  role: role;
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

// ************* SIGN IN *************

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
      role: role;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      isSuspended?: boolean;
      isHighPriority?: boolean;
    };
  };
}

export interface SignInResponse {
  success: boolean;
  data?: {
    user: {
      _id: string;
      name: string;
      role: role;
      email: string;
      phoneNumber: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      isSuspended?: boolean;
      isHighPriority?: boolean;
      isSubscribed?: boolean;
    };
  };
  error?: string;
}

export type UserType = 'contractor' | 'client' | 'admin';

// ************* SIGN UP *************
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
      role: UserType;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    };
  };
}

export interface SignInResponse {
  success: boolean;
  data?: {
    user: {
      _id: string;
      name: string;
      role: UserType;
      email: string;
      phoneNumber: string;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    };
  };
  error?: string;
}
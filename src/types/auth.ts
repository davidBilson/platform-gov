export type UserType = 'contractor' | 'client';

export interface FormData {
    userType: UserType;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
}

export interface FormErrors {
    email: string;
    phone_number: string;
    password: string;
}

export interface SignupResponse {
    success: boolean;
    message: string;
}
/**
 * Vetting System TypeScript Types
 */

export type VetterStatus = 'pending' | 'confirmed' | 'rejected';

export interface Vetter {
    _id: string;
    consultant: string;
    name: string;
    email: string;
    linkedinUrl: string;
    status: VetterStatus;
    confirmationToken?: string;
    confirmationTokenExpiry?: string;
    confirmationTimestamp?: string;
    reminderSentAt?: string;
    reminderCount: number;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface VettingStatus {
    profileStatus: 'pending' | 'active' | 'suspended';
    profileActive: boolean;
    confirmedCount: number;
    pendingCount: number;
    rejectedCount: number;
    totalCount: number;
    vettingCount: number;
}

export interface AddVetterRequest {
    consultantId: string;
    name: string;
    email: string;
    linkedinUrl?: string;
}

export interface AddVetterResponse {
    success: boolean;
    message: string;
    data: {
        vetter: {
            _id: string;
            name: string;
            email: string;
            status: VetterStatus;
            createdAt: string;
        };
    };
}

export interface VettingStatusResponse {
    success: boolean;
    data: VettingStatus;
}

export interface VettersResponse {
    success: boolean;
    count: number;
    data: Vetter[];
}

export interface ConfirmVettingResponse {
    success: boolean;
    message: string;
    data: {
        consultantName: string;
        wasActivated: boolean;
        confirmedCount: number;
    };
}

export interface RejectVettingResponse {
    success: boolean;
    message: string;
    data: {
        consultantName: string;
    };
}

export interface VetterByTokenResponse {
    success: boolean;
    data: {
        vetter: {
            _id: string;
            name: string;
            status: VetterStatus;
            isTokenValid: boolean;
        };
        consultant: {
            name: string;
            profile: {
                bio?: string;
                primaryPosition?: string;
                profession?: string;
                location?: {
                    country: string;
                    state: string;
                };
                profileImage?: string;
            };
        };
    };
}

export interface VettingFormData {
    name: string;
    email: string;
    linkedinUrl: string;
}








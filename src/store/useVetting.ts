/**
 * Vetting Zustand Store
 * Manages vetting-related state across the application
 */

import { create } from 'zustand';
import { Vetter, VettingStatus } from '@/types/vetting';
import {
    getMyVetters,
    getVettingStatus,
    addVetter as addVetterApi,
    removeVetter as removeVetterApi,
    resendVettingEmail as resendVettingEmailApi
} from '@/api/vetting-api';
import { AddVetterRequest } from '@/types/vetting';

interface VettingState {
    // State
    vetters: Vetter[];
    vettingStatus: VettingStatus | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchVetters: (consultantId: string) => Promise<void>;
    fetchVettingStatus: (consultantId: string) => Promise<void>;
    addVetter: (data: AddVetterRequest) => Promise<void>;
    removeVetter: (vetterId: string, consultantId: string) => Promise<void>;
    resendVettingEmail: (vetterId: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    vetters: [],
    vettingStatus: null,
    isLoading: false,
    error: null
};

export const useVettingStore = create<VettingState>((set, get) => ({
    ...initialState,

    fetchVetters: async (consultantId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getMyVetters(consultantId);
            set({ vetters: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch vetters',
                isLoading: false
            });
            throw error;
        }
    },

    fetchVettingStatus: async (consultantId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await getVettingStatus(consultantId);
            set({ vettingStatus: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch vetting status',
                isLoading: false
            });
            throw error;
        }
    },

    addVetter: async (data: AddVetterRequest) => {
        set({ isLoading: true, error: null });
        try {
            await addVetterApi(data);
            // Refresh vetters list after adding
            await get().fetchVetters(data.consultantId);
            // Refresh status
            await get().fetchVettingStatus(data.consultantId);
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to add vetter',
                isLoading: false
            });
            throw error;
        }
    },

    removeVetter: async (vetterId: string, consultantId: string) => {
        set({ isLoading: true, error: null });
        try {
            await removeVetterApi(vetterId, consultantId);
            // Refresh vetters list after removing
            await get().fetchVetters(consultantId);
            // Refresh status
            await get().fetchVettingStatus(consultantId);
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to remove vetter',
                isLoading: false
            });
            throw error;
        }
    },

    resendVettingEmail: async (vetterId: string) => {
        set({ isLoading: true, error: null });
        try {
            await resendVettingEmailApi(vetterId);
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Failed to resend email',
                isLoading: false
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    reset: () => set(initialState)
}));




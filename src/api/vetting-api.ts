/**
 * Vetting API Functions
 * Handles all API calls related to the vetting system
 */

import axios from 'axios';
import {
    AddVetterRequest,
    AddVetterResponse,
    VettingStatusResponse,
    VettersResponse,
    ConfirmVettingResponse,
    RejectVettingResponse,
    VetterByTokenResponse
} from '@/types/vetting';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

/**
 * Add a new vetter for a consultant
 */
export const addVetter = async (data: AddVetterRequest): Promise<AddVetterResponse> => {
    try {
        const response = await axios.post<AddVetterResponse>(
            `${API_BASE_URL}/api/vetting/add-vetter`,
            data
        );
        return response.data;
    } catch (error: any) {
        console.error('Error adding vetter:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to add vetter. Please try again.'
        );
    }
};

/**
 * Get all vetters for a consultant
 */
export const getMyVetters = async (consultantId: string): Promise<VettersResponse> => {
    try {
        const response = await axios.get<VettersResponse>(
            `${API_BASE_URL}/api/vetting/my-vetters/${consultantId}`
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching vetters:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to fetch vetters. Please try again.'
        );
    }
};

/**
 * Get vetting status for a consultant
 */
export const getVettingStatus = async (consultantId: string): Promise<VettingStatusResponse> => {
    try {
        const response = await axios.get<VettingStatusResponse>(
            `${API_BASE_URL}/api/vetting/status/${consultantId}`
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching vetting status:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to fetch vetting status. Please try again.'
        );
    }
};

/**
 * Confirm vetting (public endpoint)
 */
export const confirmVetting = async (token: string): Promise<ConfirmVettingResponse> => {
    try {
        const response = await axios.post<ConfirmVettingResponse>(
            `${API_BASE_URL}/api/vetting/confirm/${token}`
        );
        return response.data;
    } catch (error: any) {
        console.error('Error confirming vetting:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to confirm vetting. Please try again.'
        );
    }
};

/**
 * Reject vetting (public endpoint)
 */
export const rejectVetting = async (token: string, reason?: string): Promise<RejectVettingResponse> => {
    try {
        const response = await axios.post<RejectVettingResponse>(
            `${API_BASE_URL}/api/vetting/reject/${token}`,
            { reason }
        );
        return response.data;
    } catch (error: any) {
        console.error('Error rejecting vetting:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to reject vetting. Please try again.'
        );
    }
};

/**
 * Remove a vetter
 */
export const removeVetter = async (vetterId: string, consultantId: string): Promise<void> => {
    try {
        await axios.delete(
            `${API_BASE_URL}/api/vetting/remove-vetter/${vetterId}`,
            { data: { consultantId } }
        );
    } catch (error: any) {
        console.error('Error removing vetter:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to remove vetter. Please try again.'
        );
    }
};

/**
 * Resend vetting email
 */
export const resendVettingEmail = async (vetterId: string): Promise<void> => {
    try {
        await axios.post(
            `${API_BASE_URL}/api/vetting/resend-email/${vetterId}`
        );
    } catch (error: any) {
        console.error('Error resending vetting email:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to resend email. Please try again.'
        );
    }
};

/**
 * Get vetter by token (for public confirmation page)
 */
export const getVetterByToken = async (token: string): Promise<VetterByTokenResponse> => {
    try {
        const response = await axios.get<VetterByTokenResponse>(
            `${API_BASE_URL}/api/vetting/vetter-by-token/${token}`
        );
        return response.data;
    } catch (error: any) {
        console.error('Error fetching vetter by token:', error);
        throw new Error(
            error.response?.data?.message ||
            'Invalid or expired vetting link.'
        );
    }
};








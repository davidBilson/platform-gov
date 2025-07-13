// 🚀 Optimized API Functions for React Query
// Clean separation of concerns - API functions don't handle toasts or UI state

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  admins?: T;
  user?: T;
  error?: string;
}

export interface AddAdminRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'superadmin';
}

// 🎯 FETCH ALL ADMINS
export const getAllAdmins = async (superAdminId: string): Promise<ApiResponse<Admin[]>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${process.env.NEXT_PUBLIC_GET_ALL_ADMINS}?adminId=${superAdminId}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch admins');
    }
    
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admins');
    }
    throw new Error('An unexpected error occurred while fetching admins');
  }
};

// 🎯 ADD NEW ADMIN
export const addAdmin = async (
  adminData: AddAdminRequest,
  superAdminId: string
): Promise<ApiResponse<Admin>> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${process.env.NEXT_PUBLIC_ADD_NEW_ADMIN}?adminId=${superAdminId}`,
      adminData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to add admin');
    }
    
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add admin');
    }
    throw new Error('An unexpected error occurred while adding admin');
  }
};

// 🎯 REMOVE ADMIN
export const removeAdmin = async (
  adminId: string,
  superAdminId: string
): Promise<ApiResponse<Admin>> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_REMOVE_ADMIN?.replace(':id', adminId);
    const response = await axios.delete(
      `${API_BASE_URL}${endpoint}?adminId=${superAdminId}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove admin');
    }
    
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to remove admin');
    }
    throw new Error('An unexpected error occurred while removing admin');
  }
};

// 🎯 TOGGLE SUSPEND ADMIN
export const toggleSuspendAdmin = async (
  adminId: string,
  superAdminId: string
): Promise<ApiResponse<Admin>> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_TOGGLE_SUSPEND_ADMIN?.replace(':id', adminId);
    const response = await axios.put(
      `${API_BASE_URL}${endpoint}?adminId=${superAdminId}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to toggle admin suspension');
    }
    
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to toggle admin suspension');
    }
    throw new Error('An unexpected error occurred while updating admin status');
  }
};
import axios from 'axios';
import { GetUsersResponse, GetUsersParams, GetJobParams, Job, JobStats, ContractStats, 
  Contract, 
  GetContractsParams,  
  FeeSettings,
  FeeSettingsResponse} from '@/types/admin';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const adminId = process.env.NEXT_PUBLIC_AUTHORIZED

// # ============ USERS ============ # 

export const getAllUsers = async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (adminId) {
      queryParams.append('adminId', adminId);
    }
    
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.role) {
      queryParams.append('role', params.role);
    }
    
    if (params.search) {
      queryParams.append('search', params.search);
    }

    const endpoint = process.env.NEXT_PUBLIC_GET_ALL_USERS;
    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data as GetUsersResponse;
  } catch (error) {
    console.error('Error fetching users:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
    
    throw error;
  }
};

export const getUserStats = async (): Promise<{
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    usersByRole: {
      contractors: number;
      clients: number;
      admins: number;
    };
    verification: {
      verifiedEmails: number;
      verifiedPhones: number;
    };
    recentUsers: number;
  };
}> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_USER_STATS;
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
    }
    
    throw error;
  }
};

export const toggleUserPriority = async (userId: string, isHighPriority: boolean) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_TOGGLE_PRIORITY?.replace(':id', userId);
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.put(url, { isHighPriority });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
};

export const toggleUserSuspend = async (userId: string, isSuspended: boolean) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_TOGGLE_SUSPEND?.replace(':id', userId);
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.put(url, { isSuspended });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
    }

  }
};

export const deleteUser = async (userId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_DELETE_USER?.replace(':id', userId);
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_USER_PROFILE?.replace(':id', userId);
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
};

// # ============ JOBS ============ # 

export const getJobStats = async (): Promise<{
  success: boolean;
  message: string;
  data: JobStats;
}> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_JOB_STATS;
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.get(url, {
      headers: {'Content-Type': 'application/json'},
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching job stats:', error);
    throw error;
  }
};

export const getAllJobs = async (params: GetJobParams = {}): Promise<{
  success: boolean;
  message: string;
  data: Job[];
}> => {
  try {
    const queryParams = new URLSearchParams();
    if (adminId) {
      queryParams.append('adminId', adminId);
    }
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }

    const endpoint = process.env.NEXT_PUBLIC_GET_ALL_JOBS;
    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

    const response = await axios.get(url, {
      headers: {'Content-Type': 'application/json'},
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};


// # ============ CONTENT ============ # 

// Helper to add adminId to requests
const withAdminId = (data = {}) => ({
  ...data,
  adminId
});

// Content Categories
export const createCategory = async (data: { name: string; label: string }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${process.env.NEXT_PUBLIC_CREATE_CATEGORY}`,
      withAdminId(data)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_DELETE_CATEGORY?.replace(':id', id);
    const response = await axios.delete(
      `${API_BASE_URL}${endPoint}`,
      { data: withAdminId() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${process.env.NEXT_PUBLIC_GET_ALL_CATEGORIES}`,
      { params: withAdminId() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Content Items
export const createItem = async (categoryId: string, value: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${process.env.NEXT_PUBLIC_CREATE_ITEM}`,
      withAdminId({ categoryId, value })
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (id: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_DELETE_ITEM?.replace(':id', id);
    const response = await axios.delete(
      `${API_BASE_URL}${endPoint}`,
      { data: withAdminId() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getItemsByCategory = async (categoryId: string) => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_GET_ITEMS_BY_CATEGORY?.replace(':id', categoryId);
    const response = await axios.get(
      `${API_BASE_URL}${endPoint}`,
      { params: withAdminId() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Content Stats
export const getContentStats = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${process.env.NEXT_PUBLIC_GET_CONTENT_STATS}`,
      { params: withAdminId() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============ CONTRACTS ============
export const getContractStats = async (): Promise<{
  success: boolean;
  message: string;
  data: ContractStats;
}> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_CONTRACT_STATS;
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.get(url, {
      headers: {'Content-Type': 'application/json'},
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching contract stats:', error);
    throw error;
  }
};

export const getAllContracts = async (params: GetContractsParams = {}): Promise<{
  success: boolean;
  message: string;
  data: {
    contracts: Contract[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalContracts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}> => {
  try {
    const queryParams = new URLSearchParams();
    if (adminId) {
      queryParams.append('adminId', adminId);
    }
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }

    const endpoint = process.env.NEXT_PUBLIC_GET_ALL_CONTRACTS;
    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

    const response = await axios.get(url, {
      headers: {'Content-Type': 'application/json'},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};

// ============ FEE SETTINGS ============
export const getFeeSettings = async () => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_FEE_SETTINGS;
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFeeSettings = async (settings: FeeSettings): Promise<FeeSettingsResponse> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_UPDATE_FEE_SETTINGS;
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.put(url, settings, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.status === 200) {
      toast.success('Saved successfully');
    }
    
    return response.data;
  } catch (error) {
    toast.error('Failed to save settings');
    console.log(error);
    throw error; // Re-throw to handle in calling code
  }
};

// ============ DASHBOARD ============

export const getDashboardData = async () => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_DASHBOARD_DATA;
    const url = `${API_BASE_URL}${endpoint}?adminId=${adminId}`;

    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
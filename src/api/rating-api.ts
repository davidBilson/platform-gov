// src/services/ratingService.ts
import axios from 'axios';

interface Rating {
  _id?: string;
  contractId: string;
  jobId: string;
  reviewer: string;
  reviewee: string;
  role: 'client' | 'contractor';
  rating: number;
  comments?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateRatingParams {
  contractId: string;
  jobId: string;
  reviewee: string;
  reviewer: string;
  role: 'client' | 'contractor';
  rating: number;
  comments?: string;
}

interface UpdateRatingParams {
  id: string;
  rating?: number;
  comments?: string;
  userId: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Create a new rating
export const createRating = async (params: CreateRatingParams): Promise<Rating> => {
  try {
    const response = await axios.post(`${BASE_URL}${process.env?.NEXT_PUBLIC_CREATE_NEW_RATING}`, params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create rating');
    }
    throw new Error('Failed to create rating');
  }
};

// Get all ratings for a user
export const getUserRatings = async (userId: string, role?: 'client' | 'contractor'): Promise<Rating[]> => {
  try {
    let url = `${BASE_URL}${process.env.NEXT_PUBLIC_GET_USER_RATINGS?.replace(':id', userId)}`;
    if (role) {
      url += `?role=${role}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user ratings');
    }
    throw new Error('Failed to fetch user ratings');
  }
};

// Get a specific rating by ID
export const getRatingById = async (id: string): Promise<Rating> => {
  try {
    const response = await axios.get(`${BASE_URL}${process.env.NEXT_PUBLIC_GET_RATING_BY_ID?.replace(':id', id)}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rating');
    }
    throw new Error('Failed to fetch rating');
  }
};

// Update a rating
export const updateRating = async (params: UpdateRatingParams): Promise<Rating> => {
  try {
    const response = await axios.put(`${BASE_URL}${process.env.NEXT_PUBLIC_UPDATE_RATING?.replace(':id', params.id)}`, {
      rating: params.rating,
      comments: params.comments,
      userId: params.userId
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update rating');
    }
    throw new Error('Failed to update rating');
  }
};

// Delete a rating
export const deleteRating = async (id: string, userId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}${process.env.NEXT_PUBLIC_DELETE_RATING?.replace(':id', id)}`, {
      params: { userId }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete rating');
    }
    throw new Error('Failed to delete rating');
  }
};

// Get ratings for a contract
export const getContractRatings = async (contractId: string): Promise<Rating[]> => {
  try {
    const response = await axios.get(`${BASE_URL}${process.env.NEXT_PUBLIC_GET_CONTRACT_RATINGS?.replace(':id', contractId)}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch contract ratings');
    }
    throw new Error('Failed to fetch contract ratings');
  }
};

// Get ratings for a job
export const getJobRatings = async (jobId: string): Promise<Rating[]> => {
  try {
    const response = await axios.get(`${BASE_URL}${process.env.NEXT_PUBLIC_GET_JOB_RATINGS?.replace(':id', jobId)}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch job ratings');
    }
    throw new Error('Failed to fetch job ratings');
  }
};
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const addMilestone = async (contractId, milestoneData, userId) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_ADD_MILESTONE
      .replace(':id', contractId);
    
    const requestBody = {
      ...milestoneData,
      userId
    };

    const response = await axios.post(
      `${baseURL}${endpoint}`,
      requestBody
    );
    
    toast.success('Milestone added successfully!');
    return response.data;
    
  } catch (error) {
    console.error('Error adding milestone:', error);
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to add milestone');
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};

export const getMilestones = async (contractId) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_MILESTONES
      .replace(':id', contractId);
    
    const response = await axios.get(
      `${baseURL}${endpoint}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};


/**
 * Get a single milestone
 */
export const getMilestone = async (contractId, milestoneId) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_MILESTONE
      .replace(':contractId', contractId)
      .replace(':milestoneId', milestoneId);
    
    const response = await axios.get(
      `${baseURL}${endpoint}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching milestone:', error);
    throw error;
  }
};

/**
 * Mark milestone as completed (contractor only)
 */
export const completeMilestone = async (contractId, milestoneId) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_COMPLETE_MILESTONE
      .replace(':contractId', contractId)
      .replace(':milestoneId', milestoneId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`
    );
    toast.success('Milestone marked as completed!');
    return response.data;
  } catch (error) {
    console.error('Error completing milestone:', error);
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to complete milestone');
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};

/**
 * Approve milestone (client only)
 */
export const approveMilestone = async (contractId, milestoneId) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPROVE_MILESTONE
      .replace(':contractId', contractId)
      .replace(':milestoneId', milestoneId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`
    );
    toast.success('Milestone approved!');
    return response.data;
  } catch (error) {
    console.error('Error approving milestone:', error);
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to approve milestone');
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};

/**
 * Mark milestone as paid (client only)
 */
export const markMilestonePaid = async (contractId, milestoneId) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_MARK_MILESTONE_PAID
      .replace(':contractId', contractId)
      .replace(':milestoneId', milestoneId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`
    );
    toast.success('Milestone marked as paid!');
    return response.data;
  } catch (error) {
    console.error('Error marking milestone as paid:', error);
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to mark milestone as paid');
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};

/**
 * Dispute milestone (client or contractor)
 */
export const disputeMilestone = async (contractId, milestoneId, reason) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_DISPUTE_MILESTONE
      .replace(':contractId', contractId)
      .replace(':milestoneId', milestoneId);
    
    const response = await axios.put(
      `${baseURL}${endpoint}`,
      { reason }
    );
    toast.success('Milestone disputed!');
    return response.data;
  } catch (error) {
    console.error('Error disputing milestone:', error);
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.message || 'Failed to dispute milestone');
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};
import axios from "axios";
import { ProfileFormData } from "@/types/profile";
import { prepareDataForSubmission } from "@/utils/profile-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Base URL for all profile endpoints

// Fetch the current user's profile
export const fetchProfile = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me?userId=${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { success: false, message: "Profile not found" };
    }
    throw error;
  }
};

// Save profile (create or update)
export const saveProfile = async (formData: ProfileFormData, userId: string, profileId: string | null) => {
  const apiData = await prepareDataForSubmission(formData, userId);
  
  if (profileId) {
    // Update existing profile
    return await axios.put(`${API_BASE_URL}/update/${profileId}`, apiData);
  } else {
    // Create new profile
    return await axios.post(`${API_BASE_URL}/create`, apiData);
  }
};

// Fetch suggestions for skills, expertise, and certifications
export const fetchSuggestions = async (type: 'skills' | 'expertise' | 'certifications') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${type}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
};
import axios from 'axios';
import { ProfileFormData } from "@/types/profile";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export const fetchProfile = async (userId: string) => {
  try {
    // Use the environment variable for the endpoint
    const endpoint = process.env.NEXT_PUBLIC_FETCH_CONTRACTOR_PROFILE?.replace(':id', userId) || `/api/profile/${userId}`;
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    // throw error;
  }
};

export const saveProfile = async (formData: ProfileFormData, userId: string, profileId: string | null) => {
  try {

    const profileData = {
      userId: userId,
      bio: formData.bio,
      profileImage: formData.profileImageUrl,
      ratePerHour: formData.ratePerHour,
      primaryPosition: formData.primaryPosition,
      skills: formData.skills,
      expertise: formData.expertise,
      certifications: formData.certifications,
      workHistory: formData.workHistory,
      degrees: formData.degrees,
      firmAffiliation: formData.firmAffiliation || '', // Add this line
      location: formData.location || { country: '', state: '' }, // Add this line
    };
    
    let response;
    

    if (profileId) {
      // Update existing profile
      const updateEndpoint = process.env.NEXT_PUBLIC_UPDATE_CONTRACTOR_PROFILE?.replace(':id', userId);
      response = await axios.put(`${API_BASE_URL}${updateEndpoint}`, profileData);
    } else {
      // Create new profile
      const createEndpoint = process.env.NEXT_PUBLIC_CREATE_CONTRACTOR_PROFILE;
      response = await axios.post(`${API_BASE_URL}${createEndpoint}`, profileData);
    }
    
    return response;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};


export const fetchProfilePicture = async (id: string): Promise<string> => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GET_PROFILE_PIC?.replace(':id', id);
    if (!endpoint) throw new Error('Endpoint not configured');
    
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);

    if (response?.data?.success) {
      return response?.data?.data;
    }
   
    return '';
  } catch (error) {
    console.error('Error fetching client profile picture:', error);
    return '';
  }
};
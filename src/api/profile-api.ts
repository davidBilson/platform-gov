import axios from 'axios';
import { ProfileFormData } from "@/types/profile";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Fetch user profile by userId
 * @param {string} userId - User ID
 * @returns {Promise} - Profile data response
 */
export const fetchProfile = async (userId: string) => {
  try {
    // Use the environment variable for the endpoint
    const endpoint = process.env.NEXT_PUBLIC_GET_PROFILE?.replace(':id', userId) || `/api/profile/${userId}`;
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Save profile (create or update)
 * @param {object} formData - Profile form data
 * @param {string} userId - User ID
 * @param {string|null} profileId - Profile ID (if exists)
 * @returns {Promise} - Save response
 */
export const saveProfile = async (formData: ProfileFormData, userId: string, profileId: string | null) => {
  try {
    // Prepare data for API
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
      degrees: formData.degrees
    };
    
    let response;
    
    // Determine if creating or updating
    if (profileId) {
      // Update existing profile
      const updateEndpoint = process.env.NEXT_PUBLIC_UPDATE_PROFILE?.replace(':id', userId) || 
                            `/api/profile/update/${userId}`;
      response = await axios.put(`${API_BASE_URL}${updateEndpoint}`, profileData);
    } else {
      // Create new profile
      const createEndpoint = process.env.NEXT_PUBLIC_CREATE_PROFILE || '/api/profile/create';
      response = await axios.post(`${API_BASE_URL}${createEndpoint}`, profileData);
    }
    
    return response;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

/**
 * Helper mock data for UI development
 */
export const skillsList = [
  "JavaScript", "React", "Node.js", "Python", "Java", "C#", "AWS", "Azure", 
  "Docker", "Kubernetes", "Database Design", "SQL", "MongoDB", "REST API", 
  "GraphQL", "TypeScript", "Redux", "Git", "CI/CD", "Project Management"
];

export const expertiseList = [
  "Frontend Development", "Backend Development", "Full Stack Development", 
  "DevOps", "Cloud Engineering", "Data Science", "Machine Learning", 
  "UI/UX Design", "Mobile Development", "Enterprise Architecture", 
  "Security", "Quality Assurance", "Agile Methodology", "Scrum Master", 
  "Technical Lead", "Solution Architecture"
];

export const certificationsList = [
  "AWS Certified Solutions Architect", "Microsoft Certified: Azure Developer Associate", 
  "Google Cloud Professional Cloud Architect", "Certified Kubernetes Administrator (CKA)", 
  "Certified Information Systems Security Professional (CISSP)", "PMP", "ITIL", 
  "Scrum Master", "Cisco CCNA", "CompTIA Security+", "Oracle Certified Professional", 
  "Salesforce Certified Developer", "Certified Ethical Hacker (CEH)"
];
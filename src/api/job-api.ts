// services/job-api.ts
import axios from 'axios';
import { Jobs } from '@/types/jobs';
import { JobApplicationsResponse } from '@/types/proposals';

interface JobApiResponse {
  success: boolean;
  data: Jobs;
  message?: string;
}

export const fetchJob = async (jobId: string): Promise<Jobs | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const endpoint = process.env.NEXT_PUBLIC_GET_SINGLE_JOB?.replace(':id', jobId) || '';
    
    const response = await axios.get<JobApiResponse>(`${baseUrl}${endpoint}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch job details');
  } catch (err) {
    console.error('Error fetching job details:', err);
    return null;
  }
};

export const fetchJobApplications = async (jobId: string): Promise<JobApplicationsResponse | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const endpoint = process.env.NEXT_PUBLIC_GET_JOB_APPLICATIONS_BY_JOB_ID?.replace(':id', jobId) || '';
    
    const response = await axios.get<JobApplicationsResponse>(`${baseUrl}${endpoint}`);
    
    return response.data.success ? response.data : null;
  } catch (err) {
    console.error('Error fetching job applications:', err);
    return null;
  }
};
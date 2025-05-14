// services/job-api.ts
import axios from 'axios';
import { Jobs } from '@/types/jobs';
import { JobApplicationsResponse } from '@/types/proposals';

interface JobApiResponse {
  success: boolean;
  data: Jobs;
  message?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

export const fetchJob = async (jobId: string): Promise<Jobs | null> => {
  try {
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
    const endpoint = process.env.NEXT_PUBLIC_GET_JOB_APPLICATIONS_BY_JOB_ID?.replace(':id', jobId) || '';
    
    const response = await axios.get<JobApplicationsResponse>(`${baseUrl}${endpoint}`);
    
    return response.data.success ? response.data : null;
  } catch (err) {
    console.error('Error fetching job applications:', err);
    return null;
  }
};

// fetch proposal/application
export const fetchApplication = async (applicationId: string): Promise<JobApplicationsResponse | null> => {
  // First validate the applicationId
  if (!applicationId || typeof applicationId !== 'string') {
    console.error('Invalid application ID');
    return null;
  }

  try {
    if (!baseUrl) {
      console.error('Base URL not configured');
      return null;
    }

    const endpointTemplate = process.env.NEXT_PUBLIC_GET_JOB_APPLICATION_BY_ID;
    if (!endpointTemplate) {
      console.error('Endpoint template not configured');
      return null;
    }

    const endpoint = endpointTemplate.replace(':id', applicationId);
    const url = `${baseUrl}${endpoint}`;

    // Add timeout and validate URL
    if (!url.startsWith('http')) {
      console.error('Invalid API URL');
      return null;
    }

    const response = await axios.get<JobApplicationsResponse>(url, {
      timeout: 10000, // 10 second timeout
      validateStatus: (status) => status >= 200 && status < 500 // Accept 400-499 as valid responses
    });

    if (!response.data?.success) {
      console.error('API request failed:', response.data?.message || 'Unknown error');
      return null;
    }

    return response.data;
  } catch (err) {
    // More detailed error logging
    if (axios.isAxiosError(err)) {
      console.error(
        'API Error:',
        err.response?.status,
        err.response?.data?.message || err.message
      );
    } else {
      console.error('Unexpected error:', err);
    }
    return null;
  }
};

export const updateJobStatus = async (userId:string, jobId:string | null, status:string) => {
  try {
    if (!userId || !jobId || !status) {
      console.error('Missing required parameters');
      return;
    }

    const endPointTemplate = process.env.NEXT_PUBLIC_UPDATE_JOB_STATUS ?? '';
    const endPoint = endPointTemplate.replace(':id', userId);

    const response = await axios.put(
      `${baseUrl}${endPoint}`,
      { jobId, status },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
  }
};
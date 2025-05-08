import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const trackJobStatus = async (jobId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${process.env.NEXT_PUBLIC_TRACK_JOB_STATUS}/${jobId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error tracking job status:', error);
    }
};

export const trackHiringStatus = async (params: {
    jobId: string;
    contractorId: string;
    clientId: string;
  }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${process.env.NEXT_PUBLIC_TRACK_HIRING_STATUS}`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error tracking hiring status:', error);
    }
};

export const trackJobApplicationStatus = async (params: {
    jobId: string;
    freelancerId: string;
    applicationId: string;
  }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${process.env.NEXT_PUBLIC_TRACK_JOB_APPLICATION_STATUS}`,
        { params }
      );
      return response.data.applicationStatus;
    } catch (error) {
      console.error('Error tracking job application status:', error);
    }
};

export const updateJobApplicationStatus = async (data: {
    applicationId: string | null;
    status: string;
  }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}${process.env.NEXT_PUBLIC_UPDATE_JOB_APPLICATION_STATUS}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating job application status:', error);
    }
};
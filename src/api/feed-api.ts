import axios from 'axios';
import { ContractorApiResponse, ContractorProfile } from '@/types/contractors';

export const fetchContractors = async (): Promise<ContractorProfile[]> => {
  try {
    const response = await axios.get<ContractorApiResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FETCH_ALL_CONTRACTORS}`
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch contractors - API returned unsuccessful response');
    }
  } catch (error) {
    console.error('Error fetching contractors:', error);
    throw new Error('Failed to fetch contractors');
  }
};
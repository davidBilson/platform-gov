import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export const fetchConversations = async (userId: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_FETCH_CONVERSATIONS?.replace(':id', userId)
    const { data } = await axios.get(`${baseURL}${endpoint}`);
    return data.conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};
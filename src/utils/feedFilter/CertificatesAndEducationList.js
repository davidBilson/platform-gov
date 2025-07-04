import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getContentCategories = async () => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_CONTENT_CATEGORIES
    const response = await axios.get(`${API_BASE_URL}${endPoint}`);
    const values = response.data.data.certificatesAndEducation.map(item => item.value);
    return values;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export let certificatesAndEducationList = [];

getContentCategories().then(data => {
    certificatesAndEducationList = data;
});


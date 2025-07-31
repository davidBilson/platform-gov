import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getContentCategories = async () => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_CONTENT_CATEGORIES
    const response = await axios.get(`${API_BASE_URL}${endPoint}`);

    const values = response.data.data.professionalFieldsAndAreasOfExpertise
      .sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      })
      .map(item => item.value)
      .filter((value, index, array) => array.indexOf(value) === index);
      
    return values;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export let ProfessionalFieldsAndAreasOfExpertise152 = [];

getContentCategories().then(data => {
  ProfessionalFieldsAndAreasOfExpertise152 = data;
});
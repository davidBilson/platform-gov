import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getContentCategories = async () => {
  try {
    const endPoint = process.env.NEXT_PUBLIC_CONTENT_CATEGORIES
    const response = await axios.get(`${API_BASE_URL}${endPoint}`);

    const values = response.data.data.governmentDepartmentsAndAgencies
      .sort((a, b) => {
        const aIsUS = a.value.startsWith('US –') ? 0 : a.value.startsWith('Canada') ? 1 : 2;
        const bIsUS = b.value.startsWith('US –') ? 0 : b.value.startsWith('Canada') ? 1 : 2;

        if (aIsUS !== bIsUS) {
          return aIsUS - bIsUS;
        }

        return a.sortOrder - b.sortOrder;
      })
      .map(item => item.value);

    return values;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export let GovernmentDepartmentsAndAgenciesByCountry = [];

getContentCategories().then(data => {
  GovernmentDepartmentsAndAgenciesByCountry = data;
});
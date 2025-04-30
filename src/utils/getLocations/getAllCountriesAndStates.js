import axios from 'axios';

export const getSpecificCountryStates = async () => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/states');
    const { data } = response.data;
    
    const countryMap = {
      'United States': 'US',
      'Australia': 'AU',
      'Canada': 'CA',
      'United Kingdom': 'GB'
    };
    
    const result = [];
    
    data.forEach(country => {
      const countryCode = countryMap[country.name];
      if (countryCode && country.states) {
        country.states.forEach(state => {
          result.push([state.name, countryCode]);
        });
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching country states:', error);
    return [];
  }
};

export const getUSStates = async () => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/states');
    const { data } = response.data;
    
    const usData = data.find(country => country.name === 'United States');
    
    if (!usData?.states) {
      return [];
    }
    
    return usData.states.map(state => state.name);
  } catch (error) {
    console.error('Error fetching US states:', error);
    return [];
  }
};

export const getAllCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    return response.data
      .map(country => country.name.common)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};
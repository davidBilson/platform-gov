import axios from 'axios';
import { allCountries } from '../feedFilter/allCountries';

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
    
    // Start with general location options
    const result = [
      ["US countrywide", "US"],
      ["Canada countrywide", "CA"],
      ["UK countrywide", "GB"],
      ["Remote", "REMOTE"],
      ["Not location specific", "ANY"]
    ];
    
    // Add specific states/provinces
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
    // Return at least the general options even if API fails
    return [
      ["US countrywide"],
      ["Canada countrywide", "CA"],
      ["UK countrywide", "GB"],
      ["Remote", "REMOTE"],
      ["Not location specific", "ANY"]
    ];
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
    return allCountries .sort((a, b) => a.localeCompare(b));
};
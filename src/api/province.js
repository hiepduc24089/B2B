import { getData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Fetch all provinces
export const fetchProvinces = async () => {
  try {
    const response = await getData(apiURL.provinces);
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
};

// Fetch districts by province ID
export const fetchDistricts = async (province_id) => {
  try {
    const response = await getData(apiURL.districts(province_id));
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

// Fetch wards by district ID
export const fetchWards = async (district_id) => {
  try {
    const response = await getData(apiURL.wards(district_id));
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
};

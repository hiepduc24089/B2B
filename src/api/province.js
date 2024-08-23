import axios from 'axios';

const API_HOST = 'https://api-b2b.krmedi.vn';

export const fetchProvinces = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/province`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
};

export const fetchDistricts = async (province_id) => {
  try {
    const response = await axios.get(`${API_HOST}/api/district/${province_id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching district:', error);
    throw error;
  }
};

export const fetchWards = async (district_id) => {
  try {
    const response = await axios.get(`${API_HOST}/api/wards/${district_id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ward:', error);
    throw error;
  }
};

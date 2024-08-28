import axios from 'axios';
import { API_HOST } from '~/config/host';

export const fetchHotDeal = async (page = 1) => {
  try {
    const response = await axios.get(`${API_HOST}/api/deal-hot-today`, {
      params: { page },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hot deal product:', error);
    throw error;
  }
};

export const fetchForYou = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/product-for-you`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching for you product:', error);
    throw error;
  }
};

export const fetchBrand = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/trademark`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching for you product:', error);
    throw error;
  }
};

export const fetchSupplier = async (page = 1) => {
  try {
    const response = await axios.get(`${API_HOST}/api/get-request-supplier`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching supplier data:', error);
    throw error;
  }
};

export const fetchCategory = async (page = 1) => {
  try {
    const response = await axios.get(`${API_HOST}/api/category`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching for you product:', error);
    throw error;
  }
};

// api/store.js
import axios from 'axios';
import { API_HOST } from '~/config/host';

export const createShop = async (shopData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(`${API_HOST}/api/create-shop`, shopData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to create shop:', error);
    throw error;
  }
};

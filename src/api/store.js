import { postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Function to create a new shop
export const createShop = async (shopData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.createShop, shopData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create shop:', error);
    throw error;
  }
};

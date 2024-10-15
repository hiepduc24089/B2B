import { getData, postData } from '~/axios/config';
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

export const getShopByUser = async (shop_id) => {
  try {
    const response = await getData(apiURL.getShopByUser(shop_id));
    return response.data;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

export const getProductByShop = async (shop_id, user_id, page = 1) => {
  try {
    const response = await getData(apiURL.getProductByShop(shop_id, user_id, page));
    return response.data;
  } catch (error) {
    console.error('Error fetching product store:', error);
    throw error;
  }
};

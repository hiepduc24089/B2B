// src/api/product.js
import axios from 'axios';

const API_HOST = 'https://api-b2b.krmedi.vn';

export const fetchProductDetails = async (slug) => {
  try {
    const response = await axios.get(`${API_HOST}/api/detail-product/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchShopDetails = async (shop_id) => {
  try {
    const response = await axios.get(`${API_HOST}/api/detail-shop/${shop_id}`, {});
    return response.data.data;
  } catch (error) {
    console.error('Error fetching shop details:', error);
    throw error;
  }
};

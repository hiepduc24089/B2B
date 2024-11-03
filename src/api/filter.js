import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

export const filterHotDeal = async (categories = [], cities = [], min_price = '', max_price = '', userID) => {
  try {
    const params = new URLSearchParams();

    categories.forEach((category) => {
      params.append('category[]', category);
    });

    cities.forEach((city) => {
      params.append('region[]', city);
    });

    if (min_price) params.append('min_price', min_price);
    if (max_price) params.append('max_price', max_price);
    params.append('user_id', userID);

    const response = await getData(`${apiURL.filterHotDeal}?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error fetching hot deal product:', error);
    throw error;
  }
};

export const filterProduct = async (categories = [], cities = [], min_price = '', max_price = '', userID) => {
  try {
    const params = new URLSearchParams();

    categories.forEach((category) => {
      params.append('category[]', category);
    });

    cities.forEach((city) => {
      params.append('region[]', city);
    });

    if (min_price) params.append('min_price', min_price);
    if (max_price) params.append('max_price', max_price);
    params.append('user_id', userID);

    const response = await getData(`${apiURL.filterProduct}?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const searchAll = async (search = '', userID) => {
  try {
    const params = new URLSearchParams();

    if (search) params.append('search', search);
    params.append('user_id', userID);

    const response = await getData(`${apiURL.searchAll}?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

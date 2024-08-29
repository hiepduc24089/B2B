import { getData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Fetch hot deal products
export const fetchHotDeal = async (page = 1) => {
  try {
    const response = await getData(apiURL.dealHotToday, { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Error fetching hot deal product:', error);
    throw error;
  }
};

// Fetch "For You" products
export const fetchForYou = async () => {
  try {
    const response = await getData(apiURL.productForYou);
    return response.data;
  } catch (error) {
    console.error('Error fetching "For You" product:', error);
    throw error;
  }
};

// Fetch brands
export const fetchBrand = async () => {
  try {
    const response = await getData(apiURL.trademark);
    return response.data;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    throw error;
  }
};

// Fetch suppliers
export const fetchSupplier = async (page = 1) => {
  try {
    const response = await getData(apiURL.getRequestSupplier, { params: { page } });
    return response;
  } catch (error) {
    console.error('Error fetching supplier data:', error);
    throw error;
  }
};

// Fetch categories
export const fetchCategory = async (page = 1) => {
  try {
    const response = await getData(apiURL.category, { params: { page } });
    return response;
  } catch (error) {
    console.error('Error fetching category data:', error);
    throw error;
  }
};

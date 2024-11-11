import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

//Fetch banner
export const fetchBanner = async () => {
  try {
    const response = await getData(apiURL.getBanner);
    return response.data;
  } catch (error) {
    console.error('Error fetching banner:', error);
    throw error;
  }
};

// Fetch hot deal products
export const fetchHotDeal = async (user_id, page = 1) => {
  try {
    const response = await getData(apiURL.dealHotToday, { params: { user_id, page } });
    return response.data;
  } catch (error) {
    console.error('Error fetching hot deal product:', error);
    throw error;
  }
};

// Fetch "For You" products
export const fetchForYou = async (user_id) => {
  try {
    const response = await getData(apiURL.productForYou, { params: { user_id } });
    return response.data;
  } catch (error) {
    console.error('Error fetching "For You" product:', error);
    throw error;
  }
};

// Fetch "New" products
export const fetchNewProduct = async (user_id) => {
  try {
    const response = await getData(apiURL.productNew, { params: { user_id } });
    return response.data;
  } catch (error) {
    console.error('Error fetching "New" product:', error);
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

//Favorite Product Add or Remove
export const postFavoriteProduct = async (product_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.postFavoriteProduct,
      { product_id },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error update favorite:', error);
    throw error;
  }
};

export const getSettingPage = async () => {
  try {
    const response = await getData(apiURL.getSetting);
    return response.data;
  } catch (error) {
    console.error('Error fetching setting:', error);
    throw error;
  }
};

export const getDetailPostFooter = async (slug) => {
  try {
    const response = await getData(apiURL.getDetailPostFooter(slug));
    return response.data;
  } catch (error) {
    console.error('Error fetching setting:', error);
    throw error;
  }
};

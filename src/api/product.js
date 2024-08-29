import { getData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Fetch product details by slug
export const fetchProductDetails = async (slug) => {
  try {
    const response = await getData(apiURL.productDetails(slug));
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

// Fetch shop details by shop ID
export const fetchShopDetails = async (shop_id) => {
  try {
    const response = await getData(apiURL.shopDetails(shop_id));
    return response.data;
  } catch (error) {
    console.error('Error fetching shop details:', error);
    throw error;
  }
};

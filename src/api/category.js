import { getData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Fetch category products
export const fetchCategoryProduct = async (category, region, min_price, max_price, page = 1) => {
  try {
    const params = new URLSearchParams({
      category: category || '',
      region: region || '',
      min_price: min_price || '',
      max_price: max_price || '',
      page,
    });

    const response = await getData(`${apiURL.getCategoyProduct}?${params.toString()}`);

    return response;
  } catch (error) {
    console.error('Error fetching category product:', error);
    throw error;
  }
};

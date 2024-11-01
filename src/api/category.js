import { getData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Fetch category products
export const fetchCategoryProduct = async (
  categories = [],
  cities = [],
  min_price = '',
  max_price = '',
  page = 1,
  user_id,
) => {
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
    params.append('page', page);
    params.append('user_id', user_id);

    const response = await getData(`${apiURL.getCategoyProduct}?${params.toString()}`);

    return response;
  } catch (error) {
    console.error('Error fetching category product:', error);
    throw error;
  }
};

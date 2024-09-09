import { getData, postData } from '~/axios/config';
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

//Post new Product
export const postProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postProduct, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to post product:', error);
    throw error;
  }
};

//Show all product by shop at shop
export const fetchProductByShopAtShop = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getProductByShopAtShop, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch Product:', error);
    throw error;
  }
};

export const updateProductDisplay = async (product_id, display) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(
      apiURL.updateProductDisplayStatus(product_id),
      { display },
      {
        // Pass display in body
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error('Failed to update display:', error);
    throw error;
  }
};

import axios from 'axios';

const API_HOST = 'https://api-b2b.krmedi.vn';

export const createShoppingCard = async ({ shop_id, product_id, quantity }) => {
  try {
    const response = await axios.post(
      `${API_HOST}/api/add-to-cart`,
      {
        shop_id,
        product_id,
        quantity,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create cart:', error);
    throw error;
  }
};

export const getShoppingCard = async () => {
  try {
    const response = await axios.get(`${API_HOST}/api/get-cart`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching get cart:', error);
    throw error;
  }
};

export const removeProductByShop = async ({ shop_id, product_id, quantity }) => {
  try {
    const response = await axios.post(
      `${API_HOST}/api/remove-product-from-cart`,
      {
        shop_id,
        product_id,
        quantity,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create cart:', error);
    throw error;
  }
};

export const removeStore = async ({ shop_id }) => {
  try {
    const response = await axios.post(
      `${API_HOST}/api/remove-product-from-cart`,
      {
        shop_id,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create cart:', error);
    throw error;
  }
};

export const createCheckOut = async (items) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(
      `${API_HOST}/api/checkout`,
      { items },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

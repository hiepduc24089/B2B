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

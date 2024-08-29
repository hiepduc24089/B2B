import { postData, getData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Create a shopping cart entry
export const createShoppingCard = async ({ shop_id, product_id, quantity }) => {
  try {
    const response = await postData(apiURL.addToCart, { shop_id, product_id, quantity });
    return response;
  } catch (error) {
    console.error('Failed to create cart:', error);
    throw error;
  }
};

// Get shopping cart details
export const getShoppingCard = async () => {
  try {
    const response = await getData(apiURL.getCart);
    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Update shopping cart quantity
export const updateCart = async ({ shop_id, product_id, quantity }) => {
  try {
    const response = await postData(apiURL.updateCartQuantity, { shop_id, product_id, quantity });
    return response;
  } catch (error) {
    console.error('Failed to update cart:', error);
    throw error;
  }
};

// Remove a product from the cart by shop
export const removeProductByShop = async ({ shop_id, product_id, quantity }) => {
  try {
    const response = await postData(apiURL.removeProductFromCart, { shop_id, product_id, quantity });
    return response;
  } catch (error) {
    console.error('Failed to remove product from cart:', error);
    throw error;
  }
};

// Remove a shop from the cart
export const removeStore = async ({ shop_id }) => {
  try {
    const response = await postData(apiURL.removeShopFromCart, { shop_id });
    return response;
  } catch (error) {
    console.error('Failed to remove shop from cart:', error);
    throw error;
  }
};

// Create a checkout
export const createCheckOut = async (items) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.checkout,
      { items },
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
    console.error('Failed to create checkout:', error);
    throw error;
  }
};

// Create a payment
export const createPayment = async (items) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(apiURL.pay, items, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to create payment:', error);
    throw error;
  }
};

// Create a buy now request
export const createBuyNow = async (items) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(apiURL.buyNow, items, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to create buy now request:', error);
    throw error;
  }
};

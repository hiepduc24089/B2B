import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Function to create a new shop
export const createShop = async (shopData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.createShop, shopData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create shop:', error);
    throw error;
  }
};

export const updateShop = async (shopData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.updateShop, shopData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create shop:', error);
    throw error;
  }
};

export const getShopByUser = async (shop_id) => {
  try {
    const response = await getData(apiURL.getShopByUser(shop_id));
    return response.data;
  } catch (error) {
    console.error('Error fetching store:', error);
    throw error;
  }
};

export const getProductByShop = async (shop_id, user_id, page = 1) => {
  try {
    const response = await getData(apiURL.getProductByShop(shop_id, user_id, page));
    return response.data;
  } catch (error) {
    console.error('Error fetching product store:', error);
    throw error;
  }
};

export const getProfileShop = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found, user not logged in.');
      return null;
    }

    const response = await getData(apiURL.getShopProfile, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('User not authenticated, skipping profile shop data fetch.');
      return null;
    }
    console.error('Failed to get shop:', error);
    throw error; // Re-throw if it’s an unexpected error
  }
};

export const cancelOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.cancelOrder, orderData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create shop:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.updateStatusOrder, orderData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create shop:', error);
    throw error;
  }
};

export const getCustomer = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await getData(apiURL.getCustomer, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to get customer:', error);
    throw error;
  }
};

export const getAskBuy = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getAskBuy, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to get list ask to buy:', error);
    throw error;
  }
};

export const getAskBuyDetail = async (ask_id) => {
  try {
    const token = localStorage.getItem('token');

    const response = await getData(apiURL.getAskBuyDetail(ask_id), {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to get detail ask to buy:', error);
    throw error;
  }
};

export const getProductReport = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await getData(apiURL.getProductReport, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to get list product being reported:', error);
    throw error;
  }
};

export const getProductReportDetail = async (report_id) => {
  try {
    const token = localStorage.getItem('token');

    const response = await getData(apiURL.getProductReportDetail(report_id), {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to get product being reported::', error);
    throw error;
  }
};

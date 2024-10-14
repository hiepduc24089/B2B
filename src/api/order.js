import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Fetch list order
export const fetchListOrder = async (key_search = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.getListOrder,
      { key_search },
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
    console.error('Error fetching list order', error);
    throw error;
  }
};

//Fetch order details by orderid
export const fetchOrderDetail = async (order_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getOrderDetail(order_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

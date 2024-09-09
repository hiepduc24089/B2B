import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

export const fetchRequestSupplier = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getListRequestSuppier, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching request supplier:', error);
    throw error;
  }
};

export const fetchListPriceQuote = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getListPriceQuote, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error list price quote:', error);
    throw error;
  }
};

export const fetchAllListCategory = async () => {
  try {
    const response = await getData(apiURL.getAllListCategory);
    return response;
  } catch (error) {
    console.error('Error fetching list category:', error);
    throw error;
  }
};

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

export const fetchPriceQuoteDetail = async (quote_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getPriceQuoteDetail(quote_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error get price quote detail:', error);
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

export const postRequestSupplier = async (supplierData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postRequestSupplier, supplierData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to post request supplier:', error);
    throw error;
  }
};

export const fetchDetailRequestSupplier = async (request_id) => {
  try {
    const response = await getData(apiURL.getDetailRequest(request_id));
    return response;
  } catch (error) {
    console.error('Error fetching detail request supplier:', error);
    throw error;
  }
};

export const postCreateQuotesFromUser = async (quoteData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await postData(apiURL.postCreateQuote, quoteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create quote:', error);
    throw error;
  }
};

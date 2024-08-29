import axios from 'axios';
import { API_HOST } from '~/config/host';

const apiClient = axios.create({
  baseURL: API_HOST,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const setupInterceptors = (onUnauthorized) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        onUnauthorized();
      }
      return Promise.reject(error);
    },
  );
};

export const getData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (endpoint, payload, options = {}) => {
  try {
    const response = await apiClient.post(endpoint, payload, options);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const updateData = async (endpoint, payload) => {
  try {
    const response = await apiClient.put(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

import { apiURL } from '~/axios/apiURL';
import { getData } from '~/axios/config';

export const getListNotification = async (page = 1) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(`${apiURL.getNotification}?page=${page}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching list notification:', error);
    throw error;
  }
};

export const getMarkReadNotification = async (notification_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.markReadNotification(notification_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching read notification:', error);
    throw error;
  }
};

import { apiURL } from '~/axios/apiURL';
import { getData } from '~/axios/config';

export const getStatistic = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getStatistic, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching statistic', error);
    throw error;
  }
};

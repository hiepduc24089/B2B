import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

//Fetch user detail
export const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getProfile, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

//Update Profile
export const postUpdateProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(apiURL.updateProfile, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error updating profile', error);
    throw error;
  }
};

//My Order
export const fetchMyOrder = async (key_search = '') => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.fetchMyOrder,
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
    console.error('Error fetching my order', error);
    throw error;
  }
};

//get Favorite product
export const fetchFavoriteProduct = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.fetchFavoriteProduct, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching favorite product:', error);
    throw error;
  }
};

//Get shop following
export const fetchFollowingShop = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getFollowingShop, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching following shop:', error);
    throw error;
  }
};

//Unfollow shop
export const postUnfollowShop = async (shop_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.unfollowShop,
      { shop_id },
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
    console.error('Error unfollow shop', error);
    throw error;
  }
};

//Get viewed product
export const fetchViewedProduct = async () => {
  try {
    const response = await getData(apiURL.fetchViewedProduct, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching viewed product:', error);
    throw error;
  }
};

//Get quote sent
export const fetchQuoteSent = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.fetchQuoteSent, {
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

import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

//Get Address
export const fetchAddress = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getAddress, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};

// Create New Address
export const postCreateAddress = async (addressData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(apiURL.createAddress, addressData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error create address', error);
    throw error;
  }
};

//Update default address
export const updateDefaultAddress = async (addressID) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.updateDefaultAddress(addressID), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error updating default address:', error);
    throw error;
  }
};

//Get address detail
export const fetchAddressDetail = async (address_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getDetailAddress(address_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};

//Update user address
export const updateUserAddress = async (addressID, dataAddress) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(apiURL.updateUserAddress(addressID), dataAddress, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};

//Delete user address
export const deleteUserAddress = async (address_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.deleteUserAddress(address_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

import { API_HOST } from '~/config/host';

export const confirmEmail = async (emailData) => {
  try {
    const response = await fetch(`${API_HOST}/api/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'An error occurred during sending email.');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const verifyEmailCode = async (verificationData) => {
  try {
    const response = await fetch(`${API_HOST}/api/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Invalid verification code.');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_HOST}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'An error occurred during registration.');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_HOST}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'An error occurred during login.');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

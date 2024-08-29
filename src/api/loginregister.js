import { postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

// Confirm email by sending a code
export const confirmEmail = async (emailData) => {
  try {
    const response = await postData(apiURL.sendCode, emailData);
    return response;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

// Verify email code
export const verifyEmailCode = async (verificationData) => {
  try {
    const response = await postData(apiURL.verifyCode, verificationData);
    return response;
  } catch (error) {
    console.error('Error verifying email code:', error);
    throw error;
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await postData(apiURL.register, userData);
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login a user
export const loginUser = async (userData) => {
  try {
    const response = await postData(apiURL.login, userData);
    return response;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

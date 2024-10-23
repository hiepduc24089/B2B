import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

export const getMessage = async (user_id, receiver_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getMessage(user_id, receiver_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const postSendMessage = async (content, sender_id, receiver_id, conversation_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.sendMessage,
      {
        content,
        sender_id,
        receiver_id,
        conversation_id,
      },
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
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getConversations, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const broadCast = async (message, sender_id, receiver_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.broadCast,
      {
        message,
        sender_id,
        receiver_id,
      },
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
    console.error('Error sending message:', error);
    throw error;
  }
};

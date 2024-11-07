import { getData, postData } from '~/axios/config';
import { apiURL } from '~/axios/apiURL';

export const getMessage = async (user_id, receiver_id, page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('token');
    const response = await getData(apiURL.getMessage(user_id, receiver_id), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page, // Add pagination parameters
        limit: limit,
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

export const markReadMessage = async (receiver_id, conversation_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.markReadMessage(receiver_id, conversation_id),
      {},
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
    console.error('Error marking read message:', error);
    throw error;
  }
};

export const createConversations = async (sender_id, user_id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await postData(
      apiURL.createConversations,
      {
        user1_id: sender_id,
        user2_id: user_id,
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
    console.error('Error creating conversation:', error);
    throw error;
  }
};

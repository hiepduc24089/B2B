import React, { memo, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatOpen.module.scss';
import { API_HOST } from '~/config/host';
import { broadCast, getMessage, markReadMessage, postSendMessage } from '~/api/chat';
import Echo from 'laravel-echo';
import LoadingIndicator from '~/components/Loading';
import { images } from '~/assets/images';
import axios from 'axios';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function CurrentBoxChat({
  userId,
  receiverId,
  conversationId,
  receiverAvatar,
  receiverName,
  onBack,
  clickMarkMessagesAsRead,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessage(userId, receiverId);
        setMessages(response.message);

        if (response.message.length > 0) {
          markMessagesAsRead();
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId, receiverId]);

  // Function to mark messages as read
  const markMessagesAsRead = async () => {
    try {
      await markReadMessage(userId, conversationId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Function to scroll the current-message container to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const response = await postSendMessage(newMessage, userId, receiverId, conversationId);

      if (response.status) {
        setNewMessage('');
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: newMessage, sender_id: userId, receiver_id: receiverId },
        ]);
        // Broadcast the message to others
        await broadCast(newMessage, userId, receiverId);
      } else {
        alert('Error sending message');
        console.error('Failed to send message:', response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Setup Echo for real-time updates
  useEffect(() => {
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'bd72b2f14ad121b7671a',
      cluster: 'ap1',
      forceTLS: true,
    });

    const channelName = `chat.${Math.min(userId, receiverId)}-${Math.max(userId, receiverId)}`;
    const channel = window.Echo.channel(channelName);

    channel.listen('.chat', async (data) => {
      try {
        const res = await axios.post(`${API_HOST}/api/test-chat/receive`, {
          content: data.message,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
        });

        if (res.data.status) {
          if (userId !== data.sender_id) {
            setMessages((prevMessages) => [...prevMessages, res.data]);
          }
        }
      } catch (error) {
        console.error('Error posting received message to /receive endpoint:', error);
      }
    });

    return () => {
      channel.stopListening('.chat');
      window.Echo.leave(channelName);
    };
  }, [userId, receiverId]);

  return (
    <>
      <div className={cx('box-chat-user')}>
        <FontAwesomeIcon icon={faArrowLeft} alt="arrow right" className={cx('back-box-chat-icon')} onClick={onBack} />
        <img
          src={receiverAvatar ? `${API_HOST}${receiverAvatar}` : images.avatar_icon}
          alt="Avatar"
          className={cx('avatar-box')}
        />
        <span className={cx('box-header-name')}>{receiverName}</span>
      </div>
      <div className={cx('box-chat')} ref={chatContainerRef} style={{ overflowY: 'auto' }}>
        {loading ? (
          <LoadingIndicator />
        ) : (
          messages.map((message, index) => (
            <div key={index} className={cx('message', message.sender_id === userId ? 'sent' : 'received')}>
              {message.sender_id !== userId && (
                <img
                  src={receiverAvatar ? `${API_HOST}${receiverAvatar}` : images.avatar_icon}
                  alt="Avatar"
                  className={cx('avatar')}
                />
              )}
              <p className={cx('message-content')}>{message.content}</p>
            </div>
          ))
        )}
      </div>
      <div className={cx('input-message')}>
        <img src={images.attach_file} alt="attach file" className={cx('attach-file')} />
        <div className={cx('input-wrapper')}>
          <input
            type="text"
            placeholder="Message"
            className={cx('input')}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onFocus={clickMarkMessagesAsRead}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className={cx('send-button')} onClick={handleSendMessage}>
            <img src={images.send_message} alt="send message" className={cx('send-message-icon')} />
          </button>
        </div>
        <img src={images.record} alt="record" className={cx('record')} />
      </div>
    </>
  );
}

export default memo(CurrentBoxChat);

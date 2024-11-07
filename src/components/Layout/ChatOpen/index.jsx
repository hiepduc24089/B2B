import React, { memo, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ChatOpen.module.scss';
import { images } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import CurrentBoxChat from '../ChatOpen/component/CurrentBoxChat';
import { getConversations } from '~/api/chat';
import { API_HOST } from '~/config/host';
import { format } from 'date-fns';
import Echo from 'laravel-echo';
import { useAuth } from '~/context/AuthContext';

const cx = classNames.bind(styles);

function ChatOpen({ userId, receiverId, conversationId, onClose }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCurrentMessage, setShowCurrentMessage] = useState(false);
  const initialConversationSet = useRef(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await getConversations();
        setConversations(response);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // Initialize Laravel Echo with Pusher
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'bd72b2f14ad121b7671a',
      cluster: 'ap1',
      forceTLS: true,
      authEndpoint: `${API_HOST}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    });

    // Subscribe to each conversation channel only once
    const channels = conversations.map((conversation) => {
      return window.Echo.private(`messenger.${conversation.id}`)
        .subscribed(() => {})
        .listen('.messenger-notification', (event) => {
          setConversations((prevConversations) => {
            // Find and update the conversation
            const updatedConversations = prevConversations.map((conv) =>
              conv.id === event.conversation_id
                ? {
                    ...conv,
                    last_message: {
                      content: event.content,
                      created_at: event.created_at,
                      conversation_id: event.conversation_id,
                    },
                    unread_message_count:
                      user.id === event.receiver_id ? conv.unread_message_count + 1 : conv.unread_message_count,
                  }
                : conv,
            );

            // Find the updated conversation
            const updatedConversation = updatedConversations.find((conv) => conv.id === event.conversation_id);

            // Move the updated conversation to the top
            if (updatedConversation) {
              return [updatedConversation, ...updatedConversations.filter((conv) => conv.id !== event.conversation_id)];
            }

            // Return the original array if no conversation was updated
            return updatedConversations;
          });
        });
    });

    return () => {
      channels.forEach((channel) => {
        channel.stopListening('messenger-notification');
        window.Echo.leaveChannel(channel.name);
      });
    };
  }, [conversations, user.id]);

  // Automatically select the conversation matching the passed conversationId
  useEffect(() => {
    if (!initialConversationSet.current && conversations.length > 0 && conversationId) {
      const matchedConversation = conversations.find((conversation) => conversation.id === conversationId);
      if (matchedConversation) {
        setSelectedConversation({ ...matchedConversation, unread_message_count: 0 });
        setShowCurrentMessage(true);
        initialConversationSet.current = true;
      }
    }
  }, [conversations, conversationId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => {
      if (!mediaQuery.matches) {
        setShowCurrentMessage(false);
      }
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const handleSelectConversation = (conversation) => {
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    if (isSmallScreen) {
      setShowCurrentMessage(true);
    }
    setSelectedConversation({
      ...conversation,
      unread_message_count: 0,
    });
    setConversations((prevConversations) =>
      prevConversations.map((conv) => (conv.id === conversation.id ? { ...conv, unread_message_count: 0 } : conv)),
    );
  };

  const handleMarkMessagesAsRead = (conversationId) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => (conv.id === conversationId ? { ...conv, unread_message_count: 0 } : conv)),
    );
  };

  const handleBackToConversations = () => {
    setShowCurrentMessage(false);
    setSelectedConversation(null);
  };
  return (
    <div className={cx('box-chat-open-wrapper', { 'show-current': showCurrentMessage })}>
      <div className={cx('message-title')}>
        <h5 className={cx('title')}>Tin nhắn</h5>
        <span className={cx('d-flex', 'align-items-center', 'show-less')} onClick={onClose}>
          Thu gọn
          <img src={images.arrow_down} alt="arrow down" style={{ width: '10px', height: '10px' }} />
        </span>
      </div>
      <div className={cx('message-wrapper')}>
        <div className={cx('list-message')}>
          <div className={cx('list-message-wrapper')}>
            {loading ? (
              <LoadingIndicator />
            ) : conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div
                  key={index}
                  className={cx('list-message-item', {
                    'is-selected': selectedConversation
                      ? selectedConversation.id === conversation.id
                      : conversationId === conversation.id,
                  })}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className={cx('detail-wrapper')}>
                    <img
                      src={
                        conversation.receiver_avatar ? `${API_HOST}${conversation.receiver_avatar}` : images.avatar_icon
                      }
                      alt="Avatar"
                      className={cx('avatar')}
                    />
                    <div className={cx('content')}>
                      <div className={cx('d-flex', 'justify-content-between')}>
                        <label className={cx('name')}>{conversation.receiver_name}</label>
                        <label className={cx('time')}>
                          {conversation.last_message?.created_at
                            ? format(new Date(conversation.last_message.created_at), 'HH:mm')
                            : 'No time available'}
                        </label>
                      </div>
                      <div className={cx('d-flex', 'justify-content-between')}>
                        <p
                          className={cx('message', {
                            'fw-bold': conversation.unread_message_count > 0,
                          })}
                        >
                          {conversation.last_message?.content || 'Chưa có tin nhắn'}
                        </p>
                        {conversation.unread_message_count !== null && conversation.unread_message_count > 0 && (
                          <span className={cx('unread-message')}>{conversation.unread_message_count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={cx('no-conversations')}>Không có cuộc hội thoại</p>
            )}
          </div>
        </div>
        <div className={cx('current-message')}>
          {selectedConversation ? (
            <CurrentBoxChat
              userId={selectedConversation.user1_id}
              receiverId={selectedConversation.user2_id}
              conversationId={selectedConversation.id}
              receiverAvatar={selectedConversation.receiver_avatar}
              receiverName={selectedConversation.receiver_name}
              onBack={handleBackToConversations}
              clickMarkMessagesAsRead={() => handleMarkMessagesAsRead(selectedConversation.id)}
            />
          ) : (
            <p className={cx('no-selected-conversation')}>Vui lòng chọn cuộc hội thoại</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ChatOpen);

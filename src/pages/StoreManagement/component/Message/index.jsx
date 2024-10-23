import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import CurrentMessage from './component/CurrentMessage';
import { images } from '~/assets/images';
import { getConversations } from '~/api/chat';
import { format } from 'date-fns';
import { API_HOST } from '~/config/host';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function Message() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true); // Set loading to true when starting the fetch
        const response = await getConversations();
        setConversations(response);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchConversations();
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <>
      <div className={cx('message-wrapper')}>
        <div className={cx('list-message')}>
          <h5 className={cx('title')}>Tin nhắn</h5>
          <div className={cx('list-message-wrapper')}>
            {loading ? (
              <LoadingIndicator />
            ) : conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div
                  key={index}
                  className={cx('list-message-item', { 'is-selected': selectedConversation === conversation })}
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
                      <p className={cx('message')}>{conversation.last_message.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={cx('no-conversations')}>No conversations available</p>
            )}
          </div>
          <h5 className={cx('date-render')}>Today</h5>
        </div>
        <div className={cx('current-message')}>
          {selectedConversation ? (
            <CurrentMessage
              userId={selectedConversation.user1_id}
              receiverId={selectedConversation.user2_id}
              conversationId={selectedConversation.last_message.conversation_id}
              receiverAvatar={selectedConversation.receiver_avatar}
            />
          ) : (
            <p className={cx('no-selected-conversation')}>Select a conversation to start chatting</p>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(Message);

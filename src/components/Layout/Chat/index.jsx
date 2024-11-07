import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Chat.module.scss';
import { images } from '~/assets/images';
import ChatOpen from '../ChatOpen';

const cx = classNames.bind(styles);

function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleShowBoxChat = () => {
    setIsChatOpen(true);
  };

  const handleHideBoxChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {isChatOpen ? (
        <ChatOpen onClose={handleHideBoxChat} />
      ) : (
        <div className={cx('chat-wrapper')} onClick={handleShowBoxChat}>
          <div className={cx('chat-box-close')}>
            <img src={images.message_icon} alt="message icon" className={cx('chat-icon')} />
            <h5 className={cx('chat-name')}>Tin Nhắn</h5>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(Chat);

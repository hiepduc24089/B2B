import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Message.module.scss';
import { imagesSeller } from '~/assets/images';

const cx = classNames.bind(styles);

function ListMessage() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleSelectMessage = (index) => {
    setSelectedMessage(index);
  };

  return (
    <>
      <h5 className={cx('title')}>Tin nhắn</h5>
      <div className={cx('list-message-wrapper')}>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={cx('list-message-item', { 'is-selected': selectedMessage === index })}
            onClick={() => handleSelectMessage(index)}
          >
            <div className={cx('detail-wrapper')}>
              <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
              <div className={cx('content')}>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <label className={cx('name')}>Sarah Johnson</label>
                  <label className={cx('time')}>12:01pm</label>
                </div>
                <p className={cx('message')}>Thanks, I can’t wait to see you tomorrow for coffee!</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h5 className={cx('date-render')}>Today</h5>

      <div className={cx('list-message-wrapper')}>
        {[...Array(4)].map((_, index) => (
          <div
            key={index + 4}
            className={cx('list-message-item', { 'is-selected': selectedMessage === index + 4 })}
            onClick={() => handleSelectMessage(index + 4)}
          >
            <div className={cx('detail-wrapper')}>
              <img src={imagesSeller.seller_avatar} alt="Avatar" className={cx('avatar')} />
              <div className={cx('content')}>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <label className={cx('name')}>Sarah Johnson</label>
                  <label className={cx('time')}>12:01pm</label>
                </div>
                <p className={cx('message')}>Thanks, I can’t wait to see you tomorrow for coffee!</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default memo(ListMessage);

import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import ListMessage from './component/ListMessage';
import CurrentMessage from './component/CurrentMessage';

const cx = classNames.bind(styles);

function Message() {
  return (
    <>
      <div className={cx('message-wrapper')}>
        <div className={cx('list-message')}>
          <ListMessage />
        </div>
        <div className={cx('current-message')}>
          <CurrentMessage />
        </div>
      </div>
    </>
  );
}

export default memo(Message);

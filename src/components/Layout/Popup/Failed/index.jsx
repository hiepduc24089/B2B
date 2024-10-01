import React from 'react';
import classNames from 'classnames/bind';
import styles from './Failed.module.scss';
import { imagesPopup } from '~/assets/images';

const cx = classNames.bind(styles);

function Failed({ message, onClose }) {
  return (
    <div className={cx('popup-overlay')}>
      <div className={cx('popup')}>
        <div className={cx('close-icon')} onClick={onClose}>
          <img src={imagesPopup.closePopup} alt="Close" />
        </div>
        <img src={imagesPopup.failed} alt="Success" className={cx('icon-image')} />
        <p className={cx('popup-message')}>{message}</p>
      </div>
    </div>
  );
}

export default Failed;

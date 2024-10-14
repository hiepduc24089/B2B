import React from 'react';
import classNames from 'classnames/bind';
import styles from './Success.module.scss';
import { imagesPopup } from '~/assets/images';

const cx = classNames.bind(styles);

function Success({ message, onClose }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={cx('popup-overlay')} onClick={handleOverlayClick}>
      <div className={cx('popup')}>
        <div className={cx('close-icon')} onClick={onClose}>
          <img src={imagesPopup.closePopup} alt="Close" />
        </div>
        <img src={imagesPopup.success} alt="Success" className={cx('icon-image')} />
        <p className={cx('popup-message')}>{message}</p>
      </div>
    </div>
  );
}

export default Success;

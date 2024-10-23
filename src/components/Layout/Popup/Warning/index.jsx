import React from 'react';
import classNames from 'classnames/bind';
import styles from './Warning.module.scss';
import { images, imagesPopup } from '~/assets/images';

const cx = classNames.bind(styles);

function Warning({ message, onBack, onClose, onOk }) {
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
        <img src={images.exclamation} alt="Exclamation" />
        <p className={cx('popup-message')}>{message}</p>
        <div className={cx('d-flex')} style={{ gap: '10px' }}>
          <button onClick={onClose} className={cx('button-back', 'col-6')}>
            Huỷ
          </button>
          <button onClick={onOk} className={cx('button-ok', 'col-6')}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default Warning;

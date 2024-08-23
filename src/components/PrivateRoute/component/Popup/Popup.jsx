import React from 'react';
import classNames from 'classnames/bind';
import styles from './Popup.module.scss';
import { images } from '~/assets/images';

const cx = classNames.bind(styles);

function Popup({ message, onClose, onBack, onOk }) {
  return (
    <div className={cx('popup-overlay')}>
      <div className={cx('popup')}>
        <img src={images.exclamation} alt="Exclamation" />
        <p className={cx('popup-message')}>{message}</p>
        <div className={cx('d-flex')} style={{ gap: '10px' }}>
          <button onClick={onBack} className={cx('button-back', 'col-6')}>
            Quay Lại
          </button>
          <button onClick={onOk} className={cx('button-ok', 'col-6')}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;

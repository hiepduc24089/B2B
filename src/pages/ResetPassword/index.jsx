import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ResetPassword.module.scss';
import { images } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function ResetPassword() {
  return (
    <div className={cx('login-wrapper')}>
      <img src={images.login_background} alt="Login Background" className={cx('login-background')} />
      <div className={cx('login-details')}>
        <div className={cx('login-details-wrapper')}>
          <h1 className={cx('title')}>Shopping Mall</h1>
          <div className={cx('login-form')}>
            <h5>Đặt lại mật khẩu của bạn</h5>
            <div className={cx('form-wrapper', 'margin-top-24')}>
              <input type="text" required className={cx('form-input-login')} />
              <label className={cx('form-label')}>Email</label>
            </div>
            <div className={cx('form-wrapper', 'margin-top-24')}>
              <div className={cx('d-flex', 'justify-content-between', 'flex-wrap')}>
                <input type="text" required className={cx('form-input-login', 'email-confirm-input')} />
                <button className={cx('email-confirm')}>Lấy mã xác nhận</button>
              </div>
              <label className={cx('form-label')}>Mã xác nhận Email</label>
            </div>
            <button className={cx('login-btn')}>Tiếp tục</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ResetPassword;

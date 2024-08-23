import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { images } from '~/assets/images';

const cx = classNames.bind(styles);

function Register() {
  return (
    <div className={cx('login-wrapper')}>
      <img src={images.login_background} alt="Login Background" className={cx('login-background')} />
      <div className={cx('login-details')}>
        <div className={cx('login-details-wrapper')}>
          <h1 className={cx('title')}>Shopping Mall</h1>
          <div className={cx('login-form')}>
            <h5>Đăng ký</h5>
            <p className={cx('slogan')}>Mua thuốc sỉ giá tốt cùng với shopping mall</p>
            <div className={cx('form-wrapper')}>
              <input type="text" required className={cx('form-input-login')} />
              <label className={cx('form-label')}>Tên của bạn</label>
            </div>
            <div className={cx('form-wrapper', 'margin-top-24')}>
              <input type="text" required className={cx('form-input-login')} />
              <label className={cx('form-label')}>Số điện thoại</label>
            </div>
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
            <div className={cx('agree-wrapper')}>
              <input type="checkbox" className={cx('agree')} />
              <label>
                Đồng ý với <span>Chính sách bảo mật và điều khoản sử dụng</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Register);

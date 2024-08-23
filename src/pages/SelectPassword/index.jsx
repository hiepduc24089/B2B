import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SelectPassword.module.scss';
import { images } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function SelectPassword() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <div className={cx('login-wrapper')}>
      <img src={images.login_background} alt="Login Background" className={cx('login-background')} />
      <div className={cx('login-details')}>
        <div className={cx('login-details-wrapper')}>
          <h1 className={cx('title')}>Shopping Mall</h1>
          <div className={cx('login-form')}>
            <h5>Chọn mật khẩu của bạn</h5>
            <div className={cx('form-wrapper', 'margin-top-24')}>
              <div className={cx('password-field')}>
                <input type={showPassword1 ? 'text' : 'password'} required className={cx('form-input-login')} />
                <img
                  src={images.show_password}
                  className={cx('show-password')}
                  onClick={togglePasswordVisibility1}
                  alt="Toggle Password Visibility"
                />
              </div>
              <label className={cx('form-label')}>Mật khẩu của bạn</label>
              <p className={cx('password-note')}>
                8 đến 16 ký tự, bao gồm chữ cái và số, không có khoảng trắng hoặc ký tự đặc biệt.
              </p>
            </div>
            <div className={cx('form-wrapper', 'margin-top-24')}>
              <div className={cx('password-field')}>
                <input type={showPassword2 ? 'text' : 'password'} required className={cx('form-input-login')} />
                <img
                  src={images.show_password}
                  className={cx('show-password')}
                  onClick={togglePasswordVisibility2}
                  alt="Toggle Password Visibility"
                />
              </div>
              <label className={cx('form-label')}>Nhập lại mật khẩu của bạn</label>
            </div>
            <button className={cx('login-btn')}>Lưu và tiếp tục</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SelectPassword);

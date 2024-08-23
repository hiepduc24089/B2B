import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { images } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={cx('login-wrapper')}>
      <img src={images.login_background} alt="Login Background" className={cx('login-background')} />
      <div className={cx('login-details')}>
        <div className={cx('login-details-wrapper')}>
          <h1 className={cx('title')}>Shopping Mall</h1>
          <div className={cx('login-form')}>
            <h5>Đăng nhập</h5>
            <p className={cx('slogan')}>Mua thuốc sỉ giá tốt cùng với shopping mall</p>
            <div className={cx('form-wrapper')}>
              <input type="text" required className={cx('form-input-login')} />
              <label className={cx('form-label')}>Email của bạn</label>
            </div>
            <div className={cx('form-wrapper', 'margin-top-24')}>
              <div className={cx('password-field')}>
                <input type={showPassword ? 'text' : 'password'} required className={cx('form-input-login')} />
                <img
                  src={images.show_password}
                  className={cx('show-password')}
                  onClick={togglePasswordVisibility}
                  alt="Toggle Password Visibility"
                />
              </div>
              <label className={cx('form-label')}>Mật khẩu</label>
            </div>
            <div className={cx('forget-password')}>
              <span>Quên mật khẩu</span>
            </div>
            <button className={cx('login-btn')}>Đăng nhập</button>
            <div className={cx('register-href')}>
              <span className={cx('dont-have-account')}> Bạn chưa có tài khoản</span>
              <Link to={routesConfig.register} className={cx('register-now')}>
                Đăng ký ngay
              </Link>
            </div>
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

export default memo(Login);

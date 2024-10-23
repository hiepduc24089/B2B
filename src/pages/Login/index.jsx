import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { images } from '~/assets/images';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { loginUser } from '~/api/loginregister';
import { useAuth } from '~/context/AuthContext';
import Failed from '~/components/Layout/Popup/Failed';
import Success from '~/components/Layout/Popup/Success';

const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const { successMessageRegister } = location.state || {};

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showFailed, setShowFailed] = useState(false);
  const [receiveSuccessMessage, setReceiveSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.successMessageRegister) {
      setReceiveSuccessMessage(true);
      setTimeout(() => {
        setReceiveSuccessMessage(false);
      }, 2000);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Custom form validation
  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!formData.email) {
      setEmailError('Vui lòng nhập email');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError('Email không hợp lệ');
      isValid = false;
    }

    if (!formData.password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (!result.status) {
        setShowFailed(true);
        return;
      }

      const userData = result.data;
      login(userData);
      localStorage.setItem('user_id', userData.id);
      navigate(routesConfig.home, { state: { showSuccessPopup: true } });
    } catch (error) {
      setEmailError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeFailedPopup = () => {
    setShowFailed(false);
  };

  const closeSuccessPopup = () => {
    setReceiveSuccessMessage('');
  };

  return (
    <>
      <div className={cx('login-wrapper')}>
        <img src={images.login_background} alt="Login Background" className={cx('login-background')} />
        <div className={cx('login-details')}>
          <div className={cx('login-details-wrapper')}>
            <h1 className={cx('title')}>Shopping Mall</h1>
            <div className={cx('login-form')}>
              <h5>Đăng nhập</h5>
              <p className={cx('slogan')}>Mua thuốc sỉ giá tốt cùng với shopping mall</p>
              <form onSubmit={handleSubmit}>
                <div className={cx('form-wrapper')}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cx('form-input-login')}
                    placeholder="Email của bạn"
                  />
                  <label className={cx('form-label')}>Email của bạn</label>
                  {emailError && <p className={cx('error-message')}>{emailError}</p>} {/* Show email error */}
                </div>
                <div className={cx('form-wrapper', 'margin-top-24')}>
                  <div className={cx('password-field')}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={cx('form-input-login')}
                      placeholder="Mật khẩu"
                    />
                    <img
                      src={images.show_password}
                      className={cx('show-password')}
                      onClick={togglePasswordVisibility}
                      alt="Toggle Password Visibility"
                    />
                  </div>
                  <label className={cx('form-label')}>Mật khẩu</label>
                  {passwordError && <p className={cx('error-message')}>{passwordError}</p>}
                </div>
                <div className={cx('forget-password')}>
                  <span>Quên mật khẩu</span>
                </div>
                <button type="submit" className={cx('login-btn')}>
                  Đăng nhập
                </button>
                <div className={cx('register-href')}>
                  <span className={cx('dont-have-account')}> Bạn chưa có tài khoản</span>
                  <Link to={routesConfig.register} className={cx('register-now')}>
                    Đăng ký ngay
                  </Link>
                </div>
                <div className={cx('agree-wrapper')}>
                  <input type="checkbox" className={cx('agree')} required />
                  <label>
                    Đồng ý với <span>Chính sách bảo mật và điều khoản sử dụng</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Show Success popup */}
      {receiveSuccessMessage && <Success message={successMessageRegister} onClose={closeSuccessPopup} />}
      {/* Show Failed popup when login fails */}
      {showFailed && <Failed message="Email hoặc mật khẩu không đúng, vui lòng thử lại" onClose={closeFailedPopup} />}
    </>
  );
}

export default memo(Login);

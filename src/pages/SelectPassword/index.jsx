import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SelectPassword.module.scss';
import { images } from '~/assets/images';
import { useLocation, useNavigate } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { registerUser } from '~/api/loginregister'; // Import the register API function
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function SelectPassword() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate hook
  const { name, email, phone, successMessage } = location.state || {};

  // State to manage password visibility and input values
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [receiveSuccessMessage, setReceiveSuccessMessage] = useState('');
  const [showFailed, setShowFailed] = useState(false);
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);

  useEffect(() => {
    if (location.state?.successMessage) {
      setReceiveSuccessMessage(true);
      setTimeout(() => {
        setReceiveSuccessMessage(false);
      }, 2000);
    }
  }, [location.state]);
  // Function to toggle password visibility
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password criteria
    if (
      !password ||
      password.length < 8 ||
      password.length > 16 ||
      /\s/.test(password) ||
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        'Mật khẩu phải có độ dài 8-16 ký tự, phải có chữ cái và số, và không có khoảng trống hoặc ký tự đặc biệt',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không trùng khớp');
      return;
    }

    setError(''); // Clear any previous errors
    setLoadingFullScreen(true);
    try {
      // Make the final registration API call with name, email, phone, and password
      const registerResponse = await registerUser({
        name,
        phone,
        email,
        password,
      });

      if (!registerResponse.status) {
        setShowFailed(true);
        return;
      }

      navigate(routesConfig.login, {
        state: {
          successMessageRegister: 'Đăng ký thành công, vui lòng đăng nhập!',
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const closeFailedPopup = () => {
    setShowFailed(false);
  };

  const closeSuccessPopup = () => {
    setReceiveSuccessMessage('');
  };

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div className={cx('login-wrapper')}>
        <img src={images.login_background} alt="Login Background" className={cx('login-background')} />
        <div className={cx('login-details')}>
          <div className={cx('login-details-wrapper')}>
            <h1 className={cx('title')}>Shopping Mall</h1>
            <div className={cx('login-form')}>
              <h5>Chọn mật khẩu của bạn</h5>
              <form onSubmit={handleSubmit}>
                <div className={cx('form-wrapper', 'margin-top-24')}>
                  <div className={cx('password-field')}>
                    <input
                      type={showPassword1 ? 'text' : 'password'}
                      required
                      className={cx('form-input-login')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
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
                    <input
                      type={showPassword2 ? 'text' : 'password'}
                      required
                      className={cx('form-input-login')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <img
                      src={images.show_password}
                      className={cx('show-password')}
                      onClick={togglePasswordVisibility2}
                      alt="Toggle Password Visibility"
                    />
                  </div>
                  <label className={cx('form-label')}>Nhập lại mật khẩu của bạn</label>
                </div>
                {error && <p className={cx('error-message')}>{error}</p>}
                <button type="submit" className={cx('login-btn')}>
                  Lưu và tiếp tục
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Show Failed popup  */}
      {showFailed && <Failed message="Vui lòng thử lại" onClose={closeFailedPopup} />}
      {/* Show Success popup */}
      {receiveSuccessMessage && <Success message={successMessage} onClose={closeSuccessPopup} />}
    </>
  );
}

export default memo(SelectPassword);

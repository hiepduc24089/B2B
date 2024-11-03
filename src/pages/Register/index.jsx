import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { images } from '~/assets/images';
import { confirmEmail, verifyEmailCode } from '~/api/loginregister';
import routesConfig from '~/config/routes';
import Failed from '~/components/Layout/Popup/Failed';
import Success from '~/components/Layout/Popup/Success';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    emailCode: '',
  });

  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailCodeError, setEmailCodeError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false); // New state to track if email has been sent
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      setEmailSent(false);
      setIsEmailVerified(false);
    }
  };

  // Function to handle email verification
  const handleEmailVerification = async () => {
    if (!formData.email) {
      setEmailError('Vui lòng nhập Email');
      return;
    }
    setLoadingFullScreen(true);
    try {
      setError('');
      const sendConfirmEmail = await confirmEmail({ email: formData.email });

      if (!sendConfirmEmail) {
        alert(sendConfirmEmail.message);
        return;
      }

      //Success message
      setSuccessMessage('Mã xác nhận đã được gửi, vui lòng kiểm tra Email');

      setIsEmailVerified(true);
      setEmailSent(true);
    } catch (error) {
      setEmailError(error.message);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate input fields
    let hasError = false;

    if (!formData.name) {
      setNameError('Vui lòng nhập tên của bạn');
      hasError = true;
    }

    if (!formData.phone) {
      setPhoneError('Vui lòng nhập số điện thoại');
      hasError = true;
    }

    if (!formData.email) {
      setEmailError('Vui lòng nhập email');
      hasError = true;
    }

    if (!formData.emailCode) {
      setEmailCodeError('Vui lòng nhập mã xác nhận email');
      hasError = true;
    }

    if (!isEmailVerified) {
      setError('Vui lòng xác thực Email trước khi tiếp tục.');
      return;
    }

    if (hasError) return;

    setError('');

    try {
      const verificationResult = await verifyEmailCode({
        email: formData.email,
        verification_code: formData.emailCode,
      });

      if (!verificationResult.status) {
        setShowFailed(true);
        return;
      }

      navigate(routesConfig.select_password, {
        state: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          successMessage: 'Xác nhận thành công, vui lòng tiếp tục!',
        },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const closeFailedPopup = () => {
    setShowFailed(false);
  };

  const closeSuccessPopup = () => {
    setSuccessMessage('');
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
              <h5>Đăng ký</h5>
              <p className={cx('slogan')}>Mua thuốc sỉ giá tốt cùng với shopping mall</p>
              <form onSubmit={handleSubmit}>
                <div className={cx('form-wrapper')}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cx('form-input-login')}
                    placeholder="Tên của bạn"
                  />
                  <label className={cx('form-label')}>Tên của bạn</label>
                  {nameError && <p className={cx('error-message')}>{nameError}</p>}
                </div>

                <div className={cx('form-wrapper', 'margin-top-24')}>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={cx('form-input-login')}
                    placeholder="Số điện thoại"
                  />
                  <label className={cx('form-label')}>Số điện thoại</label>
                  {phoneError && <p className={cx('error-message')}>{phoneError}</p>}
                </div>

                <div className={cx('form-wrapper', 'margin-top-24')}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cx('form-input-login')}
                    placeholder="Email"
                  />
                  <label className={cx('form-label')}>Email</label>
                  {emailError && <p className={cx('error-message')}>{emailError}</p>}
                </div>

                <div className={cx('form-wrapper', 'margin-top-24')}>
                  <div className={cx('d-flex', 'justify-content-between', 'flex-wrap')}>
                    <input
                      type="text"
                      name="emailCode"
                      value={formData.emailCode}
                      onChange={handleChange}
                      className={cx('form-input-login', 'email-confirm-input')}
                      placeholder="Mã xác nhận Email"
                    />
                    <button
                      type="button"
                      className={cx('email-confirm', isEmailVerified ? 'email-confirm-before' : 'email-confirm-first')}
                      onClick={handleEmailVerification}
                      disabled={emailSent}
                    >
                      {emailSent ? 'Đã gửi mã xác nhận' : 'Lấy mã xác nhận'}
                    </button>
                  </div>
                  <label className={cx('form-label')}>Mã xác nhận Email</label>
                  {emailCodeError && <p className={cx('error-message')}>{emailCodeError}</p>}
                </div>

                {error && <p className={cx('error-message')}>{error}</p>}

                <button type="submit" className={cx('login-btn')}>
                  Tiếp tục
                </button>

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
      {/* Show Failed popup  */}
      {showFailed && <Failed message="Vui lòng thử lại" onClose={closeFailedPopup} />}

      {/* Show Success popup */}
      {successMessage && <Success message={successMessage} onClose={closeSuccessPopup} />}
    </>
  );
}

export default memo(Register);

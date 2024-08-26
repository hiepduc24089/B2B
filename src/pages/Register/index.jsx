import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { images } from '~/assets/images';
import { confirmEmail, verifyEmailCode } from '~/api/loginregister';
import routesConfig from '~/config/routes';

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
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle email verification
  const handleEmailVerification = async () => {
    if (!formData.email) {
      setError('Vui lòng nhập Email');
      return;
    }

    try {
      setError('');
      const sendConfirmEmail = await confirmEmail({ email: formData.email });

      if (!sendConfirmEmail) {
        alert(sendConfirmEmail.message);
      }

      alert('Mã xác nhận đã được gửi đến email của bạn');
      setIsEmailVerified(true);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!formData.name || !formData.phone || !formData.email || !formData.emailCode) {
      setError('Cần nhập các tất cả các trường.');
      return;
    }

    if (!isEmailVerified) {
      setError('Vui lòng xác thực Email trước khi tiếp tục.');
      return;
    }

    setError('');

    try {
      const verificationResult = await verifyEmailCode({
        email: formData.email,
        verification_code: formData.emailCode,
      });

      if (!verificationResult.status) {
        alert(verificationResult.message); // Show alert if verification fails
        return;
      }

      alert('Xác nhận thành công, vui lòng tiếp tục!');

      navigate(routesConfig.select_password, {
        state: { name: formData.name, email: formData.email, phone: formData.phone },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
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
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={cx('form-input-login')}
                />
                <label className={cx('form-label')}>Tên của bạn</label>
              </div>
              <div className={cx('form-wrapper', 'margin-top-24')}>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={cx('form-input-login')}
                />
                <label className={cx('form-label')}>Số điện thoại</label>
              </div>
              <div className={cx('form-wrapper', 'margin-top-24')}>
                <input
                  type="text"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cx('form-input-login')}
                />
                <label className={cx('form-label')}>Email</label>
              </div>
              <div className={cx('form-wrapper', 'margin-top-24')}>
                <div className={cx('d-flex', 'justify-content-between', 'flex-wrap')}>
                  <input
                    type="text"
                    required
                    name="emailCode"
                    value={formData.emailCode}
                    onChange={handleChange}
                    className={cx('form-input-login', 'email-confirm-input')}
                  />
                  <button
                    type="button"
                    className={cx('email-confirm')}
                    onClick={handleEmailVerification} // Trigger email verification
                  >
                    Lấy mã xác nhận
                  </button>
                </div>
                <label className={cx('form-label')}>Mã xác nhận Email</label>
              </div>
              {error && <p className={cx('error-message')}>{error}</p>}
              <button type="submit" className={cx('login-btn')}>
                Tiếp tục
              </button>
              <div className={cx('agree-wrapper')}>
                <input type="checkbox" className={cx('agree')} />
                <label>
                  Đồng ý với <span>Chính sách bảo mật và điều khoản sử dụng</span>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Register);

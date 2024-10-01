import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Popper.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import { logoutUser } from '~/api/loginregister';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function Wrapper() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const logoutResponse = await logoutUser();
      if (!logoutResponse.status) {
        alert('Đăng xuất thất bại, vui lòng thử lại!');
        return;
      }
      logout();

      alert('Đăng xuất thành công');
      navigate(routesConfig.home);
    } catch (error) {
      console.error('Failed to log out:', error);

      logout();
    }
  };
  return (
    <div className={cx('menu-wrapper')}>
      <ul>
        <li className={cx('active')}>Quản lý gian hàng</li>
        <li>Thông tin tài khoản</li>
        <li>Đơn hàng của tôi</li>
        <li>Sản phẩm yêu thích</li>
        <li>NCC yêu thích</li>
        <li>Sản phẩm đã xem</li>
        <li>Yêu cầu đã đăng</li>
        <li>Báo giá đã nhận</li>
        <li onClick={handleLogout}>Đăng xuất</li>
      </ul>
    </div>
  );
}

export default memo(Wrapper);

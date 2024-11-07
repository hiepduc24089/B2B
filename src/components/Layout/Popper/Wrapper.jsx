import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Popper.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '~/context/AuthContext';
import { logoutUser } from '~/api/loginregister';
import routesConfig from '~/config/routes';
import { useStoreData } from '~/context/StoreDataContext';

const cx = classNames.bind(styles);

function Wrapper({ onLogoutSuccess, onLogoutFailed }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { dataShop } = useStoreData();

  const handleLogout = async () => {
    try {
      const logoutResponse = await logoutUser();
      if (!logoutResponse.status) {
        onLogoutFailed();
        return;
      }
      logout();
      localStorage.removeItem('user_id');
      onLogoutSuccess();

      setTimeout(() => {
        navigate(routesConfig.home);
        window.location.reload();
      }, 1000);
    } catch (error) {
      onLogoutFailed();
    }
  };

  const handleStoreManagementClick = (tab) => {
    navigate(routesConfig.store_management, { state: { activeTab: tab } });
  };

  const handleProfileClick = (tab) => {
    navigate(routesConfig.profile, { state: { activeTab: tab } });
  };

  const isStoreManagementRoute = location.pathname === routesConfig.store_management;

  return (
    <div className={cx('menu-wrapper')}>
      <ul>
        {dataShop.length === 0 ? (
          <>
            <li className={cx('active')} onClick={() => handleProfileClick('Account')}>
              Thông tin tài khoản
            </li>
            <li onClick={() => handleProfileClick('MyOrder')}>Đơn hàng của tôi</li>
            <li onClick={() => handleProfileClick('FavProduct')}>Sản phẩm yêu thích</li>
            <li onClick={() => handleProfileClick('FavSupplier')}>NCC yêu thích</li>
            <li onClick={() => handleProfileClick('ViewedProduct')}>Sản phẩm đã xem</li>
            <li onClick={() => handleProfileClick('PostedRequest')}>Yêu cầu đã đăng</li>
            <li onClick={() => handleProfileClick('QuoteReceive')}>Báo giá đã gửi</li>
            <li onClick={handleLogout}>Đăng xuất</li>
          </>
        ) : isStoreManagementRoute ? (
          <>
            <li className={cx('active')} onClick={() => handleStoreManagementClick('Edit Profile')}>
              Quản lý gian hàng
            </li>

            <li onClick={() => handleProfileClick('Account')}>Thông tin tài khoản</li>
            <li onClick={() => handleStoreManagementClick('Order')}>Đơn hàng</li>
            <li onClick={() => handleStoreManagementClick('Supplier-All')}>Yêu cầu nhà cung cấp</li>
            <li onClick={() => handleStoreManagementClick('Message')}>Tin nhắn</li>
            <li onClick={() => handleStoreManagementClick('Product-All')}>Sản phẩm</li>
            {/* <li onClick={() => handleStoreManagementClick('Statistics')}>Thống kê</li> */}
            <li onClick={() => handleStoreManagementClick('Customer')}>Khách hàng</li>
            <li onClick={handleLogout}>Đăng xuất</li>
          </>
        ) : (
          <>
            <li className={cx('active')} onClick={() => handleProfileClick('Account')}>
              Thông tin tài khoản
            </li>
            <li onClick={() => handleStoreManagementClick('Edit Profile')}>Quản lý gian hàng</li>

            <li onClick={() => handleProfileClick('MyOrder')}>Đơn hàng của tôi</li>
            <li onClick={() => handleProfileClick('FavProduct')}>Sản phẩm yêu thích</li>
            <li onClick={() => handleProfileClick('FavSupplier')}>NCC yêu thích</li>
            <li onClick={() => handleProfileClick('ViewedProduct')}>Sản phẩm đã xem</li>
            <li onClick={() => handleProfileClick('PostedRequest')}>Yêu cầu đã đăng</li>
            <li onClick={() => handleProfileClick('QuoteReceive')}>Báo giá đã gửi</li>
            <li onClick={handleLogout}>Đăng xuất</li>
          </>
        )}
      </ul>
    </div>
  );
}

export default memo(Wrapper);

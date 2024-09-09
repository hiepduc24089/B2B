import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import routesConfig from '~/config/routes';
import { images } from '~/assets/images';
import Search from '../Search/Search';
import { useAuth } from '~/context/AuthContext';
import { useStoreHeader } from '~/context/StoreHeaderContext';

const cx = classNames.bind(styles);

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isStoreHeaderVisible } = useStoreHeader();

  return (
    <header className={cx('wrapper', { 'no-box-shadow': isStoreHeaderVisible })}>
      <div className={cx('inner', 'container')}>
        <div className={cx('row', 'align-items-center', 'justify-content-between')}>
          <div className={cx('col-2')}>
            <Link to={routesConfig.home} className={cx('logo-link')}>
              <img src={images.logo} alt="B2B" />
            </Link>
          </div>
          <div className={cx('col-6', 'search-form')}>
            <Search />
          </div>
          <div className={cx('col-3', 'information-form')}>
            <div className={cx('icon-wrapper', 'd-flex', 'justify-content-between')}>
              <div className={cx('text-center', 'notification')}>
                <img src={images.noti} alt="Notification" />
                <p>Thông báo</p>
              </div>
              <Link to={routesConfig.shopping_cart} className={cx('icon-link')}>
                <div className={cx('text-center', 'shopping-cart')}>
                  <img src={images.shopping} alt="Shopping Cart" />
                  <p>Giỏ hàng</p>
                </div>
              </Link>
              <div className={cx('text-center', 'user-icon')}>
                <img src={images.user} alt="User Icon" />
                {isAuthenticated ? (
                  <Link to={routesConfig.profile} className={cx('icon-link')}>
                    <p>{user.name}</p>
                  </Link>
                ) : (
                  <p>
                    <Link to={routesConfig.login} className={cx('icon-link')}>
                      Đăng nhập
                    </Link>
                    /
                    <Link to={routesConfig.register} className={cx('icon-link')}>
                      Đăng ký
                    </Link>
                  </p>
                )}
              </div>
            </div>
            <Link to={routesConfig.store_management} className={cx('sell-with')}>
              <img src={cx(images.sell_with)} alt="Sell" />
              <span>Bán hàng cùng krmedi</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

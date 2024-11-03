import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import routesConfig from '~/config/routes';
import { images } from '~/assets/images';
import Search from '../Search/Search';
import { useAuth } from '~/context/AuthContext';
import { useStoreHeader } from '~/context/StoreHeaderContext';
import { useStoreData } from '~/context/StoreDataContext'; // Import useStoreData hook
import Tippy from '@tippyjs/react';
import { Wrapper as PopperWrapper } from '~/components/Layout/Popper';
import Success from '~/components/Layout/Popup/Success';
import Failed from '../Popup/Failed';

const cx = classNames.bind(styles);

function Header() {
  const { isAuthenticated, user } = useAuth();
  const { isStoreHeaderVisible } = useStoreHeader();
  const { dataShop } = useStoreData(); // Access dataShop from StoreDataContext
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccessLogout, setShowSuccessLogout] = useState(false);
  const [showFailedLogout, setShowFailedLogout] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(routesConfig.store_management, {
      state: { activeTab: dataShop.length === 0 ? 'Create Profile' : 'Edit Profile' },
    });
  };

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
                {isAuthenticated ? (
                  <>
                    <Link to={routesConfig.profile} className={cx('icon-link')} aria-expanded={isExpanded}>
                      <img src={images.user} alt="User Icon" />
                    </Link>
                    <Tippy
                      interactive={true}
                      placement="bottom-end"
                      hideOnClick={false}
                      delay={[0, 700]}
                      offset={[12, 8]}
                      onShow={() => setIsExpanded(true)}
                      onHide={() => setIsExpanded(false)}
                      render={(attrs) => (
                        <div
                          className={cx('menu-dropdown')}
                          tabIndex="-1"
                          {...attrs}
                          style={{ display: isExpanded ? 'block' : 'none' }}
                        >
                          <PopperWrapper
                            onLogoutSuccess={() => setShowSuccessLogout(true)}
                            onLogoutFailed={() => setShowFailedLogout(true)}
                          />
                        </div>
                      )}
                    >
                      <Link to={routesConfig.profile} className={cx('icon-link')} aria-expanded={isExpanded}>
                        <p>{user.name}</p>
                      </Link>
                    </Tippy>
                  </>
                ) : (
                  <>
                    <Link to={routesConfig.login} className={cx('icon-link')}>
                      <img src={images.user} alt="User Icon" />
                    </Link>
                    <p>
                      <Link to={routesConfig.login} className={cx('icon-link')}>
                        Đăng nhập
                      </Link>
                      /
                      <Link to={routesConfig.register} className={cx('icon-link')}>
                        Đăng ký
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </div>
            <button onClick={handleNavigate} className={cx('sell-with')}>
              <img src={cx(images.sell_with)} alt="Sell" />
              <span>Bán hàng cùng krmedi</span>
            </button>
          </div>
        </div>
      </div>
      {showSuccessLogout && <Success message="Đăng xuất thành công" onClose={() => setShowSuccessLogout(false)} />}
      {showFailedLogout && <Failed message="Đăng xuất thất bại" onClose={() => setShowFailedLogout(false)} />}
    </header>
  );
}

export default Header;

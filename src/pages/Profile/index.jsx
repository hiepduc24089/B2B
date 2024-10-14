import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import Account from './component/Account';
import MyOrder from './component/MyOrder';
import FavProduct from './component/FavProduct';
import FavSupplier from './component/FavSupplier';
import ViewedProduct from './component/ViewedProduct';
import PostedRequest from './component/PostedRequest';
import QuoteReceive from './component/QuoteReceive';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function Profile() {
  const location = useLocation();
  const { activeTab: initialActiveTab } = location.state || {};

  const [activeTab, setActiveTab] = useState(initialActiveTab || 'Account');

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  const handleMainItemClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Account':
        return <Account />;
      case 'MyOrder':
        return <MyOrder />;
      case 'FavProduct':
        return <FavProduct />;
      case 'FavSupplier':
        return <FavSupplier />;
      case 'ViewedProduct':
        return <ViewedProduct />;
      case 'PostedRequest':
        return <PostedRequest />;
      case 'QuoteReceive':
        return <QuoteReceive />;
      default:
        return <Account />;
    }
  };

  return (
    <>
      <SubTitle />
      <div className={cx('profile-management')}>
        <div className={cx('side-bar')}>
          <div
            className={cx({ active: activeTab === 'Account' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('Account')}
          >
            <span className={cx('title')}>Thông tin tài khoản</span>
          </div>
          <div
            className={cx({ active: activeTab === 'MyOrder' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('MyOrder')}
          >
            <span className={cx('title')}>Đơn hàng của tôi</span>
          </div>
          <div
            className={cx({ active: activeTab === 'FavProduct' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('FavProduct')}
          >
            <span className={cx('title')}>Sản phẩm yêu thích</span>
          </div>
          <div
            className={cx({ active: activeTab === 'FavSupplier' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('FavSupplier')}
          >
            <span className={cx('title')}>NCC yêu thích</span>
          </div>
          <div
            className={cx({ active: activeTab === 'ViewedProduct' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('ViewedProduct')}
          >
            <span className={cx('title')}>Sản phẩm đã xem</span>
          </div>
          <div
            className={cx({ active: activeTab === 'PostedRequest' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('PostedRequest')}
          >
            <span className={cx('title')}>Yêu cầu đã đăng</span>
          </div>
          <div
            className={cx({ active: activeTab === 'QuoteReceive' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('QuoteReceive')}
          >
            <span className={cx('title')}>Báo giá đã gửi</span>
          </div>
        </div>
        <div className={cx('main-content')}>{renderContent()}</div>
      </div>
    </>
  );
}

export default memo(Profile);

import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreManagement.module.scss';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import Home from './component/Home';
import CreateProfile from './component/CreateProfile';
import Order from './component/Order';
import Price from './component/Price';
import Message from './component/Message';
import Product from './component/Product';
import Statistics from './component/Statistics';
import Customer from './component/Customer';
import { imagesStore } from '~/assets/images';

const cx = classNames.bind(styles);

function StoreManagement() {
  const [activeTab, setActiveTab] = useState('Create Profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Create Profile':
        return <CreateProfile />;
      case 'Order':
        return <Order />;
      case 'Price':
        return <Price />;
      case 'Message':
        return <Message />;
      case 'Product':
        return <Product />;
      case 'Statistics':
        return <Statistics />;
      case 'Customer':
        return <Customer />;
      default:
        return null;
    }
  };

  return (
    <>
      <SubTitle />
      <div className={cx('store-management')}>
        <div className={cx('side-bar')}>
          <div className={cx({ active: activeTab === 'Home' }, 'item-wrapper')} onClick={() => setActiveTab('Home')}>
            <img src={imagesStore.store_home} alt="Trang Chủ" />
            <span className={cx('title')}>Trang chủ</span>
          </div>
          <div className={cx({ active: activeTab === 'Order' }, 'item-wrapper')} onClick={() => setActiveTab('Order')}>
            <img src={imagesStore.store_order} alt="Đơn Hàng" />
            <span className={cx('title')}>Đơn hàng</span>
          </div>
          <div className={cx({ active: activeTab === 'Price' }, 'item-wrapper')} onClick={() => setActiveTab('Price')}>
            <img src={imagesStore.store_price} alt="Yêu cầu báo giá" />
            <span className={cx('title')}>Yêu cầu báo giá</span>
          </div>
          <div
            className={cx({ active: activeTab === 'Message' }, 'item-wrapper')}
            onClick={() => setActiveTab('Message')}
          >
            <img src={imagesStore.store_message} alt="Tin nhắn" />
            <span className={cx('title')}>Tin nhắn</span>
          </div>
          <div
            className={cx({ active: activeTab === 'Product' }, 'item-wrapper')}
            onClick={() => setActiveTab('Product')}
          >
            <img src={imagesStore.store_product} alt="Sản phẩm" />
            <span className={cx('title')}>Sản phẩm</span>
          </div>
          <div
            className={cx({ active: activeTab === 'Statistics' }, 'item-wrapper')}
            onClick={() => setActiveTab('Statistics')}
          >
            <img src={imagesStore.store_statistics} alt="Thống kê" />
            <span className={cx('title')}>Thống kê</span>
          </div>
          <div
            className={cx({ active: activeTab === 'Customer' }, 'item-wrapper')}
            onClick={() => setActiveTab('Customer')}
          >
            <img src={imagesStore.store_customer} alt="Khách hàng" />
            <span className={cx('title')}>Khách hàng</span>
          </div>
        </div>
        <div className={cx('main-content')}>{renderContent()}</div>
      </div>
    </>
  );
}

export default memo(StoreManagement);

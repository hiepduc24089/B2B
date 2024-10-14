import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreManagement.module.scss';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import Home from './component/Home';
import CreateProfile from './component/CreateProfile';
import Order from './component/Order';
import Message from './component/Message';
import Statistics from './component/Statistics';
import Customer from './component/Customer';
import { imagesStore } from '~/assets/images';
import ProductAll from './subComponent/ProductAll';
import ProductAdd from './subComponent/ProductAdd';
import ProductRemaining from './subComponent/ProductRemaining';
import ProductSale from './subComponent/ProductSale';
import SupplierAll from './subComponent/SupplierAll';
import SupplierPrice from './subComponent/SupplierPrice';
import SupplierPost from './subComponent/SupplierPost';
import ProductEdit from './subComponent/ProductEdit';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function StoreManagement() {
  const location = useLocation();
  const { activeTab: initialActiveTab } = location.state || {};

  const [activeTab, setActiveTab] = useState(initialActiveTab || 'Create Profile');
  const [activeSubItem, setActiveSubItem] = useState(initialActiveTab || 'Create Profile');
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [isSupplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const [productEditID, setProductEditID] = useState('');

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
      setActiveSubItem(initialActiveTab);
    }
  }, [initialActiveTab]);
  const renderContent = () => {
    switch (activeSubItem) {
      case 'Home':
        return <Home onAddProductClick={() => handleProductComponentClick('Product-Add')} />;
      case 'Create Profile':
        return <CreateProfile />;
      case 'Order':
        return <Order />;
      case 'Message':
        return <Message />;
      case 'Statistics':
        return <Statistics />;
      case 'Customer':
        return <Customer />;
      case 'Product-All':
        return (
          <ProductAll onEditProductClick={(productID) => handleEditProductComponentClick('Product-Edit', productID)} />
        );
      case 'Product-Add':
        return <ProductAdd onSubmitSuccess={handleProductSubmitSuccess} />;
      case 'Product-Remaining':
        return <ProductRemaining />;
      case 'Product-Sale':
        return <ProductSale />;
      case 'Product-Edit':
        return <ProductEdit productID={productEditID} onSubmitSuccess={handleProductSubmitSuccess} />;
      case 'Supplier-All':
        return <SupplierAll onFindSupplierClick={() => handleSupplierComponentClick('Supplier-Post')} />;
      case 'Supplier-Price':
        return <SupplierPrice />;
      case 'Supplier-Post':
        return <SupplierPost />;
      default:
        return <CreateProfile />;
    }
  };

  const handleMainItemClick = (tab) => {
    setActiveTab(tab);
    setProductDropdownOpen(false);
    setSupplierDropdownOpen(false);
    setActiveSubItem(tab);
  };

  const toggleDropdown = (dropdownType) => {
    if (dropdownType === 'product') {
      setActiveTab('Product'); // Set active tab to Product
      setProductDropdownOpen((prevState) => !prevState);
      setSupplierDropdownOpen(false);
      setActiveSubItem('Product-All');
    } else if (dropdownType === 'supplier') {
      setActiveTab('Supplier'); // Set active tab to Supplier
      setSupplierDropdownOpen((prevState) => !prevState);
      setProductDropdownOpen(false);
      setActiveSubItem('Supplier-All');
    }
  };

  const handleSubItemClick = (tab) => {
    setActiveSubItem(tab);
  };

  const handleProductComponentClick = (tab) => {
    setActiveTab('Product');
    setProductDropdownOpen(true);
    setActiveSubItem(tab);
  };

  const handleSupplierComponentClick = (tab) => {
    setActiveTab('Supplier');
    setSupplierDropdownOpen(true);
    setActiveSubItem(tab);
  };

  const handleEditProductComponentClick = (tab, productID) => {
    setActiveTab('Product');
    setProductDropdownOpen(true);
    setActiveSubItem(tab);
    setProductEditID(productID);
  };

  const handleProductSubmitSuccess = () => {
    setActiveSubItem('Product-All');
  };
  return (
    <>
      <SubTitle />
      <div className={cx('store-management')}>
        <div className={cx('side-bar')}>
          <div
            className={cx({ active: activeTab === 'Home' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('Home')}
          >
            <img src={imagesStore.store_home} alt="Trang Chủ" />
            <span className={cx('title')}>Trang chủ</span>
          </div>
          <div
            className={cx({ active: activeTab === 'Order' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('Order')}
          >
            <img src={imagesStore.store_order} alt="Đơn Hàng" />
            <span className={cx('title')}>Đơn hàng</span>
          </div>
          <div className={cx({ active: activeTab === 'Supplier' }, 'item-with-sub')}>
            <div className={cx('item-wrapper')}>
              <img src={imagesStore.store_price} alt="Yêu cầu báo giá" />
              <span className={cx('title')} onClick={() => toggleDropdown('supplier')}>
                Yêu cầu nhà cung cấp
              </span>
            </div>
            {/* Submenu for Supplier */}
            {isSupplierDropdownOpen && (
              <div className={cx('dropdown')}>
                <div
                  className={cx('dropdown-item', { 'sub-item-active': activeSubItem === 'Supplier-All' })}
                  onClick={() => handleSubItemClick('Supplier-All')}
                >
                  Tất cả yêu cầu
                </div>
                <div
                  className={cx('dropdown-item', { 'sub-item-active': activeSubItem === 'Supplier-Price' })}
                  onClick={() => handleSubItemClick('Supplier-Price')}
                >
                  Báo giá đã nhận
                </div>
                <div
                  className={cx('dropdown-item', { 'sub-item-active': activeSubItem === 'Supplier-Post' })}
                  onClick={() => handleSubItemClick('Supplier-Post')}
                >
                  Đăng yêu cầu
                </div>
              </div>
            )}
          </div>
          <div
            className={cx({ active: activeTab === 'Message' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('Message')}
          >
            <img src={imagesStore.store_message} alt="Tin nhắn" />
            <span className={cx('title')}>Tin nhắn</span>
          </div>
          <div className={cx({ active: activeTab === 'Product' }, 'item-with-sub')}>
            <div className={cx('item-wrapper')}>
              <img src={imagesStore.store_product} alt="Sản phẩm" />
              <div className={cx('sub-item', 'title-with-sub')}>
                <span className={cx('title')} onClick={() => toggleDropdown('product')}>
                  Sản phẩm
                </span>
              </div>
            </div>
            {/* Submenu for Products */}
            {isProductDropdownOpen && (
              <div className={cx('dropdown')}>
                <div
                  className={cx('dropdown-item', { 'sub-item-active': activeSubItem === 'Product-All' })}
                  onClick={() => handleSubItemClick('Product-All')}
                >
                  Tất cả Sản phẩm
                </div>
                <div
                  className={cx('dropdown-item', { 'sub-item-active': activeSubItem === 'Product-Add' })}
                  onClick={() => handleSubItemClick('Product-Add')}
                >
                  Thêm sản phẩm
                </div>
                <div
                  className={cx('dropdown-item', { 'sub-item-active': activeSubItem === 'Product-Remaining' })}
                  onClick={() => handleSubItemClick('Product-Remaining')}
                >
                  Tồn kho
                </div>
                <div
                  className={cx('dropdown-item', { 'sub-item-active': activeSubItem === 'Product-Sale' })}
                  onClick={() => handleSubItemClick('Product-Sale')}
                >
                  Giảm giá
                </div>
              </div>
            )}
          </div>
          <div
            className={cx({ active: activeTab === 'Statistics' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('Statistics')}
          >
            <img src={imagesStore.store_statistics} alt="Thống kê" />
            <span className={cx('title')}>Thống kê</span>
          </div>
          <div
            className={cx({ active: activeTab === 'Customer' }, 'item-wrapper')}
            onClick={() => handleMainItemClick('Customer')}
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

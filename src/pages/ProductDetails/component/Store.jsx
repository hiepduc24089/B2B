import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../ProductDetails.module.scss';

import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function Store({ seller, loading }) {
  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('store-details')}>
          <div className={cx('store-header')}>
            <img src={seller.avatar} alt={seller.name} />
            <h3>{seller.name}</h3>
            <p>{seller.location}</p>
          </div>
          <div className={cx('store-information')}>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Sản phẩm</span>
              <span className={cx('number')}>{seller.product}</span>
            </div>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Người theo dõi</span>
              <span className={cx('number')}>{seller.followers}</span>
            </div>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Lượt liên hệ</span>
              <span className={cx('number')}>{seller.contacts}</span>
            </div>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Tỷ lệ phản hồi</span>
              <span className={cx('number')}>{seller.response_rate}</span>
            </div>
            <button className={cx('follow-btn')}>Theo dõi</button>
            <button className={cx('phone-btn')}>Xem SĐT</button>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div className={cx('store-contact')}>
        <p>Để hỏi về giá sản phẩm, sản phẩm liên quan hoặc các thông tin khác:</p>
        <button>Liên hệ ngay</button>
      </div>
      <div className={cx('store-wrapper')}>{renderContent()}</div>
    </>
  );
}

export default memo(Store);

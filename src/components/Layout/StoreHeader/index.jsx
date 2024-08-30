import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreHeader.module.scss';
import { images } from '~/assets/images';
import { useStoreHeader } from '~/context/StoreHeaderContext';
import { API_HOST } from '~/config/host';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function StoreHeader() {
  const { storeName, storeAddress, storeAvatar, storeID } = useStoreHeader();

  return (
    <div className={cx('store-header')}>
      <div className={cx('container')}>
        <div className={cx('store-wrapper')}>
          <div className={cx('store-details')}>
            <Link
              to={{
                pathname: `${routesConfig.store_information.replace(':id', storeID)}`,
              }}
              state={{ shop_id: storeID }}
            >
              <div className={cx('store-infor')}>
                <img src={`${API_HOST}${storeAvatar}`} alt="Avatar" />
                <div>
                  <h3 className={cx('name')}>{storeName || 'N/A'}</h3>
                  <p className={cx('location')}>{storeAddress || 'N/A'}</p>
                </div>
              </div>
            </Link>
            <div className={cx('store-followers')}>
              <span>
                <span className={cx('fw-bold-600')}>38</span> Theo dõi
              </span>
              <span>
                <span className={cx('fw-bold-600')}>106</span> Liên hệ
              </span>
              <span>
                <span className={cx('fw-bold-600')}>50%</span> Phản hồi
              </span>
            </div>
          </div>
          <div className={cx('store-button')}>
            <div className={cx('follow')}>
              <img src={images.follow} alt="Follow" />
              <button>Theo dõi</button>
            </div>
            <div className={cx('see-phone')}>
              <img src={images.phone} alt="Phone" />
              <button>Xem SĐT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(StoreHeader);

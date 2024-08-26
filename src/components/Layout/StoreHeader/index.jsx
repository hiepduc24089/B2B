import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreHeader.module.scss';
import { images, imagesSeller } from '~/assets/images';

const cx = classNames.bind(styles);

function StoreHeader() {
  return (
    <div className={cx('store-header')}>
      <div className={cx('container')}>
        <div className={cx('store-wrapper')}>
          <div className={cx('store-details')}>
            <div className={cx('store-infor')}>
              <img src={imagesSeller.seller_avatar} alt="Avatar" />
              <div>
                <h3 className={cx('name')}>OIC NanoPharma</h3>
                <p className={cx('location')}>Q. Thanh Xuan, Hà Nội</p>
              </div>
            </div>
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

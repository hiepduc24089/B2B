import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { imagesStore } from '~/assets/images';

const cx = classNames.bind(styles);

function Home({ onAddProductClick }) {
  return (
    <>
      <div className={cx('list-job-wrapper', 'box-wrapper')}>
        <h3 className={cx('title')}>Danh sách cần làm</h3>
        <h5 className={cx('sub-title', 'mb-0')}>Những công việc chưa được hoàn tất</h5>
        <div className={cx('list-job')}>
          <div className={cx('job-item')}>
            <span className={cx('number')}>0</span>
            <p>Chờ xác nhận</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>0</span>
            <p>Chờ lấy hàng</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>0</span>
            <p>Đã xử lý </p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>0</span>
            <p>Sản phẩm hết hàng</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>0</span>
            <p>Sản phẩm bị từ chồi</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>0</span>
            <p>Tin nhắn chưa đọc</p>
          </div>
        </div>
      </div>
      <div className={cx('post-product-wrapper', 'box-wrapper')}>
        <h3 className={cx('title')}>Bạn chưa đăng sản phẩm nào</h3>
        <h5 className={cx('sub-title', 'mb-0')}>Những công việc chưa được hoàn tất</h5>
        <div className={cx('note-content')}>
          <img src={imagesStore.productNote} alt="Note" />
          <h5 className={cx('note-title')}>
            Hãy đăng sản phẩm đầu tiên và bắt đầu tiếp cận hàng triệu khách hàng sỉ trên Krmedi
          </h5>
        </div>
        <div className={cx('submit-btn')}>
          <button className={cx('post-product')} onClick={onAddProductClick}>
            {' '}
            Đăng sản phẩm
          </button>
        </div>
      </div>
    </>
  );
}

export default memo(Home);

import React, { useEffect, useState, memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { imagesStore } from '~/assets/images';
import { getStatistic } from '~/api/statistic';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function Home({ onAddProductClick }) {
  const [pendingOrder, setPendingOrder] = useState('');
  const [awaitingOrder, setAwaitingOrder] = useState('');
  const [completeOrder, setCompleteOrder] = useState('');
  const [outStockOrder, setOutStockOrder] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistic = async () => {
      try {
        const response = await getStatistic();
        if (response && response.data) {
          setPendingOrder(response.data.orders.pending_orders);
          setAwaitingOrder(response.data.orders.awaiting_orders);
          setCompleteOrder(response.data.orders.completed_orders);
          setOutStockOrder(response.data.out_of_stock_products);
        }
      } catch (error) {
        console.error('Error fetching statistic:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistic();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <div className={cx('list-job-wrapper', 'box-wrapper')}>
        <h3 className={cx('title')}>Danh sách cần làm</h3>
        <h5 className={cx('sub-title', 'mb-0')}>Những công việc chưa được hoàn tất</h5>
        <div className={cx('list-job')}>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{pendingOrder}</span>
            <p>Chờ xác nhận</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{awaitingOrder}</span>
            <p>Chờ lấy hàng</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{completeOrder}</span>
            <p>Đã xử lý </p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{outStockOrder}</span>
            <p>Sản phẩm hết hàng</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>0</span>
            <p>Sản phẩm bị từ chối</p>
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

import React, { useEffect, useState, memo } from 'react';
import classNames from 'classnames/bind';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './Home.module.scss';
import { imagesStore } from '~/assets/images';
import { getStatistic } from '~/api/statistic';
import LoadingIndicator from '~/components/Loading';
import AnalyticsComponent from '~/components/GA4';

const cx = classNames.bind(styles);

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

  const [loadingChart, setLoadingChart] = useState(true);
  const [ga4Data, setGa4Data] = useState([]);
  const [ga4Labels, setGa4Labels] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [orderLabels, setOrderLabels] = useState([]);

  useEffect(() => {
    const fetchStatistic = async () => {
      try {
        const response = await getStatistic();
        if (response && response.data) {
          // Format ga4Labels to dd-mm
          const ga4 = response.data.ga4;
          const ga4Labels = ga4.map((entry) => {
            const dateStr = entry.date;
            const formattedDate = `${dateStr.slice(6, 8)}-${dateStr.slice(4, 6)}`;
            return formattedDate;
          });
          const screenPageViews = ga4.map((entry) => parseInt(entry.screenPageViews, 10));

          // Sort dailyOrders by date and format to dd-mm
          const dailyOrders = response.data.daily_orders;
          const sortedOrders = dailyOrders.sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
          const orderLabels = sortedOrders.map((order) => {
            const dateStr = order.order_date;
            const formattedDate = `${dateStr.slice(8, 10)}-${dateStr.slice(5, 7)}`;
            return formattedDate;
          });
          const totalOrders = sortedOrders.map((order) => order.total_orders);

          // Set the fetched and formatted data to the state
          setGa4Labels(ga4Labels);
          setGa4Data(screenPageViews);
          setOrderLabels(orderLabels);
          setOrderData(totalOrders);
        }
      } catch (error) {
        console.error('Error fetching statistic:', error);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchStatistic();
  }, []);

  // Traffic Data for the chart
  const trafficData = {
    labels: ga4Labels,
    datasets: [
      {
        label: 'Lưu lượng truy cập',
        data: ga4Data,
        fill: false,
        backgroundColor: '#C084FC',
        borderColor: '#C084FC',
        tension: 0.4,
      },
    ],
  };

  // Interaction Data for the chart
  const interactionData = {
    labels: orderLabels,
    datasets: [
      {
        label: 'Tổng số đơn hàng',
        data: orderData,
        fill: false,
        backgroundColor: '#C084FC',
        borderColor: '#C084FC',
        tension: 0.4,
      },
    ],
  };

  if (loading && loadingChart) {
    return <LoadingIndicator />;
  }
  console.log(pendingOrder);
  return (
    <>
      <div className={cx('list-job-wrapper', 'box-wrapper')}>
        <h3 className={cx('title')}>Danh sách cần làm</h3>
        <h5 className={cx('sub-title', 'mb-0')}>Những công việc chưa được hoàn tất</h5>
        <div className={cx('list-job')}>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{pendingOrder || 0}</span>
            <p>Chờ xác nhận</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{awaitingOrder || 0}</span>
            <p>Chờ lấy hàng</p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{completeOrder || 0}</span>
            <p>Đã xử lý </p>
          </div>
          <div className={cx('job-item')}>
            <span className={cx('number')}>{outStockOrder || 0}</span>
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
      <AnalyticsComponent />
      <div className={cx('chart-container')}>
        <h3>Số liệu thống kê</h3>
        <p>Lưu lượng truy cập theo ngày</p>
        <Line data={trafficData} />
      </div>

      <div className={cx('chart-container')}>
        <h3>Số liệu thống kê</h3>
        <p>Tổng số đơn hàng theo ngày</p>
        <Line data={interactionData} />
      </div>
    </>
  );
}

export default memo(Home);

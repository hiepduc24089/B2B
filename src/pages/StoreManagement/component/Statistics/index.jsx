import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './Statistics.module.scss';
import AnalyticsComponent from '~/components/GA4';
import { getStatistic } from '~/api/statistic';

const cx = classNames.bind(styles);

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Statistics() {
  const [ga4Data, setGa4Data] = useState([]);
  const [ga4Labels, setGa4Labels] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [orderLabels, setOrderLabels] = useState([]);
  const [completeOrder, setCompleteOrder] = useState('');
  const [cancelOrder, setCancelOrder] = useState('');

  useEffect(() => {
    const fetchStatistic = async () => {
      try {
        const response = await getStatistic();
        if (response && response.data) {
          const ga4 = response.data.ga4;
          const ga4Labels = ga4.map((entry) => entry.date);
          const screenPageViews = ga4.map((entry) => parseInt(entry.screenPageViews, 10));

          const dailyOrders = response.data.daily_orders;
          const orderLabels = dailyOrders.map((order) => order.order_date);
          const totalOrders = dailyOrders.map((order) => order.total_orders);

          setGa4Labels(ga4Labels);
          setGa4Data(screenPageViews);
          setOrderLabels(orderLabels);
          setOrderData(totalOrders);
          setCompleteOrder(response.data.orders.completed_orders);
          setCancelOrder(response.data.orders.cancels_orders);
        }
      } catch (error) {
        console.error('Error fetching statistic:', error);
      }
    };

    fetchStatistic();
  }, []);

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

  return (
    <div className={cx('dashboard-container')}>
      <AnalyticsComponent />

      <div className={cx('summary-boxes')}>
        <div className={cx('summary-box')}>
          <h3>0</h3>
          <p>Lượt hiển thị</p>
        </div>
        <div className={cx('summary-box')}>
          <h3>0</h3>
          <p>Lượt xem</p>
        </div>
        <div className={cx('summary-box')}>
          <h3>0</h3>
          <p>Lượt nhận tin</p>
        </div>
        <div className={cx('summary-box')}>
          <h3>0</h3>
          <p>Lượt xem SDT</p>
        </div>
        <div className={cx('summary-box')}>
          <h3>{completeOrder}</h3>
          <p>Đơn hàng</p>
        </div>
        <div className={cx('summary-box')}>
          <h3>{cancelOrder}</h3>
          <p>Đơn huỷ</p>
        </div>
      </div>

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
    </div>
  );
}

export default memo(Statistics);

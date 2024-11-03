import React, { memo, useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './MyOrder.module.scss';
import { useNavigate } from 'react-router-dom';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { fetchMyOrder } from '~/api/profile';
import routesConfig from '~/config/routes';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import Warning from '~/components/Layout/Popup/Warning';
import Failed from '~/components/Layout/Popup/Failed';
import Success from '~/components/Layout/Popup/Success';
import { cancelOrder } from '~/api/store';

const cx = classNames.bind(styles);

function MyOrder() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState(7);
  const [state, setState] = useState({
    loading: true,
    listOrder: [],
  });
  const [searchKey, setSearchKey] = useState('');

  const { loading, listOrder } = state;

  const statuses = {
    0: 'Chờ xác nhận',
    1: 'Chờ lấy hàng',
    2: 'Đang giao',
    3: 'Hoàn thành',
    4: 'Đã huỷ',
    5: 'Hoàn đơn',
  };

  const listRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    isDown = true;
    listRef.current.classList.add('grabbing');
    startX = e.pageX - listRef.current.offsetLeft;
    scrollLeft = listRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    listRef.current.classList.remove('grabbing');
  };

  const handleMouseUp = () => {
    isDown = false;
    listRef.current.classList.remove('grabbing');
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    listRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleActive = (index) => {
    setActiveStatus(index);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const getListOrderResponse = await fetchMyOrder(searchKey);

        if (!getListOrderResponse.status) {
          setState({
            loading: false,
            listOrder: [],
          });
          return;
        }

        setState({
          loading: false,
          listOrder: getListOrderResponse.data,
        });
      } catch (error) {
        console.error('Fetch order failed:', error);
        alert('Lấy thông tin đơn hàng thất bại.');
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = async () => {
    try {
      setState({ ...state, loading: true });
      const getListOrderResponse = await fetchMyOrder(searchKey);

      setState({
        loading: false,
        listOrder: getListOrderResponse.data,
      });
    } catch (error) {
      console.error('Fetch order failed:', error);
      alert('Lấy thông tin đơn hàng thất bại.');
    }
  };

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const filteredOrders =
    activeStatus === 7 ? listOrder || [] : (listOrder || []).filter((order) => order.status === activeStatus);

  const handleLinkToOrderDetail = (order_id) => {
    navigate(routesConfig.order_detail.replace(':id', order_id));
  };

  const handleSearchChange = (e) => {
    setSearchKey(e.target.value);
  };

  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [showSuccessCancel, setShowSuccessCancel] = useState(false);
  const [showFailedCancel, setShowFailedCancel] = useState(false);
  const [showWarningCancel, setShowWarningCancel] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Trigger warning popup when cancel is clicked
  const handleCancelOrder = (order_id) => {
    setOrderToCancel(order_id);
    setShowWarningCancel(true);
  };

  // Confirm and cancel order
  const confirmCancelOrder = async () => {
    setLoadingFullScreen(true);
    setShowWarningCancel(false);
    try {
      const response = await cancelOrder({ order_id: orderToCancel });

      if (response.status) {
        setShowSuccessCancel(true);
        const updatedOrders = listOrder.map((order) =>
          order.order_id === orderToCancel ? { ...order, status: 4 } : order,
        );
        setState({ ...state, listOrder: updatedOrders });
      } else {
        setShowFailedCancel(true);
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      setShowFailedCancel(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div
        className={cx('list-status')}
        ref={listRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <ul>
          <li key="7" className={cx({ active: activeStatus === 7 })} onClick={() => handleActive(7)}>
            Tất cả
          </li>
          {Object.entries(statuses).map(([index, status]) => (
            <li
              key={index}
              className={cx({ active: parseInt(index) === activeStatus })}
              onClick={() => handleActive(parseInt(index))}
            >
              {status}
            </li>
          ))}
        </ul>
      </div>
      <div className={cx('search-field-box')}>
        <div className={cx('search-field-wrapper')}>
          <HeadlessTippy>
            <div className={cx('search')}>
              <input
                className={cx('search-field', 'form-control')}
                placeholder="Nhập từ khoá để tìm kiếm"
                spellCheck={false}
                value={searchKey}
                onChange={handleSearchChange}
              />
              <button className={cx('search-btn', 'd-flex')} onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
          </HeadlessTippy>
        </div>
      </div>
      {loading ? (
        <LoadingIndicator />
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <div className={cx('order-wrapper')}>
          {filteredOrders.map((order) => (
            <div className={cx('order-item')} key={order.order_id}>
              <div className={cx('status')}>
                <span className={cx('black-text')}>#{order.order_code}</span>
                <span className={cx('black-text')}>đặt lúc {order.date}</span>
                <span className={cx('yellow-text')}>{statuses[order.status]}</span>
              </div>
              <div className={cx('list-product')}>
                {order.items.map((product, index) => (
                  <div className={cx('product-detail')} key={index}>
                    <div className={cx('title-image')}>
                      <img src={`${API_HOST}${product.src[0]}`} alt={product.name} />
                      <h5 className={cx('product-name')}>{product.name}</h5>
                    </div>
                    <span className={cx('unit-price')}>
                      <span className={cx('black-text')}>{formatPrice(product.price)}đ</span>
                      <span className={cx('grey-text')}>/{product.unit}</span>
                    </span>
                    <span className={cx('quantity')}>x{product.quantity}</span>
                    <span className={cx('black-text')}>{formatPrice(product.total_money)}đ</span>
                  </div>
                ))}
              </div>
              <div className={cx('total-wrapper')}>
                <h6 className={cx('title')}>Tổng thanh toán</h6>
                <span className={cx('total')}>{formatPrice(order.total_payment)}đ</span>
              </div>
              <div className={cx('button-wrapper')}>
                <button className={cx('cancel')} onClick={() => handleCancelOrder(order.order_id)}>
                  Huỷ đơn
                </button>
                <button className={cx('detail')} onClick={() => handleLinkToOrderDetail(order.order_id)}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={cx('not-found-order')}>Không tìm thấy đơn hàng</p>
      )}
      {showSuccessCancel && <Success message="Huỷ đơn hàng thành công" onClose={() => setShowSuccessCancel(false)} />}
      {showFailedCancel && <Failed message="Huỷ đơn hàng thất bại" onClose={() => setShowFailedCancel(false)} />}
      {showWarningCancel && (
        <Warning
          message="Bạn có muốn huỷ đơn hàng này?"
          onClose={() => setShowWarningCancel(false)}
          onOk={confirmCancelOrder}
        />
      )}
    </>
  );
}

export default memo(MyOrder);

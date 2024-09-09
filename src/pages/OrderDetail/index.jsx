import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
import { useParams } from 'react-router-dom';
import { imagesCart } from '~/assets/images';
import { fetchOrderDetail } from '~/api/order';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function OrderDetail() {
  const { id: order_id } = useParams();

  const [state, setState] = useState({
    loading: true,
    dataOrderDetail: [],
  });

  const { loading, dataOrderDetail } = state;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const getOrderDetailResponse = await fetchOrderDetail(order_id);

        if (!getOrderDetailResponse.status) {
          alert('Lấy thông tin đơn hàng thất bại, vui lòng thử lại');
          return;
        }

        setState({
          loading: false,
          dataOrderDetail: getOrderDetailResponse.data,
        });
      } catch (error) {
        console.error('Fetch order failed:', error);
        alert('Lấy thông tin đơn hàng thất bại, vui lòng thử lại');
      }
    };
    fetchDetail();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className={cx('order-wrapper')}>
          <div className={cx('order-information')}>
            <div className={cx('box-wrapper', 'information-wrapper')}>
              <div className={cx('address')}>
                <h5 className={cx('title')}>Địa chỉ giao hàng</h5>
                <h6 className={cx('sub-title')}>
                  {dataOrderDetail.customer_name} - {dataOrderDetail.customer_phone}
                </h6>
                <p className={cx('address-detail')}>{dataOrderDetail.full_address}</p>
              </div>
              <div className={cx('shipping')}>
                <h5 className={cx('title')}>Đơn vị vận chuyển</h5>
                <h6 className={cx('sub-title')}>Giao hàng nhanh - tiêu chuẩn</h6>
                <p className={cx('shipping-note')}>Dự kiến nhận hàng vào 7 tháng 6,2024</p>
                <span className={cx('shipping-note')}>
                  Phí vận chuyển:{' '}
                  <span className={cx('text-primary')}>{formatPrice(dataOrderDetail.shipping_fee)}đ</span>
                </span>
              </div>
              <div className={cx('payment-type')}>
                <h5 className={cx('title')}>Phương thức thanh toán</h5>
                <h6 className={cx('payment-detail')}>Thanh toán khi nhận hàng</h6>
              </div>
            </div>
            <div className={cx('box-wrapper', 'store-product')}>
              <div className={cx('store-product-details')}>
                <div className={cx('store-header')}>
                  <img src={imagesCart.store_icon} alt="Store Icon" />
                  <h5>{dataOrderDetail.shop_name}</h5>
                </div>
                {dataOrderDetail.items.map((product, index) => (
                  <div key={index} className={cx('product-wrapper')}>
                    <div className={cx('d-flex', 'col-md-10', 'product-names')}>
                      <img src={`${API_HOST}${product.src[0]}`} alt={product.name} className={cx('product-image')} />
                      <div style={{ marginLeft: '8px' }}>
                        <h5>{product.name}</h5>
                        <span className={cx('order-price')}>
                          Đơn giá:
                          <span className={cx('text-primary')} style={{ fontWeight: '600' }}>
                            {formatPrice(product.price)}đ
                          </span>
                          <span className={cx('text-grey')}>/ {product.unit}</span>
                        </span>
                      </div>
                    </div>
                    <div className={cx('quantity')}>x{product.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={cx('order-payment')}>
            <div className={cx('box-wrapper', 'order-payment-wrapper')}>
              <div className={cx('total-product')}>
                <span className={cx('title')}>Tổng tiền hàng</span>
                <span className={cx('price-black')}>{formatPrice(dataOrderDetail.commodity_money)}đ</span>
              </div>
              <div className={cx('total-shipping')}>
                <span className={cx('title')}>Phí vận chuyển</span>
                <span className={cx('price-black')}>{formatPrice(dataOrderDetail.shipping_fee)}đ</span>
              </div>
              <div className={cx('total-price')}>
                <span className={cx('title')}>Tổng tiền hàng</span>
                <span className={cx('price-primary')}>{formatPrice(dataOrderDetail.total_payment)}đ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(OrderDetail);

import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import { useLocation } from 'react-router-dom';
import LoadingIndicator from '~/components/Loading';
import { images, imagesCart, imagesFooter, imagesPayment } from '~/assets/images';
import { createPayment } from '~/api/payment';

const cx = classNames.bind(styles);
const BASE_URL = 'https://api-b2b.krmedi.vn';

function Payment() {
  const { state } = useLocation();
  const { checkoutData } = state || {};
  const [loading, setLoading] = useState(true);
  const [selectedShipping, setSelectedShipping] = useState({});
  const [paymentType, setPaymentType] = useState(1);
  const [usePoints, setUsePoints] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(1);
  const [exchangePoints, setExchangePoints] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Handle shipping option change for each store
  const handleShippingChange = (shopId, shippingCost) => {
    setSelectedShipping((prev) => ({
      ...prev,
      [shopId]: shippingCost,
    }));
  };

  const handleSubmitPayment = async () => {
    // Construct items payload for API
    const shopItems = checkoutData.map(({ shop_id, products }) => ({
      shop_id,
      note: 'alo',
      shipping_unit: selectedShipping[shop_id] === 23000 ? 'GHN' : 'GHTK',
      shipping_fee: selectedShipping[shop_id] || 0,
      products: products.map(({ product_id, quantity, price }) => ({
        product_id,
        quantity,
        price,
      })),
    }));

    const items = {
      deliver_address: deliveryAddress,
      shop_items: shopItems,
      type_payment: paymentType,
      exchange_points: usePoints ? exchangePoints : 50,
    };

    try {
      const response = await createPayment(items);
      console.log('Payment successful:', response);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  // Calculate total for each store (products + shipping)
  const calculateTotalEachStore = (shopId, products) => {
    const productTotal = products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    const shippingCost = selectedShipping[shopId] || 0;
    return productTotal + shippingCost;
  };

  // Calculate total price for all products
  const calculateTotalPrice = () => {
    return checkoutData?.reduce((total, shop) => {
      return (
        total +
        shop.products.reduce((subTotal, product) => {
          return subTotal + product.price * product.quantity;
        }, 0)
      );
    }, 0);
  };

  const calculateTotalShipping = () => {
    return Object.values(selectedShipping).reduce((total, shippingCost) => total + shippingCost, 0);
  };

  const calculateTotal = () => {
    return calculateTotalPrice() + calculateTotalShipping();
  };

  function renderContent() {
    if (loading) {
      return <LoadingIndicator />;
    } else if (!checkoutData) {
      return <div>No checkout data available.</div>;
    } else {
      return checkoutData.map(({ shop_id, shop_name, products }) => (
        <div key={shop_id} className={cx('store-product-details', 'box-wrapper')}>
          <div className={cx('store-header')}>
            <img src={imagesCart.store_icon} alt="Store Icon" />
            <h5>{shop_name}</h5>
          </div>
          {products.map((product) => (
            <div key={product.product_id} className={cx('product-wrapper')}>
              <div className={cx('d-flex', 'col-md-10', 'product-names')}>
                <img src={`${BASE_URL}${product.src[0]}`} alt="Product Image" className={cx('product-image')} />
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
          {/* Shipping Options */}
          <div className={cx('shipping-wrapper')}>
            <h5>Đơn vị vận chuyển</h5>
            <div className={cx('d-flex', 'align-items-center', 'shipping-details')}>
              <input
                type="radio"
                name={`shipping-${shop_id}`}
                className={cx('cart-checkbox')}
                checked={selectedShipping[shop_id] === 23000}
                onChange={() => handleShippingChange(shop_id, 23000)}
                id={`shipping-${shop_id}-23000`}
              />
              <div className={cx('information')}>
                <h6 className={cx('shipping-title')}>Giao hàng nhanh - tiêu chuẩn</h6>
                <p>Dự kiến nhận hàng vào 7 tháng 6, 2024</p>
                <span className={cx('shipping-price')}>
                  Phí vận chuyển:{' '}
                  <span className={cx('text-primary')} style={{ fontWeight: '600' }}>
                    {formatPrice(23000)}đ
                  </span>
                </span>
              </div>
            </div>
            <div className={cx('d-flex', 'align-items-center', 'shipping-details')}>
              <input
                type="radio"
                name={`shipping-${shop_id}`}
                className={cx('cart-checkbox')}
                checked={selectedShipping[shop_id] === 60000}
                onChange={() => handleShippingChange(shop_id, 60000)}
                id={`shipping-${shop_id}-60000`}
              />
              <div className={cx('information')}>
                <h6 className={cx('shipping-title')}>Giao Hàng Tiết Kiệm - Nhanh</h6>
                <p>Dự kiến nhận hàng vào 7 tháng 6, 2024</p>
                <span className={cx('shipping-price')}>
                  Phí vận chuyển:{' '}
                  <span className={cx('text-primary')} style={{ fontWeight: '600' }}>
                    {formatPrice(60000)}đ
                  </span>
                </span>
              </div>
            </div>
            <span className={cx('notes-title')}>Ghi chú</span>
            <textarea rows={2} className={cx('notes-area')}></textarea>
            <div className={cx('d-flex', 'align-items-center', 'justify-content-between', 'total-each-product')}>
              <span className={cx('title')}>Tổng tiền</span>
              <span className={cx('price')}>{formatPrice(calculateTotalEachStore(shop_id, products))}đ</span>
            </div>
          </div>
        </div>
      ));
    }
  }

  return (
    <div className={cx('payment-wrapper')}>
      <div className={cx('payment-details')}>
        {/* Shipping Information */}
        <div className={cx('my-cart', 'box-wrapper')}>
          <h3>Vận Chuyển</h3>
          <div className={cx('d-flex')}>
            <span className={cx('select-location-text')}>Chọn địa chỉ giao hàng bên dưới hoặc</span>
            <span className={cx('text-primary', 'add-new')}>Thêm mới</span>
          </div>
          <div className={cx('box-infor-wrapper')}>
            <div className={cx('box-infor')}>
              <h5>Trần Đình Phi - 0379357213</h5>
              <p className={cx('location-details')}>90 Hoàng Ngân, Trung Hoà, Cầu Giấy, Hà Nội</p>
              <div className={cx('d-flex', 'justify-content-between')}>
                <button className={cx('select-location')}>Giao đến địa chỉ này</button>
                <div className={cx('action-icon')}>
                  <img src={images.edit_icon} alt="Edit" />
                  <img src={images.delete_icon} alt="Delete" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Store And Product Information */}
        <div className={cx('store-product-wrapper')}>{renderContent()}</div>
      </div>

      <div className={cx('shopping-cart-payment', 'box-wrapper')}>
        <div className={cx('payment-wrapper-details')}>
          <div className={cx('d-flex', 'justify-content-between', 'items', 'border-btm')}>
            <span className={cx('title')}>Tổng tiền hàng</span>
            <span className={cx('details', 'text-black')}>{formatPrice(calculateTotalPrice())}đ</span>
          </div>
          <div className={cx('d-flex', 'justify-content-between', 'items', 'border-btm')}>
            <span className={cx('title')}>Phí vận chuyển</span>
            <span className={cx('details', 'text-black')}>{formatPrice(calculateTotalShipping())}đ</span>
          </div>
          <div className={cx('d-flex', 'justify-content-between', 'items', 'border-btm-dark')}>
            <div className={cx('d-flex', 'align-items-center')}>
              <img src={imagesPayment.use_point} alt="Use Point" className={cx('use-point')} />
              <span className={cx('title')}>
                Dùng{' '}
                <span className={cx('text-primary')} style={{ fontWeight: '600' }}>
                  1000
                </span>{' '}
                điểm
              </span>
            </div>
            <span className={cx('details')}>
              <div className={cx('toggle-switch')}>
                <input type="checkbox" id="switch" checked={usePoints} onChange={() => setUsePoints(!usePoints)} />
                <label htmlFor="switch"></label>
              </div>
            </span>
          </div>
          <div className={cx('d-flex', 'justify-content-between', 'items')}>
            <span className={cx('title')}>Tổng thanh toán</span>
            <span className={cx('total-price')}>{formatPrice(calculateTotal())}đ</span>
          </div>
          <div className={cx('d-flex', 'justify-content-between', 'items')}>
            <span className={cx('title', 'd-flex', 'align-items-center')}>
              <input
                type="radio"
                name="payment-method"
                className={cx('cart-checkbox')}
                id="payment-method-transfer"
                checked={paymentType === 1}
                onChange={() => setPaymentType(1)}
              />
              Chuyển khoản
            </span>
            <span className={cx('details')}>
              <img src={imagesFooter.visa} alt="Visa" />
              <img src={imagesFooter.masterCart} alt="Master Card" style={{ marginLeft: '8px' }} />
            </span>
          </div>
          <div className={cx('items', 'd-flex', 'align-items-center')}>
            <input
              type="radio"
              name="payment-method"
              className={cx('cart-checkbox')}
              id="payment-method-cod"
              checked={paymentType === 2}
              onChange={() => setPaymentType(2)}
            />
            <span className={cx('title')}>Thanh toán khi nhận hàng</span>
          </div>
        </div>
        <button className={cx('submit-payment')} onClick={handleSubmitPayment}>
          Đặt Mua
        </button>
      </div>
    </div>
  );
}

export default memo(Payment);

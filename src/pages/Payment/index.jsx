import React, { memo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import { useCart } from '~/context/CartContext';
import { dataProduct } from '../Home/data/product';
import { dataSeller } from '~/data/seller';
import LoadingIndicator from '~/components/Loading';
import { images, imagesCart, imagesFooter, imagesPayment } from '~/assets/images';

const cx = classNames.bind(styles);

function Payment() {
  const { checkedProducts, quantities } = useCart();

  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
    selectedShipping: {},
  });
  const { dataListProduct, loading, selectedShipping } = state;

  const fetchDataListProductAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListProduct: dataProduct,
      }));
    }, 1000);
  };

  useEffect(() => {
    fetchDataListProductAPI();
  }, []);

  const groupProductsByStore = (products) => {
    return products.reduce((result, product) => {
      const { store_id } = product;
      if (!result[store_id]) {
        result[store_id] = [];
      }
      result[store_id].push(product);
      return result;
    }, {});
  };

  // Get the products that are checked
  const checkedProductList = dataListProduct.filter((product) => checkedProducts[product.id]);

  // Group the checked products by store_id
  const groupedCheckedProducts = groupProductsByStore(checkedProductList);

  //Format Price
  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Function to calculate the total price
  function calculateTotalPrice() {
    return Object.values(groupedCheckedProducts).reduce((total, products) => {
      return (
        total +
        products.reduce((subTotal, product) => {
          const quantity = quantities[product.id] || 1; // Default to 1 if no quantity is set
          return subTotal + product.price * quantity;
        }, 0)
      );
    }, 0);
  }

  const handleShippingSelection = (storeId, shippingCost) => {
    setState((prevState) => ({
      ...prevState,
      selectedShipping: {
        ...prevState.selectedShipping,
        [storeId]: shippingCost, // Store the selected shipping cost per store
      },
    }));
  };

  function calculateTotalShipping() {
    return Object.values(selectedShipping).reduce((total, shippingCost) => total + shippingCost, 0);
  }
  function calculateTotal() {
    return calculateTotalPrice() + calculateTotalShipping();
  }
  function renderContent() {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return Object.entries(groupedCheckedProducts).map(([storeId, products]) => {
        const seller = dataSeller.find((seller) => seller.id === parseInt(storeId));
        const selectedStoreShipping = selectedShipping[storeId] || 0;

        return (
          <div key={storeId} className={cx('store-product-details', 'box-wrapper')}>
            <div className={cx('store-header')}>
              <img src={imagesCart.store_icon} alt="Store Icon" />
              <h5>{seller?.name}</h5>
            </div>
            {products.map((product) => (
              <div key={product.id} className={cx('product-wrapper')}>
                <div className={cx('d-flex', 'col-md-10', 'product-names')}>
                  <img
                    src={product.image || imagesCart.store_icon}
                    alt="Product Image"
                    className={cx('product-image')}
                  />
                  <div style={{ marginLeft: '8px' }}>
                    <h5>{product.title}</h5>
                    <span className={cx('order-price')}>
                      Đơn giá:
                      <span className={cx('text-primary')} style={{ fontWeight: '600' }}>
                        {formatPrice(product.price)}đ
                      </span>
                      <span className={cx('text-grey')}>/ Hộp</span>
                    </span>
                  </div>
                </div>
                <div className={cx('quantity')}>x{quantities[product.id]}</div>
              </div>
            ))}

            <div className={cx('shipping-wrapper')}>
              <h5>Đơn vị vận chuyển</h5>
              <div className={cx('d-flex', 'align-items-center', 'shipping-details')}>
                <input
                  type="checkbox"
                  className={cx('cart-checkbox')}
                  checked={selectedStoreShipping === 23000}
                  onChange={() => handleShippingSelection(storeId, 23000)}
                  id={`shipping-${storeId}-23000`}
                />
                <div className={cx('information')}>
                  <h6 className={cx('shipping-title')}>Giao hàng nhanh - tiêu chuẩn</h6>
                  <p>Dự kiến nhận hàng vào 7 tháng 6,2024</p>
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
                  type="checkbox"
                  className={cx('cart-checkbox')}
                  checked={selectedStoreShipping === 60000}
                  onChange={() => handleShippingSelection(storeId, 60000)}
                  id={`shipping-${storeId}-60000`}
                />
                <div className={cx('information')}>
                  <h6 className={cx('shipping-title')}>Giao Hàng Tiết Kiệm - Nhanh</h6>
                  <p>Dự kiến nhận hàng vào 7 tháng 6,2024</p>
                  <span className={cx('shipping-price')}>
                    Phí vận chuyển:{' '}
                    <span className={cx('text-primary')} style={{ fontWeight: '600' }}>
                      {formatPrice(60000)}đ
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      });
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
              <h5>Trần đình phi - 0379357213</h5>
              <p className={cx('location-details')}>90 Hoàng Ngân, Trung Hoà, Cầu Giấy, Hà Nội</p>
              <div className={cx('d-flex', 'justify-content-between')}>
                <button className={cx('select-location')}>Giao đến địa chỉ này</button>
                <div className={cx('action-icon')}>
                  <img src={images.edit_icon} alt="Edit" />
                  <img src={images.delete_icon} alt="Delete" />
                </div>
              </div>
            </div>
            <div className={cx('box-infor')}>
              <h5>Trần đình phi - 0379357213</h5>
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
                <input type="checkbox" id="switch" />
                <label for="switch"></label>
              </div>
            </span>
          </div>
          <div className={cx('d-flex', 'justify-content-between', 'items')}>
            <span className={cx('title')}>Tổng thanh toán</span>
            <span className={cx('total-price')}>{formatPrice(calculateTotal())}đ</span>
          </div>
          <div className={cx('d-flex', 'justify-content-between', 'items')}>
            <span className={cx('title', 'd-flex', 'align-items-center')}>
              <input type="checkbox" className={cx('cart-checkbox')} id="product-checkbox" />
              Chuyển khoản
            </span>
            <span className={cx('details')}>
              <img src={imagesFooter.visa} alt="Visa" />
              <img src={imagesFooter.masterCart} alt="Master Card" style={{ marginLeft: '8px' }} />
            </span>
          </div>
          <div className={cx('items', 'd-flex', 'align-items-center')}>
            <input type="checkbox" className={cx('cart-checkbox')} id="product-checkbox" />
            <span className={cx('title')}>Thanh toán khi nhận hàng</span>
          </div>
        </div>
        <button className={cx('submit-payment')}>Đặt Mua</button>
      </div>
    </div>
  );
}

export default memo(Payment);

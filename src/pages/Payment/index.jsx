import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingIndicator from '~/components/Loading';
import { images, imagesCart, imagesFooter, imagesPayment, imagesPopup } from '~/assets/images';
import { createPayment } from '~/api/payment';
import { API_HOST } from '~/config/host';
import ModalAddAddress from './component/ModalAddAddress';
import { deleteUserAddress, fetchAddress, updateDefaultAddress } from '~/api/address';
import routesConfig from '~/config/routes';
import Warning from '~/components/Layout/Popup/Warning';
import ModalEditAddress from './component/ModalEditAddress';
import Failed from '~/components/Layout/Popup/Failed';
import Success from '~/components/Layout/Popup/Success';

const cx = classNames.bind(styles);

function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { checkoutData } = state || {};
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState({});
  const [paymentType, setPaymentType] = useState(1);
  const [usePoints, setUsePoints] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(1);
  const [exchangePoints, setExchangePoints] = useState(0);
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);

  //Get address
  const [stateAddress, setStateAddress] = useState({
    loadingAddress: true,
    dataListAddress: [],
  });
  const { loadingAddress, dataListAddress } = stateAddress;

  useEffect(() => {
    const getListAddress = async () => {
      try {
        const getAddressResponse = await fetchAddress();

        if (!getAddressResponse.status) {
          alert('Lấy thông tin địa chỉ thất bại, vui lòng thử lại');
          return;
        }

        setStateAddress({
          loadingAddress: false,
          dataListAddress: getAddressResponse.data,
        });

        const defaultAddress = getAddressResponse.data.find((address) => address.display === 1);
        if (defaultAddress) {
          setDeliveryAddress(defaultAddress.id);
        }
      } catch (error) {
        console.error('Fetch order failed:', error);
        alert('Lấy thông tin địa chỉ thất bại, vui lòng thử lại');
      }
    };
    getListAddress();
  }, []);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedAddressID, setSelectedAddressID] = useState(null);

  const handleShowWarning = (addressID) => {
    setSelectedAddressID(addressID);
    setShowWarning(true);
  };

  const handleShowEditModal = (id) => {
    setSelectedAddressID(id);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAddressID(null);
  };

  const [successUpdateAddress, setSuccessUpdateAddress] = useState(false);
  const [failedUpdateAddress, setFailedUpdateAddress] = useState(false);
  const handleUpdateDefaultAddress = async () => {
    setLoadingFullScreen(true);
    try {
      const responseUpdateAddress = await updateDefaultAddress(selectedAddressID);

      if (!responseUpdateAddress.status) {
        setFailedUpdateAddress(true);
      } else {
        setSuccessUpdateAddress(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to update address:', error);
      setFailedUpdateAddress(true);
    } finally {
      setLoadingFullScreen(false);
      setShowWarning(false);
    }
  };

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [successDeleteAddress, setSuccessDeleteAddress] = useState(false);
  const [failedDeleteAddress, setFailedDeleteAddress] = useState(false);

  const handleDeleteAddress = (addressID) => {
    setAddressToDelete(addressID);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = async () => {
    setLoadingFullScreen(true);
    try {
      const response = await deleteUserAddress(addressToDelete);

      if (response.status) {
        const updatedAddress = dataListAddress.filter((address) => address.id !== addressToDelete);
        setStateAddress({ ...stateAddress, dataListAddress: updatedAddress });
        setSuccessDeleteAddress(true);
      } else {
        setFailedDeleteAddress(true);
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      setFailedDeleteAddress(true);
    } finally {
      setLoadingFullScreen(false);
      setShowDeleteWarning(false);
      setAddressToDelete(null);
    }
  };
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

  const [successPayment, setSuccessPayment] = useState(false);
  const [failedPayment, setFailedPayment] = useState(false);
  const [note, setNote] = useState('');
  const [showWarningNoAddress, setShowWarningNoAddress] = useState(false);

  const handleSubmitPayment = async () => {
    if (dataListAddress.length === 0) {
      setShowWarningNoAddress(true);
      return;
    }
    // Construct items payload for API
    const shopItems = checkoutData.map(({ shop_id, products }) => ({
      shop_id,
      note,
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

    setLoadingFullScreen(true);
    try {
      const response = await createPayment(items);
      if (!response.status) {
        setFailedPayment(true);
      }
      setSuccessPayment(true);
    } catch (error) {
      console.error('Payment failed:', error);
      setFailedPayment(true);
    } finally {
      setLoadingFullScreen(false);
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

  const handleProfileClick = (tab) => {
    navigate(routesConfig.profile, { state: { activeTab: tab } });
  };
  const handleHomeClick = () => {
    navigate(routesConfig.home);
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
                <img src={`${API_HOST}${product.src[0]}`} alt="Product Image" className={cx('product-image')} />
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
            <textarea
              rows={2}
              className={cx('notes-area')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
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
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div className={cx('payment-wrapper')}>
        <div className={cx('payment-details')}>
          {/* Shipping Information */}
          <div className={cx('my-cart', 'box-wrapper')}>
            <h3>Vận Chuyển</h3>
            <div className={cx('d-flex')}>
              <span className={cx('select-location-text')}>Chọn địa chỉ giao hàng bên dưới hoặc</span>
              <span className={cx('text-primary', 'add-new')} onClick={handleShowAddModal}>
                Thêm mới
              </span>
            </div>
            <ModalAddAddress showModal={showAddModal} handleCloseModal={handleCloseAddModal} />
            <div className={cx('box-infor-wrapper')}>
              {loadingAddress ? (
                <LoadingIndicator />
              ) : (
                dataListAddress.map((dataAddress, index) => (
                  <div key={index} className={cx('box-infor')}>
                    <h5>
                      {dataAddress.name} - {dataAddress.phone}
                    </h5>
                    <p className={cx('location-details')}>{dataAddress.full_address}</p>
                    <div className={cx('d-flex', 'justify-content-between')}>
                      {dataAddress.display == 1 ? (
                        <button className={cx('default-location')}>Địa chỉ mặc định</button>
                      ) : (
                        <button className={cx('select-location')} onClick={() => handleShowWarning(dataAddress.id)}>
                          Giao đến địa chỉ này
                        </button>
                      )}
                      <div className={cx('action-icon')}>
                        <img src={images.edit_icon} alt="Edit" onClick={() => handleShowEditModal(dataAddress.id)} />
                        {showEditModal && selectedAddressID === dataAddress.id && (
                          <ModalEditAddress
                            showModal={showEditModal}
                            handleCloseModal={handleCloseEditModal}
                            addressID={selectedAddressID}
                          />
                        )}
                        <img
                          src={images.delete_icon}
                          alt="Delete"
                          onClick={() => handleDeleteAddress(dataAddress.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
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
      {showWarning && (
        <Warning
          message="Bạn có muốn thay đổi địa chỉ mặc định?"
          onClose={() => setShowWarning(false)}
          onOk={handleUpdateDefaultAddress}
        />
      )}
      {showDeleteWarning && (
        <Warning
          message="Bạn có muốn xoá địa chỉ này?"
          onClose={() => setShowDeleteWarning(false)}
          onOk={handleConfirmDelete}
        />
      )}
      {showWarningNoAddress && (
        <Warning
          message="Vui lòng thêm địa chỉ nhận hàng?"
          onClose={() => setShowWarningNoAddress(false)}
          onOk={() => setShowWarningNoAddress(false)}
        />
      )}
      {successUpdateAddress && (
        <Success message="Địa chỉ cập nhật thành công" onClose={() => setSuccessUpdateAddress(false)} />
      )}
      {successDeleteAddress && (
        <Success message="Địa chỉ xoá thành công" onClose={() => setSuccessDeleteAddress(false)} />
      )}
      {failedUpdateAddress && (
        <Failed message="Địa chỉ cập nhật thất bại" onClose={() => setFailedUpdateAddress(false)} />
      )}
      {failedDeleteAddress && <Failed message="Địa chỉ xoá thất bại" onClose={() => setFailedDeleteAddress(false)} />}
      {failedPayment && (
        <Failed message="Thanh toán thất bại, vui lòng thử lại" onClose={() => setFailedPayment(false)} />
      )}
      {successPayment && (
        <div className={cx('payment-popup-overlay')}>
          <div className={cx('popup')}>
            <img src={imagesPopup.success} alt="Success" className={cx('icon-image')} />
            <p className={cx('popup-message')}>Thanh toán thành công</p>
            <div className={cx('d-flex')} style={{ gap: '10px' }}>
              <button className={cx('button-back')} onClick={() => handleHomeClick()}>
                Về trang chủ
              </button>
              <button className={cx('button-ok')} onClick={() => handleProfileClick('MyOrder')}>
                Quản lý đơn hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(Payment);

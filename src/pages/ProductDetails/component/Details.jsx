import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from '../ProductDetails.module.scss';
import LoadingIndicator from '~/components/Loading';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import { imagesHotDeal } from '~/assets/images';
import { createShoppingCard, createBuyNow } from '~/api/payment';
import routesConfig from '~/config/routes';
import { API_HOST } from '~/config/host';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';

const cx = classNames.bind(styles);

function Details({ product, loading, seller }) {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [successCreateCart, setSuccessCreateCart] = useState(false);
  const [successCheckout, setSuccessCheckout] = useState(false);
  const [failedCreateCart, setFailedCreateCart] = useState(false);
  const [failedCheckout, setFailedCheckout] = useState(false);

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const handleCreateCart = async () => {
    setLoadingFullScreen(true);
    try {
      const response = await createShoppingCard({
        shop_id: seller.id,
        product_id: product.id,
        quantity: quantity,
      });

      if (!response.status) {
        setFailedCreateCart(true);
        return;
      }
      setSuccessCreateCart(true);

      setTimeout(() => {
        setSuccessCreateCart(false);
        navigate(routesConfig.shopping_cart);
      }, 1500);
    } catch (error) {
      setFailedCreateCart(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const handleCheckout = async () => {
    setLoadingFullScreen(true);
    try {
      const response = await createBuyNow({
        product_id: product.id,
        quantity: quantity,
      });

      if (!response.status) {
        setFailedCheckout(true);
        return;
      }

      setSuccessCheckout(true);
      setTimeout(() => {
        setSuccessCheckout(false);
        navigate(routesConfig.payment, { state: { checkoutData: response.data } });
      }, 1500);
    } catch (error) {
      setFailedCheckout(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const today = new Date();
  const discountStartDate = product && product.discount_date_start ? new Date(product.discount_date_start) : null;
  const discountEndDate = product && product.discount_date_end ? new Date(product.discount_date_end) : null;
  const isDiscountActive =
    product && discountStartDate && discountEndDate ? today >= discountStartDate && today <= discountEndDate : false;

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else if (product) {
      return (
        <>
          <div className={cx('product-images')}>
            <img src={`${API_HOST}${product.src[0]}`} alt={product.name} className={cx('main-image')} />
            <div className={cx('sub-images')}>
              {product.src.slice(1, 6).map((image, index) => (
                <img
                  key={index}
                  src={`${API_HOST}${image}`}
                  alt={`${product.name} ${index + 1}`}
                  className={cx('sub-image')}
                />
              ))}
            </div>
          </div>
          <div className={cx('product-infor')}>
            <div className={cx('product-data')}>
              <h1 className={cx('product-title')}>{product.name}</h1>
              <span className={cx('contact')}>1 lượt liên hệ</span>
              <div className={cx('price-details', 'd-flex')}>
                {product.attributes.map((attribute, index) => {
                  const colClass =
                    product.attributes.length === 2 ? 'col-6' : product.attributes.length === 3 ? 'col-4' : 'col-3'; // Defaults to 'col-3' for 4 or more attributes
                  const price = parseFloat(attribute.price);

                  // Calculate priceOrigin with the condition for `number_discount`
                  const priceOrigin =
                    isDiscountActive && parseFloat(product.number_discount) > attribute.quantity
                      ? price - (price * parseFloat(product.discount)) / 100
                      : price;

                  // If `number_discount <= attribute.quantity`, set priceOrigin to price
                  const displayPrice = parseFloat(product.number_discount) <= attribute.quantity ? price : priceOrigin;
                  return (
                    <div key={index} className={cx(colClass)}>
                      <h3 className={cx('product-price')}>{formatPrice(priceOrigin)}đ</h3>

                      {isDiscountActive && (
                        <h3
                          className={cx('product-price-origin')}
                          style={{
                            opacity: parseFloat(product.number_discount) > attribute.quantity ? 1 : 0,
                          }}
                        >
                          {formatPrice(price)}đ
                        </h3>
                      )}

                      {index === product.attributes.length - 1 ? (
                        <span>
                          {'>'} {attribute.quantity} {product.unit}
                        </span>
                      ) : (
                        <span>
                          {attribute.quantity} - {product.attributes[index + 1].quantity - 1} {product.unit}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {isDiscountActive && (
                <h5 className={cx('discount-number')}>
                  Số lượng được giảm giá:{' '}
                  <span className={cx('discount-number-highlight')}>
                    {product.number_discount} {product.unit}
                  </span>
                </h5>
              )}
              <span className={cx('negotiate')}>Có thể thương lượng</span>
              <h5 className={cx('buy-at-least')}>
                Mua ít nhất{' '}
                <span>
                  {product.attributes[0].quantity} {product.unit}
                </span>
              </h5>
            </div>
            <div className={cx('product-order')}>
              {product.quantity > 0 ? (
                <>
                  <div className={cx('product-remaining', 'd-flex', 'align-items-center')}>
                    <span>Tồn kho {product.quantity}</span>
                    <CustomInputNumber
                      min={product.attributes[0].quantity}
                      max={product.quantity}
                      onValueChange={setQuantity}
                    />
                  </div>
                  <div className={cx('d-flex', 'justify-content-between', 'product-btn')}>
                    <button className={cx('order')} onClick={handleCheckout}>
                      Đặt hàng ngay
                    </button>
                    <button className={cx('add-to-cart')} onClick={handleCreateCart}>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </>
              ) : (
                <p className={cx('out-of-stock')}>
                  Sản phẩm tạm thời <span className={cx('out-of-stock-highlight')}>HẾT HÀNG</span>
                </p>
              )}
              <div className={cx('d-flex', 'align-items-center', 'product-notes')}>
                <img src={imagesHotDeal.check} alt="Check" />
                <span>Chính hãng 100%</span>
                <span className={cx('slash')}>|</span>
                <img src={imagesHotDeal.change} alt="Change" />
                <span>Đổi trả hàng lỗi</span>
              </div>
            </div>
          </div>

          {successCreateCart && (
            <Success message="Thêm vào giỏ hàng thành công" onClose={() => setSuccessCreateCart(false)} />
          )}
          {successCheckout && <Success message="Đặt hàng thành công" onClose={() => setSuccessCheckout(false)} />}
          {failedCreateCart && (
            <Failed message="Thêm vào giỏ hàng thất bại" onClose={() => setFailedCreateCart(false)} />
          )}
          {failedCheckout && <Failed message="Đặt hàng thất bại" onClose={() => setFailedCheckout(false)} />}
        </>
      );
    } else {
      return <h4>Không tìm thấy sản phẩm</h4>;
    }
  };

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      {renderContent()}
    </>
  );
}

export default memo(Details);

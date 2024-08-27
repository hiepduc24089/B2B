import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from '../ProductDetails.module.scss';
import LoadingIndicator from '~/components/Loading';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import { imagesHotDeal } from '~/assets/images';
import { createShoppingCard, createBuyNow } from '~/api/payment';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

const BASE_URL = 'https://api-b2b.krmedi.vn';

function Details({ product, loading, seller }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const handleCreateCart = async () => {
    try {
      const response = await createShoppingCard({
        shop_id: seller.id,
        product_id: product.id,
        quantity: quantity,
      });

      if (!response.status) {
        alert('Thêm sản phẩm thất bại, vui lòng thử lại');
        return;
      }
      alert(response.message);

      navigate(routesConfig.shopping_cart);
    } catch (error) {
      console.error('Failed to create cart:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await createBuyNow({
        product_id: product.id,
        quantity: quantity,
      });

      if (!response.status) {
        alert('Đặt hàng thất bại, vui lòng thử lại');
        return;
      }
      alert('Đặt hành thành công!');

      navigate(routesConfig.payment, { state: { checkoutData: response.data } });
    } catch (error) {
      console.error('Failed to create cart:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else if (product) {
      return (
        <>
          <div className={cx('product-images')}>
            <img src={`${BASE_URL}${product.src[0]}`} alt={product.name} className={cx('main-image')} />
            <div className={cx('sub-images')}>
              {product.src.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={`${BASE_URL}${image}`}
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
                <div className={cx('col-6')}>
                  <h3 className={cx('product-price')}>{formatPrice(product.attributes[1].price)}đ</h3>
                  <span>
                    {product.attributes[0].quantity} - {product.attributes[1].quantity - 1} {product.unit}
                  </span>
                </div>
                <div className={cx('col-6')}>
                  <h3 className={cx('product-price')}>{formatPrice(product.attributes[2].price)}đ</h3>
                  <span>
                    {'>'} {product.attributes[2].quantity} {product.unit}
                  </span>
                </div>
              </div>
              <span className={cx('negotiate')}>Có thể thương lượng</span>
              <h5 className={cx('buy-at-least')}>
                Mua ít nhất{' '}
                <span>
                  {product.attributes[0].quantity} {product.unit}
                </span>
              </h5>
            </div>
            <div className={cx('product-order')}>
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
              <div className={cx('d-flex', 'align-items-center', 'product-notes')}>
                <img src={imagesHotDeal.check} alt="Check" />
                <span>Chính hãng 100%</span>
                <span className={cx('slash')}>|</span>
                <img src={imagesHotDeal.change} alt="Change" />
                <span>Đổi trả hàng lỗi</span>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <h4>Không tìm thấy sản phẩm</h4>;
    }
  };

  return <>{renderContent()}</>;
}

export default memo(Details);

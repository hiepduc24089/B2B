import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../ProductDetails.module.scss';
import LoadingIndicator from '~/components/Loading';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import { imagesHotDeal } from '~/assets/images';

const cx = classNames.bind(styles);

function Details({ product, loading }) {
  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else if (product) {
      return (
        <>
          <div className={cx('product-images')}>
            <img src={product.image} alt={product.title} className={cx('main-image')} />
            <div className={cx('sub-images')}>
              <img src={product.image} alt={product.title} className={cx('sub-image')} />
              <img src={product.image} alt={product.title} className={cx('sub-image')} />
              <img src={product.image} alt={product.title} className={cx('sub-image')} />
              <img src={product.image} alt={product.title} className={cx('sub-image')} />
              <img src={product.image} alt={product.title} className={cx('sub-image')} />
            </div>
          </div>
          <div className={cx('product-infor')}>
            <div className={cx('product-data')}>
              <h1 className={cx('product-title')}>{product.title}</h1>
              <span className={cx('contact')}>{product.contact} lượt liên hệ</span>
              <div className={cx('price-details', 'd-flex')}>
                <div className={cx('col-6')}>
                  <h3 className={cx('product-price')}>{formatPrice(product.price)}đ</h3>
                  <span>4 - 11 hộp</span>
                </div>
                <div className={cx('col-6')}>
                  <h3 className={cx('product-price')}>{formatPrice(product.sale_price)}đ</h3>
                  <span> {'>'} 12 hộp</span>
                </div>
              </div>
              <span className={cx('negotiate')}>{product.negotiable}</span>
              <h5 className={cx('buy-at-least')}>
                Mua ít nhất <span>{product.wholesaleitem}</span>
              </h5>
            </div>
            <div className={cx('product-order')}>
              <div className={cx('product-remaining', 'd-flex', 'align-items-center')}>
                <span>Tồn kho {product.remaining}</span>
                <CustomInputNumber min={1} max={product.remaining} />
              </div>
              <div className={cx('d-flex', 'justify-content-between', 'product-btn')}>
                <button className={cx('order')}>Đặt hàng ngay</button>
                <button className={cx('add-to-cart')}>Thêm vào giỏ hàng</button>
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

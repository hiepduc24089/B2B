import React, { useEffect, memo } from 'react';
import LoadingIndicator from '~/components/Loading';
import classNames from 'classnames/bind';
import styles from '../Category.module.scss';
import routesConfig from '~/config/routes';
import { Link } from 'react-router-dom';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function Product({ loading, dataListProduct }) {
  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else if (dataListProduct.length === 0) {
      return <p className={cx('mt-5')}>Không có sản phẩm</p>;
    } else {
      return (
        <div className={cx('product-wrapper')}>
          {dataListProduct.map((product, index) => (
            <Link
              key={index}
              to={`${routesConfig.product_details.replace(':slug', product.slug).replace(':id', product.id)}`}
            >
              <div className={cx('product-items')}>
                <img src={`${API_HOST}${product.src[0]}`} alt={product.name} />
                <h1 className={cx('product-title')}>{product.name}</h1>
                <h3 className={cx('product-price')}>
                  {formatPrice(product.price)}đ<span>/{product.unit}</span>
                </h3>
                <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                  <div>
                    <h4 className={cx('sale-price')}>{formatPrice(product.price_original)}đ</h4>
                    <span className={cx('negotiate')}>Có thể thương lượng</span>
                  </div>
                  <button className={cx('sale')}>-{product.discount}%</button>
                </div>
                <h5 className={cx('buy-at-least')}>
                  Mua sỉ từ{' '}
                  <span>
                    {product.min_quantity} {product.unit}
                  </span>
                </h5>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <span className={cx('location')}>{product.province_name}</span>
                  <span className={cx('contact')}>2 lượt liên hệ</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <h2>Deal HOT hôm nay</h2>
      {renderContent()}
    </>
  );
}
export default memo(Product);

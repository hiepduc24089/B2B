import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../RelatedProduct.module.scss';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function RelatedProduct({ recommendedProduct, relatedProduct, viewedProduct }) {
  const getNumberOfItems = () => {
    const width = window.innerWidth;

    if (width > 1400) return 12;
    if (width > 1200) return 10;
    if (width > 992) return 8;
    if (width > 768) return 6;
    return 4;
  };

  const [numberOfItems, setNumberOfItems] = useState(getNumberOfItems());

  useEffect(() => {
    const handleResize = () => {
      setNumberOfItems(getNumberOfItems());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Function to render product list based on provided data
  function renderProductList(products) {
    return (
      <div className={cx('product-wrapper')}>
        {products.slice(0, numberOfItems).map((product, index) => (
          <Link
            key={index}
            to={`${routesConfig.product_details.replace(':slug', product.slug).replace(':id', product.id)}`}
          >
            <div className={cx('product-item')}>
              <img src={`${API_HOST}${product.src[0]}`} alt={product.name} />
              <h1>{product.name}</h1>
              <h3>
                <span>{formatPrice(product.price)}đ</span>/Hộp
              </h3>
              <span className={cx('negotiate')}>Có thể thương lượng</span>
              <p className={cx('buy-at-least')}>
                Mua ít nhất: {product.min_quantity} {product.unit}
              </p>
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

  return (
    <>
      {/* Render recommended products */}
      <div className={cx('related-product-wrapper')}>
        <h3>Đề xuất từ cửa hàng</h3>
        {renderProductList(recommendedProduct)}
      </div>

      {/* Render related products */}
      <div className={cx('related-product-wrapper')}>
        <h3>Sản phẩm tương tự</h3>
        {renderProductList(relatedProduct)}
      </div>

      {/* Render products you might like (same as relatedProduct for demonstration) */}
      <div className={cx('related-product-wrapper')}>
        <h3>Bạn cũng có thể thích</h3>
        {renderProductList(relatedProduct)}
      </div>

      {/* Render viewed products */}
      <div className={cx('related-product-wrapper')}>
        <h3>Sản phẩm đã xem</h3>
        {renderProductList(viewedProduct)}
      </div>
    </>
  );
}

export default memo(RelatedProduct);

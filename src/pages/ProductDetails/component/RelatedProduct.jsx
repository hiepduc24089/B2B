import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../RelatedProduct.module.scss';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { API_HOST } from '~/config/host';
import Success from '~/components/Layout/Popup/Success';
import { postFavoriteProduct } from '~/api/home';
import { images } from '~/assets/images';

const cx = classNames.bind(styles);

function RelatedProduct({ recommendedProduct, relatedProduct, viewedProduct }) {
  const [showSuccessAdd, setShowSuccessAdd] = useState(false);
  const [showSuccessRemove, setShowSuccessRemove] = useState(false);

  const getNumberOfItems = () => {
    const width = window.innerWidth;

    if (width > 1200) return 12;
    if (width > 992) return 10;
    if (width > 768) return 8;
    if (width > 500) return 6;
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

  // New ProductList component
  const ProductList = ({ products }) => {
    const [favorites, setFavorites] = useState(
      new Set(products.filter((item) => item.is_favorite === 1).map((item) => item.id)),
    );

    const handleFavoriteClick = async (id) => {
      try {
        const response = await postFavoriteProduct(id);
        if (response.status) {
          setFavorites((prevFavorites) => {
            const newFavorites = new Set(prevFavorites);
            if (newFavorites.has(id)) {
              newFavorites.delete(id);
              setShowSuccessRemove(true);
            } else {
              newFavorites.add(id);
              setShowSuccessAdd(true);
            }
            return newFavorites;
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          alert('Failed to update favorite status. Please try again.');
        }
      } catch (error) {
        console.error('Error updating favorite:', error);

        if (error.response && error.response.status === 401) {
          return;
        } else {
          alert('An error occurred while updating the favorite status.');
        }
      }
    };

    return (
      <div className={cx('product-wrapper')}>
        {products.slice(0, numberOfItems).map((product, index) => (
          <Link
            key={index}
            to={`${routesConfig.product_details.replace(':slug', product.slug).replace(':id', product.id)}`}
          >
            <div className={cx('product-item')}>
              <img src={`${API_HOST}${product.src[0]}`} alt={product.name} className={cx('product-img')} />
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
              <img
                src={favorites.has(product.id) ? images.heart_red : images.heart}
                alt="Heart"
                className={cx('heart-icon', {
                  'active-heart': favorites.has(product.id),
                })}
                onClick={() => handleFavoriteClick(product.id)}
              />
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Render recommended products */}
      <div className={cx('related-product-wrapper')}>
        <h3>Đề xuất từ cửa hàng</h3>
        <ProductList products={recommendedProduct} />
      </div>

      {/* Render related products */}
      <div className={cx('related-product-wrapper')}>
        <h3>Sản phẩm tương tự</h3>
        <ProductList products={relatedProduct} />
      </div>

      {/* Render products you might like (same as relatedProduct for demonstration) */}
      <div className={cx('related-product-wrapper')}>
        <h3>Bạn cũng có thể thích</h3>
        <ProductList products={relatedProduct} />
      </div>

      {/* Render viewed products */}
      <div className={cx('related-product-wrapper')}>
        <h3>Sản phẩm đã xem</h3>
        <ProductList products={viewedProduct} />
      </div>

      {/* Show Success Popup */}
      {showSuccessAdd && (
        <Success message="Thêm sản phẩm yêu thích thành công" onClose={() => setShowSuccessAdd(false)} />
      )}
      {showSuccessRemove && (
        <Success message="Bỏ sản phẩm yêu thích thành công" onClose={() => setShowSuccessRemove(false)} />
      )}
    </>
  );
}

export default memo(RelatedProduct);

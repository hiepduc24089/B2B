import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './FavProduct.module.scss';
import routesConfig from '~/config/routes';
import { Link } from 'react-router-dom';
import { API_HOST } from '~/config/host';
import LoadingIndicator from '~/components/Loading';
import { fetchFavoriteProduct } from '~/api/profile';
import { postFavoriteProduct } from '~/api/home';
import Success from '~/components/Layout/Popup/Success';
import { images } from '~/assets/images';

const cx = classNames.bind(styles);

function FavProduct() {
  const [showSuccessAdd, setShowSuccessAdd] = useState(false);
  const [showSuccessRemove, setShowSuccessRemove] = useState(false);

  const [state, setState] = useState({
    loading: true,
    dataListProduct: null,
  });
  const { loading, dataListProduct } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFavoriteProduct();
        setState({
          loading: false,
          dataListProduct: data.data.data,
        });
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setState({
          loading: false,
          dataListProduct: [],
        });
      }
    };

    fetchData();
  }, []);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (dataListProduct) {
      const favoriteSet = new Set(dataListProduct.filter((item) => item.is_favorite === 1).map((item) => item.id));
      setFavorites(favoriteSet);
    }
  }, [dataListProduct]);

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
      alert('An error occurred while updating the favorite status.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else if (!dataListProduct || dataListProduct.length === 0) {
      return <p className={cx('not-found-order')}>Không có sản phẩm yêu thích</p>;
    } else {
      return (
        <div className={cx('product-wrapper')}>
          {dataListProduct.map((product, index) => (
            <div key={index} className={cx('list-item-wrapper')}>
              <Link to={`${routesConfig.product_details.replace(':slug', product.slug).replace(':id', product.id)}`}>
                <div className={cx('product-items')}>
                  <img src={`${API_HOST}${product.src[0]}`} alt={product.name} className={cx('product-img')} />
                  <h1 className={cx('product-title')}>{product.name}</h1>
                  <h3 className={cx('product-price')}>
                    {formatPrice(product.price)}đ<span>/{product.unit}</span>
                  </h3>
                  <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                    <div>
                      <span className={cx('negotiate')}>Có thể thương lượng</span>
                    </div>
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
                  <img
                    src={favorites.has(product.id) ? images.heart_red : images.heart}
                    alt="Heart"
                    className={cx('heart-icon', {
                      'active-heart': favorites.has(product.id),
                    })}
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleFavoriteClick(product.id);
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      {renderContent()}
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

export default memo(FavProduct);

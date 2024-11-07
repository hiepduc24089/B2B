import React, { useEffect, memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { images, imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import LoadingIndicator from '~/components/Loading';
import { fetchNewProduct, postFavoriteProduct } from '~/api/home';
import { API_HOST } from '~/config/host';
import Success from '~/components/Layout/Popup/Success';

const cx = classNames.bind(styles);

function New() {
  const [showSuccessAdd, setShowSuccessAdd] = useState(false);
  const [showSuccessRemove, setShowSuccessRemove] = useState(false);

  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;

  const getNumberOfItems = () => {
    return window.innerWidth > 768 ? 12 : 4;
  };

  const userID = localStorage.getItem('user_id') || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNewProduct(userID);

        setState((prevState) => ({
          ...prevState,
          loading: false,
          dataListProduct: data.data.slice(0, getNumberOfItems()),
        }));
      } catch (error) {
        console.error('Failed to fetch products for you:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchData();

    const handleResize = () => {
      setState((prevState) => ({
        ...prevState,
        dataListProduct: prevState.dataListProduct.slice(0, getNumberOfItems()),
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [userID]);

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

      if (error.response && error.response.status === 401) {
        return;
      } else {
        alert('An error occurred while updating the favorite status.');
      }
    }
  };

  function renderContent() {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('for-you-wrapper')}>
          {dataListProduct.map((foryou, index) => (
            <div key={index} className={cx('list-item-wrapper')}>
              <Link
                key={index}
                to={`${routesConfig.product_details.replace(':slug', foryou.slug).replace(':id', foryou.id)}`}
              >
                <div className={cx('for-you-item')}>
                  <img src={`${API_HOST}${foryou.src[0]}`} alt="Product" className={cx('product-img')} />
                  <h1>{foryou.name}</h1>
                  <h3>
                    <span>{formatPrice(foryou.price)}đ</span>/Hộp
                  </h3>
                  <span className={cx('negotiate')}>Có thể thương lượng</span>
                  <p className={cx('buy-at-least')}>
                    Mua ít nhất: {foryou.min_quantity} {foryou.unit}
                  </p>
                  <div className={cx('d-flex', 'justify-content-between')}>
                    <span className={cx('location')}>{foryou.province_name}</span>
                    <span className={cx('contact')}>2 lượt liên hệ</span>
                  </div>
                  <img
                    src={favorites.has(foryou.id) ? images.heart_red : images.heart}
                    alt="Heart"
                    className={cx('heart-icon', {
                      'active-heart': favorites.has(foryou.id),
                    })}
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleFavoriteClick(foryou.id);
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    }
  }
  return (
    <>
      <div className={cx('title-header')}>
        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
          <h1>Sản phẩm mới</h1>
          <Link to={routesConfig.foryou} className={cx('see-all')}>
            <p>
              Xem tất cả
              <img src={imagesHome.see_all} alt="See All Icon" />
            </p>
          </Link>
        </div>
      </div>
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

export default memo(New);

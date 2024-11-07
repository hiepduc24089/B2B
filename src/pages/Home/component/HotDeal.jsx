import React, { useEffect, memo, useState } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { images, imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LoadingIndicator from '~/components/Loading';
import { fetchHotDeal, postFavoriteProduct } from '~/api/home';
import { API_HOST } from '~/config/host';
import Success from '~/components/Layout/Popup/Success';

const cx = classNames.bind(styles);

function HotDeal() {
  const [showSuccessAdd, setShowSuccessAdd] = useState(false);
  const [showSuccessRemove, setShowSuccessRemove] = useState(false);

  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;

  const userID = localStorage.getItem('user_id') || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHotDeal(userID);
        setState((prevState) => ({
          ...prevState,
          dataListProduct: data.data,
        }));
      } catch (error) {
        console.error('Failed to fetch hot deals:', error);
      } finally {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchData();
  }, [userID]);

  const settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

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

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('hot-deal-wrapper')}>
          <Slider {...settings}>
            {dataListProduct.slice(0, 5).map((hotdeal, index) => (
              <div key={index} className={cx('list-item-wrapper')}>
                <Link
                  to={`${routesConfig.product_details.replace(':slug', hotdeal.slug).replace(':id', hotdeal.id)}`}
                  className={cx('product-link')}
                >
                  <div className={cx('list-item')}>
                    <img src={`${API_HOST}${hotdeal.src[0]}`} alt={hotdeal.name} className={cx('product-img')} />
                    <h3>
                      {formatPrice(hotdeal.price)}đ<span>/{hotdeal.unit}</span>
                    </h3>
                    <h4
                      style={{
                        opacity:
                          parseInt(hotdeal.price_original, 10) === parseInt(hotdeal.price.replace(/\./g, ''), 10)
                            ? 0
                            : 1,
                      }}
                    >
                      {formatPrice(hotdeal.price_original)}đ
                    </h4>
                    <h5>
                      Mua sỉ từ{' '}
                      <span>
                        {hotdeal.min_quantity} {hotdeal.unit}
                      </span>
                    </h5>
                    <p>{hotdeal.name}</p>
                    <img
                      src={favorites.has(hotdeal.id) ? images.heart_red : images.heart}
                      alt="Heart"
                      className={cx('heart-icon', {
                        'active-heart': favorites.has(hotdeal.id),
                      })}
                      onClick={async (e) => {
                        e.preventDefault();
                        await handleFavoriteClick(hotdeal.id);
                      }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      );
    }
  };

  return (
    <>
      <div className={cx('title-header')}>
        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
          <div className={cx('d-flex', 'align-items-center')}>
            <img
              src={imagesHome.flash}
              alt="Flash Icon"
              width={'40px'}
              height={'40px'}
              className={cx('hot-deal-icon')}
            />
            <h1 className={cx('mb-0')}>Deal HOT hôm nay</h1>
          </div>
          <Link to={routesConfig.hot_deal} className={cx('see-all')}>
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

export default memo(HotDeal);

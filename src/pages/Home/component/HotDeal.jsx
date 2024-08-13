import React, { useEffect, memo } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { dataProduct } from '~/pages/Home/data/product';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function HotDeal() {
  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;
  useEffect(() => {
    fetchDataListProductAPI();
    return () => {};
  }, []);

  const fetchDataListProductAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListProduct: dataProduct,
      }));
    }, 1000);
  };

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

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('hot-deal-wrapper')}>
          <Slider {...settings}>
            {dataListProduct.slice(0, 5).map((hotdeal, index) => (
              <div key={index} className={cx('list-item')}>
                <img src={hotdeal.image} alt="Product" />
                <h3>
                  {formatPrice(hotdeal.price)}đ<span>/Hộp</span>
                </h3>
                <h4>{formatPrice(hotdeal.sale_price)}đ</h4>
                <h5>
                  Mua sỉ từ <span>{hotdeal.wholesaleitem}</span>
                </h5>
                <p>{hotdeal.title}</p>
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
    </>
  );
}

export default memo(HotDeal);

import React, { useEffect, memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchBrand } from '~/api/home';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function Brand() {
  const [state, setState] = useState({
    loading: true,
    dataListBrand: [],
  });
  const { loading, dataListBrand } = state;

  useEffect(() => {
    fetchDataListBrandAPI();
  }, []);

  const fetchDataListBrandAPI = async () => {
    try {
      const data = await fetchBrand();
      const filteredData = data.filter((brand) => brand.display === 1);

      setState({
        loading: false,
        dataListBrand: filteredData,
      });
    } catch (error) {
      console.error('Error fetching brand data:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('brand-wrapper')}>
          <Slider {...settings}>
            {dataListBrand.map((brand) => (
              <div key={brand.id} className={cx('brand-item')}>
                <img src={`${API_HOST}${brand.src}`} alt="Brand Name" className={cx('brand-img')} />
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
        <div className={cx('d-flex', 'align-items-center')}>
          <img
            src={imagesHome.brand_icon}
            alt="Flash Icon"
            width={'40px'}
            height={'40px'}
            className={cx('brand-icon')}
          />
          <h1 className={cx('mb-0')}>Một số thương hiệu nổi bật</h1>
        </div>
      </div>
      {renderContent()}
    </>
  );
}

export default memo(Brand);

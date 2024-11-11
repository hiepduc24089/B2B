import React, { memo } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { API_HOST } from '~/config/host';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function Banner({ banners, loading }) {
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  // Filter for banners with location = 1 for the slider
  const slideBanners = banners.filter((banner) => banner.location === 1);
  // Filter for banners with location = 2 for the right-side images
  const rightBanners = banners.filter((banner) => banner.location === 2);

  return (
    <div className={cx('row')}>
      <div className={cx('col-md-8', 'banner-slide')}>
        <Slider {...settings}>
          {slideBanners.length > 0 ? (
            slideBanners.map((banner, index) => (
              <div key={index}>
                <img src={`${API_HOST}${banner.src}`} alt={`Banner ${index + 1}`} />
              </div>
            ))
          ) : (
            <div>
              <p>No banners available</p>
            </div>
          )}
        </Slider>
      </div>
      <div className={cx('col-md-4', 'banner-right')}>
        {rightBanners.length > 0 ? (
          rightBanners.map((banner, index) => (
            <img key={index} src={`${API_HOST}${banner.src}`} alt={`Banner Ad ${index + 1}`} />
          ))
        ) : (
          <p>No side banners available</p>
        )}
      </div>
    </div>
  );
}

export default memo(Banner);

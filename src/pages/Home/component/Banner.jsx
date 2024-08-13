import React, { memo } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const cx = classNames.bind(styles);

function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={cx('row')}>
      <div className={cx('col-md-8', 'banner-slide')}>
        <Slider {...settings}>
          <div>
            <img src={imagesHome.slide_1} alt="Banner" />
          </div>
          <div>
            <img src={imagesHome.slide_2} alt="Banner" />
          </div>
          <div>
            <img src={imagesHome.slide_3} alt="Banner" />
          </div>
          <div>
            <img src={imagesHome.slide_4} alt="Banner" />
          </div>
        </Slider>
      </div>
      <div className={cx('col-md-4', 'banner-right')}>
        <img src={imagesHome.banner_1} alt="Banner" />
        <img src={imagesHome.banner_2} alt="Banner" />
      </div>
    </div>
  );
}

export default memo(Banner);

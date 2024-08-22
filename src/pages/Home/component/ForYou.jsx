import React, { useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { dataProduct } from '../data/product';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function ForYou() {
  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;

  const getNumberOfItems = () => {
    return window.innerWidth > 768 ? 12 : 4;
  };

  const fetchDataListProductAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListProduct: dataProduct.slice(0, getNumberOfItems()),
      }));
    }, 1000);
  };

  useEffect(() => {
    fetchDataListProductAPI();

    const handleResize = () => {
      setState((prevState) => ({
        ...prevState,
        dataListProduct: dataProduct.slice(0, getNumberOfItems()),
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function renderContent() {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('for-you-wrapper')}>
          {dataListProduct.map((foryou, index) => (
            <Link
              key={index}
              to={`${routesConfig.product_details.replace(':slug', foryou.slug).replace(':id', foryou.id)}`}
            >
              <div className={cx('for-you-item')}>
                <img src={foryou.image} alt="Product" />
                <h1>{foryou.title}</h1>
                <h3>
                  <span>{formatPrice(foryou.price)}đ</span>/Hộp
                </h3>
                <span className={cx('negotiate')}>{foryou.negotiable}</span>
                <p className={cx('buy-at-least')}>Mua ít nhất: {foryou.minimum_order} cái</p>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <span className={cx('location')}>{foryou.location}</span>
                  <span className={cx('contact')}>{foryou.contact} lượt liên hệ</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  }
  return (
    <>
      <div className={cx('title-header')}>
        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
          <h1>Dành cho bạn</h1>
          <Link to={routesConfig.foryou} className={cx('see-all')}>
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

export default memo(ForYou);

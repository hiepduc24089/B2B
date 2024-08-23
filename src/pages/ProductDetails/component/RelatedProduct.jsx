import React, { memo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../RelatedProduct.module.scss';
import { dataProduct } from '~/pages/Home/data/product';
import LoadingIndicator from '~/components/Loading';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function RelatedProduct() {
  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;

  const getNumberOfItems = () => {
    const width = window.innerWidth;

    if (width > 1400) return 12;
    if (width > 1200) return 10;
    if (width > 992) return 8;
    if (width > 768) return 6;
    return 4;
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
        <div className={cx('product-wrapper')}>
          {dataListProduct.map((foryou, index) => (
            <Link
              key={index}
              to={`${routesConfig.product_details.replace(':slug', foryou.slug).replace(':id', foryou.id)}`}
            >
              <div className={cx('product-item')}>
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
      <div className={cx('related-product-wrapper')}>
        <h3>Đề xuất từ cửa hàng</h3>
        {renderContent()}
      </div>
      <div className={cx('related-product-wrapper')}>
        <h3>Sản phẩm tương tự</h3>
        {renderContent()}
      </div>
      <div className={cx('related-product-wrapper')}>
        <h3>Bạn cũng có thể thích</h3>
        {renderContent()}
      </div>
      <div className={cx('related-product-wrapper')}>
        <h3>Sản phẩm đã xem</h3>
        {renderContent()}
      </div>
    </>
  );
}

export default memo(RelatedProduct);

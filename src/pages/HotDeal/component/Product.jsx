import React, { useEffect, memo } from 'react';
import { dataProduct } from '~/pages/Home/data/product';
import LoadingIndicator from '~/components/Loading';
import classNames from 'classnames/bind';
import styles from '../HotDeal.module.scss';
import routesConfig from '~/config/routes';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Product() {
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

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('product-wrapper')}>
          {dataListProduct.map((product, index) => (
            <Link
              key={index}
              to={`${routesConfig.product_details.replace(':slug', product.slug).replace(':id', product.id)}`}
            >
              <div className={cx('product-items')}>
                <img src={product.image} alt={product.title} />
                <h1 className={cx('product-title')}>{product.title}</h1>
                <h3 className={cx('product-price')}>
                  {formatPrice(product.price)}đ<span>/Hộp</span>
                </h3>
                <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                  <div>
                    <h4 className={cx('sale-price')}>{formatPrice(product.sale_price)}đ</h4>
                    <span className={cx('negotiate')}>{product.negotiable}</span>
                  </div>
                  <button className={cx('sale')}>-{product.sale}%</button>
                </div>
                <h5 className={cx('buy-at-least')}>
                  Mua sỉ từ <span>{product.wholesaleitem}</span>
                </h5>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <span className={cx('location')}>{product.location}</span>
                  <span className={cx('contact')}>{product.contact} lượt liên hệ</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <h2>Deal HOT hôm nay</h2>
      {renderContent()}
    </>
  );
}
export default memo(Product);

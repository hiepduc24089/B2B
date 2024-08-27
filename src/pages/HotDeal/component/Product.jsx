import React, { useEffect, memo } from 'react';
import LoadingIndicator from '~/components/Loading';
import classNames from 'classnames/bind';
import styles from '../HotDeal.module.scss';
import routesConfig from '~/config/routes';
import { Link } from 'react-router-dom';
import { fetchHotDeal } from '~/api/home';

const cx = classNames.bind(styles);
const BASE_URL = 'https://api-b2b.krmedi.vn';

function Product() {
  const [state, setState] = React.useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHotDeal();

        setState((prevState) => ({
          ...prevState,
          loading: false,
          dataListProduct: data.data,
        }));
      } catch (error) {
        console.error('Failed to fetch hot deals:', error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      }
    };

    fetchData();
  }, []);

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
                <img src={`${BASE_URL}${product.src[0]}`} alt={product.name} />
                <h1 className={cx('product-title')}>{product.name}</h1>
                <h3 className={cx('product-price')}>
                  {formatPrice(product.price)}đ<span>/{product.unit}</span>
                </h3>
                <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                  <div>
                    <h4 className={cx('sale-price')}>{formatPrice(product.price_original)}đ</h4>
                    <span className={cx('negotiate')}>Có thể thương lượng</span>
                  </div>
                  <button className={cx('sale')}>-{product.discount}%</button>
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

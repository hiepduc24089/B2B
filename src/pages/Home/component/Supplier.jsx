import React, { useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import { dataSupplier } from '../data/supplier';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function Supplier() {
  const [state, setState] = React.useState({
    loading: true,
    dataListSupplier: [],
  });
  const { loading, dataListSupplier } = state;

  const getNumberOfItems = () => {
    return window.innerWidth > 768 ? 14 : 5;
  };

  const fetchDataListSupplierAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListSupplier: dataSupplier.slice(0, getNumberOfItems()),
      }));
    }, 1000);
  };

  useEffect(() => {
    fetchDataListSupplierAPI();

    const handleResize = () => {
      setState((prevState) => ({
        ...prevState,
        dataListSupplier: dataSupplier.slice(0, getNumberOfItems()),
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('supplier-wrapper')}>
          {dataListSupplier.map((supplier, index) => (
            <div key={index} className={cx('supplier-item')}>
              <div className={cx('d-flex', 'align-items-center')}>
                <img src={supplier.image} alt="Supplier Image" className={cx('supplier-image')} />
                <div className={cx('supplier-text')}>
                  <h3>{supplier.title}</h3>
                  <Link to={'#'} className={cx('find-supplier')}>
                    {supplier.description}
                  </Link>
                  <span className={cx('d-flex', 'align-items-center', 'supplier-location')}>
                    <img src={imagesHome.supplier_location} alt="Location" />
                    {supplier.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  return (
    <>
      <div className={cx('title-header')}>
        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
          <h1>Đang tìm Nhà Cung cấp</h1>
          <Link to={routesConfig.supplier} className={cx('see-all')}>
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

export default memo(Supplier);

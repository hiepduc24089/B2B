import React, { useEffect } from 'react';
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
  useEffect(() => {
    fetchDataListSupplierAPI();
    return () => {};
  }, []);

  const fetchDataListSupplierAPI = async () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        dataListSupplier: dataSupplier,
      }));
    }, 3000);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('supplier-wrapper')}>
          <div className={cx('supplier-item')}>
            {dataListSupplier.map((supplier, index) => (
              <div key={index} className={cx('d-flex', 'align-items-center')}>
                <img src={supplier.image} alt="Supplier Image" />
                <div className={cx('supplier-text')}>
                  <h3>{supplier.title}</h3>
                  <p>{supplier.description}</p>
                  <span className={cx('d-flex', 'align-items-center')}>
                    <img src={imagesHome.supplier_location} alt="Location" />
                    {supplier.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
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

export default Supplier;

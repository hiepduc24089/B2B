import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Supplier.module.scss';
import { imagesHome, imagesSupplier } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import { dataSupplier } from '../Home/data/supplier';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';

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
    }, 1000);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('supplier-item')}>
          {dataListSupplier.map((supplier, index) => (
            <div key={index} className={cx('supplier-item-details')}>
              <img src={supplier.image} alt="Supplier" />
              <div className={cx('supplier-text')}>
                <h3>{supplier.title}</h3>
                <p>{supplier.description}</p>
                <span className={cx('d-flex', 'align-items-center', 'supplier-location')}>
                  <img src={imagesHome.supplier_location} alt="Location" />
                  {supplier.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  return (
    <>
      <SubTitle />
      <div className={cx('supplier')}>
        <h1 className={cx('supplier-title')}>Tìm nhà cung cấp trên toàn quốc</h1>
        <button className={cx('post-news')}>
          <img src={imagesSupplier.post_news} alt="Post New" />
          <span>Đăng tin của bạn</span>
        </button>
        <div className={cx('supplier-wrapper')}>
          <p className={cx('count-post')}>Tìm thấy {dataListSupplier.length} bài đăng</p>
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default Supplier;

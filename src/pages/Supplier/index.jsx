import React, {useEffect} from 'react';
import classNames from 'classnames/bind';
import styles from './Supplier.module.scss';
import { imagesHome } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import { dataSupplier } from '../Home/data/supplier';

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
        <div className={cx('supplier-item')}>
          {dataListSupplier.map((supplier, index) => (
            <div key={index}>
              <img src={supplier.image} alt='Supplier' />
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
      );
    }
  };
  return (
    <div className={cx('supplier')}>
      <h1 className={cx('supplier-title')}>Tìm nhà cung cấp trên toàn quốc</h1>
      <button className={cx('post-news')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
          <path d="M20.5 10.5V6.8C20.5 5.11984 20.5 4.27976 20.173 3.63803C19.8854 3.07354 19.4265 2.6146 18.862 2.32698C18.2202 2 17.3802 2 15.7 2H9.3C7.61984 2 6.77976 2 6.13803 2.32698C5.57354 2.6146 5.1146 3.07354 4.82698 3.63803C4.5 4.27976 4.5 5.11984 4.5 6.8V17.2C4.5 18.8802 4.5 19.7202 4.82698 20.362C5.1146 20.9265 5.57354 21.3854 6.13803 21.673C6.77976 22 7.61984 22 9.3 22H12.5M14.5 11H8.5M10.5 15H8.5M16.5 7H8.5M18.5 21V15M15.5 18H21.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Đăng tin của bạn</span>
      </button>
      <div className={cx('supplier-wrapper')}>
        {renderContent()}
      </div>
    </div>
  );
}

export default Supplier;

import React, { useEffect, memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../Home.module.scss';
import { imagesHome } from '~/assets/images';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import LoadingIndicator from '~/components/Loading';
import { fetchSupplier } from '~/api/home';
import { API_HOST } from '~/config/host';

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
    try {
      const data = await fetchSupplier();

      if (!data.status) {
        console.log('Lấy dữ liệu thất bại');
      }

      setState({
        loading: false,
        dataListSupplier: data.data.data.slice(0, getNumberOfItems()),
      });
    } catch (error) {
      console.error('Error fetching supplier data:', error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    fetchDataListSupplierAPI();

    const handleResize = () => {
      setState((prevState) => ({
        ...prevState,
        dataListSupplier: prevState.dataListSupplier.slice(0, getNumberOfItems()),
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
                <img src={`${API_HOST}${supplier.src[0]}`} alt="Supplier Image" className={cx('supplier-image')} />
                <div className={cx('supplier-text')}>
                  <h3>{supplier.name}</h3>
                  <Link to={'#'} className={cx('find-supplier')}>
                    Tìm nhà cung cấp
                  </Link>
                  <span className={cx('d-flex', 'align-items-center', 'supplier-location')}>
                    <img src={imagesHome.supplier_location} alt="Location" />
                    {supplier.scope_name}
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

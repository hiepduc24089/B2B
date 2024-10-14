import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Supplier.module.scss';
import { imagesHome, imagesSupplier } from '~/assets/images';
import LoadingIndicator from '~/components/Loading';
import { fetchSupplier } from '~/api/home';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function Supplier() {
  const [state, setState] = React.useState({
    loading: true,
    dataListSupplier: [],
  });
  const { loading, dataListSupplier } = state;

  const fetchDataListSupplierAPI = async () => {
    try {
      const data = await fetchSupplier();

      if (!data.status) {
        alert('Lấy dữ liệu thất bại');
        return;
      }

      setState({
        loading: false,
        dataListSupplier: data.data.data,
      });
    } catch (error) {
      console.error('Error fetching supplier data:', error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    fetchDataListSupplierAPI();
  }, []);
  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('supplier-item')}>
          {dataListSupplier.map((supplier, index) => (
            <div key={index} className={cx('supplier-item-details')}>
              <img src={`${API_HOST}${supplier.src[0]}`} alt="Supplier Image" />
              <div className={cx('supplier-text')}>
                <h3>{supplier.name}</h3>
                <p>Tìm nhà cung cấp</p>
                <span className={cx('d-flex', 'align-items-center', 'supplier-location')}>
                  <img src={imagesHome.supplier_location} alt="Location" />
                  {supplier.scope_name}
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

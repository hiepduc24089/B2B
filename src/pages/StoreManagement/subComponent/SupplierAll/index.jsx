import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SupplierAll.module.scss';
import { fetchRequestSupplier } from '~/api/requestsupplier';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import { imagesHome } from '~/assets/images';

const cx = classNames.bind(styles);

function SupplierAll() {
  const [state, setState] = useState({
    loading: true,
    dataRequestSupplier: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
    },
  });

  const { loading, dataRequestSupplier, pagination } = state;

  // Move fetchRequest function to the component scope
  const fetchRequest = async (page = 1) => {
    try {
      const getRequestSupplierResponse = await fetchRequestSupplier(page);

      if (!getRequestSupplierResponse.status) {
        alert('Lấy thông tin yêu cầu nhà cung cấp thất bại, vui lòng thử lại');
        return;
      }

      setState({
        loading: false,
        dataRequestSupplier: getRequestSupplierResponse.data.data,
        pagination: {
          current_page: getRequestSupplierResponse.data.current_page,
          last_page: getRequestSupplierResponse.data.last_page,
          per_page: getRequestSupplierResponse.data.per_page,
        },
      });
    } catch (error) {
      console.error('Fetch request supplier:', error);
      alert('Lấy thông tin yêu cầu nhà cung cấp thất bại, vui lòng thử lại');
    }
  };

  useEffect(() => {
    fetchRequest(); // Fetch initial data on component mount
  }, []);

  const handlePageChange = (page) => {
    // Fetch data for the selected page
    setState((prevState) => ({ ...prevState, loading: true }));
    fetchRequest(page);
  };

  return (
    <>
      <div className={cx('supplier-all-wrapper')}>
        <div className={cx('product-wrapper')}>
          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              {dataRequestSupplier.length === 0 ? (
                <p>Không có bản ghi</p>
              ) : (
                dataRequestSupplier.map((item, index) => (
                  <div key={index} className={cx('supplier-item')}>
                    <img src={`${API_HOST}${item.src[0]}`} alt={item.name} className={cx('supplier-img')} />
                    <div className={cx('information')}>
                      <h5>{item.name}</h5>
                      <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                        <button className={cx('find-supplier')}>Tìm nhà cung cấp</button>
                        <div className={cx('toggle-switch')}>
                          <input type="checkbox" id={`switch-${index}`} />
                          <label htmlFor={`switch-${index}`}></label>
                        </div>
                      </div>
                      <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                        <span className={cx('location')}>
                          <img src={imagesHome.supplier_location} alt="Location" />
                          {item.scope_name}
                        </span>
                        <span className={cx('quantity')}>
                          Số lượng báo giá: <span className={cx('fw-bold')}>{item.quantity}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
      <div className={cx('pagination-wrapper')}>
        {pagination.current_page > 1 && (
          <button onClick={() => handlePageChange(pagination.current_page - 1)}>Previous</button>
        )}
        {pagination.current_page < pagination.last_page && (
          <button onClick={() => handlePageChange(pagination.current_page + 1)}>Next</button>
        )}
      </div>
    </>
  );
}

export default memo(SupplierAll);

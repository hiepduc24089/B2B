import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './PostedRequest.module.scss';
import { fetchRequestSupplier } from '~/api/requestsupplier';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import { imagesHome } from '~/assets/images';
import routesConfig from '~/config/routes';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function PostedRequest() {
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
    fetchRequest();
  }, []);

  const handlePageChange = (page) => {
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
                <p>Bạn chưa đăng yêu cầu nào</p>
              ) : (
                dataRequestSupplier.map((item, index) => (
                  <Link key={index} to={`${routesConfig.supplier_detail.replace(':id', item.id)}`}>
                    <div className={cx('supplier-item')}>
                      <img src={`${API_HOST}${item.src[0]}`} alt={item.name} className={cx('supplier-img')} />
                      <div className={cx('information')}>
                        <h5>{item.name}</h5>
                        <div className={cx('d-flex', 'justify-content-between', 'align-items-center')}>
                          <button className={cx('find-supplier')}>Tìm nhà cung cấp</button>
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
                  </Link>
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

export default memo(PostedRequest);

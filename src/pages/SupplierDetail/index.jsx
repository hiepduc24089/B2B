import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SupplierDetail.module.scss';
import SubTitle from '~/components/Layout/SubTitle/SubTitle';
import Supplier from './component/Supplier';
import Store from './component/Store';
import { useParams } from 'react-router-dom';
import { fetchDetailRequestSupplier } from '~/api/requestsupplier';

const cx = classNames.bind(styles);

function SupplierDetail() {
  const { id } = useParams();
  const [state, setState] = useState({
    loading: true,
    requestSupplier: null,
  });

  const { loading, requestSupplier } = state;

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const selectedRequest = await fetchDetailRequestSupplier(id);

      if (!selectedRequest.status) {
        alert('Lấy dữ liệu thất bại, vui lòng thử lại');
        return;
      }

      setState({
        loading: false,
        requestSupplier: selectedRequest.data,
      });
    } catch (error) {
      console.error('Failed to fetch product or shop details:', error);
      setState({
        loading: false,
        requestSupplier: null,
      });
    }
  };
  return (
    <>
      <SubTitle title="Chi tiết bài đăng" />
      <div className={cx('product-wrapper')}>
        <div className={cx('product-details')}>
          {!loading && requestSupplier ? (
            <Supplier requestSupplier={requestSupplier.request} loading={loading} />
          ) : (
            <p>Loading supplier details...</p>
          )}
        </div>
        <div className={cx('store-details')}>
          {!loading && requestSupplier ? (
            <Store requestSupplier={requestSupplier.user} loading={loading} requestSupplierID={id} />
          ) : (
            <p>Loading store details...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(SupplierDetail);

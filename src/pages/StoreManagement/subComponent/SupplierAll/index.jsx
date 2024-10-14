import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SupplierAll.module.scss';
import { fetchRequestSupplier, postUpdateRequestStatus } from '~/api/requestsupplier';
import LoadingIndicator from '~/components/Loading';
import Warning from '~/components/Layout/Popup/Warning';
import { API_HOST } from '~/config/host';
import { imagesHome } from '~/assets/images';

const cx = classNames.bind(styles);

function SupplierAll({ onFindSupplierClick }) {
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

  const [showWarning, setShowWarning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
    setState((prevState) => ({ ...prevState, loading: true }));
    fetchRequest(page);
  };

  const handleToggleStatus = (item) => {
    setSelectedItem(item);
    setShowWarning(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedItem) return;

    const { id, display } = selectedItem;
    const newDisplay = display === 1 ? 0 : 1;

    try {
      setState((prevState) => ({
        ...prevState,
        dataRequestSupplier: prevState.dataRequestSupplier.map((item) =>
          item.id === id ? { ...item, display: newDisplay } : item,
        ),
      }));

      const responseUpdateStatus = await postUpdateRequestStatus(id, newDisplay);

      if (!responseUpdateStatus.status) {
        alert('Cập nhật trạng thái thất bại.');
        return;
      }
    } catch (error) {
      console.error('Failed to update request supplier status:', error);
      alert('Cập nhật trạng thái thất bại.');
    } finally {
      setShowWarning(false);
      setSelectedItem(null);
    }
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
                        <button className={cx('find-supplier')} onClick={onFindSupplierClick}>
                          Tìm nhà cung cấp
                        </button>
                        <div className={cx('toggle-switch')}>
                          <input
                            type="checkbox"
                            id={`switch-${index}`}
                            checked={item.display === 1}
                            onChange={() => handleToggleStatus(item)} // Show the warning on toggle
                          />
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

      {showWarning && (
        <Warning
          message={
            selectedItem && selectedItem.display === 1
              ? 'Bạn có chắc chắn muốn ngừng hiển thị bài đăng này không?'
              : 'Bạn có muốn hiển thị bài đăng này không?'
          }
          onClose={() => setShowWarning(false)}
          onOk={handleConfirmToggle}
        />
      )}
    </>
  );
}

export default memo(SupplierAll);

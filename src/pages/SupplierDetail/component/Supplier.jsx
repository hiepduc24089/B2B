import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from '../SupplierDetail.module.scss';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function Supplier({ requestSupplier, loading }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else if (requestSupplier) {
      return (
        <>
          <div className={cx('product-images')}>
            <img src={`${API_HOST}${requestSupplier.src[0]}`} alt={requestSupplier.name} className={cx('main-image')} />
            <div className={cx('sub-images')}>
              {requestSupplier.src.slice(1, 6).map((image, index) => (
                <img
                  key={index}
                  src={`${API_HOST}${image}`}
                  alt={`${requestSupplier.name} ${index + 1}`}
                  className={cx('sub-image')}
                />
              ))}
            </div>
          </div>
          <div className={cx('product-infor')}>
            <div className={cx('product-data')}>
              <h1 className={cx('product-title')}>{requestSupplier.name}</h1>
              <div className={cx('infor-detail')}>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <span className={cx('label-field')}>Trạng thái: </span>
                  <span className={cx('input-field-green')}>Còn hiệu lực</span>
                </div>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <span className={cx('label-field')}>Đăng vào: </span>
                  <span className={cx('input-field')}>{formatDate(requestSupplier.created_at)}</span>
                </div>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <span className={cx('label-field')}>Ngày hết hạn: </span>
                  <span className={cx('input-field')}>{formatDate(requestSupplier.date_end)}</span>
                </div>
                <div className={cx('d-flex', 'justify-content-between')}>
                  <span className={cx('label-field')}>Số lượng cần mua: </span>
                  <span className={cx('input-field')}>{requestSupplier.quantity}</span>
                </div>
              </div>
              <div className={cx('notes')}>
                <p>Tìm nhà cung cấp thuốc dạng giảm đau với giá thành vừa phải</p>
                <ul>
                  <li>Yêu cầu chính hãng 100%</li>
                  <li>Có giấy kiểm chứng từ bộ y tế</li>
                  <li>Đã được kiểm tra và công nhận của quốc gia</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <h4>Không tìm thấy yếu cầu</h4>;
    }
  };

  return <>{renderContent()}</>;
}

export default memo(Supplier);

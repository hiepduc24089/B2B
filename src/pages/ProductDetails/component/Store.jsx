import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../ProductDetails.module.scss';
import { Modal, Button } from 'react-bootstrap';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

const BASE_URL = 'https://api-b2b.krmedi.vn';

function Store({ seller, product, loading }) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('store-details')}>
          <div className={cx('store-header')}>
            <img src={`${BASE_URL}${seller.avatar}`} alt={seller.name} />
            <h3>{seller.name}</h3>
            <p>{seller.full_address}</p>
          </div>
          <div className={cx('store-information')}>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Sản phẩm</span>
              <span className={cx('number')}>{product.total_products_shop}</span>
            </div>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Người theo dõi</span>
              <span className={cx('number')}>{product.total_followers_shop}</span>
            </div>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Lượt liên hệ</span>
              <span className={cx('number')}>1</span>
            </div>
            <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Tỷ lệ phản hồi</span>
              <span className={cx('number')}>50%</span>
            </div>
            <button className={cx('follow-btn')}>Theo dõi</button>
            <button className={cx('phone-btn')}>Xem SĐT</button>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div className={cx('store-contact')}>
        <p>Để hỏi về giá sản phẩm, sản phẩm liên quan hoặc các thông tin khác:</p>
        <button onClick={handleShowModal}>Liên hệ ngay</button>
      </div>
      <div className={cx('store-wrapper')}>{renderContent()}</div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} className={cx('store-modal')}>
        <Modal.Header closeButton>
          <Modal.Title className={cx('modal-title')}>Hỏi mua hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product ? (
            <div className={cx('d-flex', 'flex-wrap')}>
              <span>Sản phẩm</span>
              <h5>{product.title}</h5>
            </div>
          ) : (
            <div>Loading product details...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Hỏi mua hàng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default memo(Store);

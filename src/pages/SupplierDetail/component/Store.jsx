import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../SupplierDetail.module.scss';
import { Modal } from 'react-bootstrap';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import { postCreateQuotesFromUser } from '~/api/requestsupplier';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';

const cx = classNames.bind(styles);

function Store({ requestSupplier, loading, requestSupplierID }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [inputRequestSupplierID, setInputRequestSupplierID] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [inputPrice, setInputPrice] = useState(0);
  const [inputContent, setInputContent] = useState('');

  useEffect(() => {
    if (requestSupplierID) {
      setInputRequestSupplierID(requestSupplierID);
    }
  }, [requestSupplierID]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('request_supplier_id', inputRequestSupplierID);
    formData.append('name', inputName);
    formData.append('phone', inputPhone);
    formData.append('price', inputPrice);
    formData.append('address', inputAddress);
    formData.append('content', inputContent);

    setLoadingFullScreen(true);
    try {
      const response = await postCreateQuotesFromUser(formData);
      if (!response.status) {
        handleCloseModal();
        setShowError(true);
        return;
      }

      setShowSuccess(true);
      handleCloseModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      handleCloseModal();
      console.error('Failed to create quotes:', error);
      setShowError(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('store-details')}>
          <div className={cx('store-header')}>
            <img src={`${API_HOST}${requestSupplier.avatar}`} alt={requestSupplier.name} />
            <h3>{requestSupplier.name}</h3>
            <p>{requestSupplier.email}</p>
          </div>

          <div className={cx('store-information')}>
            <button className={cx('follow-btn')} onClick={handleShowModal}>
              Gửi báo giá
            </button>
            <button className={cx('phone-btn')}>Xem SĐT</button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      {renderContent()}
      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} className={cx('store-modal')}>
        <Modal.Header closeButton>
          <Modal.Title className={cx('modal-title')}>Gửi báo giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={cx('w-100', 'double-input')}>
            <div>
              <label className={cx('send-request-label-field')}>Tên của bạn</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className={cx('send-request-input-field')}
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>
            <div>
              <label className={cx('send-request-label-field')}>Thông tin liên hệ của bạn</label>
              <input
                type="text"
                placeholder="0379357213"
                className={cx('send-request-input-field')}
                onChange={(e) => setInputPhone(e.target.value)}
              />
            </div>
          </div>
          <div className={cx('w-100', 'double-input')}>
            <div>
              <label className={cx('send-request-label-field')}>Địa chỉ</label>
              <input
                type="text"
                placeholder="Hà Nội"
                className={cx('send-request-input-field')}
                onChange={(e) => setInputAddress(e.target.value)}
              />
            </div>
            <div>
              <label className={cx('send-request-label-field')}>Giá đưa ra</label>
              <input
                type="number"
                placeholder="0"
                className={cx('send-request-input-field')}
                onChange={(e) => setInputPrice(e.target.value)}
              />
            </div>
          </div>
          <div className={cx('describe-wrapper', 'w-100')}>
            <label className={cx('send-request-label-field')}>Lời nhắn</label>
            <textarea
              type="text"
              rows={10}
              placeholder="Lời nhắn, câu trả lời đến người yêu cầu"
              className={cx('send-request-input-field')}
              onChange={(e) => setInputContent(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button variant="primary" onClick={handleSubmit} className={cx('modal-submit-quote')}>
            Gửi
          </button>
        </Modal.Footer>
      </Modal>

      {showSuccess && <Success message="Gửi báo giá thành công" onClose={() => setShowSuccess(false)} />}
      {showError && <Failed message="Gửi báo giá thất bại" onClose={() => setShowError(false)} />}
    </>
  );
}

export default memo(Store);

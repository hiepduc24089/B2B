import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../ProductDetails.module.scss';
import { Modal } from 'react-bootstrap';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import { postAskToBuyRequest } from '~/api/product';

const cx = classNames.bind(styles);

function Store({ seller, product, loading }) {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [inputProductID, setInputProductID] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inputContent, setInputContent] = useState('');
  const [inputShopID, setInputShopID] = useState(null);

  useEffect(() => {
    if (product && product.id) {
      setInputProductID(product.id);
    }
    if (seller && seller.id) {
      setInputShopID(seller.id);
    }
  }, [product, seller]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('product_id', inputProductID);
    formData.append('quantity', quantity);
    formData.append('content', inputContent);
    formData.append('shop_id', inputShopID);
    try {
      const response = await postAskToBuyRequest(formData);

      if (!response.status) {
        alert('Hỏi mua sản phẩm thất bại.');
        return;
      }

      alert('Gửi yêu cầu mua sản phẩm thành công!');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to post product:', error);
      alert('Hỏi mua sản phẩm thất bại.');
    }
  };

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    } else {
      return (
        <div className={cx('store-details')}>
          <Link
            to={{
              pathname: `${routesConfig.store_information.replace(':id', seller.id)}`,
            }}
            state={{ shop_id: seller.id }}
          >
            <div className={cx('store-header')}>
              <img src={`${API_HOST}${seller.avatar}`} alt={seller.name} />
              <h3>{seller.name}</h3>
              <p>{seller.full_address}</p>
            </div>
          </Link>
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
            <div className={cx('modal-product-infor')}>
              <div className={cx('list-infor-wrapper')} style={{ flexWrap: 'nowrap' }}>
                <span className={cx('label-field')}>Sản phẩm: </span>
                <h5 className={cx('input-field')}>{product.name}</h5>
              </div>
              <div className={cx('list-infor-3-items')}>
                <div className={cx('item')}>
                  <span className={cx('label-field-first-child', 'label-field')}>Số lượng cần mua: </span>
                  <CustomInputNumber
                    min={product.attributes[0].quantity}
                    max={product.quantity}
                    onValueChange={setQuantity}
                  />
                </div>
                <div className={cx('item')}>
                  <span className={cx('label-field')}>Đơn giá: </span>
                  <h5 className={cx('input-field')}>
                    {formatPrice(120000)}đ / {product.unit}
                  </h5>
                </div>
                <div className={cx('item')}>
                  <span className={cx('label-field')}>Thành tiền: </span>
                  <h5 className={cx('input-field', 'text-primary')}>{formatPrice(120000)}đ</h5>
                </div>
              </div>
              <div className={cx('list-infor-wrapper')}>
                <span className={cx('label-field')}>Nội dung tin nhắn: </span>
                <textarea
                  className={cx('input-field', 'input-textarea')}
                  placeholder="Viết tin gửi đến nhà cung cấp"
                  onChange={(e) => setInputContent(e.target.value)}
                ></textarea>
              </div>
            </div>
          ) : (
            <div>Loading product details...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className={cx('modal-buy-at-least')}>
            Vui lòng mua từ <span className={cx('text-primary')}>{product?.attributes[0]?.quantity || 4} sản phẩm</span>{' '}
            trở lên
          </div>
          <button variant="primary" onClick={handleSubmit} className={cx('modal-ask-to-buy')}>
            Hỏi mua hàng
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default memo(Store);

import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../ProductDetails.module.scss';
import { Modal } from 'react-bootstrap';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import CustomInputNumber from '~/components/Layout/CustomInputNumber';
import { postAskToBuyRequest, postCheckFollowShop, postFollowShop } from '~/api/product';
import { postUnfollowShop } from '~/api/profile';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';

const cx = classNames.bind(styles);

function Store({ seller, product, loading }) {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [showSuccessSendRequest, setShowSuccessSendRequest] = useState(false);
  const [showErrorSendRequest, setShowErrorSendRequest] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [inputProductID, setInputProductID] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inputContent, setInputContent] = useState('');
  const [inputShopID, setInputShopID] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(true);

  useEffect(() => {
    if (product && product.id) {
      setInputProductID(product.id);
    }
    if (seller && seller.id) {
      setInputShopID(seller.id);
      setSellerLoading(false);
    }
  }, [product, seller]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('product_id', inputProductID);
    formData.append('quantity', quantity);
    formData.append('content', inputContent);
    formData.append('shop_id', inputShopID);

    setLoadingFullScreen(true);
    try {
      const response = await postAskToBuyRequest(formData);

      if (!response.status) {
        setShowErrorSendRequest(true);
        return;
      }

      setShowSuccessSendRequest(true);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to post product:', error);
      setShowErrorSendRequest(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const userID = localStorage.getItem('user_id') || 0;
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await postCheckFollowShop(seller.id, userID);
        if (response.status) {
          setIsFollowing(response.data);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    if (seller && seller.id) {
      checkFollowStatus();
    }
  }, [seller]);

  const [showSuccessFollow, setShowSuccessFollow] = useState(false);
  const [showSuccessUnfollow, setShowSuccessUnfollow] = useState(false);
  const [showErrorFollow, setShowErrorFollow] = useState(false);
  const [showErrorUnfollow, setShowErrorUnfollow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowShop = async (shopId) => {
    setLoadingFullScreen(true);
    try {
      const followResponse = await postFollowShop(shopId);
      if (followResponse.status) {
        setShowSuccessFollow(true);
        setIsFollowing(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setShowErrorFollow(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return;
      } else {
        console.error('Error follow shop:', error);
        setShowErrorFollow(true);
      }
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const handleUnfollowShop = async (shopId) => {
    setLoadingFullScreen(true);
    try {
      const unfollowResponse = await postUnfollowShop(shopId);
      if (unfollowResponse.status) {
        setShowSuccessUnfollow(true);
        setIsFollowing(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setShowErrorUnfollow(true);
      }
    } catch (error) {
      console.error('Error unfollowing shop:', error);
      setShowErrorUnfollow(true);
    } finally {
      setLoadingFullScreen(false);
    }
  };

  const renderContent = () => {
    if (loading || sellerLoading) {
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
              <span className={cx('number')}>{seller.total_contacts ?? 0}</span>
            </div>
            {/* <div className={cx('d-flex', 'justify-content-between', 'store-number')}>
              <span className={cx('title')}>Tỷ lệ phản hồi</span>
              <span className={cx('number')}>50%</span>
            </div> */}
            {!isFollowing ? (
              <button className={cx('follow-btn')} onClick={() => handleFollowShop(seller.id)}>
                Theo dõi
              </button>
            ) : (
              <button className={cx('unfollow-btn')} onClick={() => handleUnfollowShop(seller.id)}>
                Bỏ theo dõi
              </button>
            )}
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
      {/* Show Success Popup */}
      {showSuccessFollow && <Success message="Theo dõi shop thành công" onClose={() => setShowSuccessFollow(false)} />}
      {showSuccessUnfollow && (
        <Success message="Bỏ theo dõi shop thành công" onClose={() => setShowSuccessUnfollow(false)} />
      )}
      {showErrorFollow && <Failed message="Theo dõi shop thất bại" onClose={() => setShowErrorFollow(false)} />}
      {showErrorUnfollow && <Failed message="Bỏ theo dõi shop thất bại" onClose={() => setShowErrorUnfollow(false)} />}
      {showSuccessSendRequest && (
        <Success message="Gửi yêu cầu mua hàng thành công" onClose={() => setShowSuccessSendRequest(false)} />
      )}
      {showErrorSendRequest && (
        <Failed message="Gửi yêu cầu mua hàng thất bại" onClose={() => setShowErrorSendRequest(false)} />
      )}
    </>
  );
}

export default memo(Store);

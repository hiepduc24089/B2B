import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductAsk.module.scss';
import LoadingIndicator from '~/components/Loading';
import { Modal } from 'react-bootstrap';
import { API_HOST } from '~/config/host';
import { getAskBuy, getAskBuyDetail } from '~/api/store'; // Import the new API function

const cx = classNames.bind(styles);

function ProductAsk() {
  const [state, setState] = useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;

  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState(null); // State to store the details
  const handleCloseModal = () => {
    setShowModal(false);
    setDetails(null); // Reset details when closing the modal
  };

  // Fetch the main product list on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAskBuy();
        if (response.status) {
          setState({
            loading: false,
            dataListProduct: response.data.data,
          });
        } else {
          setState({
            loading: false,
            dataListProduct: [],
          });
          console.error('Failed to fetch data:', response.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setState({
          loading: false,
          dataListProduct: [],
        });
      }
    };

    fetchData();
  }, []);

  // Function to handle click on "Chi tiết"
  const handleShowDetails = async (ask_id) => {
    setShowModal(true);
    setDetails(null);

    try {
      const response = await getAskBuyDetail(ask_id);
      if (response.status) {
        setDetails(response.data);
      } else {
        console.error('Failed to fetch product details:', response.message);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return (
    <>
      <div className={cx('sale-product-header')}>
        <h3 className={cx('mb-0')}>Hỏi mua sản phẩm</h3>
      </div>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className={cx('table-container')}>
          <table className={cx('table', 'table-vcenter', 'text-nowrap')}>
            <thead>
              <tr>
                <th className={cx('border-bottom-0', 'black-text', 'text-start', 'ps-0')}>Sản phẩm</th>
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Số lượng</th>
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Người hỏi</th>
                <th className={cx('border-bottom-0', 'black-text', 'text-end')}>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {dataListProduct.map((product) => (
                <tr key={product.id}>
                  <td className={cx('ps-0')}>
                    <div className={cx('d-flex', 'align-items-center')}>
                      <img
                        src={`${API_HOST}${product.product_src[0]}`}
                        alt={product.product_name}
                        className={cx('product-image')}
                      />
                      <h5 className={cx('product-name')}>{product.product_name}</h5>
                    </div>
                  </td>
                  <td className={cx('black-text', 'text-center')}>{product.quantity}</td>
                  <td className={cx('black-text', 'text-center')}>{product.user_name}</td>
                  <td className={cx('pe-0', 'text-webkit-right')}>
                    <span className={cx('set-sale-btn')} onClick={() => handleShowDetails(product.id)}>
                      Chi tiết
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal show={showModal} onHide={handleCloseModal} className={cx('sale-modal')}>
        <div className={cx('modal-title')}>
          <h3>Chi tiết hỏi mua</h3>
        </div>
        {details ? (
          <div className={cx('modal-product-infor')}>
            <div className={cx('list-infor-wrapper')} style={{ flexWrap: 'nowrap' }}>
              <span className={cx('label-field')}>Sản phẩm: </span>
              <h5 className={cx('input-field')}>{details.product_name}</h5>
            </div>
            <div className={cx('list-infor-3-items')}>
              <div className={cx('item')}>
                <span className={cx('label-field-first-child', 'label-field')}>Số lượng cần mua: </span>
                <h5 className={cx('input-field')}>{details.quantity}</h5>
              </div>
              <div className={cx('item')}>
                <span className={cx('label-field')}>Đơn giá: </span>
                <h5 className={cx('input-field')}>{formatPrice(details.product_price)}đ</h5>
              </div>
              <div className={cx('item')}>
                <span className={cx('label-field')}>Thành tiền: </span>
                <h5 className={cx('input-field', 'text-primary')}>
                  {formatPrice(details.quantity * details.product_price)}đ
                </h5>
              </div>
            </div>
            <div className={cx('list-infor-3-items')} style={{ width: '60%' }}>
              <div className={cx('item')}>
                <span className={cx('label-field-first-child', 'label-field')}>Người hỏi: </span>
                <h5 className={cx('input-field')}>{details.user_name}</h5>
              </div>
              <div className={cx('item')}>
                <span className={cx('label-field')}>SĐT: </span>
                <h5 className={cx('input-field')}>{details.user_phone}</h5>
              </div>
            </div>
            <div className={cx('list-infor-wrapper')}>
              <span className={cx('label-field')}>Nội dung tin nhắn: </span>
              <h5 className={cx('input-field')}>{details.content}</h5>
            </div>
          </div>
        ) : (
          <LoadingIndicator />
        )}
        <div className={cx('modal-footer')}>
          <button onClick={handleCloseModal} className={cx('modal-close-sale')}>
            Đóng
          </button>
        </div>
      </Modal>
    </>
  );
}

export default memo(ProductAsk);

import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductSale.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { fetchProductByShopAtShop, postUpdateSale, updateSaleDisplay } from '~/api/product';
import LoadingIndicator from '~/components/Loading';
import { API_HOST } from '~/config/host';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';
import { Modal } from 'react-bootstrap';
import Warning from '~/components/Layout/Popup/Warning';

const cx = classNames.bind(styles);

function ProductSale() {
  const [newDisplayValue, setNewDisplayValue] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showUpdateFailed, setShowUpdateFailed] = useState(false);
  const [state, setState] = useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    quantity: 0,
    price: 0,
    name: null,
    image: null,
    unit: null,
    original_price: 0,
  });
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [number, setNumber] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [confirmProductID, setConfirmProductID] = useState(null);
  const [showUpdateDisplaySuccess, setShowUpdateDisplaySuccess] = useState(false);
  const [showUpdateDisplayFailed, setShowUpdateDisplayFailed] = useState(false);

  const handleCheckboxChange = (index, productID) => {
    const product = dataListProduct[index];
    const newDisplay = product.discount_display ? 0 : 1;
    setNewDisplayValue(newDisplay);
    setConfirmProductID(productID);
    setShowWarning(true);
  };

  const handleConfirmToggle = async (productID, newDisplayValue) => {
    setLoadingFullScreen(true);
    try {
      const updateStatus = await updateSaleDisplay(productID, newDisplayValue);
      if (!updateStatus.status) {
        setShowUpdateDisplayFailed(true);
        return;
      }

      const updatedProducts = dataListProduct.map((item) =>
        item.id === productID ? { ...item, discount_display: newDisplayValue === 1 } : item,
      );

      setState({ ...state, dataListProduct: updatedProducts });
      setShowUpdateDisplaySuccess(true);
    } catch (error) {
      setShowUpdateDisplayFailed(true);
      console.error('Failed to update display:', error);
    } finally {
      setLoadingFullScreen(false);
      setShowWarning(false);
    }
  };

  const handleShowModal = (
    id,
    quantity,
    price,
    name,
    image,
    unit,
    original_price,
    discount,
    discount_date_start,
    discount_date_end,
    discount_number,
  ) => {
    setSelectedProduct({
      id,
      quantity,
      price,
      name,
      image,
      unit,
      original_price,
      discount,
      discount_date_start,
      discount_date_end,
      discount_number,
    });

    setDateStart(discount_date_start || '');
    setDateEnd(discount_date_end || '');
    setNumber(discount_number || 0);
    setDiscount(discount || 0);

    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const fetchDataListProductAPI = async () => {
    try {
      const data = await fetchProductByShopAtShop();
      const initializedProducts = data.data.data.map((product) => ({
        ...product,
        discount_display: product.discount_display === 1,
      }));
      setState({
        loading: false,
        dataListProduct: initializedProducts,
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchDataListProductAPI();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('date_start', dateStart);
    formData.append('date_end', dateEnd);
    formData.append('number', number);
    formData.append('discount', discount);

    setLoadingFullScreen(true);
    try {
      const response = await postUpdateSale(selectedProduct.id, formData);
      if (!response.status) {
        setShowUpdateFailed(true);
        return;
      }
      setShowUpdateSuccess(true);
      setTimeout(() => {
        fetchDataListProductAPI();
      }, 1500);
    } catch (error) {
      console.error('Failed to post sale product:', error);
      setShowUpdateFailed(true);
    } finally {
      setLoadingFullScreen(false);
      handleCloseModal();
    }
  };

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div className={cx('sale-product-header')}>
        <h3 className={cx('mb-0')}>Giảm giá</h3>
        {/* <HeadlessTippy>
          <div className={cx('search')}>
            <input className={cx('search-field', 'form-control')} placeholder="Tìm kiếm theo tên" spellCheck={false} />
            <button className={cx('search-btn', 'd-flex')}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </HeadlessTippy> */}
      </div>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className={cx('table-container')}>
          <table className={cx('table', 'table-vcenter', 'text-nowrap')}>
            <thead>
              <tr>
                <th className={cx('border-bottom-0', 'black-text', 'text-start', 'ps-0')}>Sản phẩm</th>
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Mã sản phẩm</th>
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Giá</th>
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Tồn kho</th>
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Trạng thái</th>
                <th className={cx('border-bottom-0', 'black-text', 'text-end')}>Giảm giá</th>
              </tr>
            </thead>
            <tbody>
              {dataListProduct.map((product, index) => (
                <tr key={index}>
                  <td className={cx('ps-0')}>
                    <div className={cx('d-flex', 'align-items-center')}>
                      <img src={`${API_HOST}${product.src[0]}`} alt={product.name} className={cx('product-image')} />
                      <h5 className={cx('product-name')}>{product.name}</h5>
                    </div>
                  </td>
                  <td className={cx('black-text', 'text-center')}>{product.sku}</td>
                  <td className={cx('price', 'text-center')}>
                    <span className={cx('unit-price', 'black-text')}>{formatPrice(product.original_price)}đ</span>
                    <span className={cx('unit', 'grey-text')}>/ {product.unit}</span>
                  </td>
                  <td className={cx('black-text', 'text-center')}>{product.quantity}</td>
                  <td className={cx('text-center')}>
                    <input
                      type="checkbox"
                      checked={product.discount_display}
                      onChange={() => handleCheckboxChange(index, product.id)}
                      className={cx('status-checkbox')}
                    />
                  </td>
                  <td className={cx('pe-0', 'text-webkit-right')}>
                    <span
                      className={cx('set-sale-btn')}
                      onClick={() =>
                        handleShowModal(
                          product.id,
                          product.quantity,
                          product.final_price,
                          product.name,
                          product.src[0],
                          product.unit,
                          product.original_price,
                          product.discount,
                          product.discount_date_start,
                          product.discount_date_end,
                          product.discount_number,
                        )
                      }
                    >
                      Cài đặt giảm giá
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
          <h3>Cài đặt giảm giá</h3>
        </div>
        <div className={cx('set-sale-wrapper')}>
          <div className={cx('image-wrapper')}>
            <div className={cx('d-flex', 'justify-content-between', 'status-wrapper')}>
              <span>Trạng thái giảm giá: </span>
              <span className={cx('active-sale')}>Đang hoạt động</span>
            </div>
            <img
              src={`${API_HOST}${selectedProduct.image}`}
              className={cx('image-product')}
              alt={selectedProduct.name}
            />
            <h5 className={cx('product-name')}>{selectedProduct.name}</h5>
          </div>
          <div className={cx('content-wrapper')}>
            <div className={cx('input-wrapper')}>
              <label className={cx('label-field')}>
                Bắt đầu <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                className={cx('input-field')}
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label className={cx('label-field')}>
                Kết thúc <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                className={cx('input-field')}
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label className={cx('label-field')}>Tồn kho:</label>
              <input type="text" className={cx('input-field')} readOnly value={selectedProduct.quantity} />
            </div>
            <div className={cx('input-wrapper')}>
              <label className={cx('label-field')}>
                Khuyến mãi <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                className={cx('input-field')}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
              <span className={cx('unit-sale')}>%</span>
            </div>
            <div className={cx('input-wrapper')}>
              <label className={cx('label-field')}>
                Số lượng hàng muốn giảm giá <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                className={cx('input-field')}
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
              />
              <span className={cx('unit-sale')}>{selectedProduct.unit}</span>
            </div>
            <div className={cx('input-wrapper')}>
              <label className={cx('label-field')}>Giá bán:</label>
              <input
                type="text"
                className={cx('input-field')}
                readOnly
                value={formatPrice(selectedProduct.original_price) + ' VNĐ'}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label className={cx('label-field')}>Giá sau khi áp dụng khuyến mãi:</label>
              <input
                type="text"
                className={cx('input-field')}
                readOnly
                value={formatPrice(selectedProduct.price) + ' VNĐ'}
              />
            </div>
          </div>
        </div>
        <div className={cx('modal-footer')}>
          <button onClick={handleCloseModal} className={cx('modal-close-sale')}>
            Đóng chương trình giảm giá
          </button>
          <button onClick={handleSubmit} className={cx('modal-update-sale')}>
            Lưu
          </button>
        </div>
      </Modal>
      {showWarning && (
        <Warning
          message={
            newDisplayValue === 1
              ? 'Bạn có muốn bật giảm giá cho sản phẩm này không?'
              : 'Bạn có chắc chắn muốn ngừng giảm giá cho sản phẩm này không?'
          }
          onClose={() => setShowWarning(false)}
          onOk={() => handleConfirmToggle(confirmProductID, newDisplayValue)}
        />
      )}
      {showUpdateSuccess && (
        <Success message="Cập nhật giảm giá thành công" onClose={() => setShowUpdateSuccess(false)} />
      )}
      {showUpdateFailed && <Failed message="Cập nhật giảm giá thất bại" onClose={() => setShowUpdateFailed(false)} />}
      {showUpdateDisplaySuccess && (
        <Success message="Cập nhật trạng thái giảm giá thành công" onClose={() => setShowUpdateDisplaySuccess(false)} />
      )}
      {showUpdateDisplayFailed && (
        <Failed message="Cập nhật trạng thái giảm giá thất bại" onClose={() => setShowUpdateDisplayFailed(false)} />
      )}
    </>
  );
}

export default memo(ProductSale);

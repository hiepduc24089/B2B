import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductRemaining.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { InputNumber, Modal } from 'antd';
import { fetchProductByShopAtShop, postUpdateRemaining } from '~/api/product';
import { API_HOST } from '~/config/host';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function ProductRemaining() {
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
  });

  const handleShowModal = (id, quantity) => {
    setSelectedProduct({ id, quantity });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const fetchDataListProductAPI = async () => {
    try {
      const data = await fetchProductByShopAtShop();
      const initializedProducts = data.data.data.map((product) => ({
        ...product,
        isChecked: product.display === 1,
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
    formData.append('quantity', selectedProduct.quantity);

    setLoadingFullScreen(true);
    try {
      const response = await postUpdateRemaining(selectedProduct.id, formData);
      if (!response.status) {
        setShowUpdateFailed(true);
        return;
      }
      setShowUpdateSuccess(true);
      setTimeout(() => {
        fetchDataListProductAPI();
      }, 1500);
    } catch (error) {
      console.error('Failed to post product:', error);
      setShowUpdateFailed(true);
    } finally {
      setLoadingFullScreen(false);
      handleCloseModal();
    }
  };

  return (
    <>
      {loadingFullScreen && (
        <div className={cx('fullscreen-loading')}>
          <LoadingIndicator />
        </div>
      )}
      <div className={cx('remaining-product-header')}>
        <h3 className={cx('mb-0')}>Tồn kho</h3>
        <HeadlessTippy>
          <div className={cx('search')}>
            <input className={cx('search-field', 'form-control')} placeholder="Tìm kiếm theo tên" spellCheck={false} />
            <button className={cx('search-btn', 'd-flex')}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </HeadlessTippy>
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
                <th className={cx('border-bottom-0', 'black-text', 'text-end')}>Tồn kho</th>
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
                  <td className={cx('black-text', 'input-number', 'pe-0')}>
                    <input
                      type="text"
                      value={product.quantity}
                      className={cx('remaining-quantity')}
                      onClick={() => handleShowModal(product.id, product.quantity)}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={showModal} onCancel={handleCloseModal} className={cx('remaining-modal')} footer={null}>
        <h3 className={cx('modal-title')}>Cập nhật tồn kho</h3>
        <div className={cx('modal-body')}>
          <label>Tồn kho mới</label>
          <InputNumber
            value={selectedProduct.quantity}
            onChange={(value) => setSelectedProduct((prev) => ({ ...prev, quantity: value }))}
            className={cx('input-field')}
          />
        </div>
        <div className={cx('modal-footer')}>
          <button onClick={handleSubmit} className={cx('modal-update-remaining')}>
            Lưu
          </button>
        </div>
      </Modal>
      {showUpdateSuccess && (
        <Success message="Cập nhật tồn kho thành công" onClose={() => setShowUpdateSuccess(false)} />
      )}
      {showUpdateFailed && <Failed message="Cập nhật tồn kho thất bại" onClose={() => setShowUpdateFailed(false)} />}
    </>
  );
}

export default memo(ProductRemaining);

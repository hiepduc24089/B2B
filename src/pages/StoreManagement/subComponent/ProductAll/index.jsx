import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductAll.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { images, imagesHome } from '~/assets/images';
import { deleteProductByShop, fetchProductByShopAtShop, updateProductDisplay } from '~/api/product';
import LoadingIndicator from '~/components/Loading';
import Warning from '~/components/Layout/Popup/Warning';
import Success from '~/components/Layout/Popup/Success';
import Failed from '~/components/Layout/Popup/Failed';
import { API_HOST } from '~/config/host';

const cx = classNames.bind(styles);

function ProductAll({ onEditProductClick }) {
  const [loadingFullScreen, setLoadingFullScreen] = useState(false);
  const [state, setState] = useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;
  const [showWarning, setShowWarning] = useState(false); // Warning popup control
  const [showDeleteWarning, setShowDeleteWarning] = useState(false); // Control delete warning popup
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteFailed, setShowDeleteFailed] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // Store product ID to delete
  const [selectedProduct, setSelectedProduct] = useState(null); // Store the selected product to update
  const [newDisplayValue, setNewDisplayValue] = useState(null); // Store the new display value

  const fetchDataListProductAPI = async () => {
    try {
      const data = await fetchProductByShopAtShop();
      const initializedProducts = data.data.data.map((product) => ({
        ...product,
        isChecked: product.display === 1, // Initialize isChecked based on display value
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

  const handleDeleteProduct = (productID) => {
    setProductToDelete(productID); // Store the product ID to delete
    setShowDeleteWarning(true); // Show the delete warning popup
  };

  const handleConfirmDelete = async () => {
    setLoadingFullScreen(true);
    try {
      const response = await deleteProductByShop(productToDelete);
      if (response.status) {
        const updatedProducts = dataListProduct.filter((product) => product.id !== productToDelete);
        setState({ ...state, dataListProduct: updatedProducts });
        setShowDeleteSuccess(true);
      } else {
        setShowDeleteFailed(true);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      setShowDeleteFailed(true);
    } finally {
      setLoadingFullScreen(false);
      setShowDeleteWarning(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    fetchDataListProductAPI();
  }, []);

  const handleCheckboxChange = (index, product) => {
    const newDisplay = product.isChecked ? 0 : 1;
    setSelectedProduct({ index, product });
    setNewDisplayValue(newDisplay);
    setShowWarning(true);
  };

  const handleConfirmToggle = async () => {
    const { index, product } = selectedProduct;

    try {
      const updateStatus = await updateProductDisplay(product.id, newDisplayValue);
      if (!updateStatus.status) {
        alert('Cập nhật sản phẩm thất bại, vui lòng thử lại');
        return;
      }

      const updatedProducts = dataListProduct.map((item, productIndex) =>
        productIndex === index ? { ...item, isChecked: !item.isChecked } : item,
      );

      setState({ ...state, dataListProduct: updatedProducts });
    } catch (error) {
      console.error('Failed to update display:', error);
    } finally {
      setShowWarning(false);
      setSelectedProduct(null);
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
      <div className={cx('all-product-header')}>
        <h3 className={cx('mb-0')}>Tất cả sản phẩm</h3>
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
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Giá</th>
                <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Trạng thái</th>
                <th className={cx('border-bottom-0', 'black-text', 'text-end')}>Sửa xóa</th>
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
                  <td className={cx('text-center')}>
                    <input
                      type="checkbox"
                      checked={product.isChecked}
                      onChange={() => handleCheckboxChange(index, product)}
                      className={cx('status-checkbox')}
                    />
                  </td>
                  <td className={cx('pe-0', 'text-webkit-right')}>
                    <button className={cx('edit')} onClick={() => onEditProductClick(product.id)}>
                      {' '}
                      <img src={images.edit_icon} alt="Edit icon" />
                    </button>
                    <button className={cx('delete')} onClick={() => handleDeleteProduct(product.id)}>
                      <img src={images.delete_icon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showDeleteWarning && (
        <Warning
          message="Bạn có chắc chắn muốn xóa sản phẩm này không?"
          onClose={() => setShowDeleteWarning(false)}
          onOk={handleConfirmDelete}
        />
      )}
      {showWarning && (
        <Warning
          message={
            newDisplayValue === 1
              ? 'Bạn có muốn kinh doanh sản phẩm này không?'
              : 'Bạn có chắc chắn muốn ngừng kinh doanh sản phẩm này không?'
          }
          onClose={() => setShowWarning(false)}
          onOk={handleConfirmToggle}
        />
      )}

      {showDeleteSuccess && <Success message="Xoá sản phẩm thành công" onClose={() => setShowDeleteSuccess(false)} />}
      {showDeleteFailed && <Failed message="Xoá sản phẩm thất bại" onClose={() => setShowDeleteFailed(false)} />}
    </>
  );
}

export default memo(ProductAll);

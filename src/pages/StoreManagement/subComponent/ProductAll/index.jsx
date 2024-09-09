import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductAll.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { images, imagesHome } from '~/assets/images';
import { fetchProductByShopAtShop, updateProductDisplay } from '~/api/product';
import LoadingIndicator from '~/components/Loading';

const cx = classNames.bind(styles);

function ProductAll() {
  const [state, setState] = useState({
    loading: true,
    dataListProduct: [],
  });
  const { loading, dataListProduct } = state;

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

  useEffect(() => {
    fetchDataListProductAPI();
  }, []);

  const handleCheckboxChange = async (index, product_id, currentChecked) => {
    const newDisplayValue = currentChecked ? 0 : 1;

    try {
      const updateStatus = await updateProductDisplay(product_id, newDisplayValue);
      if (!updateStatus.status) {
        alert('Cập nhật sản phẩm thất bại, vui lòng thử lại');
      }
      const updatedProducts = dataListProduct.map((product, productIndex) =>
        productIndex === index ? { ...product, isChecked: !product.isChecked } : product,
      );

      setState({ ...state, dataListProduct: updatedProducts });

      alert('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Failed to update display:', error);
    }
  };

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  return (
    <>
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
          {loading ? (
            <LoadingIndicator />
          ) : (
            <tbody>
              {dataListProduct.map((product, index) => (
                <tr key={index}>
                  <td className={cx('ps-0')}>
                    <div className={cx('d-flex')}>
                      <img
                        src={imagesHome.image_product}
                        alt="Tinh Nghệ Nano Curcumin OIC"
                        className={cx('product-image')}
                      />
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
                      onChange={() => handleCheckboxChange(index, product.id, product.isChecked)}
                      className={cx('status-checkbox')}
                    />
                  </td>
                  <td className={cx('pe-0', 'text-webkit-right')}>
                    <button className={cx('edit')}>
                      <img src={images.edit_icon} alt="Edit icon" />
                    </button>
                    <button className={cx('delete')}>
                      <img src={images.delete_icon} alt="Delete Icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}

export default memo(ProductAll);

import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductSale.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { imagesHome } from '~/assets/images';

const cx = classNames.bind(styles);

function ProductSale() {
  const [isChecked, setIsChecked] = useState(true); // State to manage checkbox

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checked state
  };
  return (
    <>
      <div className={cx('sale-product-header')}>
        <h3 className={cx('mb-0')}>Giảm giá</h3>
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
              <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Tồn kho</th>
              <th className={cx('border-bottom-0', 'text-center', 'black-text')}>Trạng thái</th>
              <th className={cx('border-bottom-0', 'black-text', 'text-end')}>Giảm giá</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cx('ps-0')}>
                <div className={cx('d-flex')}>
                  <img
                    src={imagesHome.image_product}
                    alt="Tinh Nghệ Nano Curcumin OIC"
                    className={cx('product-image')}
                  />
                  <h5 className={cx('product-name')}>
                    Tinh Nghệ Nano Curcumin OIC NEW (3 Vỉ x 10 viên) giảm Đau Viêm loét Dạ dày TPCN Thực phẩm
                  </h5>
                </div>
              </td>
              <td className={cx('black-text', 'text-center')}>#37387</td>
              <td className={cx('price', 'text-center')}>
                <span className={cx('unit-price', 'black-text')}>376.500đ</span>
                <span className={cx('unit', 'grey-text')}>/ Hộp</span>
              </td>
              <td className={cx('black-text', 'text-center')}>123</td>
              <td className={cx('text-center')}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className={cx('status-checkbox')}
                />
              </td>
              <td className={cx('pe-0', 'text-webkit-right')}>Cài đặt giảm giá</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default memo(ProductSale);

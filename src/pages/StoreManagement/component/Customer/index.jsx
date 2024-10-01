import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Customer.module.scss';
import { imagesSeller } from '~/assets/images';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Customer() {
  return (
    <>
      <div>
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
        <table className={cx('table', 'table-vcenter', 'text-nowrap', 'table-customer')}>
          <tbody>
            <tr>
              <td className={cx('ps-0')}>
                <div className={cx('infor-wrapper')}>
                  <img
                    src={imagesSeller.seller_avatar}
                    alt="Tinh Nghệ Nano Curcumin OIC"
                    className={cx('customer-image')}
                  />
                  <div className={cx('name-wrapper')}>
                    <h5 className={cx('customer-name')}>Trần đình phi</h5>
                    <p className={cx('customer-address')}>Q. Thanh Xuan, Hà Nội</p>
                  </div>
                </div>
              </td>
              <td className={cx('black-text', 'text-center')}>0 đơn hàng</td>
              <td className={cx('black-text', 'text-center')}>0đ đã thanh toán</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default memo(Customer);

import React from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { images } from '~/assets/images';

const cx = classNames.bind(styles);

function Search() {
  return (
    <>
      <HeadlessTippy>
        <div className={cx('search')}>
          <input
            className={cx('search-field', 'form-control')}
            placeholder="Nhập từ khoá để tìm kiếm"
            spellCheck={false}
          />
          <button className={cx('search-btn', 'd-flex')}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <img src={images.camera} className={cx('camera-icon')} alt="Camera" />
        </div>
      </HeadlessTippy>
      <div className={cx('suggest')}>Thuốc chữa bệnh | Thực phẩm chức năng | Thuốc giảm đau</div>
    </>
  );
}

export default Search;

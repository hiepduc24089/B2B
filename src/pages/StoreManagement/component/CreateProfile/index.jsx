import React, { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './CreateProfile.module.scss';
import { imagesStore } from '~/assets/images';

const cx = classNames.bind(styles);

function CreateProfile() {
  return (
    <div className={cx('create-profile')}>
      <div className={cx('cover')}>
        <div className={cx('new-cover')}>
          <img src={imagesStore.new_cover_icon} alt="New Image" className={cx('new_cover_icon')} />
          <span>Thêm ảnh bìa</span>
        </div>
        <div className={cx('new-avatar')}>
          <div className={cx('avater-wrapper')}>
            <img src={imagesStore.new_avatar} alt="New Avatar" />
            <img src={imagesStore.new_avatar_icon} alt="New Image" className={cx('new_avatar_icon')} />
          </div>
        </div>
      </div>

      <div className={cx('content')}>
        <div className={cx('basic-information')}>
          <h5>Thông tin cơ bản</h5>
          <div className={cx('box-wrapper', 'basic-information-details')}>123123</div>
        </div>
      </div>
    </div>
  );
}

export default memo(CreateProfile);

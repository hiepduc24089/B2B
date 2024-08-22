import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../RelatedInformation.module.scss';
import { images } from '~/assets/images';

const cx = classNames.bind(styles);

function RelatedInformation({ productOverview, storeOverview }) {
  const [activeTab, setActiveTab] = useState('product'); // State to manage the active tab

  return (
    <div className={cx('related-information-wrapper')}>
      <div className={cx('related-information-header', 'd-flex', 'justify-content-between')}>
        <div className={cx('d-flex')}>
          <div
            className={cx('product-wrapper', { active: activeTab === 'product' })}
            onClick={() => setActiveTab('product')}
          >
            Tổng quan sản phẩm
          </div>
          <div className={cx('store-wrapper', { active: activeTab === 'store' })} onClick={() => setActiveTab('store')}>
            Tổng quan cửa hàng
          </div>
        </div>
        <div className={cx('report-product')}>
          <img src={images.infor} alt="Infor" />
          Báo cáo sản phẩm
        </div>
      </div>

      <div className={cx('tab-content')}>
        {activeTab === 'product' && (
          <div className={cx('product-tab')}>
            <div dangerouslySetInnerHTML={{ __html: productOverview }} />
          </div>
        )}
        {activeTab === 'store' && (
          <div className={cx('store-tab')}>
            <div dangerouslySetInnerHTML={{ __html: storeOverview }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(RelatedInformation);

import React from 'react';
import Header from '~/components/Layout/Header/Header';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Footer from '../Layout/Footer/Footer';
import StoreHeader from '~/components/Layout/StoreHeader';
import { useStoreHeader } from '~/context/StoreHeaderContext';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const { isStoreHeaderVisible } = useStoreHeader();
  return (
    <div className={cx('wrapper')}>
      <Header />
      {isStoreHeaderVisible && <StoreHeader />}
      <div className={cx('container')}>
        <div className={cx('content')}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;

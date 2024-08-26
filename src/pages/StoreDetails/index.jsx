import React, { memo, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './StoreDetails.module.scss';
import { useStoreHeader } from '~/context/StoreHeaderContext';

const cx = classNames.bind(styles);

function StoreDetails() {
  const { setStoreHeaderVisibility } = useStoreHeader();

  useEffect(() => {
    setStoreHeaderVisibility(true);
    return () => setStoreHeaderVisibility(false);
  }, [setStoreHeaderVisibility]);

  return <>123</>;
}

export default memo(StoreDetails);

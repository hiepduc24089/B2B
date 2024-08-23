import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { InputNumber } from 'antd';
import styles from './CustomInputNumber.module.scss';

const cx = classNames.bind(styles);

function CustomInputNumber({ min, max, initialValue, className, onValueChange }) {
  const [value, setValue] = useState(initialValue || min);

  const increment = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      if (onValueChange) onValueChange(newValue);
    }
  };

  const decrement = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      if (onValueChange) onValueChange(newValue);
    }
  };

  const handleChange = (newValue) => {
    if (newValue >= min && newValue <= max) {
      setValue(newValue);
      if (onValueChange) onValueChange(newValue);
    }
  };

  useEffect(() => {
    if (onValueChange) {
      onValueChange(value); // Initial value change trigger
    }
  }, []);

  return (
    <div className={cx('custom-input-number', className)}>
      <button onClick={decrement} className={cx('custom-button', 'minus')}>
        -
      </button>
      <InputNumber min={min} max={max} value={value} onChange={handleChange} className={cx('text-center')} />
      <button onClick={increment} className={cx('custom-button', 'plus')}>
        +
      </button>
    </div>
  );
}

export default CustomInputNumber;

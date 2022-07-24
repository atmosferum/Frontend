import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input(props: InputProps) {
  const { error = false, className, ...restProps } = props;
  return <input type="text" className={cx('input', { error }, className)} {...restProps} />;
}

import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames/bind';
import { Loader } from '../Loader';
const cx = classNames.bind(styles);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'stretch';
  isStretch?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    loading = false,
    children,
    className,
    isStretch,
    ...restProps
  } = props;

  return (
    <button
      className={cx('button', `button--${variant}`, isStretch && '--stretch', className)}
      {...restProps}
    >
      {!loading ? children : <Loader />}
    </button>
  );
}

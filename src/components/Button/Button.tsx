import styles from './style.module.scss';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames/bind';
import { Loader } from '../Loader';

const cx = classNames.bind(styles);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', loading = false, children, ...restProps } = props;

  return (
    <button className={cx('button', `button--${variant}`)} {...restProps}>
      {!loading ? children : <Loader />}
    </button>
  );
}

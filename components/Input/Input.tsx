import styles from './style.module.scss';
import { InputHTMLAttributes } from 'react';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input(props: InputProps) {
  const { error = false, ...restProps } = props;
  return <input type="text" className={cx('input', { error })} {...restProps} />;
}
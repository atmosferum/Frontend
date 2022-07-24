import React from 'react';
import styles from './Loader.module.scss';
import cn from 'classnames/bind';
const cx = cn.bind(styles);

export function Loader() {
  return <img className={cx('loader')} width={24} height={24} alt="corgi"></img>;
}

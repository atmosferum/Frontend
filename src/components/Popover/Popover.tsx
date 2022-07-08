import React, { ReactNode } from 'react';
import s from './style.module.scss';
import cn from 'classnames/bind';
import { X } from 'react-feather';

const cx = cn.bind(s);

interface PopoverProps {
  children?: ReactNode;
}

export function Popover(props: PopoverProps) {
  const { children } = props;

  return <div className={s.popover}>{children}</div>;
}

import React, { ReactNode, useState } from 'react';
import styles from './style.module.scss';
import cn from 'classnames/bind';
import { X } from 'react-feather';

const cx = cn.bind(styles);

interface PopoverProps {
  children?: ReactNode;
  open?: boolean;
  x?: number;
  y?: boolean;
  close?: () => void;
}

export function Popover(props: PopoverProps) {
  const { children, x, y, close } = props;
  const [open, setOpen] = useState(props.open);
  const styles = {
    display: open ?? false ? 'block' : 'none',
    top: '200px',
    left: '200px',
    width: '200px',
  };
  return (
    <div style={{ position: 'absolute', ...styles }} className={cx('content')}>
      <div className={cx('close')}>
        <X onClick={close ?? (() => setOpen(false))} />
      </div>
      <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur sunt sint iste modi
        aliquam fugiat nihil excepturi natus cumque hic corrupti esse officia blanditiis impedit, in
        voluptatibus odio itaque non?
      </div>
    </div>
  );
}

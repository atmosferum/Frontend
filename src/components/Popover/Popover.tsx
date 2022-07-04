import React, { ReactNode, useState } from 'react';
import {
  Root,
  Trigger,
  Content,
  Close,
  Arrow,
  Anchor,
  PopoverProps as RadixPopoverProps,
  PopoverAnchor,
} from '@radix-ui/react-popover';
import { X } from 'react-feather';
import { Button } from '../Button';
import styles from './style.module.scss';
import cn from 'classnames/bind';
const cx = cn.bind(styles);

interface PopoverProps {
  children?: ReactNode;
  open?: boolean;
  x?: number;
  y?: boolean;
  close?: () => void;
}

export function Popover(props: PopoverProps) {
  const { children, x, y } = props;
  const [open, setOpen] = useState(props.open);
  const styles = {
    display: open ?? false ? 'block' : 'none',
    top: '0',
    left: '0',
    width: '200px',
  };
  return (
    <div style={{ position: 'absolute', ...styles }}>
      <button onClick={() => setOpen(false)}></button>
      <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur sunt sint iste modi
        aliquam fugiat nihil excepturi natus cumque hic corrupti esse officia blanditiis impedit, in
        voluptatibus odio itaque non?
      </div>
    </div>
  );
}

import React, { ReactNode } from 'react';
import styles from './style.module.scss';
import cn from 'classnames/bind';
import { X } from 'react-feather';

const cx = cn.bind(styles);

interface PopoverProps {
  children?: ReactNode;
  open?: boolean;
  x?: string;
  y?: string;
  width?: string;
  maxHeight?: number;
  closeButton?: boolean;
  position?: 'left' | 'middle' | 'right';
  close?: () => void;
  leaveMouse?: (e: any) => void;
}

export function Popover(props: PopoverProps) {
  const { children, x, y, width, maxHeight, close, leaveMouse } = props;
  const open = props.open;
  const closeButton = props.closeButton ?? false;
  const position = props.position ?? 'middle';
  if (position === 'right') {
    var transX = '102%';
  } else if (position === 'left') {
    transX = '-102%';
  } else {
    transX = '0';
  }
  console.log(children);
  // const [open, setOpen] = useState(props.open);
  const styles = {
    display: open ? 'block' : 'none',
    top: x,
    left: y,
    width,
  };
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${transX}, -64px)`,
        maxHeight,
        ...styles,
      }}
      className={cx('popoverContent')}
      onMouseEnter={() => console.log('pop enter')}
      onMouseLeave={leaveMouse}
    >
      {closeButton ? (
        <div className={cx('close')}>
          <X onClick={close} />
        </div>
      ) : undefined}
      {children}
    </div>
  );
}

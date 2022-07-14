import React, { ReactNode } from 'react';
import s from './style.module.scss';

interface PopoverProps {
  children?: ReactNode;
  y?: number;
  maxHeight?: number;
  position?: 'left' | 'middle' | 'right';
}

export function Popover(props: PopoverProps) {
  const { children, y, maxHeight, position = 'middle' } = props;
  const positions = {
    right: '102%',
    left: '-102%',
    middle: '0',
  };
  return (
    <div
      className={s.popover}
      style={{
        top: y,
        position: 'absolute',
        transform: `translate(${positions[position]}, -64px)`,
        maxHeight,
      }}
    >
      {children}
    </div>
  );
}

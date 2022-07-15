import React, { ReactNode } from 'react';
import s from './style.module.scss';

export interface PopoverProps {
  children?: ReactNode;
  y?: number;
  maxHeight?: number;
  position?: 'left' | 'middle' | 'right';
}

export function Popover(props: PopoverProps) {
  const { children, y, maxHeight, position = 'middle' } = props;
  const positions = {
    right: '30%',
    left: '-102%',
    middle: '-50px',
  };
  return (
    <div
      className={s.popover}
      style={{
        top: y,
        position: 'absolute',
        transform: `translate(${positions[position]}, 0)`,
        maxHeight,
      }}
    >
      {children}
    </div>
  );
}

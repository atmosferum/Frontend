import React, { ReactNode, CSSProperties } from 'react';
import s from './Popover.module.scss';
export interface PopoverProps {
  children?: ReactNode;
  y?: number;
  maxHeight?: number;
  position?: 'left' | 'middle' | 'right';
  customStyles?: CSSProperties;
}

export function Popover(props: PopoverProps) {
  const { children, y, maxHeight, position = 'left', customStyles } = props;
  const positions = {
    right: '30%',
    left: '-130px',
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
        ...customStyles,
      }}
    >
      {children}
    </div>
  );
}

import React from 'react';
import s from './Timeclicker.module.scss';
import classNames from 'classnames/bind';
import { ChevronLeft, ChevronRight, Minus } from 'react-feather';
const cx = classNames.bind(s);
function Timeclicker() {
  return (
    <div className={cx('timeclicker')}>
      <div className={cx('time-slider')}>
        <button onClick={undefined} className={cx('slider', '--left')}>
          <ChevronLeft size="1rem" />
        </button>
        <div className={cx('time-div')}>
          <span className={cx('time-span')}>21:40</span>
        </div>
        <button onClick={undefined} className={cx('slider', '--right')}>
          <ChevronRight size="1rem" />
        </button>
      </div>
      <div className={cx('minus')}>
        <Minus size={24} />
      </div>
      <div className={cx('time-slider')}>
        <button onClick={undefined} className={cx('slider', '--left')}>
          <ChevronLeft size="1rem" />
        </button>
        <div className={cx('time-div')}>
          <span className={cx('time-span')}>9:00</span>
        </div>
        <button onClick={undefined} className={cx('slider', '--right')}>
          <ChevronRight size="1rem" />
        </button>
      </div>
    </div>
  );
}

export default Timeclicker;

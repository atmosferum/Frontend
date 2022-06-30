import React from 'react';
import s from './style.module.scss';
import classNames from 'classnames/bind';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { getWeekInterval } from './utils';

const cx = classNames.bind(s);

interface WeekSliderProps {
  left: () => void;
  right: () => void;
  date: Date;
}

export function WeekSlider(props: WeekSliderProps) {
  return (
    <div className={cx('week-slider')}>
      <button onClick={props.left} className={cx('slider', 'slider--left')}>
        <ChevronLeft size="1rem" />
      </button>
      <div className={cx('date-div')}>
        <span className={cx('date-span')}>{getWeekInterval(props.date)}</span>
      </div>
      <button onClick={props.right} className={cx('slider', 'slider--right')}>
        <ChevronRight size="1rem" />
      </button>
    </div>
  );
}

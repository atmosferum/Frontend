import React from 'react';
import s from './WeakSlider.module.scss';
import classNames from 'classnames/bind';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { getWeekInterval } from './utils';

const cx = classNames.bind(s);

interface WeekSliderProps {
  left: () => void;
  right: () => void;
  highlightRight: boolean;
  highlightLeft: boolean;
  date: Date;
}

export function WeekSlider(props: WeekSliderProps) {
  const { highlightRight, highlightLeft, right, left, date } = props;
  return (
    <div className={cx('week-slider')}>
      <button onClick={left} className={cx('slider', '--left', highlightLeft && '--highlight')}>
        <ChevronLeft size="1rem" />
      </button>
      <div className={cx('date-div')}>
        <span className={cx('date-span')}>{getWeekInterval(date)}</span>
      </div>
      <button onClick={right} className={cx('slider', '--right', highlightRight && '--highlight')}>
        <ChevronRight size="1rem" />
      </button>
    </div>
  );
}

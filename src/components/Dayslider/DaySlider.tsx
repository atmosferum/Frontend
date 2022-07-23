import React from 'react';
import s from './style.module.scss';
import classNames from 'classnames/bind';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { daysOfWeek, monthsAcc } from '../Calendar/consts';
// import { getWeekInterval } from './utils';

const cx = classNames.bind(s);

interface DaySliderProps {
  left: () => void;
  right: () => void;
  highlightRight: boolean;
  highlightLeft: boolean;
  date: Date;
}

export function DaySlider(props: DaySliderProps) {
  const { highlightRight, highlightLeft, right, left, date } = props;
  console.log(date.getMonth());
  console.log(date.getDate());
  return (
    <div className={cx('day-slider')}>
      <button onClick={left} className={cx('slider', '--left', highlightLeft && '--highlight')}>
        <ChevronLeft size="1rem" />
      </button>
      <div className={cx('date-div')}>
        <span className={cx('date-span')}>
          <p className={cx('number')}>{date.getDate()}</p>
          <p className={cx('month')}>{monthsAcc[date.getMonth()]}</p>
        </span>
        <span className={cx('weekday-span')}>
          <p className={cx('weekday')}>{daysOfWeek[date.getDay()]}</p>
        </span>
      </div>
      <button onClick={right} className={cx('slider', '--right', highlightRight && '--highlight')}>
        <ChevronRight size="1rem" />
      </button>
    </div>
  );
}

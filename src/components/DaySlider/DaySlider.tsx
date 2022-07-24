import React from 'react';
import s from './DaySlider.module.scss';
import classNames from 'classnames/bind';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { daysOfWeek, months } from '../../consts';

const cx = classNames.bind(s);

interface DaySliderProps {
  left: () => void;
  right: () => void;
  highlightRight: boolean;
  highlightLeft: boolean;
  date: Date;
  className?: string;
}

export function DaySlider(props: DaySliderProps) {
  const { highlightRight, highlightLeft, right, left, date, className } = props;
  console.log(date.getMonth());
  console.log(date.getDate());
  return (
    <div className={cx('day-slider', className)}>
      <button onClick={left} className={cx('slider', '--left')}>
        <ChevronLeft color={highlightLeft ? 'var(--primary)' : 'var(--gray-dark)'} size="1.5rem" />
      </button>
      <div className={cx('date-div')}>
        <span className={cx('date-span')}>
          <p className={cx('number')}>{date.getDate()}</p>
          <p className={cx('month')}>{months[date.getMonth()]}</p>
        </span>
        <span className={cx('weekday-span')}>
          <p className={cx('weekday')}>{daysOfWeek[date.getDay()]}</p>
        </span>
      </div>
      <button onClick={right} className={cx('slider', '--right')}>
        <ChevronRight
          color={highlightRight ? 'var(--primary)' : 'var(--gray-dark)'}
          size="1.5rem"
        />
      </button>
    </div>
  );
}

import React, { useContext, useEffect, useState } from 'react';
import s from './TimeClicker.module.scss';
import classNames from 'classnames/bind';
import { ChevronLeft, ChevronRight, Minus } from 'react-feather';
import { Interval } from '../../types';
import { AppContext } from '../../App/App';
import { getClockFace, getHours } from '../../dateUtils';
import { isPhone } from '../../utils';
import { Cross } from '../Calendar/DayTimeline/Intervals/cross';
import { useAppSelector, useFocusInterval } from '../../hooks/redux';
import { useActions } from '../../hooks/actions';
const cx = classNames.bind(s);

interface Props {}

function TimeClicker(props: Props) {
  const { focusDate, isResults } = useAppSelector((state) => state.store)!;
  const { setState, changeInterval } = useActions();
  const focusInterval = useFocusInterval();
  const [interval, setInterval] = useState<Interval | undefined>(focusInterval);
  const changeFocusInterval = (part: any, hour: number) =>
    changeInterval({ interval: interval!, part, byHours: hour });
  useEffect(() => {
    setInterval(focusInterval);
  }, [focusDate]);
  if (interval && isPhone() && !isResults) {
    return (
      <div className={cx('timeclicker')}>
        <div className={cx('time-slider')}>
          <button
            onClick={() => changeFocusInterval('start', -0.5)}
            className={cx('slider', '--left')}
          >
            <ChevronLeft size="1rem" />
          </button>
          <div className={cx('time-div')}>
            <span className={cx('time-span')}>
              {getClockFace(getHours(interval?.start || new Date()))}
            </span>
          </div>
          <button
            onClick={() => changeFocusInterval('start', 0.5)}
            className={cx('slider', '--right')}
          >
            <ChevronRight size="1rem" />
          </button>
        </div>
        <div className={cx('minus')}>
          <Minus size={24} />
        </div>
        <div className={cx('time-slider')}>
          <button
            onClick={() => changeFocusInterval('end', -0.5)}
            className={cx('slider', '--left')}
          >
            <ChevronLeft size="1rem" />
          </button>
          <div className={cx('time-div')}>
            <span className={cx('time-span')}>
              {getClockFace(getHours(interval?.end || new Date()))}
            </span>
          </div>
          <button
            onClick={() => changeFocusInterval('end', 0.5)}
            className={cx('slider', '--right')}
          >
            <ChevronRight size="1rem" />
          </button>
        </div>
        <Cross onClick={() => setInterval(undefined)} className={s.cross} />
      </div>
    );
  }
  return <></>;
}

export default TimeClicker;

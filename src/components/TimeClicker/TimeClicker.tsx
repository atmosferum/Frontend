import React, { useContext } from 'react';
import s from './TimeClicker.module.scss';
import classNames from 'classnames/bind';
import { ChevronLeft, ChevronRight, Minus } from 'react-feather';
import { Interval } from '../../types';
import { AppContext } from '../../App/App';
import { getClockFace, getHours } from '../../dateUtils';
import { isPhone } from '../../utils';
const cx = classNames.bind(s);

interface Props {}

function TimeClicker(props: Props) {
  const { changeFocusInterval, getFocusInterval, isResults } = useContext(AppContext)!;
  const focusInterval = getFocusInterval();
  if (focusInterval && isPhone() && !isResults) {
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
              {getClockFace(getHours(focusInterval?.start || new Date()))}
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
              {getClockFace(getHours(focusInterval?.end || new Date()))}
            </span>
          </div>
          <button
            onClick={() => changeFocusInterval('end', 0.5)}
            className={cx('slider', '--right')}
          >
            <ChevronRight size="1rem" />
          </button>
        </div>
      </div>
    );
  }
  return <></>;
}

export default TimeClicker;

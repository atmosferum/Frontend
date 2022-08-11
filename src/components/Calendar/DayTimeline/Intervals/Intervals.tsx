import React, { useEffect, useRef, useState, memo, useContext } from 'react';
import { DraggingElement, Interval, Participant } from '../../../../types';
import {
  getClockFace,
  isEqualDays,
  isIntervalsIntersect,
  isThereIntersections,
} from '../../../../dateUtils';
import { HEIGHT_OF_CELL } from '../DayTimeline';
import s from './Intervals.module.scss';
import classNames from 'classnames/bind';
import { Cross } from './cross';
import popoverStyle from '../../../Popover/Popover.module.scss';
import ParticipantsLine from '../../../ParticipantsLine/ParticipantsLine';
import * as Icon from 'react-feather';
import setFocus from 'focus-lock';
import { App, AppContext } from '../../../../App/App';
import { IntervalClass, isPhone } from '../../../../utils';
// @ts-ignore
import { ReactComponent as Triengle } from './triangle-svgrepo-com.svg';
const cx = classNames.bind(s);

interface Props {
  intervals: Interval[];
  color: string;
  margin: number;
  draggingElement: DraggingElement;
  day: Date;
  draggable?: boolean;
  deleteInterval?: any;
  isResults?: boolean;
  touchMoveHandler: (e: any) => void;
  focusDate?: Date;
}

// eslint-disable-next-line react/display-name
const Intervals = memo((props: Props) => {
  const {
    focusDate,
    intervals,
    color,
    margin,
    draggingElement,
    day,
    draggable,
    deleteInterval,
    isResults,
    touchMoveHandler,
  } = props;
  const { setFocusDate, isAdmin, setIntervals, myIntervals } = useContext(AppContext)!;
  const fillInterval = (start: Date, end: Date) => {
    setIntervals((intervals: Interval[]) => {
      const newInterval = new IntervalClass(start, end);
      return [
        ...intervals.filter((interval) => !isIntervalsIntersect(interval, newInterval)),
        newInterval,
      ];
    });
  };
  const intervalsRef = useRef<HTMLInputElement | null>(null);
  return (
    <div ref={intervalsRef}>
      {intervals.map(({ start, end, id, owners }, i) => {
        const isStartToday = isEqualDays(start, day);
        const isEndToday = isEqualDays(end, day);
        const hoursOfStart = start.getHours() + start.getMinutes() / 60;
        const hoursOfEnd = end.getHours() + end.getMinutes() / 60;
        const drawFrom = isStartToday ? hoursOfStart : 0;
        const drawTo = isEndToday ? hoursOfEnd : 24;
        const clockFace = <p>{`${getClockFace(hoursOfStart)} — ${getClockFace(hoursOfEnd)}`}</p>;

        const style = {
          top: drawFrom * HEIGHT_OF_CELL * 2,
          height: (drawTo - drawFrom) * 2 * HEIGHT_OF_CELL - margin * 2,
          backgroundColor: color,
          borderTopRightRadius: isStartToday ? 15 : 0,
          borderTopLeftRadius: isStartToday ? 15 : 0,
          borderBottomLeftRadius: isEndToday ? 15 : 0,
          borderBottomRightRadius: isEndToday ? 15 : 0,
          margin,
        };

        return (
          <div
            onClick={() => setFocusDate(start)}
            key={id || i}
            style={{ ...style }}
            className={`${cx(
              'interval',
              draggable && '--draggable',
              isResults && '--results',
              isPhone() && '--phone',
              start === focusDate && '--focus',
              style.height < 80,
            )} interval`}
          >
            <div className={cx('clockFace')}>{clockFace}</div>
            {draggable && <Cross onClick={() => deleteInterval(id)} className={s.cross} />}
            {isResults && owners && (
              <>
                <div className={s.participantsAmount}>
                  <p>{owners?.length!}</p>
                  <Icon.Users />
                </div>
                <div className={s.participantsLineWrapper}>
                  <ParticipantsLine borderColor={color} participants={owners!} />
                </div>
              </>
            )}
            {!(draggable || isAdmin || isResults) && (
              <p className={s.selectAll} onClick={() => fillInterval(start, end)}>
                Выделить весь
              </p>
            )}
            {draggable && (
              <>
                <div
                  className={cx('top')}
                  onMouseDown={(e: any) => {
                    e.preventDefault();
                    document.body.classList.add('dragInterval');
                    draggingElement.current = { id, part: 'start' };
                  }}
                  onTouchStart={() => {
                    document.body.classList.add('dragInterval');
                    draggingElement.current = { id, part: 'start' };
                  }}
                  onTouchMove={touchMoveHandler}
                />
                <div
                  // draggable
                  className={cx('bottom')}
                  onMouseDown={(e: any) => {
                    e.preventDefault();
                    document.body.classList.add('dragInterval');
                    draggingElement.current = { id, part: 'end' };
                  }}
                  onTouchStart={() => {
                    document.body.classList.add('dragInterval');
                    draggingElement.current = { id, part: 'end' };
                  }}
                  onTouchMove={touchMoveHandler}
                />
                <Triengle style={{ fill: color }} className={s.up} />
                <Triengle style={{ fill: color }} className={s.down} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});

export { Intervals };

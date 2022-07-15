import React, { SetStateAction, useEffect, useRef } from 'react';
import s from './Calendar.module.scss';
import { DayTimeline, HOURS_IN_CELL } from './DayTimeline';
import { daysOfWeek, months } from './consts';
import classNames from 'classnames/bind';
import { DraggingElement, Interval } from '../../types';
import { getClockFace, getWeek, isBefore, isToday, isTouchEnabled } from './utils';

const cx = classNames.bind(s);

interface Props {
  resultsIntervals: Interval[];
  adminIntervals: Interval[];
  myIntervals: Interval[];
  dateOfMonday: Date;
  draggingElement: DraggingElement;
  setIntervals: SetStateAction<any>;
  isAdmin?: boolean;
  isResults?: boolean;
}

function Calendar(props: Props) {
  const { dateOfMonday, draggingElement, ...propsForDayTimeline } = props;
  const week = getWeek(dateOfMonday);
  const daysLineRef = useRef<HTMLInputElement | null>(null);
  const timeLineRef = useRef<HTMLInputElement | null>(null);
  const clockFacesRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    document.body.addEventListener('mouseup', () => {
      if (!isTouchEnabled()) {
        console.log(!isTouchEnabled());
        console.log('clear draggingElement');
        draggingElement.current = null;
        document.body.style.cursor = 'auto';
      }
    });
    document.body.addEventListener('touchend', () => {
      draggingElement.current = null;
    });
    timeLineRef.current!.scrollTop = 400; // auto scroll to 8 hour
    timeLineRef.current!.onscroll = function () {
      // sync scroll
      daysLineRef.current!.scrollLeft = timeLineRef.current!.scrollLeft;
      clockFacesRef.current!.style.left = timeLineRef.current!.scrollLeft + 'px';
    };
  }, []);

  return (
    <div className={s.calendar}>
      {/* daysOfWeek */}
      <div className={s.topBar}>
        <div className={s.monthAndYear}>
          <div>{months[week[0].getMonth()]}</div>
          <div>{week[0].getFullYear()}</div>
        </div>
        <div className={cx(s.daysLine)} ref={daysLineRef}>
          {week.map((day, id) => {
            return (
              <div key={id}>
                <div>
                  <p
                    className={cx(
                      'date',
                      isToday(day) && 'today',
                      isBefore(day, new Date()) && 'before',
                    )}
                  >
                    {day.getDate()}
                  </p>
                  <p>{daysOfWeek[day.getDay()]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={s.timeLine} ref={timeLineRef}>
        {/* timeline */}
        <div className={s.clockFaces} ref={clockFacesRef}>
          {Array(24)
            .fill('')
            .map((_, id) => {
              return (
                <div key={id} className={s.clockFaceWrapper}>
                  <p>{getClockFace(id)}</p>
                </div>
              );
            })}
        </div>
        {/* columns of cells */}
        {week.map((day, id) => {
          return (
            <DayTimeline
              {...propsForDayTimeline}
              draggingElement={draggingElement}
              key={id}
              day={day}
            />
          );
        })}
      </div>
    </div>
  );
}

export { Calendar };

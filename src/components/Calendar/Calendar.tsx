import React, { SetStateAction, useEffect, useRef } from 'react';
import s from './Calendar.module.scss';
import { DayTimeline, HOURS_IN_CELL } from './DayTimeline';
import classNames from 'classnames/bind';
import { DraggingElement, Interval } from '../../types';
import { getClockFace, getWeek, isBefore, isToday, getDateOfMonday } from '../../dateUtils';
import { HEIGHT_OF_CELL } from './DayTimeline/DayTimeline';
import { isPhone } from '../../utils';
import { daysOfWeek, months } from '../../consts';

const cx = classNames.bind(s);

interface Props {
  resultsIntervals: Interval[];
  adminIntervals: Interval[];
  myIntervals: Interval[];
  focusDate: Date;
  draggingElement: DraggingElement;
  setIntervals: SetStateAction<any>;
  isAdmin?: boolean;
  isResults?: boolean;
}

function Calendar(props: Props) {
  const { draggingElement, ...propsForDayTimeline } = props;
  const { isAdmin, isResults, focusDate } = propsForDayTimeline;
  const week = getWeek(getDateOfMonday(focusDate ?? new Date()));
  const daysLineRef = useRef<HTMLInputElement | null>(null);
  const timeLineRef = useRef<HTMLInputElement | null>(null);
  const clockFacesRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    document.body.addEventListener('mouseup', () => {
      if (!isPhone()) {
        draggingElement.current = null;
        document.body.style.cursor = 'auto';
      }
    });
    document.body.addEventListener('touchend', () => {
      draggingElement.current = null;
    });
    timeLineRef.current!.onscroll = function () {
      // sync scroll
      daysLineRef.current!.scrollLeft = timeLineRef.current!.scrollLeft;
      clockFacesRef.current!.style.left = timeLineRef.current!.scrollLeft + 'px';
    };
  }, []);
  useEffect(() => {
    const isWeakSlider = (isAdmin && !isResults) || !isPhone();
    if (isWeakSlider) return;
    timeLineRef.current!.scrollTop = focusDate.getHours() * HEIGHT_OF_CELL * 2 - 30;
  }, [focusDate]);
  const dates = isPhone() ? [focusDate] : week;
  return (
    <div className={s.calendar}>
      {/* daysOfWeek */}
      {!isPhone() && (
        <div className={s.topBar}>
          <div className={s.monthAndYear}>
            <div>{months[week[0].getMonth()]}</div>
            <div>{week[0].getFullYear()}</div>
          </div>
          <div className={cx(s.daysLine)} ref={daysLineRef}>
            {dates.map((day, id) => {
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
      )}

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
        {dates.map((day, id) => {
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

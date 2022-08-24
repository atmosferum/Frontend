import React, { useContext, useEffect, useRef } from 'react';
import s from './Calendar.module.scss';
import { DayTimeline } from './DayTimeline';
import classNames from 'classnames/bind';
import { getClockFace, getWeek, isBefore, isToday, getDateOfMonday } from '../../dateUtils';
import { HEIGHT_OF_CELL } from './DayTimeline/DayTimeline';
import { isPhone } from '../../utils';
import { daysOfWeek, months } from '../../consts';
import { AppContext } from '../../App/App';
import { useAppSelector } from '../../hooks/redux';

const cx = classNames.bind(s);

export function Calendar() {
  const { draggingElement } = useContext(AppContext)!;
  const { focusDate, isAdmin, isResults } = useAppSelector((state) => state.store);
  const week = getWeek(getDateOfMonday(focusDate ?? new Date()));
  const daysLineRef = useRef<HTMLInputElement | null>(null);
  const timeLineRef = useRef<HTMLInputElement | null>(null);
  const clockFacesRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const setDefaultDragSettings = () => {
      draggingElement.current = null;
      document.body.classList.remove('dragInterval');
    };
    document.body.addEventListener('mouseup', setDefaultDragSettings);
    document.body.addEventListener('touchend', setDefaultDragSettings);
    timeLineRef.current!.scrollTop = 400;
    timeLineRef.current!.onscroll = function () {
      if (isPhone()) return;
      daysLineRef.current!.scrollLeft = timeLineRef.current!.scrollLeft; // sync scroll
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
          return <DayTimeline key={id} day={day} />;
        })}
      </div>
    </div>
  );
}

import React, { SetStateAction } from 'react';
import s from './DayTimeline.module.scss';
import { DraggingElement, Interval } from '../../../types';
import {
  IntervalClass,
  isBefore,
  isInIntervals,
  isThereIntersections,
  isEqualDays,
  isNextToOrInIntervals,
  getCellDate,
} from '../utils';
import { Intervals } from './Intervals';
import { MS_IN_HOUR } from '../../../consts';

interface Props {
  focusDate: Date;
  resultsIntervals: Interval[];
  adminIntervals: Interval[];
  myIntervals: Interval[];
  day: Date;
  draggingElement: DraggingElement;
  setIntervals: SetStateAction<any>;
  isAdmin?: boolean;
  isResults?: boolean;
}

export const HOURS_IN_CELL = 0.5;
export const HOURS_IN_DAY = 24;
export const AMOUNT_OF_CELLS = Math.round(HOURS_IN_DAY / HOURS_IN_CELL);
export const HEIGHT_OF_CELL = 30;
export const MS_IN_CELL = MS_IN_HOUR * HOURS_IN_CELL;

function DayTimeline(props: Props) {
  const {
    adminIntervals,
    myIntervals,
    day,
    draggingElement,
    setIntervals,
    isAdmin,
    isResults,
    resultsIntervals,
    focusDate,
  } = props;

  const isTodayIncludesInterval = ({ start, end }: Interval) =>
    isEqualDays(start, day) ||
    isEqualDays(end, day) ||
    (!isBefore(end, day) && isBefore(start, day));
  const myIntervalsToday = myIntervals.filter(isTodayIncludesInterval);
  const adminIntervalsToday = adminIntervals.filter(isTodayIncludesInterval);
  const resultsIntervalsToday = resultsIntervals.filter(isTodayIncludesInterval);
  const changeableIntervals = isAdmin ? adminIntervals : myIntervals;
  function deleteInterval(id: number) {
    setIntervals(changeableIntervals.filter((interval) => interval.id !== id));
  }
  const touchMoveHandler = (e: any) => {
    const cellElem = document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY);
    const id = parseInt(cellElem!.getAttribute('data-id')!);
    if (!id || draggingElement.current!.prevCellId === id) return;
    draggingElement.current!.prevCellId = id;
    const cellDate = getCellDate(id, day);
    mouseCellEnterHandler(cellDate);
  };
  const mouseCellEnterHandler = (cellDate: Date) => {
    if (!draggingElement.current || isResults) return;
    const { id, part } = draggingElement.current;
    const date = new Date(cellDate.getTime() + (part === 'end' ? MS_IN_CELL : 0));

    if (
      isNextToOrInIntervals(
        changeableIntervals.filter((interval) => interval.id !== id),
        cellDate,
      ) ||
      (!isAdmin && adminIntervals.length && !isInIntervals(adminIntervals, cellDate)) ||
      !draggingElement ||
      (part === 'start' &&
        changeableIntervals.find((el) => el.id === id)!.end.getTime() - date.getTime() <
          MS_IN_CELL) ||
      (part === 'end' &&
        date.getTime() - changeableIntervals.find((el) => el.id === id)!.start.getTime() <
          MS_IN_CELL)
    )
      return;

    const copyOfIntervals = structuredClone(changeableIntervals);
    const interval = copyOfIntervals.find((interval: Interval) => interval.id === id)!;
    interval[part] = date;
    if (
      !isThereIntersections(copyOfIntervals, interval) &&
      isEqualDays(interval.start, interval.end)
    ) {
      setIntervals(copyOfIntervals);
    }
  };
  const onCellClickHandler = (cellDate: Date) => {
    if (
      isResults ||
      isNextToOrInIntervals(changeableIntervals, cellDate) ||
      isNextToOrInIntervals(changeableIntervals, new Date(+cellDate + MS_IN_CELL)) ||
      (!isAdmin && adminIntervals.length && !isInIntervals(adminIntervals, cellDate))
    )
      return;
    document.body.style.cursor = 'row-resize';
    const newInterval = new IntervalClass(cellDate, new Date(cellDate.getTime() + MS_IN_CELL * 2));
    draggingElement.current = { id: newInterval.id, part: 'end' };
    changeableIntervals.push(newInterval);
    setIntervals([...changeableIntervals]);
  };

  return (
    <div className={s.column}>
      <div className={s.inset0}>
        {Array(AMOUNT_OF_CELLS)
          .fill(null)
          .map((_, id) => {
            const cellDate = getCellDate(id, day);
            return (
              <div key={id} className={s.cell}>
                <div
                  data-id={id.toString()}
                  className={s.inset0}
                  onMouseEnter={() => mouseCellEnterHandler(cellDate)}
                  onMouseDown={() => {
                    onCellClickHandler(cellDate);
                  }}
                />
              </div>
            );
          })}
      </div>

      {isResults ? (
        <Intervals
          focusDate={focusDate}
          intervals={resultsIntervalsToday}
          color={'#c39bd3'}
          margin={1}
          draggingElement={draggingElement}
          touchMoveHandler={touchMoveHandler}
          day={day}
          isResults
        />
      ) : (
        <>
          <Intervals
            intervals={adminIntervalsToday}
            deleteInterval={deleteInterval}
            touchMoveHandler={touchMoveHandler}
            draggable={!isResults && isAdmin}
            color={'var(--primary-light)'}
            margin={1}
            draggingElement={draggingElement}
            day={day}
          />
          <Intervals
            intervals={myIntervalsToday}
            deleteInterval={deleteInterval}
            touchMoveHandler={touchMoveHandler}
            draggable={!isAdmin}
            color="var(--success-light)"
            margin={3}
            draggingElement={draggingElement}
            day={day}
          />
        </>
      )}
    </div>
  );
}

export { DayTimeline };

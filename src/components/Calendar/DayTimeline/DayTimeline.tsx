import React, { SetStateAction, useContext } from 'react';
import s from './DayTimeline.module.scss';
import { DraggingElement, Interval } from '../../../types';
import {
  isBefore,
  isDateInIntervals,
  isThereIntersections,
  isEqualDays,
  isNextToOrInIntervals,
  getCellDate,
  isIntervalInIntervals,
  isToday,
  getClockFace,
  getHours,
} from '../../../dateUtils';
import { Intervals } from './Intervals';
import { MS_IN_HOUR } from '../../../consts';
import { IntervalClass, customAlert } from '../../../utils';
import { AppContext } from '../../../App/App';
import internal from 'stream';
import { useAppSelector } from '../../../hooks/redux';
import { useActions } from '../../../hooks/actions';
import { selectChangeableIntervals } from '../../../store/selectors';
import { useResultsQuery } from '../../../store/api';
import { interval } from 'rxjs';

interface Props {
  day: Date;
}

export const HOURS_IN_CELL = 0.5;
export const HOURS_IN_DAY = 24;
export const AMOUNT_OF_CELLS = Math.round(HOURS_IN_DAY / HOURS_IN_CELL);
export const HEIGHT_OF_CELL = 30;
export const MS_IN_CELL = MS_IN_HOUR * HOURS_IN_CELL;

function DayTimeline(props: Props) {
  const { day } = props;
  const { draggingElement } = useContext(AppContext)!;
  const { adminIntervals, myIntervals, isAdmin, isResults, focusDate, resultsIntervals } =
    useAppSelector((state) => state.store);
  const { setIntervals, deleteInterval } = useActions();
  const isTodayIncludesInterval = ({ start, end }: Interval) => isEqualDays(start, day);
  const myIntervalsToday = myIntervals.filter(isTodayIncludesInterval);
  const adminIntervalsToday = adminIntervals.filter(isTodayIncludesInterval);
  const resultsIntervalsToday = resultsIntervals.filter(isTodayIncludesInterval);
  const changeableIntervals = useAppSelector(selectChangeableIntervals);

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

    const copyOfIntervals = structuredClone(changeableIntervals);
    const newInterval = copyOfIntervals.find((interval: Interval) => interval.id === id)!;
    const copyOfIntervalsWithoutNewInterval = copyOfIntervals.filter(
      (interval) => interval.id !== id,
    );
    newInterval[part] = date;
    if (
      !isNextToOrInIntervals(copyOfIntervalsWithoutNewInterval, date) &&
      !(!isAdmin && adminIntervals.length && !isIntervalInIntervals(adminIntervals, newInterval)) &&
      !(+newInterval.end - +newInterval.start < MS_IN_CELL) &&
      !isThereIntersections(copyOfIntervalsWithoutNewInterval, newInterval) &&
      isEqualDays(newInterval.start, newInterval.end)
    ) {
      setIntervals(copyOfIntervals);
    }
  };
  const onCellClickHandler = (cellDate: Date) => {
    if (isResults) return;
    if (+cellDate < +new Date() && isAdmin) {
      return customAlert('Нельзя выделить время в прошлом');
    }
    const newInterval = new IntervalClass(cellDate, new Date(+cellDate + MS_IN_CELL * 2));
    if (
      isNextToOrInIntervals(changeableIntervals, cellDate) ||
      isNextToOrInIntervals(changeableIntervals, new Date(+cellDate + MS_IN_HOUR))
    ) {
      return;
    }
    if (!isAdmin && !isIntervalInIntervals(adminIntervals, newInterval)) {
      return customAlert(
        'Нельзя выделять интервалы вне интервалов создателя (синих интервалов)',
        6000,
      );
    }
    document.body.classList.add('dragInterval');
    draggingElement.current = { id: newInterval.id, part: 'end' };
    setIntervals([newInterval, ...changeableIntervals]);
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
          intervals={resultsIntervalsToday!}
          color={'#63adb7'}
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

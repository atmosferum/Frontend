import React, { useRef } from 'react';
import { DraggingElement, Interval } from '../../../../types';
import { getClockFace, isEqualDays } from '../../utils';
import { HEIGHT_OF_CELL } from '../DayTimeline';
import s from './Intervals.module.scss';
import classNames from 'classnames/bind';
import { months } from '../../consts';
// import Cross from './cross.tsx'
import Image from 'next/image';
import { Cross } from './cross';

const cx = classNames.bind(s);

interface Props {
  intervals: Interval[];
  color: string;
  margin: number;
  draggingElement: DraggingElement;
  day: Date;
  draggable?: boolean;
  deleteInterval?: any;
}

const Intervals = (props: Props) => {
  const { intervals, color, margin, draggingElement, day, draggable, deleteInterval } = props;
  const intervalRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {intervals.map(({ start, end, id }) => {
        const isStartToday = isEqualDays(start, day);
        const isEndToday = isEqualDays(end, day);
        const hoursOfStart = start.getHours() + start.getMinutes() / 60;
        const hoursOfEnd = end.getHours() + end.getMinutes() / 60;
        const drawFrom = isStartToday ? hoursOfStart : 0;
        const drawTo = isEndToday ? hoursOfEnd : 24;
        const clockFace = isEqualDays(start, end) ? (
          <p>{`${getClockFace(hoursOfStart)} — ${getClockFace(hoursOfEnd)}`}</p>
        ) : (
          <>
            <p>{`${months[start.getMonth()]} ${start.getDate()} ${getClockFace(
              hoursOfStart,
            )} — `}</p>
            <p>{`${months[end.getMonth()]} ${end.getDate()} ${getClockFace(hoursOfEnd)}`}</p>
          </>
        );

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
            key={id}
            style={style}
            ref={intervalRef}
            className={cx('interval')}
            // onMouseUp={()=>{intervalRef.current!.style.pointerEvents = "auto"}}
          >
            <div className={cx('clockFace')}>{clockFace}</div>
            {draggable && <Cross onClick={() => deleteInterval(id)} className={s.cross} />}
            {draggable && (
              <>
                <div
                  className={cx('top')}
                  onMouseDown={() => {
                    // intervalRef.current!.style.pointerEvents = "none"
                    document.body.style.cursor = 'row-resize';
                    draggingElement.current = { id, part: 'start' };
                  }}
                />
                <div
                  className={cx('bottom')}
                  onMouseDown={() => {
                    // intervalRef.current!.style.pointerEvents = "none"
                    document.body.style.cursor = 'row-resize';
                    draggingElement.current = { id, part: 'end' };
                  }}
                />
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export { Intervals };

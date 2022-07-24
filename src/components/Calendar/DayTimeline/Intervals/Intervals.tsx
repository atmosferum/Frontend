import React, { useEffect, useRef, useState } from 'react';
import { DraggingElement, Interval, Participant } from '../../../../types';
import { getClockFace, isEqualDays } from '../../../../dateUtils';
import { HEIGHT_OF_CELL } from '../DayTimeline';
import s from './Intervals.module.scss';
import classNames from 'classnames/bind';
import { Cross } from './cross';
import { Popover } from '../../../Popover/Popover';
import popoverStyle from '../../../Popover/Popover.module.scss';
import { ParticipantsPopover } from '../../../../App/ParticipantsPopover/ParticipantsPopover';
import { months } from '../../../../consts';
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

const Intervals = (props: Props) => {
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
  const intervalsRef = useRef<HTMLInputElement | null>(null);
  const [y, setY] = useState(0);
  function mouseEnterHandler(e: any) {
    const bounds = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - bounds.top;
    setY(y);
  }
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
            onMouseEnter={mouseEnterHandler}
            key={id}
            style={{ pointerEvents: isResults ? 'all' : 'none', ...style }}
            className={`${cx(
              'interval',
              isResults && '--results',
              start === focusDate && '--focus',
            )} ${popoverStyle.trigger} ${start === focusDate && popoverStyle.hover}`}
          >
            <div className={cx('clockFace')}>{clockFace}</div>
            {draggable && <Cross onClick={() => deleteInterval(id)} className={s.cross} />}
            {isResults && owners && (
              <ParticipantsPopover position={'middle'} y={y} participants={owners!} />
            )}
            {draggable && (
              <>
                <div
                  className={cx('top')}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    console.log(e);
                    document.body.style.cursor = 'row-resize';
                    draggingElement.current = { id, part: 'start' };
                  }}
                  onTouchStart={() => {
                    draggingElement.current = { id, part: 'start' };
                  }}
                  onTouchMove={touchMoveHandler}
                />
                <div
                  // draggable
                  className={cx('bottom')}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    console.log(e);
                    document.body.style.cursor = 'row-resize';
                    draggingElement.current = { id, part: 'end' };
                  }}
                  onTouchStart={() => {
                    draggingElement.current = { id, part: 'end' };
                  }}
                  onTouchMove={touchMoveHandler}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { Intervals };

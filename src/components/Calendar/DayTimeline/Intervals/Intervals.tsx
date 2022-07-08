import React, { useEffect, useRef, useState } from 'react';
import { DraggingElement, Interval } from '../../../../types';
import { getClockFace, isEqualDays } from '../../utils';
import { HEIGHT_OF_CELL } from '../DayTimeline';
import s from './Intervals.module.scss';
import classNames from 'classnames/bind';
import { months } from '../../consts';
import { Cross } from './cross';
import { Popover } from '../../../Popover/Popover';

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
}

const Intervals = (props: Props) => {
  const { intervals, color, margin, draggingElement, day, draggable, deleteInterval } = props;
  const intervalsRef = useRef<HTMLInputElement | null>(null);
  const isResults = props.isResults ?? false;
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverX, setPopoverX] = useState();
  const [translatePopoverY, setTranslatePopoverY] = useState();

  return (
    <div ref={intervalsRef}>
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

        function IntervalMouseEnter(e: any) {
          console.log(e.pageY - style.top - 57);

          if (style.height > 100) {
            setPopoverOpen(true);
          }
        }
        function IntervalMouseLeave(e: any) {
          setPopoverOpen(false);
        }

        return (
          <div
            key={id}
            style={{ pointerEvents: isResults ? 'all' : 'none', ...style }}
            className={cx('interval')}
            onMouseEnter={isResults ? IntervalMouseEnter : undefined}
            onMouseLeave={isResults ? IntervalMouseLeave : undefined}
            // onMouseUp={()=>{intervalRef.current!.style.pointerEvents = "auto"}}
          >
            <div className={cx('clockFace')}>{clockFace}</div>
            {draggable && <Cross onClick={() => deleteInterval(id)} className={s.cross} />}
            {draggable && (
              <>
                <div
                  // draggable
                  className={cx('top')}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    console.log(e);
                    document.body.style.cursor = 'row-resize';
                    draggingElement.current = { id, part: 'start' };
                  }}
                  onMouseEnter={undefined}
                />
                <Popover
                  open={popoverOpen}
                  width={'100%'}
                  maxHeight={style.height - 80 < 0 ? 0 : style.height}
                  position="left"
                >
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt dicta libero eaque
                    eum animi tenetur eos similique debitis, rerum ipsum? Fuga facilis asperiores
                    quidem perferendis maiores magni quae delectus laborum!
                  </div>
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur eos vel
                    dignissimos illo veritatis, enim dolor porro aperiam? Debitis tempore commodi
                    rerum explicabo fugiat alias praesentium doloremque, recusandae molestias
                    veritatis?
                  </div>
                </Popover>
                <div
                  // draggable
                  className={cx('bottom')}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    console.log(e);
                    document.body.style.cursor = 'row-resize';
                    draggingElement.current = { id, part: 'end' };
                  }}
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

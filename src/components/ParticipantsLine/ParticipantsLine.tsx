import React, { memo, useEffect, useRef } from 'react';
import { Participant } from '../../types';
import s from './ParticipantsLine.module.scss';
import { capitalizeFirstLetter } from '../../utils';

interface IProps {
  participants: Participant[];
  borderColor: string;
  children?: React.ReactNode;
}

// eslint-disable-next-line react/display-name
const ParticipantsLine = memo(({ participants, borderColor, children }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    Array.from(ref!.current?.children!).forEach((e: any, id) => {
      e.style.setProperty('--width', `${20 + participants[id].name.length * 11}px`);
    });
  }, [participants]);
  return (
    <div>
      {children}

      <div ref={ref} className={s.wrapper} style={{ pointerEvents: children ? 'none' : 'all' }}>
        {participants.map(({ isAdmin, name, id, color, isCurrentUser }) => (
          <div
            key={id}
            style={{
              borderColor: isCurrentUser ? 'var(--primary)' : borderColor,
              backgroundColor: color,
            }}
            className={s.participant}
          >
            <p>{capitalizeFirstLetter(name)}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ParticipantsLine;

import React, { memo, useEffect, useRef } from 'react';
import { Participant } from '../../types';
import s from './ParticipantsLine.module.scss';

interface IProps {
  participants: Participant[];
  borderColor: string;
  children?: React.ReactNode;
}

// eslint-disable-next-line react/display-name
const ParticipantsLine = memo(({ participants, borderColor, children }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  useEffect(() => {
    Array.from(ref!.current?.children!).forEach((e: any, id) => {
      e.style.setProperty('--width', `${30 + participants[id].name.length * 10}px`);
    });
    console.log(participants);
  }, [participants]);
  return (
    <div>
      {children}

      <div ref={ref} className={s.wrapper} style={{ pointerEvents: children ? 'none' : 'all' }}>
        {participants.map((participant) => (
          <div
            key={participant.id}
            style={{
              backgroundColor: '#' + participant.color,
              borderColor,
            }}
            className={s.participant}
          >
            <p>{capitalizeFirstLetter(participant.name)}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default ParticipantsLine;

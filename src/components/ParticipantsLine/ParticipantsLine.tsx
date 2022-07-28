import React, { memo, useEffect, useRef } from 'react';
import { Participant } from '../../types';
import s from './ParticipantsLine.module.scss';

interface IProps {
  participants: Participant[];
  borderColor: string;
}

// eslint-disable-next-line react/display-name
const ParticipantsLine = memo(({ participants, borderColor }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    Array.from(ref!.current?.children!).forEach((e: any, id) => {
      e.style.setProperty('--width', `${28 + participants[id].name.length * 10}px`);
    });
  }, []);
  return (
    <div ref={ref} className={s.wrapper}>
      {participants.map((participant, id) => (
        <div
          key={participant.id}
          style={{
            backgroundColor: `hsl(${(360 / participants.length) * id},55%,60%)`,
            borderColor,
          }}
          className={s.participant}
        >
          <p>{participant.name}</p>
        </div>
      ))}
    </div>
  );
});

export default ParticipantsLine;

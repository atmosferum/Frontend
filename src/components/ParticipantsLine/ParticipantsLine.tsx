import React, { useEffect, useRef } from 'react';
import { Participant } from '../../types';
import s from './Participants.module.scss';

interface IProps {
  participants: Participant[];
}

const ParticipantsLine = ({ participants }: IProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    Array.from(ref!.current?.children!).forEach((e: any, id) => {
      e.style.setProperty('--width', `${30 + participants[id].name.length * 10}px`);
    });
  }, []);
  return (
    <div className={s.interval}>
      <div ref={ref} className={s.wrapper}>
        {participants.map((participant, id) => (
          <div
            key={participant.id}
            style={{ backgroundColor: `hsl(${(360 / participants.length) * id},55%,65%)` }}
            className={s.participant}
          >
            <p>{participant.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsLine;

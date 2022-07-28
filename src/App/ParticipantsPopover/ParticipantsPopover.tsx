import s from './ParticipantsPopover.module.scss';
import { Participant, User } from '../../types';
import React from 'react';
import { Popover, PopoverProps } from '../../components/Popover/Popover';

interface Props extends PopoverProps {
  participants: Participant[];
}

export function ParticipantsPopover(props: Props) {
  const { participants, ...popoverProps } = props;
  return (
    <Popover customStyles={{ width: '350px', transform: 'translate(-40px, 0)' }} {...popoverProps}>
      <div className={s.participantsModalContent}>
        {participants.map((participant: Participant) => (
          <p className={s.user} key={participant.id}>
            <span style={{ backgroundColor: 'bisque' }} className={s.userBackground}>
              {/* {participant.name.length > 20 ? participant.name.slice(0, 19) + '...' : participant.name} */}
              {participant.name}
            </span>{' '}
            <span style={{ color: 'var(--success-dark)' }}>
              {participant.isAdmin && 'Организатор '}
              {participant.isCurrentUser && 'Вы'}
            </span>
          </p>
        ))}
      </div>
    </Popover>
  );
}

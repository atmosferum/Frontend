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
    <Popover {...popoverProps}>
      <div className={s.participantsModalContent}>
        {participants.map((participant: Participant) => (
          <p className={s.user} key={participant.id}>
            {participant.name}{' '}
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

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
    <Popover customStyles={{ transform: 'translate(-50%, 0)' }} {...popoverProps}>
      <div className={s.participantsModalContent}>
        {participants.map(({ isAdmin, name, id, color, isCurrentUser }: Participant) => (
          <p className={s.user} key={id}>
            <span style={{ backgroundColor: color }} className={s.userBackground}>
              {/* {name.length > 20 ? name.slice(0, 19) + '...' : name} */}
              {name}
            </span>{' '}
            <span style={{ color: 'var(--success-dark)' }}>
              {isAdmin && 'Организатор '}
              {isCurrentUser && 'Вы'}
            </span>
          </p>
        ))}
      </div>
    </Popover>
  );
}

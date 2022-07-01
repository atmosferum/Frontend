import { Dialog } from '../../components/Dialog';
import s from '../../styles/App.module.scss';
import { Participant } from '../../types';
import React from 'react';

export function ParticipantsModal(props: any) {
  const { participants, isParticipantsModalOpen, setIsParticipantsModalOpen } = props;

  return (
    <Dialog
      title="Участники"
      open={isParticipantsModalOpen}
      close={() => setIsParticipantsModalOpen(false)}
    >
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
    </Dialog>
  );
}

import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import s from '../../styles/App.module.scss';
import { Copyboard } from '../../components/Copyboard/Copyboard';
import * as Icon from 'react-feather';
import { LoginModal } from '../LoginModal/LoginModal';
import React, { useContext } from 'react';
import ReloadButton from '../../components/ReloadButton/ReloadButton';
import { ParticipantsPopover } from '../ParticipantsPopover/ParticipantsPopover';
import popoverStyles from '../../components/Popover/Popover.module.scss';
import { Participant, User } from '../../types';
import { isPhone } from '../../utils';
import { App, AppContext } from '../App';
import ParticipantsLine from '../../components/ParticipantsLine/ParticipantsLine';
export function Buttons() {
  const {
    login,
    isResults,
    isAdmin,
    name,
    createEvent,
    goToVoting,
    goToResults,
    saveIntervals,
    setIsLoginModalOpen,
    isLoginModalOpen,
    eventId,
    titleInput,
    adminIntervals,
    myIntervals,
    loginAndSaveIntervals,
    isLoading,
    setResults,
    participants,
  } = useContext(AppContext)!;
  const getHost = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/`;
    }
    return '';
  };

  if (isAdmin) {
    return (
      <>
        {isResults ? (
          <>
            <ReloadButton onClick={() => setResults(eventId)} isLoading={isLoading} />
            <ParticipantButton participants={participants} />
            <Button onClick={() => setIsLoginModalOpen(true)}>Копировать ссылку</Button>
          </>
        ) : (
          <>
            <Button
              disabled={isLoading || !titleInput.value || !adminIntervals.length}
              onClick={createEvent}
              isStretch={isPhone()}
            >
              Создать событие
            </Button>
          </>
        )}
        <Dialog
          close={() => setIsLoginModalOpen(false)}
          open={isLoginModalOpen}
          title={isResults ? 'Событие создано' : 'Введите имя'}
        >
          {!isResults ? (
            <>
              <br />
              <Input
                className={s.stretch}
                {...name.bind}
                placeholder="Иван Иванов"
                maxLength={15}
              />
              <br />
              <Button
                onClick={() => {
                  login(name.value).then(createEvent);
                }}
                disabled={!name.value}
                className={s.stretch}
              >
                Создать
              </Button>
            </>
          ) : (
            <>
              <br />
              <Copyboard url={getHost() + eventId} />
              <br />
            </>
          )}
        </Dialog>
      </>
    );
  }

  if (isResults) {
    return (
      <>
        <ReloadButton onClick={() => setResults(eventId)} isLoading={isLoading} />
        <ParticipantButton participants={participants} />
        <Button onClick={goToVoting}>К голосованию</Button>
      </>
    );
  }
  return (
    <>
      <div className={s.headerControls}>
        <Button onClick={goToResults} variant="ghost">
          Результаты
        </Button>
        <ParticipantButton participants={participants} />
        <Button disabled={!myIntervals.length} onClick={saveIntervals}>
          Сохранить
        </Button>
      </div>
      <LoginModal
        close={() => setIsLoginModalOpen(false)}
        isLoginModalOpen={isLoginModalOpen}
        name={name}
        loginAndSaveIntervals={loginAndSaveIntervals}
      />
    </>
  );
}

function ParticipantButton({ participants }: { participants: Participant[] }) {
  return (
    <div className={popoverStyles.trigger} style={{ display: 'flex', zIndex: 20 }}>
      <div className={s.participantsAmount}>
        <p>{participants.length}</p>
        <Icon.Users />
      </div>
      <div style={{ width: participants.length * 27 }}>
        <ParticipantsLine participants={participants} borderColor={'white'}>
          <ParticipantsPopover participants={participants} position="right" y={60} />
        </ParticipantsLine>
      </div>
    </div>
  );
}

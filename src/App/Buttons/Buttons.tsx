import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import s from '../../styles/App.module.scss';
import { Copyboard } from '../../components/Copyboard/Copyboard';
import * as Icon from 'react-feather';
import { LoginModal } from '../LoginModal/LoginModal';
import React from 'react';
import ReloadButton from '../../components/ReloadButton/ReloadButton';
import { ParticipantsPopover } from '../ParticipantsPopover/ParticipantsPopover';
import popoverStyles from '../../components/Popover/Popover.module.scss';
import { Participant, User } from '../../types';
import { isPhone } from '../../utils';

export function Buttons(props: any) {
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
  } = props;
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
              <Input className={s.stretch} {...name.bind} placeholder="Иван Иванов" />
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

function ParticipantButton(props: { participants: Participant[] }) {
  return (
    <Button
      variant="secondary"
      style={{ position: 'relative', zIndex: 1000, cursor: 'initial' }}
      className={popoverStyles.trigger}
    >
      <Icon.Users />
      <ParticipantsPopover participants={props.participants} position="right" y={40} />
    </Button>
  );
}

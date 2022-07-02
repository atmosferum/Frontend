import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import s from '../../styles/App.module.scss';
import { Copyboard } from '../../components/Copyboard/Copyboard';
import * as Icon from 'react-feather';
import { LoginModal } from '../LoginModal/LoginModal';
import React from 'react';

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
    showParticipantsModal,
    loginAndSaveIntervals,
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
          <Button onClick={() => setIsLoginModalOpen(true)}>Копировать ссылку</Button>
        ) : (
          <Button disabled={!titleInput.value || !adminIntervals.length} onClick={createEvent}>
            Создать событие
          </Button>
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
        <Button variant="secondary" onClick={showParticipantsModal}>
          <Icon.Users />
        </Button>
        <Button onClick={goToVoting}>К голосованию</Button>
      </>
    );
  } else {
    return (
      <>
        <div className={s.headerControls}>
          <Button onClick={goToResults} variant="ghost">
            Результаты
          </Button>
          <Button variant="secondary" onClick={showParticipantsModal}>
            <Icon.Users />
          </Button>
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
}

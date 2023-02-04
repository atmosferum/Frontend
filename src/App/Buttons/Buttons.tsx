import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { Input } from '../../components/Input';
import s from '../App.module.scss';
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
import { useAppSelector } from '../../hooks/redux';
import { useActions } from '../../hooks/actions';
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { AppDispatch } from '../../store';
export function Buttons() {
  const { name, titleInput } = useContext(AppContext)!;
  const {
    isAdmin,
    isResults,
    adminIntervals,
    myIntervals,
    isLoading,
    isLoginModalOpen,
    eventId,
    participants,
  } = useAppSelector((s) => s.store);
  const {
    saveIntervals,
    loginAndSaveIntervals,
    setState,
    login,
    goToVoting,
    goToResultsThunk,
    postEventThunk,
    setResultThunk,
  } = useActions();
  const getHost = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/`;
    }
    return '';
  };

  if (isAdmin) {
    // @ts-ignore
    return (
      <>
        {isResults ? (
          <>
            <ReloadButton onClick={setResultThunk} isLoading={isLoading} />
            <ParticipantButton participants={participants} />
            <Button onClick={() => setState({ isLoginModalOpen: true })}>Копировать ссылку</Button>
          </>
        ) : (
          <>
            <Button
              disabled={isLoading || !titleInput.value || !adminIntervals.length}
              onClick={() => setState({ isLoginModalOpen: true })}
              isStretch={isPhone()}
            >
              Создать событие
            </Button>
          </>
        )}
        <Dialog
          close={() => setState({ isLoginModalOpen: false })}
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
                onClick={async () => {
                  await login(name.value);
                  postEventThunk({
                    title: titleInput.value,
                    description: '',
                  });
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
        <ReloadButton onClick={setResultThunk} isLoading={isLoading} />
        <ParticipantButton participants={participants} />
        <Button onClick={goToVoting}>К голосованию</Button>
      </>
    );
  }
  return (
    <>
      <div className={s.headerControls}>
        <Button onClick={goToResultsThunk} variant="ghost">
          Результаты
        </Button>
        <ParticipantButton participants={participants} />
        <Button disabled={!myIntervals.length} onClick={saveIntervals}>
          Сохранить
        </Button>
      </div>
      <LoginModal
        close={() => setState({ isLoginModalOpen: false })}
        isLoginModalOpen={isLoginModalOpen}
        name={name}
        loginAndSaveIntervals={() => loginAndSaveIntervals(name.value)}
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
      <div style={{ width: participants.length * 23 }}>
        <ParticipantsLine participants={participants} borderColor={'white'}>
          <ParticipantsPopover participants={participants} position="right" y={60} />
        </ParticipantsLine>
      </div>
    </div>
  );
}

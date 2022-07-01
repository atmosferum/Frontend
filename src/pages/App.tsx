import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Interval } from '../components/Calendar';
import {
  convertIntervalToFrontend,
  getCurrentUser,
  getEventById,
  getAllIntervals,
  postIntervals,
  postEvent,
  getResult,
  getDateOfMonday,
  postLogin,
} from '../api';
import s from '../styles/App.module.scss';
import { Button } from '../components/Button';
import { MS_IN_DAY } from '../consts';
import { Input } from '../components/Input';
import { WeekSlider } from '../components/WeekSlider/WeekSlider';
import { Dialog } from '../components/Dialog';
import { useInput } from '../customHooks';
import { Copyboard } from '../components/Copyboard/Copyboard';
import * as Icon from 'react-feather';
import { Participant, User } from '../types';
import { LoginModal } from '../components/LoginModal/LoginModal';
import { ParticipantsModal } from '../components/ParticipantsModal/ParticipantsModal';
// TODO добавить кнопку загрузки актуальных интервалов
// TODO сделать кнопку учасников во всех состояниях

// refactor
// изменить имена api функций
// разнести useEffect по функциям

export const App = () => {
  const [adminIntervals, setAdminIntervals] = useState<Interval[]>([]);
  const [myIntervals, setMyIntervals] = useState<Interval[]>([]);
  const [resultsIntervals, setResultsIntervals] = useState<Interval[]>([]);

  const [dateOfMonday, setDateOfMonday] = useState(getDateOfMonday(new Date()));
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isResults, setIsResults] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [eventId, setEventId] = useState('');
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const name = useInput('');
  const titleInput = useInput('');
  const draggingElement = useRef(null);
  const queryEventId = location.pathname.substring(1);

  useEffect(() => {
    initState();
  }, []);
  async function initState() {
    if (!queryEventId) {
      setIsAdmin(true);
      return;
    }
    setEventId(queryEventId);
    const { owner, title } = await getEventById(queryEventId);
    const user = await getCurrentUser().catch(console.log);
    console.log({ user, title, owner });
    titleInput.setValue(title);
    setCurrentUser(user ?? null);
    await setResults(queryEventId);
    await setIntervals(owner, user);
    if (owner.id === user?.id) {
      console.log('admin');
      setIsAdmin(true);
      setIsResults(true);
    }
  }

  async function setIntervals(ownerOfEvent: User, user: User | void) {
    const eventIntervals = await getAllIntervals(queryEventId);
    const allIntervals = convertIntervalToFrontend(eventIntervals);
    console.log({ allIntervals, ownerOfEvent });
    setAdminIntervals(allIntervals.filter((interval) => interval.owner!.id === ownerOfEvent.id));
    setMyIntervals(allIntervals.filter((interval) => interval.owner!.id === user?.id));
  }

  function previousWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() - MS_IN_DAY * 7));
  }

  function nextWeek() {
    setDateOfMonday(new Date(dateOfMonday.getTime() + MS_IN_DAY * 7));
  }

  async function setResults(eventId: string) {
    const { intervals, participants, event } = await getResult(eventId);
    setResultsIntervals(convertIntervalToFrontend(intervals) as any);
    setParticipants(
      participants.map((participant: User) => ({
        ...participant,
        isAdmin: participant.id === event.owner.id,
        isCurrentUser: participant.id === currentUser?.id,
      })),
    );
  }

  async function createEvent() {
    setIsLoginModalOpen(true);
    await getCurrentUser();
    const event = await postEvent({
      title: titleInput.value,
      description: '',
    });
    const eventIdCreated = event.split('/')[event.split('/').length - 1];
    setEventId(eventIdCreated);
    await postIntervals(adminIntervals, eventIdCreated);
    await setResultsIntervals(adminIntervals);
    setIsResults(true);
  }

  async function saveIntervals() {
    if (!currentUser) {
      setIsLoginModalOpen(true);
    } else {
      await postIntervals(myIntervals, eventId);
    }
  }

  async function goToResults() {
    await setResults(eventId);
    setIsResults(true);
  }

  async function goToVoting() {
    setIsResults(false);
  }
  async function login(name: string) {
    await postLogin({ name });
    const user = await getCurrentUser();
    console.log(user);
    setCurrentUser(user);
    return user;
  }
  async function loginAndSaveIntervals(name: string) {
    await login(name);
    await postIntervals(myIntervals, eventId);
    setIsLoginModalOpen(false);
  }
  const propsForCalendar = {
    resultsIntervals,
    adminIntervals,
    myIntervals,
    draggingElement,
    dateOfMonday,
    setIntervals: isAdmin ? setAdminIntervals : setMyIntervals,
    isAdmin,
    isResults,
  };

  return (
    <div className={s.window}>
      <div className={s.header}>
        <WeekSlider right={nextWeek} left={previousWeek} date={dateOfMonday} />
        {!isAdmin ? (
          <h1>{titleInput.value}</h1>
        ) : (
          <input {...titleInput.bind} placeholder="Название события" className={s.eventNameInput} />
        )}
        <div>
          <Buttons
            login={login}
            isAdmin={isAdmin}
            isResults={isResults}
            name={name}
            goToVoting={goToVoting}
            goToResults={goToResults}
            saveIntervals={saveIntervals}
            createEvent={createEvent}
            setIsLoginModalOpen={setIsLoginModalOpen}
            isLoginModalOpen={isLoginModalOpen}
            eventId={eventId}
            titleInput={titleInput}
            adminIntervals={adminIntervals}
            myIntervals={myIntervals}
            showParticipantsModal={() => {
              setIsParticipantsModalOpen(true);
            }}
            loginAndSaveIntervals={loginAndSaveIntervals}
          />
        </div>
      </div>

      <Calendar {...propsForCalendar} />

      <ParticipantsModal
        isParticipantsModalOpen={isParticipantsModalOpen}
        setIsParticipantsModalOpen={setIsParticipantsModalOpen}
        participants={participants}
      />
    </div>
  );
};

const Buttons = ({
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
}: any) => {
  const getHost = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}/`;
    }
    return '';
  };

  if (isAdmin) {
    return (
      <div>
        <Button disabled={!titleInput.value || !adminIntervals.length} onClick={createEvent}>
          {isResults ? 'Копировать ссылку' : 'Создать событие'}
        </Button>
        <Dialog
          close={() => setIsLoginModalOpen(false)}
          open={isLoginModalOpen}
          title={isResults ? 'Событие создано' : 'Введите имя'}
        >
          {!isResults ? (
            <div>
              <br />
              <Input className={s.stretch} {...name.bind} placeholder="Иван Иванов" />
              <br />
              <Button
                onClick={() => login(name.value).then(createEvent)}
                disabled={!name.value}
                className={s.stretch}
              >
                Создать
              </Button>
            </div>
          ) : (
            <div>
              <br />
              <Copyboard url={getHost() + eventId} />
              <br />
              <Button
                className={s.stretch}
                onClick={() => {
                  goToResults();
                  setIsLoginModalOpen(false);
                }}
              >
                <a onClick={() => false} href={eventId}>
                  Посмотреть результаты
                </a>
              </Button>
            </div>
          )}
        </Dialog>
      </div>
    );
  } else {
    if (isResults) {
      return (
        <div>
          <Button variant="secondary" onClick={showParticipantsModal}>
            <Icon.Users />
          </Button>
          <Button onClick={goToVoting}>К голосованию</Button>;
        </div>
      );
    } else {
      return (
        <div>
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
        </div>
      );
    }
  }
};

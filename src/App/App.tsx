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
import { MS_IN_DAY } from '../consts';
import { WeekSlider } from '../components/WeekSlider/WeekSlider';
import { useInput } from '../customHooks';
import { Participant, User } from '../types';
import { ParticipantsModal } from './ParticipantsModal/ParticipantsModal';
import { Buttons } from './Buttons/Buttons';
// TODO добавить кнопку загрузки актуальных интервалов

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
    console.log({ eventIdCreated }, 'createEvent');
    window.history.pushState('data', 'Time manager', '/' + eventIdCreated);
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
  async function loginAndSaveIntervals() {
    await login(name.value);
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

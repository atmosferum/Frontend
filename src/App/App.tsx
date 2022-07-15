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
  convertUsersToParticipants,
  getParticipants,
} from '../api';
import s from '../styles/App.module.scss';
import { MS_IN_DAY } from '../consts';
import { WeekSlider } from '../components/WeekSlider/WeekSlider';
import { useInput } from '../customHooks';
import { Participant, User } from '../types';
import { Buttons } from './Buttons/Buttons';

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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const participants = await getParticipants(eventId);
    const { intervals, event } = await getResult(eventId);
    const convertUsersToParticipantsCarried = (users: User[]) =>
      convertUsersToParticipants(currentUser!, event.owner, users);
    intervals.forEach((interval) => {
      interval.owners = convertUsersToParticipantsCarried(interval.owners!);
    });
    setResultsIntervals(convertIntervalToFrontend(intervals));
    setParticipants(convertUsersToParticipantsCarried(participants));
    setIsLoading(false);
  }

  async function createEvent() {
    try {
      setIsLoading(true);
      const event = await postEvent({
        title: titleInput.value,
        description: '',
      });
      setIsLoginModalOpen(true);
      const eventIdCreated = event!.split('/')[event!.split('/').length - 1];
      setEventId(eventIdCreated);
      await postIntervals(adminIntervals, eventIdCreated);
      setIsResults(true);
      await setResults(eventIdCreated);
      console.log({ eventIdCreated }, 'createEvent');
      window.history.pushState('data', 'Time manager', '/' + eventIdCreated);
      setIsLoading(false);
    } catch (e) {
      setIsLoginModalOpen(true);
      setIsLoading(false);
    }
  }

  async function saveIntervals() {
    if (!currentUser) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoading(true);
      await postIntervals(myIntervals, eventId);
      await goToResults();
      setIsLoading(false);
    }
  }

  async function goToResults() {
    setResults(eventId);
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
    saveIntervals();
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
  const propsForButtons = {
    login,
    isAdmin,
    isResults,
    name,
    goToVoting,
    goToResults,
    saveIntervals,
    createEvent,
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
        <div style={{ display: 'flex', gap: 10 }}>
          <Buttons {...propsForButtons} />
        </div>
      </div>

      <Calendar {...propsForCalendar} />
    </div>
  );
};

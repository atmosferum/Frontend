import {
  convertIntervalToFrontend,
  convertParticipants,
  filterParticipantsByUsers,
  getAllIntervals,
  getCurrentUser,
  getEventById,
  getParticipants,
  getResult,
  postEvent,
  postIntervals,
  postLogin,
} from '../api';
import { useEffect, useRef, useState } from 'react';
import { Interval, Participant, User } from '../types';
import { useInput } from '../customHooks';
import { MS_IN_DAY, MS_IN_HOUR } from '../consts';
import { isInIntervals, isNextToOrInIntervals } from '../dateUtils';
import { MS_IN_CELL } from '../components/Calendar/DayTimeline/DayTimeline';

export function useInitState() {
  const [adminIntervals, setAdminIntervals] = useState<Interval[]>([]);
  const [myIntervals, setMyIntervals] = useState<Interval[]>([]);
  const [resultsIntervals, setResultsIntervals] = useState<Interval[]>([]);
  const [focusDate, setFocusDate] = useState<Date>(new Date());

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
  const currentIntervals = isResults ? resultsIntervals : adminIntervals;
  const changeableIntervals = isAdmin ? adminIntervals : myIntervals;
  const setChangeableIntervals = isAdmin ? setAdminIntervals : setMyIntervals;
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
    titleInput.setValue(title);
    setCurrentUser(user ?? null);
    const isAdminVar = owner.id === user?.id;
    await setResults(queryEventId, user!);
    await setIntervals(owner, user);
    if (isAdminVar) {
      setIsAdmin(true);
      await goToResults(queryEventId, user);
    }
  }
  async function setIntervals(ownerOfEvent: User, user: User | void) {
    const eventIntervals = await getAllIntervals(queryEventId);
    const allIntervals = convertIntervalToFrontend(eventIntervals);
    const adminIntervals = allIntervals.filter(
      (interval) => interval.owner!.id === ownerOfEvent.id,
    );
    const myIntervals = allIntervals.filter((interval) => interval.owner!.id === user?.id);
    setAdminIntervals(adminIntervals);
    setMyIntervals(myIntervals);
    setFocusDate(adminIntervals[0].start);
  }

  function nextInterval() {
    const intervals = currentIntervals;
    const idOfFocusInterval = intervals.indexOf(intervals.find((i) => +i.start === +focusDate!)!);
    setFocusDate((intervals[idOfFocusInterval + 1] ?? intervals[0]).start);
  }

  function previousInterval() {
    const intervals = currentIntervals;
    const idOfFocusInterval = intervals.indexOf(intervals.find((i) => +i.start === +focusDate!)!);
    setFocusDate((intervals[idOfFocusInterval - 1] ?? intervals[intervals.length - 1]).start);
  }

  function relativelyTodayGoByDays(amountOfDays: number) {
    setFocusDate(new Date(+focusDate + MS_IN_DAY * amountOfDays));
  }
  async function setResults(eventId: string, user: User | null = currentUser) {
    setIsLoading(true);
    const { intervals, event } = await getResult(eventId);
    const participants = convertParticipants(await getParticipants(eventId), user!, event.owner);
    intervals.forEach((interval) => {
      interval.owners = filterParticipantsByUsers(participants, interval.owners!);
    });
    setResultsIntervals(convertIntervalToFrontend(intervals));
    setParticipants(participants);
    setIsLoading(false);
    console.log(intervals);
    return convertIntervalToFrontend(intervals);
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
    try {
      setIsLoading(true);
      await postIntervals(myIntervals, eventId);
      await goToResults();
      setIsLoading(false);
    } catch (e) {
      setIsLoginModalOpen(true);
    }
  }

  async function goToResults(eventIdProp: string = eventId, user = currentUser) {
    setIsResults(true);
    const resultIntervals = await setResults(eventIdProp, user);
    setFocusDate(resultIntervals[0].start);
  }

  async function goToVoting() {
    setIsResults(false);
    setFocusDate(adminIntervals[0].start);
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
  function getFocusInterval() {
    return changeableIntervals.find((interval) => +interval.start === +focusDate)!;
  }
  function changeInterval(interval: Interval, part: 'start' | 'end', byHours: number) {
    if (!interval) return;
    const date = new Date(+interval[part] + byHours * MS_IN_HOUR);
    if (
      isNextToOrInIntervals(
        changeableIntervals.filter((i) => i.id !== interval.id),
        date,
      ) ||
      (!isAdmin && adminIntervals.length && !isInIntervals(adminIntervals, date)) ||
      (part === 'start' && interval!.end.getTime() - date.getTime() < MS_IN_CELL) ||
      (part === 'end' && date.getTime() - interval!.start.getTime() < MS_IN_CELL)
    )
      return;
    interval[part] = date;

    setChangeableIntervals([...changeableIntervals]);
  }

  return {
    setFocusDate,
    getFocusInterval,
    changeInterval,
    resultsIntervals,
    adminIntervals,
    myIntervals,
    draggingElement,
    setIntervals: setChangeableIntervals,
    isAdmin,
    isResults,
    focusDate,
    login,
    name,
    goToResults,
    goToVoting,
    saveIntervals,
    isLoginModalOpen,
    eventId,
    titleInput,
    participants,
    createEvent,
    setIsLoginModalOpen,
    loginAndSaveIntervals,
    isLoading,
    setResults,
    relativelyTodayGoByDays,
    nextInterval,
    previousInterval,
    currentIntervals,
  };
}

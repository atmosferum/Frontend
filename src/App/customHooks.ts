import {
  convertIntervalToFrontend,
  convertUsersToParticipants,
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
import { MS_IN_DAY } from '../consts';

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
    const isAdminVar = owner.id === user?.id;
    await setResults(queryEventId);
    await setIntervals(owner, user);
    if (isAdminVar) {
      setIsAdmin(true);
      await goToResults();
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

  async function goToResults() {
    setIsResults(true);
    const resultIntervals = await setResults(eventId);
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

  return {
    resultsIntervals,
    adminIntervals,
    myIntervals,
    draggingElement,
    setIntervals: isAdmin ? setAdminIntervals : setMyIntervals,
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

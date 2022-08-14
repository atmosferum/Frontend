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
import { isDateInIntervals, isNextToOrInIntervals } from '../dateUtils';
import { MS_IN_CELL } from '../components/Calendar/DayTimeline/DayTimeline';
import { useActions } from '../hooks/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '../hooks/redux';
import { getAllIntervalsThunk, initState, setResultThunk } from '../store/store.slice';

export function useInitState() {
  const {
    isAdmin,
    isResults,
    focusDate,
    resultsIntervals,
    isLoginModalOpen,
    adminIntervals,
    myIntervals,
    eventId,
  } = useAppSelector((state) => state.store);
  const name = useInput('');
  const titleInput = useInput('');
  const draggingElement = useRef(null);
  const queryEventId = location.pathname.substring(1);
  const dispatch = useDispatch<any>();
  useEffect(() => {
    init();
  }, []);

  async function init() {
    const title = await dispatch(initState(queryEventId)).unwrap();
    titleInput.setValue(title);
  }

  return {
    resultsIntervals,
    adminIntervals,
    myIntervals,
    draggingElement,
    setIntervals: isAdmin,
    isResults,
    focusDate,
    name,
    isLoginModalOpen,
    eventId,
    titleInput,
  };
}

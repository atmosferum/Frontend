import { useEffect, useRef, useState } from 'react';
import { Interval, Participant, User } from '../types';
import { useInput } from '../hooks/customHooks';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '../hooks/redux';
import { getAllIntervalsThunk, initState, setResultThunk } from '../store/store.slice';

export function useInitState() {
  const name = useInput(localStorage.getItem('name') || '');
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
    draggingElement,
    name,
    titleInput,
  };
}

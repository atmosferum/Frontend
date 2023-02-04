import { DraggingElement, Interval, Participant, User } from '../types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  convertIntervalsToFrontend,
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
import { MS_IN_DAY, MS_IN_HOUR } from '../consts';
import { isDateInIntervals, isNextToOrInIntervals } from '../dateUtils';
import { MS_IN_CELL } from '../components/Calendar/DayTimeline/DayTimeline';
import { store } from './index';
import { selectChangeableIntervals } from './selectors';

// @ts-ignore

export interface Store {
  isResults: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  adminIntervals: Interval[];
  myIntervals: Interval[];
  resultsIntervals: Interval[];
  focusDate: Date;
  participants: Participant[];
  eventId: string;
  draggingElement: DraggingElement;
  title: string;
  currentUser: User | null | undefined;
  owner: User | null;
}

const initialState: Store = {
  adminIntervals: [],
  myIntervals: [],
  draggingElement: { current: null },
  eventId: '',
  isAdmin: false,
  isResults: false,
  focusDate: new Date(),
  isLoginModalOpen: false,
  isLoading: false,
  participants: [],
  resultsIntervals: [],
  currentUser: undefined,
  title: '',
  owner: null,
};
export const initState = createAsyncThunk('initState', async (eventId: string, { dispatch }) => {
  if (!eventId) {
    dispatch(setAdmin());
    return;
  }
  let owner, title;
  try {
    const obj = await getEventById(eventId);
    owner = obj.owner;
    title = obj.title;
  } catch (e) {
    window.history.pushState('data', 'Time manager', '/');
    dispatch(setAdmin());
    return '';
  }
  const user = await getCurrentUser().catch(console.log);
  dispatch(
    setUser({
      owner,
      eventId,
      currentUser: user || null,
    }),
  );

  const isAdminVar = user && user.id === owner.id;
  console.log({ isAdminVar });
  dispatch(setResultThunk());
  dispatch(getAllIntervalsThunk());
  if (isAdminVar) {
    dispatch(setAdmin());
    dispatch(goToResultsThunk());
  }
  return title;
});
const getResults = async (_: void, { getState, dispatch }: any) => {
  dispatch(setState({ isLoading: true }));
  const { eventId, currentUser: user } = getState().store;
  const { intervals, event } = await getResult(eventId);
  const participants = convertParticipants(await getParticipants(eventId), user!, event.owner);
  intervals.forEach((interval) => {
    interval.owners = filterParticipantsByUsers(participants, interval.owners!);
  });
  const resultsIntervals = convertIntervalsToFrontend(intervals);
  dispatch(setState({ isLoading: false }));
  return { resultsIntervals, participants };
};
export const login = createAsyncThunk('login', async (name: string, { getState }) => {
  localStorage.setItem('name', name);
  // @ts-ignore
  localStorage.setItem(getState().store.eventId, 'true');
  await postLogin({ name });
  return await getCurrentUser();
});
export const postEventThunk = createAsyncThunk(
  'eventId/postEventThunk',
  async (params: any, { dispatch }) => {
    dispatch(setState({ isLoading: true }));
    const eventUrl = await postEvent(params);
    await dispatch(saveEvent(eventUrl));
    dispatch(setResultThunk());
    dispatch(setState({ isLoading: false }));
  },
);
export const getCurrentUserThunk = createAsyncThunk(
  'currentUser/getCurrentUserThunk',
  getCurrentUser,
);
export const saveIntervals = createAsyncThunk(
  'saveIntervals',
  async (_, { getState, dispatch }: any) => {
    const { eventId, myIntervals } = getState().store;
    try {
      if (!localStorage.getItem(eventId)) {
        throw new Error('not logged in');
      }
      await postIntervals(myIntervals, eventId);
      dispatch(goToResultsThunk());
    } catch (e) {
      dispatch(setState({ isLoginModalOpen: true }));
    }
  },
);
export const loginAndSaveIntervals = createAsyncThunk(
  'loginAndSaveIntervals',
  async (name: string, { dispatch }: any) => {
    await dispatch(login(name));
    dispatch(saveIntervals());
    dispatch(setState({ isLoginModalOpen: false }));
  },
);
export const getAllIntervalsThunk = createAsyncThunk(
  'getAllIntervalsThunk',
  (_, { getState }: any) => getAllIntervals(getState().store.eventId),
);

export const setResultThunk = createAsyncThunk('getResult', getResults);
export const goToResultsThunk = createAsyncThunk('goToResults/...', async (_, params) => {
  params.dispatch(setState({ isResults: true }));
  const res = await getResults(_, params);
  params.dispatch(goToResults());
  return res;
});
export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    goToResults: (state) => {
      state.isResults = true;
      state.focusDate = state.resultsIntervals[0].start;
    },
    setIntervals: (state, { payload }) => {
      const intervals = state.isAdmin ? 'adminIntervals' : 'myIntervals';
      state[intervals] = payload;
    },
    changeInterval: (
      state,
      {
        payload: { interval, part, byHours },
      }: { payload: { interval: Interval; part: 'start' | 'end'; byHours: number } },
    ) => {
      if (!interval) return;

      const changeableIntervals = state.isAdmin ? 'adminIntervals' : 'myIntervals';
      const date = new Date(+interval[part] + byHours * MS_IN_HOUR);
      const intervals = state[changeableIntervals].filter((i) => i.id !== interval.id);
      if (
        isNextToOrInIntervals(intervals, date) ||
        (!state.isAdmin &&
          state.adminIntervals.length &&
          !isDateInIntervals(state.adminIntervals, date)) ||
        (part === 'start' && interval!.end.getTime() - date.getTime() < MS_IN_CELL) ||
        (part === 'end' && date.getTime() - interval!.start.getTime() < MS_IN_CELL)
      )
        return;
      interval[part] = date;
      const newInterval = { ...interval, [part]: date };
      state[changeableIntervals] = [...intervals, newInterval];
    },
    goToVoting: (state) => {
      state.isResults = false;
      state.focusDate = state.adminIntervals[0].start;
    },
    setState: (state, { payload }) => {
      const { isLoginModalOpen, isResults, eventId, currentUser, owner, isLoading, focusDate } =
        payload;
      state.isLoginModalOpen = isLoginModalOpen ?? state.isLoginModalOpen;
      state.isResults = isResults ?? state.isResults;
      state.eventId = eventId ?? state.eventId;
      state.currentUser = currentUser ?? state.currentUser;
      state.owner = owner ?? state.owner;
      state.isLoading = isLoading ?? state.isLoading;
      state.focusDate = focusDate ?? state.focusDate;
    },
    setAdmin: (state) => {
      state.currentUser = state.owner;
      state.isAdmin = true;
    },
    nextInterval: (state, { payload }: { payload: 'next' | 'previous' }) => {
      const { resultsIntervals, adminIntervals, isResults } = state;
      const intervals = isResults ? resultsIntervals : adminIntervals;
      const idOfFocusInterval = intervals.indexOf(
        intervals.find((i) => +i.start === +state.focusDate!)!,
      );
      state.focusDate =
        payload === 'next'
          ? (intervals[idOfFocusInterval + 1] ?? intervals[0]).start
          : (intervals[idOfFocusInterval - 1] ?? intervals[intervals.length - 1]).start;
    },
    relativelyTodayGoByDays: (state, { payload }: { payload: number }) => {
      state.focusDate = new Date(+state.focusDate + MS_IN_DAY * payload);
    },
    saveEvent: (state, { payload: eventUrl }) => {
      console.log(eventUrl);
      state.isLoginModalOpen = true;
      state.eventId = eventUrl!.split('/')[eventUrl!.split('/').length - 1];
      postIntervals(state.adminIntervals, state.eventId);
      state.isResults = true;
      window.history.pushState('data', 'Time manager', '/' + state.eventId);
    },
    setUser: (state, action) => {
      state.owner = action.payload.owner;
      state.eventId = action.payload.eventId;
      state.currentUser = action.payload.currentUser;
    },
  },
  extraReducers: {
    [postEventThunk.rejected.toString()]: (state) => {
      state.isLoginModalOpen = true;
    },
    [getCurrentUserThunk.fulfilled.toString()]: (state, action) => {
      state.currentUser = action.payload;
    },
    [getAllIntervalsThunk.fulfilled.toString()]: (state, action) => {
      const eventIntervals = action.payload;
      const allIntervals = convertIntervalsToFrontend(eventIntervals);
      state.adminIntervals = allIntervals.filter(
        (interval) => interval.owner!.id === state.owner?.id,
      );
      state.myIntervals = allIntervals.filter(
        (interval) => interval.owner!.id === state.currentUser?.id,
      );
      state.focusDate = state.adminIntervals[0].start;
    },
    [setResultThunk.fulfilled.toString()]: (state, { payload }) => {
      const { resultsIntervals, participants } = payload;
      state.resultsIntervals = resultsIntervals;
      state.participants = participants;
    },
    [goToResultsThunk.fulfilled.toString()]: (state, { payload }) => {
      const { resultsIntervals, participants } = payload;
      state.resultsIntervals = resultsIntervals;
      state.participants = participants;
    },
    [login.fulfilled.toString()]: (state, { payload }: { payload: User }) => {
      state.currentUser = payload;
    },
  },
});

export const storeActions = storeSlice.actions;
export const {
  setUser,
  saveEvent,
  setState,
  goToResults,
  setAdmin,
  setIntervals,
  nextInterval,
  relativelyTodayGoByDays,
  goToVoting,
  changeInterval,
} = storeActions;
export const storeReducer = storeSlice.reducer;

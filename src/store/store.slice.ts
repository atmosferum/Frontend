import { DraggingElement, Interval, Participant, User } from '../types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
import { MS_IN_DAY, MS_IN_HOUR } from '../consts';
import { isDateInIntervals, isNextToOrInIntervals } from '../dateUtils';
import { MS_IN_CELL } from '../components/Calendar/DayTimeline/DayTimeline';
import { store } from './index';

// @ts-ignore

interface State {
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
  currentUser: User | null;
  owner: User | null;
}

const initialState: State = {
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
  currentUser: null,
  title: '',
  owner: null,
};
export const initState = createAsyncThunk('initState', async (eventId: string, { dispatch }) => {
  if (!eventId) {
    dispatch(setAdmin());
    return;
  }
  const { owner, title } = await getEventById(eventId);
  const user = await getCurrentUser().catch(console.log);
  dispatch(
    setState({
      owner,
      eventId,
      currentUser: user || null,
    }),
  );

  const isAdminVar = owner.id === user?.id;
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
  const resultsIntervals = convertIntervalToFrontend(intervals);
  dispatch(setState({ isLoading: false }));
  return { resultsIntervals, participants };
};
export const postEventThunk = createAsyncThunk(
  'eventId/postEventThunk',
  async (params: any, { dispatch }) => {
    dispatch(setState({ isLoading: true }));
    const eventUrl = await postEvent(params);
    console.log(eventUrl);
    dispatch(saveEvent(eventUrl));
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
      await postIntervals(myIntervals, eventId);
      dispatch(goToResultsThunk());
    } catch (e) {
      setState({ isLoginModalOpen: true });
    }
  },
);
export const loginAndSaveIntervals = createAsyncThunk(
  'loginAndSaveIntervals',
  async (name: string, { dispatch }: any) => {
    await dispatch(login(name));
    saveIntervals();
    setState({ isLoginModalOpen: false });
  },
);

export const getAllIntervalsThunk = createAsyncThunk(
  'getAllIntervalsThunk',
  (_, { getState }: any) => getAllIntervals(getState().store.eventId),
);
// export const getEventByIdThunk = createAsyncThunk('intervals/getEventByIdThunk', getEventById);
export const login = createAsyncThunk('login', async (name: string) => {
  await postLogin({ name });
  return await getCurrentUser();
});
export const setResultThunk = createAsyncThunk('getResult', getResults);
export const goToResultsThunk = createAsyncThunk('goToResults/...', async (_, params) => {
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
      const { adminIntervals, isAdmin } = state;
      const changeableIntervals = isAdmin ? 'adminIntervals' : 'myIntervals';
      const date = new Date(+interval[part] + byHours * MS_IN_HOUR);
      if (
        isNextToOrInIntervals(
          state[changeableIntervals].filter((i) => i.id !== interval.id),
          date,
        ) ||
        (!isAdmin && adminIntervals.length && !isDateInIntervals(adminIntervals, date)) ||
        (part === 'start' && interval!.end.getTime() - date.getTime() < MS_IN_CELL) ||
        (part === 'end' && date.getTime() - interval!.start.getTime() < MS_IN_CELL)
      )
        return;
      interval[part] = date;
    },
    goToVoting: (state) => {
      state.isResults = false;
      state.focusDate = state.adminIntervals[0].start;
    },
    setState: (state, { payload }) => {
      const { isLoginModalOpen, isResults, eventId, currentUser, owner, isLoading } = payload;
      state.isLoginModalOpen = isLoginModalOpen ?? state.isLoginModalOpen;
      state.isResults = isResults ?? state.isResults;
      state.eventId = eventId ?? state.eventId;
      state.currentUser = currentUser ?? state.currentUser;
      state.owner = owner ?? state.owner;
      state.isLoading = isLoading ?? state.isLoading;
    },
    setAdmin: (state) => {
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
      const allIntervals = convertIntervalToFrontend(eventIntervals);
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
const { saveEvent, setState, goToResults, setAdmin } = storeActions;
export const storeReducer = storeSlice.reducer;

import { DraggingElement, Interval, Participant, User } from '../types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  convertIntervalToFrontend,
  getAllIntervals,
  getCurrentUser,
  getEventById,
  postEvent,
} from '../api';
import { actions } from '@storybook/addon-actions';

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
const postEventThunk = createAsyncThunk('eventId/postEventThunk', postEvent);
const getCurrentUserThunk = createAsyncThunk('currentUser/getCurrentUserThunk', getCurrentUser);
const getAllIntervalsThunk = createAsyncThunk('intervals/getAllIntervalsThunk', getAllIntervals);
export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    //     initState:(state, {payload: queryEventId})=>{
    //         if (!queryEventId) {
    //             state.isAdmin = true;
    //             return;
    //         }
    //         state.eventId = queryEventId;
    //         postEventThunk(queryEventId)
    //         getCurrentUserThunk()
    //         await setResults(queryEventId, user!);
    //         await setIntervals(owner, user);
    //         if (isAdminVar) {
    //             state.isAdmin = true
    //             await goToResults(queryEventId, user);
    //         }
    //     }
  },
  extraReducers: {
    [postEventThunk.fulfilled.toString()]: (state, action) => {
      const { owner, title } = action.payload;
      state.title = title;
      state.owner = owner;
      state.isAdmin = owner.id === state.currentUser?.id;
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
  },
});

export const storeActions = storeSlice.actions;
export const storeReducer = storeSlice.reducer;

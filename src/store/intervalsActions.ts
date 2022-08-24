import { createAsyncThunk } from '@reduxjs/toolkit';
import { State } from '../types';
import { setIntervals, Store } from './store.slice';
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { selectChangeableIntervals } from './selectors';

export const deleteInterval = createAsyncThunk(
  'intervals/delete',
  (id: number, { dispatch, getState }: any) => {
    const changeableIntervals = selectChangeableIntervals(getState());
    dispatch(setIntervals(changeableIntervals.filter((interval) => interval.id !== id)));
  },
);

import { createSelector } from 'reselect';
import { Store } from './store.slice';
import { Interval } from '../types';

const selectAdminIntervals = (state: { store: Store }) => state.store.adminIntervals;
const selectMyIntervals = (state: { store: Store }) => state.store.myIntervals;
const selectResultsIntervals = (state: { store: Store }) => state.store.resultsIntervals;
const selectIsAdmin = (state: { store: Store }) => state.store.isAdmin;
const selectIsResults = (state: { store: Store }) => state.store.isResults;
const selectFocusDate = (state: { store: Store }) => state.store.focusDate;

export const selectChangeableIntervals = createSelector(
  [selectMyIntervals, selectAdminIntervals, selectIsAdmin],
  (myIntervals, adminIntervals, isAdmin) => (isAdmin ? adminIntervals : myIntervals),
);

export const selectCurrentIntervals = createSelector(
  [selectResultsIntervals, selectAdminIntervals, selectIsResults],
  (resultsIntervals, adminIntervals, isResults) => (isResults ? resultsIntervals : adminIntervals),
);

export const selectFocusInterval = createSelector(
  [selectMyIntervals, selectAdminIntervals, selectIsAdmin, selectFocusDate],
  (myIntervals, adminIntervals, isAdmin, focusDate) => {
    const changeableIntervals = isAdmin ? adminIntervals : myIntervals;
    return changeableIntervals.find((interval: Interval) => +interval.start === +focusDate)!;
  },
);

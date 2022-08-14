import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Interval } from '../types';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useCurrentIntervals = () =>
  useAppSelector((state) => {
    const { isResults, adminIntervals, resultsIntervals } = state.store;
    return isResults ? resultsIntervals : adminIntervals;
  });
export const useChangeableIntervals = () =>
  useAppSelector((state) => {
    const { isAdmin, adminIntervals, myIntervals } = state.store;
    return isAdmin ? adminIntervals : myIntervals;
  });
export const useFocusInterval = () =>
  useAppSelector((state) => {
    const { focusDate, isAdmin, adminIntervals, myIntervals } = state.store;
    const changeableIntervals = isAdmin ? adminIntervals : myIntervals;
    return changeableIntervals.find((interval: Interval) => +interval.start === +focusDate)!;
  });

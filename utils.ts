import { start } from 'repl';
import { MS_IN_DAY } from './consts';
import { BackendInterval, Interval } from './types';
export function getDateOfMonday(date: Date): Date {
  return new Date(date.getTime() - MS_IN_DAY * (date.getDay() ? date.getDay() - 1 : 6));
}

export function convertIntervalToBackend(intervals: Interval[]): BackendInterval[] {
  const backendIntervals = intervals.map(({ start, end, id }) => ({
    startTime: start.getTime() / 1000,
    endTime: end.getTime() / 1000,
    id,
  }));
  return backendIntervals;
}
export function convertIntervalToFrontend(intervals: BackendInterval[]): Interval[] {
  const frontendIntervals = intervals.map(({ startTime, endTime, id }) => ({
    start: new Date(startTime * 1000),
    end: new Date(endTime * 1000),
    id,
  }));
  return frontendIntervals;
}

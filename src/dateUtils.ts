import { MS_IN_DAY, MS_IN_HOUR } from './consts';
import { Interval } from './types';
import { HOURS_IN_CELL } from './components/Calendar/DayTimeline';
import { isPhone } from './utils';

export function getDateOfMonday(date: Date): Date {
  return new Date(date.getTime() - MS_IN_DAY * (date.getDay() ? date.getDay() - 1 : 6));
}
export function getNextDateOfMonday(date: Date): Date {
  return getDateOfMonday(new Date(+date + MS_IN_DAY * 7));
}

export const getCellDate = (id: number, day: Date) =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(id / 2), (id % 2) * 30);

export function getWeek(monday: Date): Date[] {
  return Array(7)
    .fill(null)
    .map((_, id) => {
      return new Date(monday.getTime() + id * 24 * 60 * 60 * 1000);
    });
}

export function isEqualDays(startOrEnd: Date, day: Date) {
  return startOrEnd.toString().substring(0, 15) === day.toString().substring(0, 15);
}

export function isToday(day: Date) {
  return isEqualDays(new Date(), day);
}

export function isBefore(first: Date, second: Date) {
  const firstCopy = new Date(first);
  const secondCopy = new Date(second);
  return firstCopy.setHours(0, 0, 0, 0) < secondCopy.setHours(0, 0, 0, 0);
}
export const isDateInInterval = (interval: Interval, date: Date) =>
  interval.start <= date && date <= interval.end;

export function isDateInIntervals(intervals: Interval[], date: Date) {
  const isTheDateInInterval = (interval: Interval) => isDateInInterval(interval, date);
  return intervals.some(isTheDateInInterval);
}
export function isIntervalInIntervals(intervals: Interval[], interval: Interval) {
  const isIntervalInInterval = (i: Interval) =>
    isDateInInterval(i, interval.start) && isDateInInterval(i, interval.end);
  return intervals.some(isIntervalInInterval);
}
export function isNextToOrInIntervals(intervals: Interval[], date: Date) {
  return intervals.some(
    (interval) =>
      interval.start.getTime() - date.getTime() < MS_IN_HOUR * HOURS_IN_CELL &&
      date.getTime() - interval.end.getTime() < MS_IN_HOUR * HOURS_IN_CELL,
  );
}
export const isIntervalsIntersect = (first: Interval, second: Interval) =>
  isDateInInterval(first, second.start) ||
  isDateInInterval(first, second.end) ||
  isDateInInterval(second, first.start) ||
  isDateInInterval(second, first.end);

export function isThereIntersections(intervals: Interval[], newInterval: Interval) {
  return intervals.some((interval) => isIntervalsIntersect(interval, newInterval));
}

export const isIntervalsBefore = (currentIntervals: Interval[], focusDate: Date) =>
  !!currentIntervals.length &&
  isBefore(currentIntervals[0]?.start, isPhone() ? focusDate : getDateOfMonday(focusDate));

export const isIntervalsAfter = (currentIntervals: Interval[], focusDate: Date) =>
  !!currentIntervals.length &&
  !isBefore(
    currentIntervals[currentIntervals.length - 1]?.end,
    isPhone() ? new Date(+focusDate + MS_IN_DAY) : getNextDateOfMonday(focusDate),
  );
export const getHours = (date: Date) => {
  return date.getHours() + date.getMinutes() / 60;
};
export const getClockFace = (hours: number) =>
  `${Math.floor(hours)}:${Math.round((hours % 1) * 60)}${hours % 1 >= 1 / 6 ? '' : '0'}`;

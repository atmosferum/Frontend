import { MS_IN_HOUR } from '../../consts';
import { Interval } from '../../types';
import { HOURS_IN_CELL } from './DayTimeline';

export function getWeek(monday: Date): Date[] {
  return Array(7)
    .fill(null)
    .map((_, id) => {
      return new Date(monday.getTime() + id * 24 * 60 * 60 * 1000);
    });
}

export function isToday(day: Date) {
  return new Date().toString().substring(0, 15) === day.toString().substring(0, 15);
}

export function isEqualDays(startOrEnd: Date, day: Date) {
  return startOrEnd.toString().substring(0, 15) === day.toString().substring(0, 15);
}

export function isBefore(startOrEnd: Date, day: Date) {
  return (
    day.getFullYear() > startOrEnd.getFullYear() ||
    day.getMonth() > startOrEnd.getMonth() ||
    day.getDate() > startOrEnd.getDate()
  );
}

export function isInIntervals(intervals: Interval[], date: Date) {
  return intervals.some((interval) => interval.start <= date && date < interval.end);
}
export function isNextToOrInIntervals(intervals: Interval[], date: Date) {
  return intervals.some(
    (interval) =>
      interval.start.getTime() - date.getTime() <= MS_IN_HOUR * HOURS_IN_CELL &&
      date.getTime() - interval.end.getTime() < MS_IN_HOUR * HOURS_IN_CELL,
  );
}

export function isThereIntersections(intervals: Interval[], newInterval: Interval) {
  return intervals.some((interval) => {
    return (
      newInterval.start.getTime() < interval.start.getTime() &&
      interval.end.getTime() < newInterval.end.getTime()
    );
  });
}

export const getClockFace = (hours: number) =>
  `${Math.floor(hours)}:${Math.round((hours % 1) * 60)}${hours % 1 ? '' : '0'}`;

export class IntervalClass {
  start: Date;
  end: Date;
  id: number;
  static staticId: number = 0;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
    this.id = IntervalClass.staticId++;
  }
}

export function isTouchEnabled() {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    window.navigator.userAgent.toLowerCase(),
  );
}

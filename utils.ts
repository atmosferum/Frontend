import { MS_IN_DAY } from './consts';

export function getDateOfMonday(date: Date): Date {
  return new Date(date.getTime() - MS_IN_DAY * (date.getDay() ? date.getDay() - 1 : 6));
}
const url = 'whattime.ru/api/v1';
export async function loginPost() {
  const req = `${url}/login`;
}

export async function currentUserGet() {}

export async function logoutGet() {}

export async function eventsPost() {}

export async function eventsIdGet(id: number) {}

export async function eventsIntervalsPost(id: number) {}

export async function eventsIntervalsGet(id: number) {}

export async function eventsResultGet(id: number) {}

import axios from 'axios';
import { MS_IN_DAY } from './consts';

export function getDateOfMonday(date: Date): Date {
  return new Date(date.getTime() - MS_IN_DAY * (date.getDay() ? date.getDay() - 1 : 6));
}

const url = 'https://whattime.ru/api/v1';

export async function loginPost(params: { name: string }) {
  const { data } = await axios.post(`${url}/login`, {
    name: params.name,
  });
  return data;
}

export async function currentUserGet() {}

export async function logoutGet() {}

export async function eventsPost() {}

export async function eventsIdGet(id: number) {}

export async function eventsIntervalsPost(id: number) {}

export async function eventsIntervalsGet(id: number) {}

export async function eventsResultGet(id: number) {}

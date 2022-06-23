import axios from 'axios';
import { MS_IN_DAY } from './consts';
import { Interval } from './types';
export function getDateOfMonday(date: Date): Date {
  return new Date(date.getTime() - MS_IN_DAY * (date.getDay() ? date.getDay() - 1 : 6));
}

const url = 'http://localhost:3000/api';

export async function loginPost(params: { name: string }) {
  const { data } = await axios.post(`${url}/login`, {
    name: params.name,
  });
  return data;
}

export async function currentUserGet() {
  const { data } = await axios.get(`${url}/currentUser`);
  return data;
}

export async function logoutGet() {
  const { data } = await axios.get(`${url}/logout`);
  return data;
}

export async function eventsPost(params: { title: string; description: string }) {
  const { data } = await axios.post(`${url}/login`, {
    title: params.title,
    description: params.description,
  });
  return data;
}

export async function eventsIdGet(id: number) {
  const { data } = await axios.get(`${url}/events/${id}`);
  return data;
}

export async function eventsIntervalsPost(intervals: Interval[]) {}

export async function eventsIntervalsGet(id: number) {
  const { data } = await axios.get(`${url}/events/${id}/intervals`);
  return data;
}

export async function eventsResultGet(id: number) {
  const { data } = await axios.get(`${url}/events/${id}/result`);
  return data;
}

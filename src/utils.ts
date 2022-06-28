import axios from 'axios';
import { start } from 'repl';
import { MS_IN_DAY } from './consts';
import { BackendInterval, Interval } from './types';
export function getDateOfMonday(date: Date): Date {
  return new Date(date.getTime() - MS_IN_DAY * (date.getDay() ? date.getDay() - 1 : 6));
}

const API_PATH = '/api/v1';

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

export async function loginPost(params: { name: string }) {
  const { data } = await axios.post(`${API_PATH}/login`, {
    name: params.name,
  });
  return data;
}

export async function currentUserGet() {
  const { data } = await axios.get(`${API_PATH}/currentUser`);
  return data;
}

export async function logoutGet() {
  const { data } = await axios.get(`${API_PATH}/logout`);
  return data;
}

export async function eventsPost(params: { title: string; description: string }) {
  const { headers } = await axios.post(`${API_PATH}/events`, {
    title: params.title,
    description: params.description,
  });

  return headers.location;
}

export async function eventsIdGet(id: string) {
  const { data } = await axios.get(`${API_PATH}/events/${id}`);
  return data;
}

export async function eventsIntervalsPost(intervals: Interval[], eventId: string) {
  const { data } = await axios.post(
    `${API_PATH}/events/${eventId}/intervals`,
    convertIntervalToBackend(intervals),
  );
  return data;
}

export async function eventsIntervalsGet(id: string) {
  const { data } = await axios.get(`${API_PATH}/events/${id}/intervals`);
  return data;
}

export async function eventsResultGet(id: string) {
  const { data } = await axios.get(`${API_PATH}/events/${id}/result`);
  return data;
}

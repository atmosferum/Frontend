import axios from 'axios';
import { MS_IN_DAY } from './consts';
import { BackendInterval, Interval, Results, Event, User, Participant } from './types';

const API_PATH = '/api/v1';

export function convertUsersToParticipants(
  currentUser: User,
  owner: User,
  users: User[],
): Participant[] {
  return users.map((participant: User) => ({
    ...participant,
    isAdmin: participant.id === owner.id,
    isCurrentUser: participant.id === currentUser?.id,
  }));
}
export function convertIntervalToBackend(intervals: Interval[]): BackendInterval[] {
  return intervals.map(({ start, end, id }) => ({
    startTime: start.getTime() / 1000,
    endTime: end.getTime() / 1000,
    id,
  }));
}
export function convertIntervalToFrontend(intervals: BackendInterval[]): Interval[] {
  return intervals.map(({ startTime, endTime, ...rest }) => ({
    start: new Date(startTime * 1000),
    end: new Date(endTime * 1000),
    ...rest,
  }));
}

export async function postLogin(params: { name: string }) {
  const { data } = await axios.post(`${API_PATH}/login`, {
    name: params.name,
  });
  return data;
}

export async function getCurrentUser(): Promise<{ name: string; id: string }> {
  const { data } = await axios.get(`${API_PATH}/currentUser`);
  return data;
}

export async function logout(): Promise<void> {
  const { data } = await axios.get(`${API_PATH}/logout`);
  return data;
}

export async function postEvent(params: { title: string; description: string }): Promise<string> {
  const { headers } = await axios.post(`${API_PATH}/events`, {
    title: params.title,
    description: params.description,
  });

  return headers.location;
}

export async function getEventById(id: string): Promise<Event> {
  const { data } = await axios.get(`${API_PATH}/events/${id}`);
  return data;
}

export async function postIntervals(intervals: Interval[], eventId: string) {
  const { data } = await axios.post(
    `${API_PATH}/events/${eventId}/intervals`,
    convertIntervalToBackend(intervals),
  );
  return data;
}

export async function getAllIntervals(id: string) {
  const { data } = await axios.get(`${API_PATH}/events/${id}/intervals`);
  return data;
}

export async function getResult(id: string): Promise<Results> {
  const { data } = await axios.get(`${API_PATH}/events/${id}/result`);
  return data;
}

export async function getParticipants(id: string): Promise<User[]> {
  const { data } = await axios.get(`${API_PATH}/events/${id}/participants`);
  return data;
}

import axios from 'axios';
import { MS_IN_DAY } from './consts';
import { BackendInterval, Interval, Results, Event, User, Participant } from './types';
import { capitalizeFirstLetter } from './utils';

const API_PATH = 'https://meettimeflask.fedor-resh.repl.co';
export function convertParticipants(
  participants: User[],
  currentUser: User,
  owner: User,
): Participant[] {
  const hslArr = [0, 180, 90, 270, 30, 210, 300, 60, 240, 330, 15, 195, 105, 285, 45, 225, 315, 75];
  return (
    participants
      // .sort((a, b) => +a.id - +b.id)
      .map((participant: User, id) => ({
        ...participant,
        name: capitalizeFirstLetter(participant.name),
        isAdmin: participant.id === owner.id,
        isCurrentUser: participant.id === currentUser?.id,
        hslNumber: hslArr[id],
        color: `hsl(${hslArr[id]}, 60%, 50%)`,
      }))
      .sort((a, b) => a.hslNumber - b.hslNumber)
  );
}
export function filterParticipantsByUsers(participants: Participant[], users: User[]) {
  return participants.filter((participant) => users.find((user) => user.id === participant.id));
}
export function convertIntervalsToBackend(intervals: Interval[]): BackendInterval[] {
  return intervals.map(({ start, end, id }) => ({
    startTime: start.getTime() / 1000,
    endTime: end.getTime() / 1000,
    id,
  }));
}
export function convertIntervalsToFrontend(intervals: BackendInterval[]): Interval[] {
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
  console.log('postEvent', params);
  const { headers } = await axios.post(`${API_PATH}/events`, params);

  return headers.location;
}

export async function getEventById(id: string): Promise<Event> {
  const { data } = await axios.get(`${API_PATH}/events/${id}`);
  return data;
}

export async function postIntervals(intervals: Interval[], eventId: string) {
  const { data } = await axios.post(
    `${API_PATH}/events/${eventId}/intervals`,
    convertIntervalsToBackend(intervals),
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

export async function getParticipants(
  id: string,
): Promise<Pick<Participant, 'color' | 'id' | 'name'>[]> {
  const { data } = await axios.get(`${API_PATH}/events/${id}/participants`);
  console.log(data);
  return data;
}

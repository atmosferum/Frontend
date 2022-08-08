import { SetStateAction } from 'react';

export interface User {
  id: string;
  name: string;
}
export interface Participant extends User {
  color?: string;
  isAdmin: boolean;
  isCurrentUser: boolean;
}
export interface Interval {
  start: Date;
  end: Date;
  id: number;
  owner?: User;
  owners?: Participant[];
}
export interface DraggingElement {
  current: {
    id: number;
    part: 'start' | 'end';
    prevCellId?: number;
  } | null;
}
export interface BackendInterval {
  id: number;
  startTime: number;
  endTime: number;
  owner?: User;
  owners?: Participant[];
}
export interface Event {
  id: string;
  title: string;
  description: string;
  owner: User;
  createdAt: number;
}
export interface Results {
  event: Event;
  intervals: BackendInterval[];
}

export interface State {
  adminIntervals: Interval[];
  myIntervals: Interval[];
  resultsIntervals: Interval[];
  setIntervals: (any) => any;
  setIsLoginModalOpen: (any) => any;
  setResults: (any) => any;
  goToResults: () => any;
  saveIntervals: () => any;
  isResults: boolean;
  isAdmin: boolean;
  titleInput: any;
  eventId: string;
  focusDate: Date;
  isLoginModalOpen: boolean;
  login: any;
  goToVoting: () => any;
  draggingElement: DraggingElement;
  name: any;
  participants: Participant[];
  isLoading: boolean;
  loginAndSaveIntervals: () => any;
  createEvent: () => void;
  currentIntervals: Interval[];
  previousInterval: () => any;
  relativelyTodayGoByDays: (x: number) => any;
  nextInterval: () => any;
  changeFocusInterval: (part: 'start' | 'end', byHours: number) => void;
  getFocusInterval: () => Interval | undefined;
  setFocusDate: SetStateAction<any>;
}

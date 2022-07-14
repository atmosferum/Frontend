export interface User {
  id: string;
  name: string;
}
export interface Participant extends User {
  isAdmin: boolean;
  isCurrentUser: boolean;
}
export interface Interval {
  start: Date;
  end: Date;
  id: number;
  owner?: User;
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
  participants: User[];
}

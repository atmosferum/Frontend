export interface User {
  id: number;
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
  } | null;
}
export interface BackendInterval {
  id: number;
  startTime: number;
  endTime: number;
}

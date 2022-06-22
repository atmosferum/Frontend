export interface Interval {
  start: Date;
  end: Date;
  id: number;
}
export interface DraggingElement {
  current: {
    id: number;
    part: "start" | "end";
  } | null;
}

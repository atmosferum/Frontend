export class IntervalClass {
  start: Date;
  end: Date;
  id: number;
  static staticId: number = 0;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
    this.id = IntervalClass.staticId++;
  }
}
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function isPhone() {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    window.navigator.userAgent.toLowerCase(),
  );
}

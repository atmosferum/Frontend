import { months, MS_IN_DAY } from '../../consts';

export function getWeekInterval(date: Date): string {
  const nextMonday = new Date(date.getTime() + MS_IN_DAY * 7);
  return `${months[date.getMonth()]} ${date.getDate()} — ${
    months[nextMonday.getMonth()]
  } ${nextMonday.getDate()}`;
}

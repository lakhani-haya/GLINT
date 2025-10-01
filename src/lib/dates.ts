import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isoWeek);
dayjs.extend(utc);

export { dayjs };

export const formatDate = (date: string | Dayjs, format = 'MMM D') => {
  return dayjs(date).format(format);
};

export const formatDateRange = (start: string | Dayjs, end: string | Dayjs) => {
  const startDay = dayjs(start);
  const endDay = dayjs(end);
  
  if (startDay.isSame(endDay, 'month')) {
    return `${startDay.format('MMM D')} - ${endDay.format('D')}`;
  }
  
  return `${startDay.format('MMM D')} - ${endDay.format('MMM D')}`;
};

export const getWeekRange = (date: string | Dayjs, startOfWeek: 'monday' | 'sunday' = 'monday') => {
  const d = dayjs(date);
  const start = startOfWeek === 'monday' ? d.startOf('isoWeek') : d.startOf('week');
  const end = start.add(6, 'days');
  return { start, end };
};

export const isSameDay = (date1: string | Dayjs, date2: string | Dayjs) => {
  return dayjs(date1).isSame(dayjs(date2), 'day');
};

export const isToday = (date: string | Dayjs) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isTomorrow = (date: string | Dayjs) => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
};

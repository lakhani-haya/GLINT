import { dayjs } from './dates';
import { Dayjs } from 'dayjs';
import { Task, Recurrence } from '../types';

export const getNextOccurrence = (task: Task, fromDate: Dayjs = dayjs()): Dayjs | null => {
  if (!task.recurrence || !task.active) return null;

  const { recurrence } = task;
  const anchor = dayjs(recurrence.anchorDate || task.lastDoneAt || fromDate);
  
  if (recurrence.kind === 'interval') {
    let nextDate = anchor;
    const intervalDays = getIntervalDays(recurrence.every, recurrence.unit);
    
    // Find the next occurrence after fromDate
    while (nextDate.isBefore(fromDate, 'day') || nextDate.isSame(fromDate, 'day')) {
      nextDate = nextDate.add(intervalDays, 'days');
    }
    
    // Check count limit
    if (recurrence.count) {
      const occurrencesSince = Math.floor(nextDate.diff(anchor, 'days') / intervalDays);
      if (occurrencesSince >= recurrence.count) return null;
    }
    
    // Check until date
    if (recurrence.until && nextDate.isAfter(dayjs(recurrence.until))) {
      return null;
    }
    
    return nextDate;
  }
  
  return null;
};

export const generateOccurrences = (task: Task, start: Dayjs, end: Dayjs): Dayjs[] => {
  if (!task.recurrence || !task.active) return [];

  const occurrences: Dayjs[] = [];
  let current = getNextOccurrence(task, start);
  
  while (current && current.isBefore(end, 'day')) {
    occurrences.push(current);
    current = getNextOccurrence(task, current.add(1, 'day'));
  }
  
  return occurrences;
};

const getIntervalDays = (every: number, unit: Recurrence['unit']): number => {
  switch (unit) {
    case 'days':
      return every;
    case 'weeks':
      return Math.round(every * 7);
    case 'months':
      return Math.round(every * 30); // Approximate
    default:
      return every;
  }
};

export const updateTaskAfterCompletion = (task: Task): Task => {
  const now = dayjs().toISOString();
  const nextDue = getNextOccurrence(task, dayjs());
  
  return {
    ...task,
    lastDoneAt: now,
    nextDueAt: nextDue?.toISOString() || null,
  };
};

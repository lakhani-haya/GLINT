import { dayjs } from './dates';
import { Dayjs } from 'dayjs';
import { Task, Recurrence } from '../types';

export const getNextOccurrence = (task: Task, fromDate: Dayjs = dayjs()): Dayjs | null => {
  if (!task.recurrence || !task.active) return null;

  const { recurrence } = task;
  
  // Use lastDoneAt if available, otherwise use anchorDate, otherwise use current date
  let anchor: Dayjs;
  if (task.lastDoneAt) {
    anchor = dayjs(task.lastDoneAt);
  } else if (recurrence.anchorDate) {
    anchor = dayjs(recurrence.anchorDate);
  } else {
    anchor = fromDate;
  }
  
  if (recurrence.kind === 'interval') {
    const intervalDays = getIntervalDays(recurrence.every, recurrence.unit);
    
    // If we have a lastDoneAt, the next occurrence is intervalDays after that
    if (task.lastDoneAt) {
      const nextFromLastDone = anchor.add(intervalDays, 'days');
      if (nextFromLastDone.isAfter(fromDate, 'day')) {
        return nextFromLastDone;
      }
    }
    
    // Otherwise, find the next occurrence after fromDate starting from anchor
    let nextDate = anchor;
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
  const { recurrence } = task;
  const intervalDays = getIntervalDays(recurrence.every, recurrence.unit);
  
  // Start from the appropriate anchor date
  let anchor: Dayjs;
  if (task.lastDoneAt) {
    // If task was done, start from the next occurrence after lastDoneAt
    anchor = dayjs(task.lastDoneAt).add(intervalDays, 'days');
  } else if (recurrence.anchorDate) {
    anchor = dayjs(recurrence.anchorDate);
  } else {
    anchor = start;
  }
  
  // Generate occurrences from anchor date
  let current = anchor;
  
  // Move current to the first occurrence within our range
  while (current.isBefore(start, 'day')) {
    current = current.add(intervalDays, 'days');
  }
  
  // Collect all occurrences within the range
  while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
    // Check count limit
    if (recurrence.count) {
      const occurrencesSince = Math.floor(current.diff(anchor, 'days') / intervalDays);
      if (occurrencesSince >= recurrence.count) break;
    }
    
    // Check until date
    if (recurrence.until && current.isAfter(dayjs(recurrence.until))) {
      break;
    }
    
    occurrences.push(current);
    current = current.add(intervalDays, 'days');
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
  const now = dayjs();
  const nowStr = now.toISOString();
  
  // Calculate the next due date based on the completion time
  let nextDue: Dayjs | null = null;
  if (task.recurrence) {
    const intervalDays = getIntervalDays(task.recurrence.every, task.recurrence.unit);
    nextDue = now.add(intervalDays, 'days');
    
    // Check count limit
    if (task.recurrence.count) {
      const anchor = dayjs(task.recurrence.anchorDate || nowStr);
      const occurrencesSince = Math.floor(nextDue.diff(anchor, 'days') / intervalDays);
      if (occurrencesSince >= task.recurrence.count) {
        nextDue = null;
      }
    }
    
    // Check until date
    if (task.recurrence.until && nextDue && nextDue.isAfter(dayjs(task.recurrence.until))) {
      nextDue = null;
    }
  }
  
  return {
    ...task,
    lastDoneAt: nowStr,
    nextDueAt: nextDue?.toISOString() || null,
  };
};

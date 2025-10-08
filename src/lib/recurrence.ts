import { dayjs } from './dates';
import { Dayjs } from 'dayjs';
import { Task, Recurrence } from '../types';

export const getNextOccurrence = (task: Task, fromDate: Dayjs = dayjs()): Dayjs | null => {
  if (!task.recurrence || !task.active) return null;

  const { recurrence } = task;
  const intervalDays = getIntervalDays(recurrence.every, recurrence.unit);
  
  if (recurrence.kind === 'interval') {
    // If task was completed, next occurrence is intervalDays after lastDoneAt
    if (task.lastDoneAt) {
      const lastDone = dayjs(task.lastDoneAt);
      const nextFromLastDone = lastDone.add(intervalDays, 'days');
      
      // Only return if it's after fromDate
      if (nextFromLastDone.isAfter(fromDate, 'day') || nextFromLastDone.isSame(fromDate, 'day')) {
        // Check count and until limits
        const anchorDate = recurrence.anchorDate ? dayjs(recurrence.anchorDate) : lastDone;
        
        if (recurrence.count) {
          const totalOccurrences = Math.floor(nextFromLastDone.diff(anchorDate, 'days') / intervalDays) + 1;
          if (totalOccurrences > recurrence.count) return null;
        }
        
        if (recurrence.until && nextFromLastDone.isAfter(dayjs(recurrence.until))) {
          return null;
        }
        
        return nextFromLastDone;
      }
      return null;
    }
    
    // If task hasn't been completed, calculate from anchor date
    const anchorDate = recurrence.anchorDate ? dayjs(recurrence.anchorDate) : fromDate;
    let nextDate = anchorDate;
    
    // Find the next occurrence after fromDate
    while (nextDate.isBefore(fromDate, 'day') || nextDate.isSame(fromDate, 'day')) {
      nextDate = nextDate.add(intervalDays, 'days');
    }
    
    // Check count limit
    if (recurrence.count) {
      const occurrenceNumber = Math.floor(nextDate.diff(anchorDate, 'days') / intervalDays) + 1;
      if (occurrenceNumber > recurrence.count) return null;
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
  
  // Determine the anchor date - the date from which we calculate the pattern
  const anchorDate = recurrence.anchorDate ? dayjs(recurrence.anchorDate) : start;
  
  // If task was completed, calculate next due date from lastDoneAt
  if (task.lastDoneAt) {
    const lastDone = dayjs(task.lastDoneAt);
    const nextDue = lastDone.add(intervalDays, 'days');
    
    // Only include this next occurrence if it falls within our date range
    if ((nextDue.isAfter(start, 'day') || nextDue.isSame(start, 'day')) && 
        (nextDue.isBefore(end, 'day') || nextDue.isSame(end, 'day'))) {
      
      // Check count limit
      if (recurrence.count) {
        const totalOccurrences = Math.floor(nextDue.diff(anchorDate, 'days') / intervalDays) + 1;
        if (totalOccurrences <= recurrence.count) {
          occurrences.push(nextDue);
        }
      } else if (!recurrence.until || nextDue.isBefore(dayjs(recurrence.until)) || nextDue.isSame(dayjs(recurrence.until))) {
        occurrences.push(nextDue);
      }
    }
    
    return occurrences;
  }
  
  // If task hasn't been completed yet, generate occurrences from anchor date
  let current = anchorDate;
  
  // Move current to the first occurrence within our range
  while (current.isBefore(start, 'day')) {
    current = current.add(intervalDays, 'days');
  }
  
  // Collect all occurrences within the range
  while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
    // Check count limit
    if (recurrence.count) {
      const occurrenceNumber = Math.floor(current.diff(anchorDate, 'days') / intervalDays) + 1;
      if (occurrenceNumber > recurrence.count) break;
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
  const nextDue = getNextOccurrence(task, now);
  
  return {
    ...task,
    lastDoneAt: nowStr,
    nextDueAt: nextDue?.toISOString() || null,
  };
};

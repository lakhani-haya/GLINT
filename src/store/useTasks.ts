import { create } from 'zustand';
import { Task, TaskCategory } from '../types';
import { dayjs } from '../lib/dates';
import { generateOccurrences, updateTaskAfterCompletion } from '../lib/recurrence';

interface TasksState {
  tasks: Task[];
  bundleRules: Record<string, string[]>;
  settings: {
    weekStart: 'monday' | 'sunday';
    defaultReminder: 'none' | '1d' | '12h' | '2h';
    themeIntensity: 'light' | 'default' | 'strong';
    autoBundling: boolean;
  };
  
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  markTaskDone: (id: string) => void;
  updateSettings: (settings: Partial<TasksState['settings']>) => void;
  updateBundleRules: (rules: Record<string, string[]>) => void;
  
  // Computed
  getUpcomingOccurrences: (days: number) => Array<{ date: string; tasks: Task[] }>;
  getOccurrencesForDate: (date: string) => Task[];
  getTasksByCategory: (category?: TaskCategory) => Task[];
}

// Sample seed data
const seedTasks: Task[] = [
  {
    id: '1',
    name: 'Nails',
    category: 'Nails',
    recurrence: {
      kind: 'interval',
      every: 2,
      unit: 'weeks',
      anchorDate: dayjs().subtract(10, 'days').toISOString(),
    },
    active: true,
    isFlexible: false,
    nextDueAt: null,
    lastDoneAt: null,
  },
  {
    id: '2',
    name: 'Lash Fill',
    category: 'Lashes',
    recurrence: {
      kind: 'interval',
      every: 2.5,
      unit: 'weeks',
      anchorDate: dayjs().subtract(5, 'days').toISOString(),
    },
    active: true,
    isFlexible: false,
    nextDueAt: null,
    lastDoneAt: null,
  },
  {
    id: '3',
    name: 'Wash Hair',
    category: 'Hair',
    recurrence: {
      kind: 'interval',
      every: 3,
      unit: 'days',
      anchorDate: dayjs().subtract(1, 'day').toISOString(),
    },
    active: true,
    isFlexible: true,
    pairWith: ['4'],
    nextDueAt: null,
    lastDoneAt: null,
  },
  {
    id: '4',
    name: 'Shave',
    category: 'Other',
    recurrence: {
      kind: 'interval',
      every: 3,
      unit: 'days',
      anchorDate: dayjs().subtract(1, 'day').toISOString(),
    },
    active: true,
    isFlexible: true,
    nextDueAt: null,
    lastDoneAt: null,
  },
];

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: seedTasks,
  bundleRules: {
    'Wash Hair': ['Shave'],
    'Nails': ['Exfoliate Hands'],
    'Lashes': ['Brows'],
  },
  settings: {
    weekStart: 'monday',
    defaultReminder: 'none',
    themeIntensity: 'default',
    autoBundling: true,
  },
  
  addTask: (taskData) => {
    const task: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
  
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
  
  markTaskDone: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? updateTaskAfterCompletion(task) : task
      ),
    }));
  },
  
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  
  updateBundleRules: (rules) => {
    set({ bundleRules: rules });
  },
  
  getUpcomingOccurrences: (days = 14) => {
    const { tasks } = get();
    const start = dayjs();
    const end = start.add(days, 'days');
    const occurrenceMap = new Map<string, Task[]>();
    
    tasks.forEach((task) => {
      const occurrences = generateOccurrences(task, start, end);
      occurrences.forEach((date) => {
        const dateStr = date.format('YYYY-MM-DD');
        if (!occurrenceMap.has(dateStr)) {
          occurrenceMap.set(dateStr, []);
        }
        occurrenceMap.get(dateStr)!.push(task);
      });
    });
    
    return Array.from(occurrenceMap.entries())
      .map(([date, tasks]) => ({ date, tasks }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
  
  getOccurrencesForDate: (date) => {
    const { tasks } = get();
    const targetDate = dayjs(date);
    const occurrences: Task[] = [];
    
    tasks.forEach((task) => {
      const taskOccurrences = generateOccurrences(task, targetDate, targetDate.add(1, 'day'));
      if (taskOccurrences.length > 0) {
        occurrences.push(task);
      }
    });
    
    return occurrences;
  },
  
  getTasksByCategory: (category) => {
    const { tasks } = get();
    return category
      ? tasks.filter((task) => task.category === category)
      : tasks;
  },
}));

export type FrequencyUnit = 'days' | 'weeks' | 'months';

export type Recurrence = {
  kind: 'interval';
  every: number;
  unit: FrequencyUnit;
  anchorDate?: string;
  count?: number;
  until?: string;
};

export type TaskCategory = 'Hair' | 'Nails' | 'Lashes' | 'Skin' | 'Brows' | 'Waxing' | 'Other';

export type Task = {
  id: string;
  name: string;
  category: TaskCategory;
  color?: string;
  notes?: string;
  durationMins?: number;
  preferredDays?: number[];
  pairWith?: string[];
  recurrence?: Recurrence | null;
  isFlexible?: boolean;
  lastDoneAt?: string | null;
  nextDueAt?: string | null;
  active: boolean;
};

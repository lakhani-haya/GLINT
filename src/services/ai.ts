const API = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:3000';

export async function getFrequencyAdvice(input: {
  taskName: string;
  history?: { lastDoneISO?: string; failedEarly?: boolean; notes?: string };
  profile?: { hairType?: string; skinType?: string; budgetTier?: 'low'|'mid'|'high' };
}) {
  const r = await fetch(`${API}/ai/frequency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error('AI frequency failed');
  return r.json() as Promise<{ every: number; unit: 'days'|'weeks'|'months'; confidence?: number; reason?: string }>;
}

export async function getRescheduleAdvice(input: {
  missedTask: string;
  earliestISO: string;
  latestISO: string;
  busySlots: { start: string; end: string }[];
}) {
  const r = await fetch(`${API}/ai/reschedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error('AI reschedule failed');
  return r.json() as Promise<{ newDate: string; reason?: string; confidence?: number }>;
}
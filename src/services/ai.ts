const API = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:3000';

export async function getFrequencyAdvice(input: {
  taskName: string;
  history?: { lastDoneISO?: string; failedEarly?: boolean; notes?: string };
  profile?: { hairType?: string; skinType?: string; budgetTier?: 'low'|'mid'|'high' };
}) {
  console.log('Making AI request to:', `${API}/ai/frequency`);
  console.log('Request payload:', input);
  
  const r = await fetch(`${API}/ai/frequency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  console.log('Response status:', r.status);
  
  if (!r.ok) {
    const errorText = await r.text();
    console.error('AI request failed:', errorText);
    throw new Error(`AI frequency failed: ${r.status} ${errorText}`);
  }
  
  const result = await r.json();
  console.log('AI response:', result);
  return result as { every: number; unit: 'days'|'weeks'|'months'; confidence?: number; reason?: string };
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
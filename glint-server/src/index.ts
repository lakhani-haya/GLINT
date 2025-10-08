import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ai/frequency', async (req, res) => {
  const { taskName, history, profile } = req.body ?? {};
  const schema = {
    type: "object",
    properties: {
      every: { type: "number" },
      unit: { enum: ["days","weeks","months"] },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      reason: { type: "string" }
    },
    required: ["every","unit"]
  };
  try {
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a grooming expert. Provide succinct, professional advice on optimal grooming intervals based on the task name, user history, and profile. Consider factors like hair/skin type, maintenance requirements, and personal preferences. Keep responses practical and evidence-based." },
        { role: "user", content: `Please recommend an optimal frequency for this grooming task: ${JSON.stringify({ taskName, history, profile })}` }
      ],
      response_format: { 
        type: "json_schema", 
        json_schema: { 
          name: "FrequencyAdvice", 
          schema, 
          strict: true 
        } 
      }
    });
    const content = r.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');
    return res.json(JSON.parse(content));
  } catch (e: any) {
    console.error('AI frequency error:', e);
    return res.status(500).json({ error: e.message });
  }
});

app.post('/ai/reschedule', async (req, res) => {
  const { missedTask, earliestISO, latestISO, busySlots } = req.body ?? {};
  const schema = {
    type: "object",
    properties: {
      newDate: { type: "string" },   // ISO date
      reason: { type: "string" },
      confidence: { type: "number", minimum: 0, maximum: 1 }
    },
    required: ["newDate"]
  };
  try {
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a scheduling assistant. Choose the best new date for a missed grooming task within the given time window, avoiding busy slots. Consider task urgency, user convenience, and optimal spacing from other activities." },
        { role: "user", content: `Please reschedule this missed task: ${JSON.stringify({ missedTask, earliestISO, latestISO, busySlots })}` }
      ],
      response_format: { 
        type: "json_schema", 
        json_schema: { 
          name: "RescheduleAdvice", 
          schema, 
          strict: true 
        } 
      }
    });
    const content = r.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');
    return res.json(JSON.parse(content));
  } catch (e: any) {
    console.error('AI reschedule error:', e);
    return res.status(500).json({ error: e.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Glint AI API on http://localhost:${port}`));
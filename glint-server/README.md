# Glint AI Server

AI-powered backend for the Glint grooming scheduler app.

## Features

- **Frequency Advice**: Provides intelligent grooming interval recommendations based on task type, user history, and profile
- **Reschedule Suggestions**: Offers optimal rescheduling options for missed tasks within specified time windows

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file and add your OpenAI API key:
```bash
cp .env.example .env
```

3. Edit `.env` and add your actual OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

## Development

Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### POST `/ai/frequency`

Get AI-powered grooming frequency recommendations.

**Request:**
```json
{
  "taskName": "Wash Hair",
  "history": {
    "lastDoneISO": "2025-10-01T00:00:00Z",
    "notes": "Works well with current routine"
  },
  "profile": {
    "hairType": "oily",
    "budgetTier": "mid"
  }
}
```

**Response:**
```json
{
  "every": 3,
  "unit": "days",
  "confidence": 0.85,
  "reason": "For oily hair types, washing every 3 days maintains cleanliness while preserving natural oils."
}
```

### POST `/ai/reschedule`

Get AI-powered rescheduling suggestions for missed tasks.

**Request:**
```json
{
  "missedTask": "Nail appointment",
  "earliestISO": "2025-10-08T00:00:00Z",
  "latestISO": "2025-10-15T00:00:00Z",
  "busySlots": [
    {
      "start": "2025-10-10T14:00:00Z",
      "end": "2025-10-10T16:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "newDate": "2025-10-09T10:00:00Z",
  "reason": "Tuesday morning provides optimal scheduling with no conflicts",
  "confidence": 0.9
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-08T05:15:30.123Z"
}
```

## Technologies

- Node.js + TypeScript
- Express.js
- OpenAI GPT-4o-mini with Structured Outputs
- CORS enabled for client integration
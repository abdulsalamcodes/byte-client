# Byte Client – Next.js Quiz Generator

Production-ready Next.js (TypeScript) app that consumes the Byte Server API to generate quizzes. Supports both non-stream JSON responses and streaming text with live display and optional parsing.

## Tech stack

- Next.js App Router (RSC where appropriate)
- TypeScript, React
- Tailwind CSS v4
- Zod + react-hook-form for validation
- fetch for HTTP requests
- ESLint + Prettier
- Jest for unit tests

## Setup

1. Create an env file:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` if your Byte Server API base differs:

   ```bash
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" >> .env.local
   ```

2. Install dependencies and run the app:

   ```bash
   npm install
   npm run dev
   ```

   The app will be available at http://localhost:3000.

## Usage

1. On the home page, enter a display name to start.
2. Fill in quiz parameters (lang, number of questions, difficulty, model). Toggle "Stream mode" to use streaming.
3. Submit:
   - Non-stream: Parses JSON array and renders quiz cards with the correct answer highlighted.
   - Stream: Click "Start stream" to receive live text from the server; click "Try to parse JSON" to attempt parsing into questions.
4. Optional quiz-taking: Toggle "Quiz-taking mode" to select answers and score client-side.

## API contract

- Endpoint: `POST {API_BASE_URL}/quiz/generate`
- Request JSON:

  ```json
  { "lang": string, "num_questions": number (1-50), "difficulty": "easy"|"medium"|"hard", "model": string, "stream": boolean }
  ```

- Non-stream response: JSON array of `{ question: string, options: string[], answer: string }`.
- Stream response: `text/plain` chunks displayed live; parsing helper can extract the first `[...]` JSON array if present.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server
- `npm run lint` – run ESLint
- `npm run test` – run Jest tests

## Tests

Minimal unit tests cover the parsing helper at `src/utils/parser.test.ts`.

## Notes

- Tailwind v4 is configured via `postcss.config.mjs` and `app/globals.css`.
- The app uses Client Components for interactive form and streaming UI; the page itself is a Client Component entry.
- ESLint config targets Next.js core web vitals.

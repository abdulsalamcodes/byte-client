# Byte Lab Client Agent Guide

## Scope

This repository contains the Next.js client for Byte Lab. The API server is in `/Users/mac/My Projects/byte/byte-server`.

## Architecture

- Client entry point: `app/page.tsx`.
- Quiz configuration and generation UI: `src/components/QuizForm.tsx`.
- Quiz practice and review UI: `src/components/QuizList.tsx`.
- Shared challenge URL and local session utilities: `src/utils/lab.ts`.
- API base URL: `NEXT_PUBLIC_API_BASE_URL`, normally `http://localhost:8001` locally.
- The server owns challenge identity, snapshots, attempts, and leaderboard data.

## Shared Challenge Invariants

- A shared link must open the already-generated quiz; it must never trigger new quiz generation.
- New share links use the canonical `/ABC123` route.
- Legacy query links are not a supported product requirement and should not drive new implementation decisions.
- Repeated sharing of one quiz must reuse its existing challenge code.
- Challenge attempts and leaderboard requests must use the same challenge code.
- Do not create client-generated authoritative challenge IDs.

## Development

```bash
npm run dev -- --port 3001
npm run lint
npx tsc --noEmit
npm run build
```

Run the API separately from the server repository on port `8001`.

## Engineering Rules

- Do not preserve backward compatibility.
- Choose the simplest implementation that fully meets the current requirements.
- Prefer established, well-maintained libraries over custom implementations.
- Make architectural decisions for the long term.
- Do not accept a stopgap that only works for now and is meant to be replaced later.
- Keep the interface professional, restrained, and non-gimmicky.
- Do not expose secrets from environment files.
- Validate client changes against the API contract before considering them complete.

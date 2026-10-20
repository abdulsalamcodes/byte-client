# Byte Lab Client Agent Guide

## Scope

This repository contains the Next.js client for Byte Lab. The API server is in `/Users/mac/My Projects/byte/byte-server`.

## Architecture

- Client entry point: `app/page.tsx`.
- Quiz configuration and generation UI: `src/components/QuizForm.tsx`.
- Quiz practice and review UI: `src/components/QuizList.tsx`.
- Shared challenge URL, local session, and local grading utilities: `src/utils/lab.ts`.
- All API calls go through the typed functions in `src/utils/api.ts`.
- Session state: `src/components/AuthProvider.tsx` (`useAuth()`); sign-in and sign-up UI: `src/components/AuthScreen.tsx`.
- API base URL: `NEXT_PUBLIC_API_BASE_URL`, normally `http://localhost:8001` locally.
- The server owns accounts, challenge identity, snapshots, grading, attempts, and leaderboard data.

## Shared Challenge Invariants

- A shared link must open the already-generated quiz; it must never trigger new quiz generation.
- New share links use the canonical `/ABC123` route.
- Legacy query links are not a supported product requirement and should not drive new implementation decisions.
- Repeated sharing of one quiz must reuse its existing challenge code.
- Challenge attempts and leaderboard requests must use the same challenge code.
- Do not create client-generated authoritative challenge IDs.
- Shared challenges arrive without answers; grade them by submitting to the server, never in the browser.
- Generating, sharing, publishing, and submitting attempts require a signed-in user; viewing a challenge does not.
- On a 401 from the API, sign the user out rather than retrying.

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

## Clean Code Principles

- Keep functions and components small, focused, and easy to name.
- Prefer clear data flow and explicit state over clever abstractions.
- Remove duplication when the abstraction is stable; do not abstract speculative reuse.
- Keep domain logic out of presentational components where practical.
- Use precise types and narrow interfaces instead of broad `any`-like contracts.
- Handle loading, empty, error, and success states explicitly.
- Name code after its behavior and domain meaning, not its implementation detail.
- Avoid hidden side effects, unnecessary global state, and deeply nested conditionals.
- Keep comments rare and explain intent or non-obvious constraints only.
- Delete dead code and unused configuration rather than leaving it for future use.
- Prefer tests that verify user-visible behavior and important invariants.

## Frontend Standards

- Design components around reusable product primitives: buttons, fields, cards, status messages, challenge metadata, and progress patterns.
- Keep components composable through clear props and callbacks; avoid components that know too much about page-level state.
- Separate API calls, parsing, persistence, and recommendation logic from rendering code.
- Reuse existing components and styles before creating a new visual pattern.
- Establish consistent variants for interactive elements instead of one-off class combinations.
- Use semantic HTML, visible focus states, keyboard support, labels, and useful error messages.
- Design mobile-first and verify layouts at narrow and wide viewport sizes.
- Preserve the Byte Lab visual language: professional, editorial, restrained, and free of childish or generic AI patterns.
- Prefer progressive disclosure over showing every control at once.
- Keep asynchronous actions visibly stateful: idle, loading, success, and failure.
- Do not duplicate business rules between components; centralize shared behavior in utilities or hooks.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

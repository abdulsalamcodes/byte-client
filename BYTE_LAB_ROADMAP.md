# Byte Roadmap

## Product Thesis

AI coding tools write more of the code, so developers practice less of the judgment behind it: reading, debugging, reviewing, and designing. Byte turns that practice into a game developers want to come back to.

> Ship with AI. Level up with Byte.

Byte is a game platform for developers to learn and challenge themselves: boss fights built from realistic bugs, progression that tracks real skill, and competition that is fair because the server grades everything.

## Principles

- **Fun that teaches.** Every reward is tied to demonstrated understanding. Speed matters, but never more than being right and knowing why.
- **Trustworthy content.** A game with a wrong answer key loses players. Every generated question passes deterministic checks and an independent AI solver before anyone sees it.
- **Fair competition.** The server owns scores, answers, and game state. Clients never see answer keys before submitting and never report their own scores.
- **Accounts first.** Playing requires an account. Progress, XP, and rankings are only meaningful when they belong to someone.
- **Realistic, not trivia.** Challenges look like engineering work: logs, diffs, failing tests, design tradeoffs.

## Audience

- Developers who work with AI coding agents and want to keep their edge.
- Backend and full-stack developers who enjoy debugging and puzzles.
- Learners who want structure and motivation beyond tutorials.

## Foundation (built)

- Accounts with JWT auth; generation, sharing, and play require sign-in.
- Seven practice formats: concept checks, code reasoning, debugging, code review, refactoring, test writing, system design.
- Verified generation as a LangGraph pipeline: generate → structural checks → independent solver → retry until enough questions agree.
- Shareable challenges with server-side snapshots, unlisted by default, creator-only publishing.
- Server-side grading, one ranked attempt per player per challenge, leaderboards that never reveal answers.

## Game Modes

### 1. Boss Fights (first mode)

A boss is a production incident told in stages. You beat it by reasoning through the stages before your HP runs out.

**Shape of a fight**

| Stage | Player does | Example |
| :---- | :---------- | :------ |
| Recon | Read the scenario, logs, and code | "p99 latency jumped after the 2.3 deploy" |
| Diagnose | Pick the root cause | Unbounded retry loop, N+1 query, race condition |
| Fix | Choose or review the fix | Pick the diff that fixes it without breaking callers |
| Harden | Prevent it coming back | Pick the test or alert that would have caught it |

**Rules**

- Player HP and boss HP. Correct answers damage the boss; wrong answers cost the player HP.
- Hints exist but cost HP, so players choose between pride and progress.
- Clearing a stage reveals the explanation before the next stage, so the fight itself teaches.
- Defeating a boss awards XP scaled by difficulty, HP remaining, and hints used. Losing still awards a little XP plus a "rematch" entry in the player's review queue.
- Bosses come in tiers (minion, elite, boss) that map to difficulty.

**How it runs**

- A boss is generated ahead of time by a LangGraph pipeline that writes the scenario, then each stage, and verifies every stage with the independent solver. Bosses are stored, not generated on demand, so fights start instantly and cost nothing per play.
- A fight is a server-authoritative LangGraph session graph: one node per stage, conditional edges for win, lose, and hint. Game state (HP, stage, hints) is persisted with a LangGraph checkpointer so fights survive refreshes and cannot be edited client-side.
- Each submitted move is graded on the server; the client only renders state the server returns.

### 2. Daily Boss

One boss per day for everyone. Global leaderboard, a daily streak, and a shared post-fight breakdown of the most common wrong answer.

### 3. Explain-It Rounds

Answer, then explain why in a sentence or two. A LangChain judge with a structured rubric scores the reasoning and names the misconception if there is one. Good explanations earn bonus XP; this is the strongest learning signal in the game.

### 4. Duels

Two players, the same boss, at the same time. First to defeat it wins. Requires realtime infrastructure (websockets) that Vercel functions do not provide, so duels follow the core game.

### 5. Quests and Skill Tree

Concepts (caching, queues, concurrency, auth, observability) form a tree. Quests chain bosses through a branch. Weak concepts surface as "rematch" quests.

## Progression

- **XP and levels** from fights, explanations, and rematches. Rematching a boss you lost to and winning pays more than farming easy ones.
- **Badges** for meaningful milestones: first elite defeated, a full skill branch cleared, ten explanations rated excellent.
- **Streaks** for the daily boss, with one free "save" per week so a missed day is not punishing.
- **Profile** showing level, badges, strongest and weakest concepts, and recent fights.

## Phases

### Phase 1: Boss Fights v1

- Boss and fight data model, migrations, and API.
- Boss generation pipeline (scenario → stages → verification) and a seed set of 20–30 bosses across formats and tiers.
- Fight session graph with checkpointed, server-authoritative state.
- Fight UI: stage view, HP bars, hints, stage explanations, victory and defeat screens.
- XP awarded per fight.

**Success criteria:** players finish their first boss, start a second within a day, and rematch bosses they lost.

### Phase 2: Progression

- Levels, badges, streaks, and the player profile.
- Rematch queue built from lost fights and missed concepts.
- Explain-it rounds with the AI judge.

### Phase 3: Daily Boss and Seasons

- Daily boss with global leaderboard and streaks.
- Seasonal rankings that reset, so new players can compete.
- Pre-generated, verified content bank so play never waits on a model.
- Report-a-problem flow and correction workflow for bad stages.

### Phase 4: Social

- Duels on dedicated realtime infrastructure.
- Friends, challenge invites, and shared fight replays.
- Guilds or team spaces with team bosses.

### Phase 5: Your Code

- Bosses generated from a pasted snippet, failing test, or pull-request diff.
- Read-only repository connections for private team bosses.
- Privacy: private by default, explicit permissions, secret redaction, deletion controls, no training on private code.

## Metrics

### North star

Weekly players who defeat a boss they previously lost to. It captures both engagement (they came back) and learning (they got better).

### Supporting metrics

- First boss completion rate and time to first victory.
- Second fight within 24 hours; return within 7 days.
- Rematch rate and rematch win rate.
- Hint usage per stage (high usage flags a stage that is unclear or wrong).
- Explain-it scores over time per player.
- Reported-problem rate per boss and correction turnaround.

### Guardrails

Do not optimize for raw session length, streak pressure, or leaderboard grinding. If a mechanic increases play without increasing rematch wins or explanation quality, it is the wrong mechanic.

## Infrastructure Notes

- **Database:** move from local SQLite to a hosted database (Turso or Postgres) before launch; fights, XP, and leaderboards depend on it.
- **Model cost:** generate bosses ahead of time and serve them from storage; live generation stays for custom labs only.
- **Model availability:** generation uses `gpt-oss:20b` and `gpt-oss:120b`; other Ollama models need paid credits or have been retired.
- **Realtime:** duels need websockets outside Vercel functions.

## Decisions To Confirm

- Product name for the game (keep "Byte Lab", or rename for the game direction).
- Whether custom labs (today's generator) stay as a "practice range" next to the game, or fold into quests.
- XP formula weights for speed, accuracy, hints, and explanation quality.
- Whether boss tiers are gated by level or open to everyone.
- Seasonal reset length.

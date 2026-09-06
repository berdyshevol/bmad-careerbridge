# bmad-careerbridge

Sandbox: running the BMAD Method (v6.12) on the CSI 5324 team project CareerBridge for the SDLC Tool presentation (Sep 15, 2026).

- `inputs/` — copies of team docs used as input (problem statement, D0, decisions, questions)
- `_bmad/`, `.claude/skills/` — BMAD installation
- `_bmad-output/` — documents produced by BMAD agents
- `transcripts/` — saved agent dialogues per step

Experiment only. Nothing here is a team decision; nothing is copied into the team repo.

## Running CareerBridge

**Prerequisites:** Node 24, npm 11, Docker Desktop.

```bash
npm ci
cp .env.example .env
npm run db:up            # Postgres 17 in Docker, plus a disposable careerbridge_test database
npm run dev:server       # Express on :3000
npm run dev:client       # Vite on :5173, proxying /api to :3000
npm test                 # both Jest suites, server --runInBand
npm run lint             # boundary lint (below) + eslint + prettier --check
```

**Boundary lint** (`npm run lint:boundaries`, part of `npm run lint`) enforces four rules as a Node script (`scripts/check-boundaries.js`), not a shell grep, so the result is identical on macOS, Linux, and Windows:

- **ARCH-03** — `require('knex')` only under `server/src/persistence/`.
- **ARCH-06** — `fetch(` in `client/src` only inside `api.js`.
- **ARCH-14** — no `EventEmitter` / `.emit(` under `server/src` (no event bus).
- **ARCH-12** — `server/src/business/domain/*.js` modules may only `require` the allowlisted enums/errors/state-machine modules.

**Database:** PostgreSQL major **17**, pinned in exactly two places, `docker-compose.yml` and `.github/workflows/ci.yml` (ARCH-02).

**Validation:** **zod**, installed in both workspaces — one schema language usable in Express handlers and React forms alike `[ASSUMPTION]`.

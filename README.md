# bmad-careerbridge

Sandbox: running the BMAD Method (v6.12) on the CSI 5324 team project CareerBridge for the SDLC Tool presentation (Sep 15, 2026).

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

**Port 5432 already in use?** `docker-compose.yml` binds Postgres to `127.0.0.1:${POSTGRES_HOST_PORT:-5432}`. Pick a different host port and point the app at it:

```bash
POSTGRES_HOST_PORT=55432 npm run db:up
# then set in .env: DATABASE_URL=postgres://careerbridge:careerbridge@localhost:55432/careerbridge
```

`docker compose` automatically loads `POSTGRES_HOST_PORT` from a `.env` file in the repo root (same directory as `docker-compose.yml`), so `cp .env.example .env` and editing that one value works too — no need to export it on the command line each time.

**Validation:** **zod**, installed in both workspaces — one schema language usable in Express handlers and React forms alike `[ASSUMPTION]`.

## Verdict

**APPROVE WITH FIXES**

All five ACs are met and independently reproduced (lint, both Jest suites, the CI-must-fail-loudly path, all four boundary probes, Story 1.2's 268 tests untouched). Docker itself could not be exercised in this sandbox (`docker compose ps` returns no rows, no daemon reachable) — CI workflow and `docker-compose.yml` are reviewed statically. A handful of concrete, low-effort fixes remain (mostly already known to the spec's own review log); none blocks approval.

## AC check

| AC | Status | Evidence |
|---|---|---|
| 1. Fresh clone: `docker compose up -d && npm ci && npm test` exits 0; lint fails on the three greps | **Met** (lint/test proven; Docker itself unexercised here) | `npm run lint` → `boundaries OK (4 rules)`, prettier clean, exit 0. `npm test` → server 271 passed/1 skipped, client 1 passed. `docker compose ps` returns empty header only (no daemon/containers in this sandbox) — could not independently start Postgres; `docker-compose.yml` statically matches spec (postgres:17-alpine, healthcheck, named volume, initdb mount). |
| 2. `server/src/config.js` sole S11 reader; missing required vars fail fast; one pino logger with request logging | **Met** | `server/src/config.js:22,26-28` (`REQUIRED`, `assertRequired` → `MissingConfigError`); one `pino({...})` at line 50; `server/src/presentation/app.js:14` `pinoHttp({logger})`. `grep -rn "process\.env" server/src \| grep -v src/config.js` → two files only: `config.test.js` (whitebox test of config.js itself) and `health.test.js:5` (`DB_AVAILABLE`, a Jest harness signal, not an S11 name) — both already disclosed in the spec's Implementation Notes. |
| 3. CI runs lint, migrate up/rollback-all/up, both suites on Postgres 17, server `--runInBand` | **Met** | `.github/workflows/ci.yml` steps in exact order: checkout → setup-node(24) → `npm ci` → `npm run lint` → `migrate:latest -w server` → `migrate:rollback -w server` → `migrate:latest -w server` → `npm test`; service `postgres:17`; `server/package.json:8` `"test": "jest --runInBand"`. Independently confirmed the "never vacuously green" claim: `CI=true DATABASE_URL=postgres://x:y@localhost:1/none npm test -w server` exits 1 (globalSetup throws) rather than skipping. |
| 4. Vite dev proxy: `/api/health` → Express :3000 → `{status:"ok"}` | **Met** (static review; not run live here) | `client/vite.config.js` `server.proxy['/api'] = { target: 'http://localhost:3000', changeOrigin: false }`; `server/src/presentation/app.js:17-25` implements the route. Spec's Implementation Notes record a live `curl` against both dev servers returning `200 {"status":"ok"}`; not re-run in this review (would require backgrounding two dev servers). |
| 5. One validation library (zod) installed both workspaces, named in README with rationale | **Met** | `server/package.json` `"zod": "^4"`; `client/package.json` `"zod": "^4"`; `README.md` last line: "**Validation:** **zod** … `[ASSUMPTION]`." |

## Must fix

None. No blocking defects found.

## Should fix

1. **`.prettierignore`'s Story-1.2 carve-out isn't mirrored in `eslint.config.js`'s main `ignores` for the errors files** — actually checked: `eslint.config.js:26-29` *does* list `server/src/business/errors.js`, `errors.test.js`, `server/src/business/domain/**`. This matches `.prettierignore`. No action needed (verified while checking review-triage item #4 — already resolved in the working tree).
2. **`PORT`/`SESSION_IDLE_HOURS`/`RESUME_MAX_BYTES` numeric parsing** (`server/src/config.js:36-46`) throws on a non-numeric value — good — but an out-of-range value (e.g. `PORT=-1` or `PORT=99999`) is still accepted silently. Low risk for a course project; worth a one-line range check if a future story tightens this.
3. **Vite proxy `changeOrigin: false`** (`client/vite.config.js:11`) — harmless in this single-origin dev setup since Express doesn't inspect `Host` yet, but if a later story's session/CSRF code starts trusting the `Host`/`Origin` header (ARCH-09/S12), the proxy should switch to `changeOrigin: true` or the mismatch could produce confusing dev-only bugs. Flag for Story 1.5 (session/CSRF), not this story.
4. **`docker-compose.yml` healthcheck has no explicit `timeout`** while `ci.yml`'s otherwise-equivalent service sets `--health-timeout 5s`. The spec's own review log (item #10) calls this a non-promise, and it's true no consistency claim is broken — but a slow-starting local Postgres could still hang `pg_isready` past a sensible bound. Low priority, two-line fix if it ever bites.
5. **`deferred-work.md`'s second entry** (no fixture tests for `check-boundaries.js`'s four rules) is correctly filed as `defer`, not silently dropped — confirmed present and worded consistently with the spec's Review Triage Log row #6. No action needed now; carries forward correctly.

## Nits

1. `server/src/persistence/db.js:10` exports `pool` with no current consumer — deliberately forward-provisioned for Story 1.5's `connect-pg-simple` per the spec's own Code Map; harmless today, flagging only so a future "unused export" lint rule doesn't get tempted to remove it.
2. `package.json:9` `"engines": {"node": ">=24"}` (already corrected from the review log's ">=22" finding #8) — consistent with README/CI's Node 24. No action.
3. `server/README.md`'s last line already points at the root README and `npm run lint:boundaries` (Design Note C5 applied) — confirmed, no stray manual-grep instruction remains.
4. Root `package.json` carries an `"allowScripts"` block (esbuild/@parcel/watcher/unrs-resolver/fsevents) that the spec discloses as a sandbox-only artifact of this environment's npm wrapper — harmless, but worth a mental note that a teammate's machine won't reproduce it and shouldn't need to.

## Command outputs

```
$ npm run lint
boundaries OK (4 rules)
Checking formatting...
All matched files use Prettier code style!
exit=0

$ npm test   (no Docker; DB skip path)
Test Suites: 6 passed, 6 total
Tests:       1 skipped, 271 passed, 272 total
> careerbridge-client test: Tests: 1 passed, 1 total

$ DATABASE_URL= npm test -w server
SKIP NFR-7 database tests: no reachable Postgres at localhost:5432. ...
Test Suites: 6 passed, 6 total
Tests:       1 skipped, 271 passed, 272 total

$ CI=true DATABASE_URL=postgres://x:y@localhost:1/none npm test -w server
Database probe failed in CI (host: localhost:1); refusing to run a vacuously green suite: ...
npm error command failed (exit 1)   <-- CI never goes vacuously green, confirmed

$ git diff 486f8a3 -- server/src/business/domain server/src/business/errors.js
(empty)   <-- Story 1.2's files untouched

$ docker compose ps
NAME  IMAGE  COMMAND  SERVICE  CREATED  STATUS  PORTS   <-- header only, no daemon/containers reachable in this sandbox
```

## Boundary probes

| Rule | Probe file | Lint output line |
|---|---|---|
| ARCH-03 (`require('knex')` outside `persistence/`) | `server/src/business/tmp.js` = `require('knex');` | `server/src/business/tmp.js:1: ARCH-03 require('knex') is only allowed under server/src/persistence/` |
| ARCH-06 (`fetch(` in `client/src` outside `api.js`) | `client/src/tmp.js` = `fetch('/api');` | `client/src/tmp.js:1: ARCH-06 fetch( is only allowed in client/src/api.js` |
| ARCH-14 (no `EventEmitter`/`.emit(` under `server/src`) | `server/src/tmp.js` = `const {EventEmitter}=require('events');` | `server/src/tmp.js:1: ARCH-14 no event bus: EventEmitter / .emit( is not allowed under server/src` |
| ARCH-12 (`business/domain/*.js` allowlist) | prepended `require('../../persistence/db');` to `server/src/business/domain/postingStatus.js`, reverted after capture | `server/src/business/domain/postingStatus.js:2: ARCH-12 business/domain modules may only require ./enums, ../errors, ./postingStatus, ./applicationStage (found '../../persistence/db')` |

All four throwaway files/edits were deleted/reverted immediately after capture; `git status --short` and `git diff` on the affected file were confirmed empty afterward.

## Review closure

| # | Item | Disposition | Reason |
|---|---|---|---|
| Should fix 1 | `.prettierignore`/`eslint.config.js` Story-1.2 carve-out mismatch | Skipped | Review's own text says already resolved in the working tree; no mismatch exists (`eslint.config.js:26-29` already lists the same files). |
| Should fix 2 | `PORT`/`SESSION_IDLE_HOURS`/`RESUME_MAX_BYTES` accept out-of-range values silently | Fixed | `server/src/config.js`: `parseNumericEnv` now takes an optional `{ min, max }` and throws `"<NAME> must be between <min> and <max>, got <value>"` when violated. Applied `PORT` (1–65535), `SESSION_IDLE_HOURS` (min 1), `RESUME_MAX_BYTES` (min 1). |
| Should fix 3 | Vite proxy `changeOrigin: false` could bite once Host/Origin is trusted (S12/ARCH-09) | Skipped | Review explicitly flags this for Story 1.5 (session/CSRF), not Story 1.1; no change made here. |
| Should fix 4 | `docker-compose.yml` healthcheck has no explicit `timeout`, unlike `ci.yml`'s `--health-timeout 5s` | Fixed | Added `timeout: 5s` to the `db` service healthcheck in `docker-compose.yml`, matching CI. |
| Should fix 5 | `deferred-work.md`'s "no fixture tests for `check-boundaries.js`" entry | Skipped | Review confirms it is already correctly filed as `defer` and worded consistently; no action needed. |
| Nit 1 | `server/src/persistence/db.js` exports unused `pool` | Skipped | Deliberate forward-provisioning for Story 1.5, per review. |
| Nit 2 | `package.json` engines Node version | Skipped | Already correct (`>=24`), per review. |
| Nit 3 | `server/README.md` last line / boundary-lint pointer | Skipped | Already correct, per review. |
| Nit 4 | Root `package.json` `allowScripts` sandbox artifact | Skipped | Informational only — mental note, not a code change, per review. |
| Maintainer fix | `docker-compose.yml` host port now `'127.0.0.1:${POSTGRES_HOST_PORT:-5432}:5432'` | Fixed (documented) | Added `POSTGRES_HOST_PORT=5432` (with a one-line comment) to `.env.example`; added a "Port 5432 already in use?" note to `README.md` with the `POSTGRES_HOST_PORT=55432 npm run db:up` / `DATABASE_URL` override and a note that `docker compose` auto-loads `.env` from the repo root for this substitution. |

**Verification:** `npm run lint` → exit 0. `DATABASE_URL=postgres://careerbridge:careerbridge@localhost:55432/careerbridge_test npm test` → server 272/272 passed (0 skipped), client 1/1 passed. `DATABASE_URL= npm test -w server` → 271 passed, 1 skipped (expected DB-less path). Story 1.2's `server/src/business/domain/**` and `errors.js`/`errors.test.js` confirmed untouched (`git diff --stat` empty).

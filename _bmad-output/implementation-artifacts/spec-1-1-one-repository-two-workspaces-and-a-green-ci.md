---
title: 'Story 1.1: One repository, two workspaces, and a green CI'
type: 'feature'
created: '2026-09-06'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '03e1aa4b667b59002e0af032d9b908091b3641aa'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/plan-1-1.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/ARCHITECTURE-SPINE.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/SHAPES.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository holds only Story 1.2's pure business modules. There is no workspace root, no database, no lint, no runnable server or client, and no CI — so every use-case branch in Epics 2–16 would invent its own toolchain and a red build would only be found at review time.

**Approach:** Land the skeleton Story 1.1 names: an npm-workspaces root over `server/` and `client/`, Docker Compose Postgres pinned to major 17 with a disposable test database, ESLint 9 flat config + Prettier + a Node boundary-check script that turns the ARCH-03 / ARCH-06 / ARCH-14 greps **and** the ARCH-12 grep deferred by `deferred-work.md` into lint failures, `server/src/config.js` as the sole reader of `process.env` with one pino logger, a knexfile over an empty (no-op) migrations directory, a two-layer `GET /api/health`, a plain-JS Vite + React 19 client proxying `/api`, Jest on both sides, and a GitHub Actions workflow running S14's step list on every push. `_bmad-output/implementation-artifacts/plan-1-1.md` is the file-by-file authority; the corrections in Design Notes override it where they disagree.

## Boundaries & Constraints

**Always:** Plain JavaScript, never TypeScript. Server is CommonJS; client is ESM. `server/src/config.js` is the only file under `server/src/` that reads `process.env`; `client/src/config.js` the only file that touches `import.meta.env` (ARCH-16, S11, ARCH-22). `require('knex')` only under `server/src/persistence/` (ARCH-03). Layer flow presentation → business → persistence only (NFR-11). Postgres major **17** in exactly two places: `docker-compose.yml` and `.github/workflows/ci.yml` (ARCH-02). Root `npm test` runs both suites and CI runs exactly that (ARCH-05); server suite runs `--runInBand` (S16). Validation library is **zod**, installed in both workspaces and named in `README.md` with a one-line rationale.

**Never:** Do not modify `server/src/business/errors.js` or anything under `server/src/business/domain/` — Story 1.2's 268 tests must stay green at every commit. Do not create any file listed in another story's Touches: no tables/migrations/seeds/`testSupport.js`/`factories.js` (1.3); no `withTransaction`, repositories, `presentation/errors.js`, `/api` 404 envelope (1.4); no express-session, bcrypt, guards, scope routers (1.5); no MUI, React Router, TanStack Query, `api.js`, `useAuth` (1.7); no `Dockerfile`, `render.yaml`, static `client/dist` serving, `backup.sh` (1.9); no issue/PR templates or branch protection (1.10). No deploy step in CI. Do not push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Health, database up | `GET /api/health`, Postgres reachable | `200` and body `{ "status": "ok" }` after `SELECT 1` | N/A |
| Health, database down | `GET /api/health`, `persistence/db.ping()` rejects | non-200 (Express 5 default handler; no stack in body) | rejection propagates from the async handler |
| Health through Vite | `GET http://localhost:5173/api/health` with both dev servers up | proxied to Express on 3000, `200` `{ "status": "ok" }` | N/A |
| Boundary lint, clean tree | `npm run lint` | `boundaries OK (4 rules)`, then eslint and prettier, exit 0 | N/A |
| Boundary lint, violation | `require('knex')` outside `persistence/`; `fetch(` in `client/src` outside `api.js`; `EventEmitter`/`.emit(` in `server/src`; a `business/domain/*.js` require outside its allowlist | one `path:line: ARCH-nn <message>` per hit, exit 1 | N/A |
| Missing required config | `DATABASE_URL` or `SESSION_SECRET` unset at boot | process exits non-zero before anything connects | `MissingConfigError: Missing required environment variables: …` naming each missing name |
| Fresh clone, no `.env`, Docker up | `docker compose up -d && npm ci && npm test` | both suites run, database health test **runs** (not skipped), exit 0 | test-only defaults from `server/test/globalSetup.js` |
| Fresh clone, no Docker | `npm ci && npm test` | database health test skips with a one-line warning; suites exit 0 | probe failure sets `DB_AVAILABLE=false` |
| CI, database unreachable | `CI=true` and the probe fails | `globalSetup` throws; the run is red | never a vacuous green |

</frozen-after-approval>

## Code Map

- `_bmad-output/implementation-artifacts/plan-1-1.md` -- file-by-file authority: §2 lists all 27 files with their exact contents, §3 the command order, §4 the tests, §5 the definition of done, §6 risks R1–R9, §7 the commit list. Read §2 before writing each file.
- `server/package.json` -- exists: name `careerbridge-server`, private, CommonJS, inline `"jest"` block, only `jest@^30`. Rewrite per plan item 9; the inline jest block moves to `server/jest.config.js`.
- `server/package-lock.json` -- exists (162 KB). **Delete**: the workspace root lock replaces it (ARCH-05). Current `server/package.json` pins `jest@^30.5.1`; the root `package.json`'s `jest@^30` devDependency must resolve to the same major (30) so `cd server && npx jest` keeps finding a compatible Jest and Story 1.2's 268 tests are unaffected by the lock-file change.
- `server/README.md` -- exists. Its last line documents the ARCH-12 boundary as a manual `grep`; replace it with `npm run lint:boundaries` and add a pointer to the root README.
- `server/src/business/errors.js`, `server/src/business/domain/{enums,postingStatus,applicationStage}.js` + their `.test.js` -- Story 1.2, **do not touch**. Confirmed imports: only `./enums` and `../errors`; these plus `./postingStatus` and `./applicationStage` are the ARCH-12 allowlist.
- `.gitignore` -- exists with `node_modules/`, `.next/`, `.DS_Store`. Append `.env`, `.env.local`, `coverage/`, `client/dist/`, `backups/`.
- `README.md` -- exists (sandbox description). Append a "Running CareerBridge" section; keep the existing text.
- `_bmad/`, `_bmad-output/`, `inputs/`, `transcripts/`, `.claude/` -- BMAD installation and course inputs, not our source. Must be ignored by ESLint and Prettier.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- the ARCH-12 lint entry lands here; mark it done in this story's Implementation Notes.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- key `1-1-one-repository-two-workspaces-and-a-green-ci`, currently `backlog`.

## Tasks & Acceptance

**Execution — commit A (root, tooling, boundaries):**
- [x] `package.json` (new, root) -- workspaces `server`/`client`, the script set from plan item 1, eslint/prettier devDependencies -- ARCH-05
- [x] `.gitignore` -- append the five entries above -- keep secrets and build output out
- [x] `.env.example` (new) -- every S11 name with a dev-safe value -- S11
- [x] `docker-compose.yml` (new) + `docker/initdb/01-create-test-db.sql` (new) -- `postgres:17-alpine`, healthcheck, named volume; init script creates `careerbridge_test` -- ARCH-02, S16
- [x] `scripts/check-boundaries.js` (new) -- four rules (ARCH-03, ARCH-06, ARCH-14, ARCH-12) with the exact regexes and path exclusions of plan item 6 -- closes the `deferred-work.md` entry
- [x] `eslint.config.js`, `.prettierrc.json`, `.prettierignore` (new) -- flat config per plan item 7; ignore lists must cover `_bmad/`, `_bmad-output/`, `inputs/`, `transcripts/`, `.claude/`, `client/dist/`, `coverage/`, `**/node_modules/`

**Execution — commit B (server):**
- [x] `server/package.json` -- rewrite per plan item 9; delete `server/package-lock.json`
- [x] `server/knexfile.js`, `server/src/data/migrations/.gitkeep`, `server/src/data/seeds/.gitkeep` -- knexfile reads the URL from `./src/config`, never `process.env` -- ARCH-02, ARCH-20
- [x] `server/src/config.js` -- sole `process.env` reader, frozen export, `MissingConfigError`, one pino `logger` -- S11, ARCH-16, S14
- [x] `server/src/persistence/db.js` -- the only `require('knex')`; exports `db`, `pool`, `ping()`; **no** `withTransaction` -- ARCH-03
- [x] `server/src/business/system/checkHealth.js` -- S8 signature `async (actor, input)`, calls `ping()`, returns `{ status: 'ok' }` -- keeps NFR-11's one-way flow
- [x] `server/src/presentation/app.js`, `server/src/index.js` -- health route only, `trust proxy`, `pino-http`, `express.json`; `index.js` requires config first, then listens -- ARCH-09, S10
- [x] `server/jest.config.js`, `server/test/globalSetup.js` -- test-only env defaults, one probe, `DB_AVAILABLE`, throw when `CI=true` and the probe fails -- see Design Notes C1
- [x] `server/src/presentation/routes/health.test.js` -- the two NFR-7 tests of plan §4 with the `describeDb` skip rule
- [x] `server/README.md` -- swap the manual ARCH-12 grep line for `npm run lint:boundaries`; point at the root README

**Execution — commit C (client):**
- [x] `client/package.json`, `client/vite.config.js`, `client/babel.config.js`, `client/jest.config.js`, `client/index.html` -- written by hand, not scaffolded (Design Notes C4); `/api` proxy to port 3000 -- ARCH-09, ARCH-22
- [x] `client/src/{config.js,main.jsx,App.jsx,setupTests.js,testMocks/config.js,testMocks/fileStub.js}` -- `config.js` is the only `import.meta.env` reader and is mapped to the test mock; `App.jsx` has one `<h1>CareerBridge</h1>` and no `fetch(`
- [x] `client/src/App.test.jsx` -- `ARCH-22 App renders without crashing`
- [x] `README.md` (root) -- "Running CareerBridge": prerequisites, `npm ci`, `cp .env.example .env`, `npm run db:up`, dev commands, `npm test`, `npm run lint`, the four boundary rules, Postgres 17, and the one-line zod rationale

**Execution — commit D (CI):**
- [x] `.github/workflows/ci.yml` -- `on: [push, pull_request]`, Postgres 17 service container, steps in S14 order: lint → `migrate:latest` → `migrate:rollback --all` → `migrate:latest` → `npm test`; no deploy -- NFR-10, S14

**Acceptance Criteria:**
- Given a fresh clone with Docker running, when `docker compose up -d && npm ci && npm test` runs at the root, then Postgres 17 starts, both Jest suites run including the NFR-7 database test, and the run exits 0.
- Given any of the four boundary violations, when `npm run lint` runs, then it exits 1 naming the file, line, and ARCH id; on a clean tree it exits 0.
- Given `DATABASE_URL` or `SESSION_SECRET` unset, when `node server/src/index.js` starts, then it exits non-zero with `MissingConfigError` naming the missing variables, and `grep -rn "process\.env" server/src | grep -v src/config.js` prints nothing.
- Given the server running in the foreground, when `/api/health` is requested, then one structured pino JSON line reaches stdout with no cookie or password fields.
- Given a pushed branch, when CI runs, then the log shows lint, `migrate:latest`, `migrate:rollback --all`, `migrate:latest`, both suites against Postgres 17, and the server step running `--runInBand`.
- Given both dev servers, when the client requests `/api/health`, then Vite proxies to Express on 3000 and returns `{ "status": "ok" }` with 200.
- Given the completed story, when `cd server && npx jest` runs, then Story 1.2's 268 tests still pass.

## Implementation Notes

All 27 files from `plan-1-1.md` §2 landed, plus the five Design Notes corrections (C1–C5). `npm install` produced one root `package-lock.json`; both workspaces are linked; `server/package-lock.json` was deleted (C3).

**Four negative lint probes (plan §5 rows 2–5), verbatim `npm run lint` output, each reverted immediately after capture — none of the four throwaway edits reached a commit:**

1. `printf "require('knex');\n" > server/src/business/tmp.js && npm run lint`
   `server/src/business/tmp.js:1: ARCH-03 require('knex') is only allowed under server/src/persistence/` — exit 1.
2. `printf "fetch('/api');\n" > client/src/tmp.js && npm run lint`
   `client/src/tmp.js:1: ARCH-06 fetch( is only allowed in client/src/api.js` — exit 1.
3. `printf "const {EventEmitter}=require('events');\n" > server/src/tmp.js && npm run lint`
   `server/src/tmp.js:1: ARCH-14 no event bus: EventEmitter / .emit( is not allowed under server/src` — exit 1.
4. Prepending `require('../../persistence/db');` to `server/src/business/domain/postingStatus.js`, then `npm run lint`:
   `server/src/business/domain/postingStatus.js:1: ARCH-12 business/domain modules may only require ./enums, ../errors, ./postingStatus, ./applicationStage (found '../../persistence/db')` — exit 1. File restored byte-for-byte afterward (`diff` confirmed clean).

On a clean tree, `npm run lint` prints `boundaries OK (4 rules)` then eslint and prettier clean, exit 0.

**Two implementation issues found and fixed beyond the plan's literal text (neither is in Design Notes C1–C5, both are corrections the plan's author could not have anticipated without running the code):**

1. **ESLint flat-config scoping.** The plan's single "server = node/commonjs, client = browser/module" split left root-level and client-side CommonJS tooling files (`eslint.config.js`, `scripts/check-boundaries.js`, `client/babel.config.js`, `client/jest.config.js`, `client/src/setupTests.js`, `client/src/testMocks/**`) with no `commonjs`/`node` globals, and `client/vite.config.js` (ESM, but not under `client/src/`) with none at all — both failed `eslint .` with `no-undef` on `require`/`module`/`process`/`__dirname`. Fixed by adding two explicit file groups (`nodeCommonJsFiles`, `nodeEsmFiles`) in `eslint.config.js` ahead of the `client/src/**` browser block, and scoping that browser block's `ignores` to exclude the CJS test-support files under `client/src/`. Also added `'no-unused-vars': ['error', { args: 'none' }]` globally: the S8 use-case signature `(actor, input)` is fixed even when a use case does not need one of the two.
2. **`moduleNameMapper` regex collided with a real dependency.** The plan's exact regex `^(?:\.{1,2}/)+config$` (R4) redirects **every** `require('./config')`/`require('../config')` in the whole module graph to `client/src/testMocks/config.js` — including `@testing-library/dom`'s own internal `./config` submodule, which `@testing-library/react` requires during `render()`. Symptom: `TypeError: (0, _dom.configure) is not a function`, because RTL's real `@testing-library/dom` config module was silently replaced by our client mock. `moduleNameMapper` matches the literal specifier text with no knowledge of which file is requiring it, so no regex on `./config` alone can distinguish "our config" from "their config". Fixed by requiring an explicit `.js` suffix in both the regex (`^(?:\.{1,2}/)+config\.js$`) and our own import (`client/src/App.jsx` now does `import { API_BASE_URL } from './config.js'`) — `@testing-library/dom` requires `./config` without an extension, so the two no longer collide. `client/src/App.test.jsx` and the full `npm test` were re-verified green after the fix.

**Other deviations, both environment-driven, not story-driven:**
- This sandbox's npm wraps installs with a script allowlist; `esbuild`, `@parcel/watcher`, `unrs-resolver`, and `fsevents` needed `npm install-scripts approve <pkg>` before `npm install` would run their install scripts (Vite/esbuild need this to fetch their native binary). This added an `"allowScripts"` block to the root `package.json`, harmless and not part of the story's file list but required for `npm ci`/`npm install` to work in this environment; a teammate's machine without that npm wrapper will not see it re-triggered.
- `dotenv@17` prints a one-line startup banner by default; silenced with `config({ quiet: true })` in `server/src/config.js` so it never lands on stdout ahead of the pino JSON request logs (AC: "one structured pino JSON line").

**Known, accepted exception to the literal `process.env` grep AC.** `grep -rn "process\.env" server/src | grep -v src/config.js` prints one line: `server/src/presentation/routes/health.test.js:5:const hasDb = process.env.DB_AVAILABLE === 'true';` — this is plan §4's skip-rule code, required verbatim, reading a Jest-only harness signal (`DB_AVAILABLE`, set by `server/test/globalSetup.js`) rather than an S11 configuration value. The same rationale Design Note C1 gives for `globalSetup.js` living outside `server/src/` applies to this line living inside it: it is test wiring, not application config, and `server/src/config.js` remains the only reader of the ten S11 names. Flagging rather than silently resolving, since the AC's grep is stated without this carve-out.

**Verification performed (see spec's Verification section for the full command list):**
- `npm install` — one root lock, both workspaces linked, exit 0.
- `npm run lint` — clean tree exits 0 with `boundaries OK (4 rules)`; all four negative probes captured above.
- `npm test` (root, no Docker) — server suite `--runInBand`, NFR-7 database `describe` block skipped with the one-line warning (`DB_AVAILABLE=false`), mocked-failure health test and all 268 Story 1.2 tests pass (270 total, 1 skipped); client suite (RTL) passes 1/1.
- `cd server && npx jest` — 269 passed, 1 skipped (268 Story 1.2 tests are unaffected).
- `grep -rn "process\.env" server/src | grep -v src/config.js` — one line, the accepted exception above.
- `DATABASE_URL= SESSION_SECRET= node server/src/index.js` (from `server/`) — exit 1, stderr `MissingConfigError: Missing required environment variables: DATABASE_URL, SESSION_SECRET`.
- Everything that does not require a live database is green: lint (clean tree + all four negative probes), both Jest suites with the NFR-7 database block correctly skipping (and printing the one-line warning) when `DB_AVAILABLE=false`, and the fail-fast `MissingConfigError` check.
- **Docker itself is network-blocked in this sandbox — confirmed independently, not just by the implementation subagent.** `docker compose up -d` and bare `docker pull postgres:17-alpine` both hang and time out (`docker pull` exit 124 after 15s with zero progress past "Pulling fs layer"), while `docker info` and unrelated pre-cached images (`public.ecr.aws/...`) work fine — this sandbox's Docker Desktop VM cannot reach `registry-1.docker.io` specifically. `docker compose config` was used instead to confirm `docker-compose.yml` parses correctly and matches the spec (`postgres:17-alpine`, healthcheck, named volume, `docker/initdb` mount). All stray `docker pull`/`docker compose` processes were killed; no containers were left running.
- **Live-database verification was still completed, against real PostgreSQL 17 via the Homebrew `postgresql@17` service (temporary role `careerbridge` + database `careerbridge_test` on port 5433) since Docker could not reach a registry.** This is the same major version pinned in `docker-compose.yml`/`ci.yml`, exercising the same `knexfile.js`/`persistence/db.js` code paths a Docker-based Postgres would: `cd server && DATABASE_URL=postgres://careerbridge:careerbridge@localhost:5433/careerbridge_test SESSION_SECRET=test-secret npx jest --runInBand` — **270 passed, 0 skipped**, the NFR-7 `SELECT 1` test actually running (not skipped); `npx knex migrate:latest` → `Already up to date`, `npx knex migrate:rollback --all` → `Already at the base migration`, `npx knex migrate:latest` → `Already up to date` (empty migrations directory, so no-op is correct); root `npm test` with the same `DATABASE_URL` — both suites green, server suite 270/270; `npm run dev:server` + `npm run dev:client` + `curl -s http://localhost:5173/api/health` — `{"status":"ok"}`, `HTTP_STATUS:200`, and one structured pino JSON request line on stdout with no cookie/password fields. The Homebrew role/database and service were torn down afterward (`dropdb`, `DROP ROLE`, `brew services stop postgresql@17`) so `postgresql@14` (the machine's pre-existing service) is the only one still running, matching the pre-task state.
- **Residual, environment-only gap:** the Docker container path itself (image pull, `docker-entrypoint-initdb.d` running `01-create-test-db.sql`, the `healthcheck`, and the exact `ubuntu-latest` + `postgres:17` GitHub Actions service container) was not executed end-to-end anywhere — only validated statically (`docker compose config`) plus the equivalent behavior against a non-Docker Postgres 17. This should be confirmed once on a machine/CI runner where Docker can reach a registry (very likely to pass — it is the same `knex`/`pg` code, same major version, already proven live) but is not, in my judgment, a reason to withhold this story: the acceptance criteria are about the application's behavior against Postgres 17, and that behavior is now verified live, not just read from source.

**Independent orchestrator verification (separate from the implementation subagent's own checks above):** re-ran `npm run lint`, all four negative boundary probes, the `MissingConfigError` fail-fast check, and the full `npm test` myself against the delivered tree — all matched the subagent's report. Independently reproduced the Docker registry block (`timeout 20 docker pull postgres:17-alpine` → exit 124) rather than trusting the subagent's account, then independently stood up, exercised, and tore down the same Homebrew Postgres 17 / port 5433 setup (270/270 server tests, migrate round-trip, `npm run dev:server`/`dev:client` + Vite proxy curl, all confirmed personally).

**Review round (three layers: Blind Hunter, Edge Case Hunter, Verification Gap — see Review Triage Log below).** 22 findings triaged: 10 routed to `patch`, 1 to `defer` (added to `deferred-work.md`), 11 rejected as `false` after verification (several because they were already deliberate, documented decisions in the plan/spec — forward-provisioned `pool`, `trust proxy` ahead of its consumer, the literal scope of ARCH-03/14, etc.). One patch finding was verified empirically, not just by inspection: an unhandled `checkHealth()` rejection was falling through to Express 5's default error handler, which returns the full stack trace in the response body whenever `NODE_ENV` isn't `production` — reachable today in dev/test/CI, and a direct contradiction of the frozen I/O matrix's "no stack in body" row. Fixed with a route-local try/catch returning `503 { status: 'error' }`; re-verified empirically after the fix (confirmed `503`, `application/json`, `{"status":"error"}`, no stack). All ten patches applied by the same implementation subagent, then independently re-verified by the orchestrator: `npm run lint` and `npm test` clean, the `.js`-extension ARCH-12 case no longer false-positives while a real violation still fires, `PORT=abc` now throws and `PORT=0` is now respected instead of silently defaulting.

## Spec Change Log

## Review Triage Log

Three layers ran on the diff (`baseline_commit` → working tree): Blind Hunter, Edge Case Hunter, Verification Gap. Findings with the same root cause across layers are merged into one row.

| # | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|
| 1 | `scripts/check-boundaries.js`'s `SKIP_DIRS` omits `_bmad`, `_bmad-output`, `inputs`, `transcripts`, `.claude` (only `.prettierignore`/`eslint.config.js` skip them) | low | Verified: `SKIP_DIRS = new Set(['node_modules','dist','.git','coverage'])`. All four rules gate on `server/src/`/`client/src/` path prefixes, so this cannot produce a false positive, but `du -sh` shows 13 MB / 379 files under those trees today (`transcripts/` alone 9.7 MB and growing every build session) that `npm run lint` needlessly reads and splits into lines on every run. | patch |
| 2 | Every boundary rule matches one physical line at a time, so a deliberately multi-line `require(\n'knex'\n)` evades ARCH-03/06/12/14 | low | Verified by code reading (`lines.forEach(... regex.test(line))`). Requires deliberate reformatting Prettier would never produce on its own (`require('knex');` is far under `printWidth`); ARCH-21's mandatory non-author review is the backstop. A robust fix needs source-level (not line-level) matching or an AST, which the plan's Design Notes R3 explicitly traded away for a simple, cross-platform script. | reject — low likelihood in everyday use, fix is disproportionate to the deliberate simplicity tradeoff already recorded in R3 |
| 3 | ARCH-12's allowlist is a literal string compare, so a legal `require('./enums.js')` (explicit extension) would be wrongly flagged | low | Verified: `ARCH12_ALLOWLIST.includes(target)` with no normalization. No current file uses an extension, but the check would misfire if one ever did. | patch |
| 4 | `eslint.config.js`'s `ignores` doesn't mirror `.prettierignore`'s carve-out of Story 1.2's frozen files | low | Verified: `.prettierignore` lists `server/src/business/errors.js`, `errors.test.js`, `server/src/business/domain/`; `eslint.config.js`'s `ignores` array has no matching entries. Today's ruleset happens to pass on those files untouched, but a future stricter ESLint config could force an edit to files this story promises never to touch. | patch |
| 5 | No automated test for `config.js`'s fail-fast `MissingConfigError` path | medium | Pre-verified by the verification-gap layer (its evidence rules require it to run the searches it cites): `grep -rn MissingConfigError` finds only the definition and prose describing a *manual* shell check; `server/test/globalSetup.js` always sets both `DATABASE_URL`/`SESSION_SECRET` before any test loads `config.js`, so `assertRequired`'s `missing.length > 0` branch is unreachable by the whole automated suite. A regression that silently disabled this AC-documented behavior would ship green. | patch |
| 6 | No fixture test proves `check-boundaries.js`'s four rules actually fire on a violation | medium (unverified severity per the layer's own disposition) | Pre-verified by the verification-gap layer; filed disposition `defer` — "guard-rail hardening for a brand-new dev tool," and the spec's own Verification section already designed one-off manual probes (captured in Implementation Notes) rather than permanent fixtures for this exact rule. Honoring that filed disposition. | defer |
| 7 | `server/src/presentation/routes/health.test.js` lives in a `routes/` directory with no corresponding `routes/health.js` — the route is defined inline in `app.js` | — | Checked: this exact path is specified verbatim in both `plan-1-1.md` §4 and this spec's Tasks list; Design Notes R2 deliberately keeps the health route inline in `app.js` rather than spending the one sanctioned presentation→persistence import on a separate route module. No functional harm; matches explicit intent. | false — matches the frozen plan/spec's own directive |
| 8 | Root `package.json`'s `engines.node` says `">=22"` while the README, CI, and this story's stated environment all use Node 24 | low | Verified: `package.json:9` `"node": ">=22"`; nothing in this story exercises or verifies Node 22–23. Purely advisory (`npm ci` won't fail on it) but overstates what's actually tested. | patch |
| 9 | `persistence/db.js` exports `pool` but nothing in this diff imports it | — | Checked against the spec's own Code Map: "`pool` (`db.client.pool`, used by connect-pg-simple in 1.5)" — explicitly forward-provisioned for Story 1.5, not an accidental unused export. | false — documented, deliberate forward-provisioning |
| 10 | `docker-compose.yml`'s healthcheck has no `timeout` while `ci.yml`'s otherwise-equivalent Postgres service sets `--health-timeout 5s` | — | Checked: the README's "pinned in exactly two places" claim is stated about the Postgres **major version** only, not healthcheck timing parity. No consistency promise was broken. | false — claim reads a promise into the README that isn't there |
| 11 | `app.set('trust proxy', 1)` is set unconditionally before any real reverse proxy exists (Story 1.9) | — | Checked: no code in this diff reads `req.ip`/`X-Forwarded-For` for any security decision yet (health route ignores it entirely); rate limiting and session mechanics that would consume it are Story 1.5. Matches SHAPES S12's explicit directive to set this now. No exploitable behavior exists at this location today. | false — no consumer of the trusted value exists yet |
| 12 | `Number(process.env.X) \|\| default` in `config.js` silently replaces an explicit `"0"` or a malformed value (e.g. `PORT=abc`) with the default, for `sessionIdleHours`, `resumeMaxBytes`, and `port` | low | Verified by code reading; flagged independently by both Blind Hunter and Edge Case Hunter. Only `port` is actually consumed by this story's code (`index.js`'s `app.listen`); a malformed/zero `PORT` silently becomes 3000 instead of surfacing the mistake, inconsistent with the fail-fast treatment given to `DATABASE_URL`/`SESSION_SECRET` two lines above in the same file. | patch |
| 13 | The `Implementation Notes`' own disclosed exception (`health.test.js:5`'s `process.env.DB_AVAILABLE` read) to the literal `grep -rn "process\.env"` AC "should be tracked explicitly" | — | Checked: it already is — disclosed in prose with the same rationale as the established `globalSetup.js` precedent (Design Notes C1). No concrete alternative implementation was proposed. | false — already adequately disclosed, no actionable code change identified |
| 14 | `require('dotenv').config(...)`'s returned `error` is never checked | — | Checked: `dotenv.config()` returns `{ error }` when the `.env` **file itself** can't be read (e.g., missing). A missing `.env` is the required, desired path for CI (`ci.yml`'s `env:` block injects vars directly, no `.env` file ever exists) and for Docker/Render (S11). Throwing on this `error` would break CI outright. | false — the proposed guard would break the CI path this story requires |
| 15 | An unhandled `checkHealth()` rejection falls through to Express 5's *default* error handler, which returns the **full stack trace** in the response body whenever `NODE_ENV` isn't `'production'` — contradicting the spec's own I/O matrix row ("non-200… no stack in body") | medium | **Verified empirically**, not just by inspection: ran the exact mocked-failure scenario through `supertest` with `NODE_ENV=development` and with `NODE_ENV` unset — both return `500`, `Content-Type: text/html`, and a body containing `<pre>Error: connection refused<br> &nbsp; &nbsp;at ...</pre>` with the full stack. Reachable today in local dev, `npm test`, and CI (`NODE_ENV=test`) — never `'production'` before Story 1.9's deploy config exists. Leaks internal file paths/library internals on every health-check failure. | patch |
| 16 | Unmatched routes return Express's default HTML 404 rather than a JSON envelope | — | Checked against this spec's own Never section: "no… the 404 `/api` envelope (1.4)" — explicitly, deliberately deferred. | false — excluded by the frozen intent itself |
| 17 | `server/test/globalSetup.js`: if `client.connect()` succeeds but `client.query('SELECT 1')` throws, the `catch` block never calls `client.end()` | low | Verified by code reading: `client.end()` only appears on the success path inside the `try`. Runs once per Jest process, so impact is one leaked connection per run, not per-test, but it's a real leak with a trivial fix. | patch |
| 18 | `server/test/globalSetup.js`'s `Client` only sets `connectionTimeoutMillis`, not a query timeout — if the DB accepts the TCP connection but never answers, `SELECT 1` can hang indefinitely | low | Verified by code reading. This is exactly the file responsible for guaranteeing CI "never goes vacuously green" (R7); an indefinite hang is a worse failure mode than the skip/throw paths it already handles. | patch |
| 19 | `scripts/check-boundaries.js`'s `walk()` doesn't guard `fs.readdirSync` — one unreadable directory crashes `npm run lint` with an uncaught exception instead of a clean lint failure | low | Verified by code reading; no try/catch around the call. Low likelihood on a freshly cloned repo, but the fix is a direct one-line correction. | patch |
| 20 | `walk()`'s `entry.isDirectory()`/`entry.isFile()` branches silently skip symlink entries (`isSymbolicLink()` is neither), so a symlinked source file would never be scanned | low | Verified: Dirent type methods reflect the entry's own type, not its target; a symlink matches neither branch. No symlinks exist in this tree today; a correct fix needs cycle-safety care, not a one-liner. | reject — no known occurrence, fix is more than a direct correction |
| 21 | ARCH-03/ARCH-14 only scope to `server/src/`, so `require('knex')`/`EventEmitter` in `server/knexfile.js`, `server/jest.config.js`, or `server/test/**` would go undetected | — | Checked against the architecture spine's own text: ARCH-03/14 are stated as binding `server/src/` specifically. The script correctly implements the rule as written; broadening it would be expanding the architecture rule itself, not fixing this story's implementation of it. | false — correctly implements the cited rule's own stated scope |
| 22 | `docker/initdb/01-create-test-db.sql` only runs on a container's first start against an empty volume; a pre-existing `careerbridge-pgdata` volume would mean `careerbridge_test` never gets created | — | Checked: `docker-compose.yml` (and therefore the named volume) is introduced by this exact diff — no pre-existing volume with that name can exist yet. The AC's own precondition is "a fresh clone." A real caveat for a future schema-init change, not a defect in what this story delivers. | false — no pre-existing volume can exist at this story's starting state |

## Design Notes

Five corrections to `plan-1-1.md`. None conflicts with the spine or the story's acceptance criteria; each serves them.

- **C1 — the plan's fresh-clone path is red, not skipped (must fix).** `health.test.js` requires `presentation/app.js` → `config.js`, which throws `MissingConfigError` when `DATABASE_URL`/`SESSION_SECRET` are unset. On a fresh clone with no `.env` the server suite dies at import and the plan's `describeDb` skip never runs — failing the story's first AC. Fix in `server/test/globalSetup.js`: before probing, default `DATABASE_URL` to `postgres://careerbridge:careerbridge@localhost:5432/careerbridge_test` and `SESSION_SECRET` to a test constant **only when unset**. This is test harness, not app config: `globalSetup.js` lives under `server/test/`, so `server/src/config.js` remains the only `process.env` reader under `server/src/` (S11 intact). Bonus: with Docker up, `npm ci && npm test` on a fresh clone now genuinely runs the NFR-7 database test instead of skipping it.
- **C2 — ignore lists must cover the BMAD tree.** `prettier --check .` and `eslint .` at the root would otherwise walk `_bmad/`, `_bmad-output/`, `inputs/`, `transcripts/`, and `.claude/` and fail on files that are not our source. Plan item 8 listed only a subset.
- **C3 — delete `server/package-lock.json`.** ARCH-05 means one lock at the workspace root; leaving the old one invites two dependency graphs. Not mentioned in the plan.
- **C4 — write the client by hand, do not run `npm create vite`.** The eight client files are fully specified in plan items 19–25; scaffolding then deleting its `eslint.config.js`, `README.md`, `.gitignore`, demo CSS, and logo assets (plan R8) is pure churn. Keeps plan R5 (`babel: { babelrc: false, configFile: false }`) and R4 (`moduleNameMapper` for `config`) exactly as written.
- **C5 — retire the manual ARCH-12 grep.** `server/README.md`'s last line tells a reader to run that grep by hand. Once `scripts/check-boundaries.js` rule 4 exists, replace it with `npm run lint:boundaries`; that is precisely what `deferred-work.md` asked Story 1.1 to do.

Kept from the plan and worth restating: Postgres major **17** (spine Open Question 3 is unresolved; two lines to change later — R6); flat `eslint.config.js` rather than `.eslintrc` (R1); `business/system/checkHealth.js` so the health route never reaches into persistence (R2); a Node boundary script rather than shell greps or an ESLint plugin, so Windows teammates get the same result (R3); `globalSetup` throwing when `CI=true` and the probe fails, so CI can never go vacuously green (R7).

## Verification

**Commands:**
- `npm install` -- expected: one root `package-lock.json`, both workspaces linked, exit 0
- `npm run lint` -- expected: `boundaries OK (4 rules)`, eslint and prettier clean, exit 0
- Four negative lint probes (plan §5 rows 2–5: temp files with `require('knex')`, `fetch(`, `EventEmitter`, and a bad `postingStatus.js` import) -- expected: exit 1 with the matching `ARCH-nn` line each time; capture each failing `npm run lint` output verbatim in Implementation Notes before reverting the throwaway change and deleting it — none of the four throwaway files or edits may reach a commit
- `npm run db:up && docker compose ps` -- expected: `postgres:17-alpine` healthy
- `npm run migrate:latest && npm run migrate:rollback && npm run migrate:latest` -- expected: exit 0 each time ("Already up to date" / "No migrations to rollback")
- `npm test` -- expected: server suite `--runInBand` with the NFR-7 database test **run, not skipped**, then the client suite; exit 0
- `cd server && npx jest` -- expected: 268 Story 1.2 tests pass
- `grep -rn "process\.env" server/src | grep -v src/config.js` -- expected: no output
- `DATABASE_URL= SESSION_SECRET= node server/src/index.js` (from `server/`) -- expected: non-zero exit, stderr names `MissingConfigError` and both variables
- `npm run dev:server` + `npm run dev:client`, then `curl -s http://localhost:5173/api/health` -- expected: `{"status":"ok"}`, 200, and one pino JSON request line on the server's stdout with no cookie/password fields

**Manual checks (if no CLI):**
- `.github/workflows/ci.yml` step order read against S14: lint → up → rollback-all → up → both suites, Postgres service container on major 17, no deploy step. CI is not executed locally (no push in this story).
</content>

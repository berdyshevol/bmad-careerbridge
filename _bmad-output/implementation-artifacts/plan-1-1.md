---
title: 'Plan — Story 1.1: One repository, two workspaces, and a green CI'
type: 'plan'
created: '2026-09-06'
story: '1-1-one-repository-two-workspaces-and-a-green-ci'
baseline_commit: '0c3c060'
---

# Plan — Story 1.1

## 1. Scope decision

**Delivered now:** npm workspaces root (ARCH-05); Docker Compose Postgres pinned to **17** (ARCH-02); ESLint 9 flat config + Prettier + a boundary-check script covering the ARCH-03 / ARCH-06 / ARCH-14 greps **and** the ARCH-12 grep deferred by `deferred-work.md`; `server/src/config.js` as the only `process.env` reader with one pino logger (S11, S14); `server/knexfile.js` + an **empty** `server/src/data/migrations/` directory; a minimal `server/src/persistence/db.js` (knex instance + `pool` + `ping()`); `GET /api/health` through `business/system/checkHealth.js` (NFR-7); Vite + React 19 client in **plain JS** with the `/api` proxy (ARCH-09); Jest on both sides (ARCH-22); `.github/workflows/ci.yml` running S14's step list; zod installed in both workspaces; README run instructions.

**Explicitly left to later stories:** tables, migrations, seeds, `testSupport.js`, `factories.js` (1.3); `withTransaction`, repositories, `presentation/errors.js`, the 404 `/api` envelope (1.4); express-session, connect-pg-simple, bcrypt, guards, scope routers, rate limiting (1.5); MUI, React Router, TanStack Query, `theme.js`, `api.js`, `useAuth` (1.7); `Dockerfile`, `render.yaml`, static serving of `client/dist`, `scripts/backup.sh`, `docs/runbook.md` (1.9); issue/PR templates, `CONTRIBUTING.md`, branch protection (1.10). Do **not** create any file listed in another story's Touches.

**`migrate:latest` / `rollback` before 1.3 exists:** `server/src/data/migrations/` is created with a `.gitkeep` only. Knex requires the directory to exist but treats zero migration files as a valid no-op: `migrate:latest` creates `knex_migrations` / `knex_migrations_lock` and prints "Already up to date"; `migrate:rollback --all` prints "No migrations to rollback"; both exit 0. So the CI up → rollback-all → up sequence is green today and becomes a real round-trip the moment 1.3 lands, with **no CI change**. `.gitkeep` has no `.js` extension, so Knex's `loadExtensions` ignores it.

**Do not break Story 1.2:** `server/src/business/{errors.js,domain/**}` and their 268 passing tests are untouched. `cd server && npx jest` must stay green at every commit.

## 2. File-by-file task list (implementation order)

### Commit A — repo root, tooling, boundaries

1. **`package.json`** (new, root) — ARCH-05. `"name": "careerbridge-csi5324"`, `"private": true`, `"workspaces": ["server", "client"]`, `"engines": { "node": ">=22" }`. Scripts:
   `"test": "npm run test --workspaces"`, `"test:server": "npm test -w server"`, `"test:client": "npm test -w client"`,
   `"lint": "node scripts/check-boundaries.js && eslint . && prettier --check ."`,
   `"lint:boundaries": "node scripts/check-boundaries.js"`, `"format": "prettier --write ."`,
   `"dev:server": "npm run dev -w server"`, `"dev:client": "npm run dev -w client"`,
   `"db:up": "docker compose up -d"`, `"db:down": "docker compose down"`,
   `"migrate:latest": "npm run migrate:latest -w server"`, `"migrate:rollback": "npm run migrate:rollback -w server"`.
   devDependencies: `eslint@^9`, `@eslint/js@^9`, `globals@^15`, `eslint-plugin-react@^7`, `eslint-plugin-react-hooks@^5`, `prettier@^3`, `eslint-config-prettier@^9`.
2. **`.gitignore`** (edit) — add `.env`, `.env.local`, `coverage/`, `client/dist/`, `backups/`.
3. **`.env.example`** (new) — every S11 name with a dev-safe value: `DATABASE_URL=postgres://careerbridge:careerbridge@localhost:5432/careerbridge`, `SESSION_SECRET=dev-only-change-me`, `SESSION_IDLE_HOURS=8`, `ADMIN_EMAIL=admin@careerbridge.local`, `ADMIN_PASSWORD=change-me`, `RESUME_MAX_BYTES=2097152`, `TZ=America/Chicago`, `SEED_DEMO=true`, `PORT=3000`, `NODE_ENV=development`. Never commit a real `.env`.
4. **`docker-compose.yml`** (new) — ARCH-02. One service `db`, `image: postgres:17-alpine`, env `POSTGRES_USER=careerbridge` / `POSTGRES_PASSWORD=careerbridge` / `POSTGRES_DB=careerbridge`, `ports: ["5432:5432"]`, `healthcheck: ["CMD-SHELL", "pg_isready -U careerbridge"]` (interval 5s, retries 10), named volume `careerbridge-pgdata`, `./docker/initdb:/docker-entrypoint-initdb.d:ro`.
5. **`docker/initdb/01-create-test-db.sql`** (new) — `CREATE DATABASE careerbridge_test OWNER careerbridge;` so the disposable test database (ARCH-02, S16) exists from day one.
6. **`scripts/check-boundaries.js`** (new, CommonJS) — ARCH-03, ARCH-06, ARCH-12, ARCH-14 as lint. Walks the tree with `fs.readdirSync`, skipping `node_modules`, `dist`, `.git`, `coverage`. Four rules, exact regexes:
   - `ARCH-03` — files under `server/src/` **not** under `server/src/persistence/`, `/require\(\s*['"]knex['"]\s*\)/`
   - `ARCH-06` — files under `client/src/`, excluding `client/src/api.js` and `*.test.js` / `*.test.jsx`, `/\bfetch\s*\(/`
   - `ARCH-14` — all files under `server/src/`, `/EventEmitter|\.emit\s*\(/`
   - `ARCH-12` — files matching `server/src/business/domain/*.js` excluding `*.test.js`: every capture of `/require\(\s*['"]([^'"]+)['"]\s*\)/g` must be in `['./enums', '../errors', './postingStatus', './applicationStage']`
   Prints `path:line: ARCH-nn <message>` per hit and `process.exit(1)` on any hit; prints `boundaries OK (4 rules)` and exits 0 otherwise. Node script, not shell, so Windows teammates get the same result.
7. **`eslint.config.js`** (new, flat config) — `js.configs.recommended` for all `**/*.{js,jsx}`; `globals.node` + `sourceType: 'commonjs'` for `server/**`; `globals.browser` + `sourceType: 'module'` + `ecmaFeatures.jsx` + react/react-hooks recommended with `react/react-in-jsx-scope: 'off'` and `settings.react.version: 'detect'` for `client/**`; `globals.jest` for `**/*.test.{js,jsx}`; `eslint-config-prettier` last; ignores `**/node_modules/`, `client/dist/`, `coverage/`.
8. **`.prettierrc.json`** (new) — `{ "singleQuote": true, "printWidth": 100, "trailingComma": "es5" }`; **`.prettierignore`** — `node_modules`, `client/dist`, `coverage`, `package-lock.json`, `_bmad-output`, `transcripts`.

### Commit B — server: config, logger, knexfile, health

9. **`server/package.json`** (edit) — keep `"name": "careerbridge-server"`, CommonJS, no `"type"`. Remove the inline `"jest"` block (moves to `jest.config.js`). Scripts: `"test": "jest --runInBand"` (S16), `"start": "node src/index.js"`, `"dev": "node --watch src/index.js"`, `"migrate:latest": "knex migrate:latest"`, `"migrate:rollback": "knex migrate:rollback --all"`, `"seed": "knex seed:run"`. dependencies: `express@^5`, `knex@^3`, `pg@^8`, `pino@^9`, `pino-http@^10`, `dotenv@^17`, `zod@^4`. devDependencies: `jest@^30`, `supertest@^7`.
10. **`server/knexfile.js`** (new) — ARCH-02, ARCH-20. `module.exports = { client: 'pg', connection: config.databaseUrl, pool: { min: 0, max: 10 }, migrations: { directory: './src/data/migrations', tableName: 'knex_migrations' }, seeds: { directory: './src/data/seeds' } }`. Reads the URL from `./src/config`, never `process.env` directly.
11. **`server/src/data/migrations/.gitkeep`**, **`server/src/data/seeds/.gitkeep`** (new, empty) — the no-op migration directory above; 1.3 fills them.
12. **`server/src/config.js`** (new) — S11, ARCH-16, the **only** reader of `process.env`. `require('dotenv').config()` first. Exports a frozen object with `databaseUrl`, `sessionSecret`, `sessionIdleHours` (8), `adminEmail`, `adminPassword`, `resumeMaxBytes` (2097152), `tz` ('America/Chicago'), `seedDemo` (boolean, default false), `port` (3000), `nodeEnv` ('development'), `isProduction`. Required at boot: `DATABASE_URL`, `SESSION_SECRET` — missing either throws `MissingConfigError` (class defined here, message `Missing required environment variables: DATABASE_URL, SESSION_SECRET`) before anything connects. `ADMIN_EMAIL` / `ADMIN_PASSWORD` are read but optional here; the 1.3 base seed refuses without them (S16). Also exports `logger = pino({ level: nodeEnv === 'test' ? 'silent' : 'info', redact: ['req.headers.cookie', 'req.headers.authorization', 'password', 'passwordHash'] })` writing to stdout (S14).
13. **`server/src/persistence/db.js`** (new, minimal) — ARCH-03. The only file that may `require('knex')`. Exports `db` (knex instance from `knexfile.js`), `pool` (`db.client.pool`, used by connect-pg-simple in 1.5), and `async function ping() { await db.raw('select 1'); }`. **No `withTransaction`** — Story 1.4 adds it to this same file.
14. **`server/src/business/system/checkHealth.js`** (new, ~10 lines) — ARCH-04, S8 signature `async (actor, input)`; calls `ping()` and returns `{ status: 'ok' }`. Keeps the one-way flow presentation → business → persistence for NFR-11 (see Risk R2).
15. **`server/src/presentation/app.js`** (new, health route only) — ARCH-09, S10. `express()`, `app.set('trust proxy', 1)`, `app.use(pinoHttp({ logger }))`, `app.use(express.json())`, `app.get('/api/health', async (req, res) => res.status(200).json(await checkHealth(null, {})))`. Exports the app; **no** `listen`, no session, no error handler (1.4/1.5).
16. **`server/src/index.js`** (new) — requires `config` (fail-fast), then `app`, then `app.listen(config.port, () => logger.info({ port }, 'careerbridge server listening'))`.
17. **`server/jest.config.js`** (new) — `{ testEnvironment: 'node', globalSetup: '<rootDir>/test/globalSetup.js', testPathIgnorePatterns: ['/node_modules/'] }`.
18. **`server/test/globalSetup.js`** (new, ~20 lines) — probes the database once and sets `process.env.DB_AVAILABLE = 'true' | 'false'` (Jest propagates main-process env to workers). If `DATABASE_URL` is unset → `'false'` + one `console.warn`. If set, `new Client({ connectionString, connectionTimeoutMillis: 3000 })`, `SELECT 1`, `end()`; on failure → `'false'` + a warn naming the URL host. **If `process.env.CI === 'true'` and the probe fails, throw** so CI can never silently skip database tests. Story 1.3 extends this same file to run `migrate:latest` once.

### Commit C — client

19. **`client/package.json`** — from `npm create vite@latest client -- --template react` (plain JS), then edited: `"private": true`, scripts `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`, `"test": "jest"`. dependencies `react@^19`, `react-dom@^19`, `zod@^4`. devDependencies `vite@^7`, `@vitejs/plugin-react@^5`, `jest@^30`, `jest-environment-jsdom@^30`, `babel-jest@^30`, `@babel/preset-env@^7`, `@babel/preset-react@^7`, `@testing-library/react@^16`, `@testing-library/jest-dom@^6`. Delete Vite's ESLint scaffolding (`eslint.config.js` inside `client/`) — lint is rooted.
20. **`client/vite.config.js`** — ARCH-09. `plugins: [react({ babel: { babelrc: false, configFile: false } })]` (so the Jest babel config never reaches the browser build), `server: { port: 5173, proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: false } } }`.
21. **`client/babel.config.js`** — `presets: [['@babel/preset-env', { targets: { node: 'current' } }], ['@babel/preset-react', { runtime: 'automatic' }]]` (Jest only, per the line above).
22. **`client/jest.config.js`** — ARCH-22. `testEnvironment: 'jsdom'`, `setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']`, `moduleNameMapper: { '^(?:\\.{1,2}/)+config$': '<rootDir>/src/testMocks/config.js', '\\.(css|svg|png|jpg)$': '<rootDir>/src/testMocks/fileStub.js' }`, `testMatch: ['**/*.test.{js,jsx}']`.
23. **`client/src/setupTests.js`** — `require('@testing-library/jest-dom')`. **`client/src/testMocks/config.js`** — mirrors `config.js` exports with test values (`API_BASE_URL: ''`, `UNREAD_POLL_MS: 60000`); **`client/src/testMocks/fileStub.js`** — `module.exports = {}`.
24. **`client/src/config.js`** — S11, ARCH-22: the only file touching `import.meta.env`. `export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';` and `export const UNREAD_POLL_MS = 60000;` (mocked in tests by the mapper above, so Jest never parses `import.meta`).
25. **`client/src/App.jsx`** — one `<h1>CareerBridge</h1>` plus a health line that uses `API_BASE_URL` only; **no `fetch(`** anywhere (ARCH-06 lint). **`client/src/main.jsx`** — `createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)`. Delete `App.css`/`index.css` demo content and the Vite logo assets.
26. **`README.md`** (root, edit) — a "Running CareerBridge" section: prerequisites (Node 24, npm 11, Docker Desktop), `npm ci`, `cp .env.example .env`, `npm run db:up`, `npm run dev:server` + `npm run dev:client`, `npm test`, `npm run lint`, the four boundary rules, Postgres major **17** pinned in `docker-compose.yml` and `ci.yml`, and the validation-library line: *"Validation: **zod**, installed in both workspaces — one schema language usable in Express handlers and React forms alike `[ASSUMPTION]`."* Append one line to `server/README.md` pointing at the root README.

### Commit D — CI

27. **`.github/workflows/ci.yml`** (new) — NFR-10, S14. `on: [push, pull_request]`; job `build` on `ubuntu-latest`; service `postgres` `image: postgres:17` with `POSTGRES_USER/PASSWORD=careerbridge`, `POSTGRES_DB=careerbridge_test`, `ports: 5432:5432`, `options: --health-cmd pg_isready --health-interval 5s --health-timeout 5s --health-retries 10`. Job `env`: `DATABASE_URL=postgres://careerbridge:careerbridge@localhost:5432/careerbridge_test`, `SESSION_SECRET=ci-secret`, `ADMIN_EMAIL=admin@careerbridge.local`, `ADMIN_PASSWORD=ci-password`, `SEED_DEMO=true`, `TZ=America/Chicago`, `NODE_ENV=test`. Steps in order: `actions/checkout@v4`; `actions/setup-node@v4` with `node-version: 24`, `cache: npm`; `npm ci`; `npm run lint`; `npm run migrate:latest -w server`; `npm run migrate:rollback -w server`; `npm run migrate:latest -w server`; `npm test`. No deploy step (1.9).

## 3. Commands, in order

```bash
cd /Users/berdyshevo/Documents/Baylor/SW-Engineering/bmad-careerbridge
npm create vite@latest client -- --template react     # plain JS React, NOT react-ts
# write the root package.json / configs / server files above, then:
npm install                                            # installs the whole workspace tree, writes the root lock
npm run lint                                           # boundaries + eslint + prettier, expect exit 0
npm run db:up && docker compose ps                     # Postgres 17 healthy (skip if Docker is down)
cp .env.example .env                                   # DATABASE_URL -> .../careerbridge_test for the suite
npm run migrate:latest && npm run migrate:rollback && npm run migrate:latest
npm test                                               # server (--runInBand) then client, exit 0
npm run dev:server & npm run dev:client                # manual: curl http://localhost:5173/api/health
```

## 4. Tests to write

| File | Test name (verbatim) | Notes |
| --- | --- | --- |
| `server/src/presentation/routes/health.test.js` | `NFR-7 GET /api/health returns 200 after SELECT 1` | supertest against `presentation/app.js`; asserts `200` and body `{ status: 'ok' }`; `afterAll(() => db.destroy())` |
| `server/src/presentation/routes/health.test.js` | `NFR-7 GET /api/health reports the database error when the pool is down` | `jest.mock` of `../../persistence/db` with `ping` rejecting; expects a non-200 — **no DB needed**, lives outside the skipped block |
| `client/src/App.test.jsx` | `ARCH-22 App renders without crashing` | RTL `render(<App />)`, `expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CareerBridge')` |

**Skip rule (DB-less environments).** At the top of `health.test.js`:

```js
const hasDb = process.env.DB_AVAILABLE === 'true';
const describeDb = hasDb ? describe : describe.skip;
if (!hasDb) console.warn('SKIP NFR-7 database tests: no reachable Postgres. Run `npm run db:up` and set DATABASE_URL in .env.');
describeDb('health route (database)', () => { /* the SELECT 1 test */ });
```

`DB_AVAILABLE` is set by `server/test/globalSetup.js` (item 18), which throws instead of skipping when `CI === 'true'`, so the service container is always exercised. Every later story reuses this exact pattern.

## 5. Definition of done

| AC (Given/When/Then) | Command | Expected |
| --- | --- | --- |
| Fresh clone + Docker → `docker compose up -d`, `npm ci`, `npm test` | `npm run db:up && npm ci && npm test` | `docker compose ps` shows `postgres:17-alpine` healthy; both Jest suites run; `echo $?` = 0 |
| Lint fails on `require('knex')` outside persistence | `printf "require('knex');\n" > server/src/business/tmp.js && npm run lint; rm server/src/business/tmp.js` | exit 1, line `server/src/business/tmp.js:1: ARCH-03 …` |
| Lint fails on `fetch(` in `client/src` outside `api.js` | `printf "fetch('/api');\n" > client/src/tmp.js && npm run lint; rm client/src/tmp.js` | exit 1, `ARCH-06 …` |
| Lint fails on `EventEmitter` / `.emit(` in `server/src` | `printf "const {EventEmitter}=require('events');\n" > server/src/tmp.js && npm run lint; rm server/src/tmp.js` | exit 1, `ARCH-14 …` |
| (deferred item) domain module importing outside its allowlist | add `require('../../persistence/db')` to `postingStatus.js`, `npm run lint`, revert | exit 1, `ARCH-12 …` |
| All S11 vars read only in `config.js` | `grep -rn "process\.env" server/src \| grep -v "src/config.js"` | prints nothing |
| Missing required value fails fast with a named error | `cd server && DATABASE_URL= SESSION_SECRET= node src/index.js` | exits non-zero, stderr contains `MissingConfigError: Missing required environment variables: DATABASE_URL, SESSION_SECRET` |
| One pino logger, request logging to stdout | `curl -s localhost:3000/api/health` with the server in the foreground | one JSON line per request on stdout, no cookie/password fields |
| CI runs lint, up / rollback-all / up, both suites, `--runInBand` | push a branch; read the Actions log | steps in that order, all green; server step shows `--runInBand` |
| Vite proxy returns health | `curl -s http://localhost:5173/api/health` | `{"status":"ok"}`, HTTP 200 |
| Validation library chosen and documented | `grep -rn "zod" package-lock.json server/package.json client/package.json README.md` | zod in both workspaces + the one-line rationale in `README.md` |
| Story 1.2 not broken | `cd server && npx jest` | 268 tests pass |

## 6. Risks / judgment calls

- **R1 — ESLint flat config vs `.eslintrc`.** `[ASSUMPTION]` Use flat `eslint.config.js` at the root: ESLint 9 (current) defaults to it and `.eslintrc` is deprecated. The story's Touches says "`.eslintrc`/prettier config", which reads as "an ESLint config", not a filename mandate.
- **R2 — Health route and the layer rule.** `[ASSUMPTION]` Touches names only `app.js`, but a route calling `db.raw` directly would put a database call in presentation and weaken the NFR-11 story we tell Dr. Ren. Add the 10-line `business/system/checkHealth.js`. Alternative rejected: import `persistence/db` from `app.js` (the S12 session pool is the one sanctioned presentation → persistence import; don't spend it here).
- **R3 — How to implement the three greps.** `[ASSUMPTION]` A Node script (`scripts/check-boundaries.js`) rather than an ESLint plugin or shell grep: exact regexes, path-aware exclusions, identical on macOS/Linux/Windows, no plugin authoring, and one file a reviewer can read. ESLint stays responsible for ordinary code quality only. The ARCH-12 rule from `deferred-work.md` is rule 4 in the same script; `server/README.md`'s manual grep line can then be dropped in a later story.
- **R4 — `import.meta.env` under Jest.** `[ASSUMPTION]` Do not add a Babel plugin. Map every relative `…/config` import to `client/src/testMocks/config.js` via `moduleNameMapper` — literally what ARCH-22 says ("mocked in tests") — so Jest never parses `import.meta` syntax at all.
- **R5 — Babel config leaking into the Vite build.** `@vitejs/plugin-react` reads `babel.config.js` by default, which would push `preset-env targets: node` into the browser bundle. Pass `babel: { babelrc: false, configFile: false }` in `vite.config.js`.
- **R6 — Postgres major.** `[ASSUMPTION]` Pin **17** (Neon's default; Open Question 3 is still open). It appears in exactly two places, `docker-compose.yml` and `ci.yml`; changing it later is a two-line commit. Host port 5432 may collide with a local Postgres — if `docker compose up` fails to bind, remap to `5433:5432` and update `.env` only.
- **R7 — Vacuous green.** A skipped DB test that always skips is worse than a red one; hence `globalSetup` throwing when `CI === 'true'` and the probe fails.
- **R8 — Vite scaffold noise.** `npm create vite` writes its own `eslint.config.js`, `README.md`, `.gitignore`, and demo CSS/assets inside `client/`. Delete all of them (root config owns lint/format) before the first `npm run lint`.
- **R9 — zod major.** `[ASSUMPTION]` zod v4 (`zod@^4`) in both workspaces; declared in each `package.json` rather than hoisted from the root so each workspace is self-describing.

## 7. Commit plan

1. `Story 1.1: npm workspaces, Docker Postgres 17, ESLint/Prettier, ARCH-03/06/12/14 boundary lint` — root `package.json`, `.gitignore`, `.env.example`, `docker-compose.yml`, `docker/initdb/`, `scripts/check-boundaries.js`, `eslint.config.js`, prettier config.
2. `Story 1.1: server config (S11), pino logger, knexfile, Express 5 app with the NFR-7 health route` — `server/package.json`, `knexfile.js`, empty `data/migrations`+`seeds`, `src/config.js`, `src/persistence/db.js`, `src/business/system/checkHealth.js`, `src/presentation/app.js`, `src/index.js`, `jest.config.js`, `test/globalSetup.js`, `routes/health.test.js`.
3. `Story 1.1: client Vite + React 19 scaffold, Jest/RTL, /api proxy (ARCH-09, ARCH-22)` — everything under `client/`, plus `README.md` run instructions and the zod rationale.
4. `Story 1.1: CI on every push — lint, migrate up/rollback/up, both suites on Postgres 17 (NFR-10, S14)` — `.github/workflows/ci.yml`; verify the first green run before marking the story `review`.

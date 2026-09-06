# Reviewer gate — Reality lens (versions, existence, fit, live defaults)

**Target:** `ARCHITECTURE-SPINE.md` (2026-09-05, status draft)
**Lens:** Was every committed technology and number web-researched or reality-checked rather than asserted from training data?
**Constraint of this run:** no web research was permitted for the spine or for this review. Everything below is from the reviewer's own knowledge (cutoff mid-2026) plus internal consistency. Each item carries a confidence label: **confident** (would bet on it), **likely** (probably right, verify), **unsure** (could be stale, must verify before it is repeated to Dr. Ren or copied into a `package.json`).

**Verdict:** the stack is real, fits plain JavaScript, and is mutually compatible; no named technology is dead or wrong for its job. The spine correctly hedges the version table ("confirm at scaffold time"). What it does *not* hedge are three build-breaking Express 5 / Render / Jest details and several free-tier numbers that were asserted, not checked. None is critical; four are high because they fail at scaffold time or on presentation day, not in review.

---

## 1. Item-by-item reality table

Columns: (a) exists and fits the stated use in plain JS; (b) version pairing plausible and compatible; (c) what to confirm at scaffold time and how.

| # | Item (as written in spine) | (a) Exists / fits plain JS | (b) Pairing and compatibility | (c) Confirm at scaffold time | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | **Node.js 22 LTS** | Exists. Fits. | Node 22 entered Active LTS Oct 2024 and moved to **Maintenance LTS in Oct 2025**; Node 24 is the Active LTS through Oct 2026 and Node 26 becomes LTS around Oct 2026. Everything else in the table runs on 22 or 24. Node ≥22.12 also has unflagged `require(esm)`, which lets a CommonJS server consume ESM-only dependencies. | `node --version` on every laptop; `docker run node:24-alpine node --version`; Render docs "Node version" (`.node-version` or `engines.node`); nodejs.org/en/about/previous-releases | confident on the LTS schedule; the spine's "22" is not wrong, just one LTS behind |
| 2 | **Express 5.x** | Exists. Plain JS is its native habitat. | 5.0 shipped Sept 2024, became the npm `latest` tag March 2025 (5.1). Requires Node ≥18. **Async errors:** a rejected promise from an `async` handler is forwarded to the error middleware automatically — no `express-async-errors`, no try/catch-next wrappers. **Breaking vs 4:** path syntax is path-to-regexp v8 — `app.get('*')` is invalid (use `'/{*splat}'` or a plain `app.use` fallback), optional params are `{/:id}` not `/:id?`, `req.query` is a read-only getter, `res.status()` rejects non-integers, `app.del`/`req.param()` removed. | `npm view express version`; expressjs.com/en/guide/migrating-5.html | confident |
| 3 | **Knex 3.x** | Exists. Query builder + migrations + seeds, plain JS `knexfile.js`. | Latest is 3.1.x (release cadence is slow; still 3.x in 2026). Needs Node ≥16. Works with pg 8. **Partial unique index:** `table.unique(cols, { indexName, predicate: knex.whereRaw("stage = 'offer'") })` emits `CREATE UNIQUE INDEX … WHERE …` on Postgres (the `predicate` option exists on both `index()` and `unique()`; with a predicate Knex creates an index, not a constraint). Fallback that always works: `knex.raw('CREATE UNIQUE INDEX … WHERE …')` in the migration. `knex.fn.uuid()` maps to `gen_random_uuid()` on Postgres. Triggers/functions (ARCH-18 audit) must be `knex.raw` — Knex has no DSL for them. | `npm view knex version`; knexjs.org/guide/schema-builder.html#unique (look for `predicate`); write the migration and run `knex migrate:latest` against Docker, then `\d applications` in `psql` to see the `WHERE` clause | likely on `predicate` for `unique()` (confident for `index()`); confident on raw fallback |
| 4 | **pg 8.x** | Exists. The driver Knex uses. | 8.x is still the major in 2026 (8.16+). Supports Node 22/24. **Neon requires TLS**; Compose Postgres has none. The spine's "`DATABASE_URL` is the only per-environment difference" holds only if TLS is carried *in the URL* (`?sslmode=require`). Caution: pg-connection-string's interpretation of `sslmode=` changed across 8.x minors (libpq-compat flag `uselibpqcompat=true` was added; `sslmode=require` may or may not verify the certificate depending on minor). | `npm view pg version`; node-postgres.com/features/ssl; neon.com/docs/connect/connect-securely; prove it with one `SELECT 1` from a laptop against the Neon URL exactly as it will be set on Render | confident it works; unsure on exact `sslmode` semantics in the current minor |
| 5 | **PostgreSQL 17 (Docker, CI, Neon)** | Exists (Sept 2024). | **Postgres 18 shipped Sept 2025**; Neon added 18 shortly after and its default for *new* projects in Sept 2026 may be 17 or 18. Open Question 3 already says "pin to whatever Neon provisions" — good. `postgres:17`/`postgres:18` Docker tags exist for Compose and for the Actions service container. `gen_random_uuid()` is built in since PG 13, so no `uuid-ossp` extension is needed on Neon. | Create the Neon project, run `SELECT version();`, then pin the same major in `docker-compose.yml` and `ci.yml` | confident 17 exists; unsure which major Neon defaults to today |
| 6 | **React 19** | Exists (Dec 2024; 19.1 Mar 2025, 19.2 Oct 2025). Plain JSX fine. | Compatible with Vite 6/7, React Router 7, TanStack Query 5, MUI 7, Testing Library 16. | `npm view react version` | confident |
| 7 | **Vite 6.x** | Exists, but **superseded**: Vite 7 shipped June 2025 (ESM-only package, Node ≥20.19 / ≥22.12, default browser target "baseline-widely-available"); a Rolldown-based Vite 8 was in beta late 2025 and may be GA by now. `npm create vite@latest` will not give you 6. The JS (non-TS) `react` template still exists. | Vite 7 + Node 22 LTS is fine (22.12+). Vite proxy: `server.proxy: { '/api': 'http://localhost:3000' }` — exists in every version, ARCH-09 is safe. | `npm create vite@latest client -- --template react` then read the generated `package.json`; vite.dev/guide/migration | confident 6 is stale; unsure whether 7 or 8 is current |
| 8 | **React Router 7 (library mode)** | Exists (Nov 2024). `react-router-dom` was folded into `react-router`; install `react-router` and import `BrowserRouter`/`Routes`/`Route` from it (`react-router-dom` v7 is a re-export shim). | Requires React ≥18. **Naming:** current v7 docs call the three modes *Declarative*, *Data*, *Framework*; "library mode" was the launch-era term for the non-framework modes. The spine's intent (no `react-router` Vite plugin, no loaders required) is Declarative mode. | reactrouter.com/start/modes; `npm view react-router version` | confident |
| 9 | **TanStack Query 5.x** | Exists (Oct 2023, still 5.x). `@tanstack/react-query`. Plain JS fine. | Supports React 19. `refetchInterval` covers the unread-count poll in ARCH-06. Mutations `invalidateQueries` as the spine assumes. | `npm view @tanstack/react-query version` | confident |
| 10 | **MUI 7.x (default, ARCH-07)** | Exists (v7 March 2025). Plain JS supported. Peer deps `@emotion/react`, `@emotion/styled`. | MUI ships a major roughly yearly (v6 Aug 2024, v7 Mar 2025); **v8 may exist by Sept 2026**. v7 supports React 17–19. v7 gotcha: `Grid` is the former `Grid2` API (`size={{ xs: 12 }}`), so tutorials written for v5 mislead. Accessible form controls and 375 px layouts: yes, meets the ARCH-07 constraint. | `npm view @mui/material version`; mui.com/material-ui/migration/ | likely 7 is current or one behind |
| 11 | **Jest 30.x** | Exists (June 2025). Requires Node ^18.14 / ^20 / ^22 / ≥24. | **Server:** zero-config *if the server package is CommonJS* (no `"type": "module"`); the spine's `require('knex')` implies CJS but never says so. Jest's native ESM is still experimental (`node --experimental-vm-modules`). **Client:** Jest does not understand Vite. It needs `babel-jest` + `@babel/preset-env` + `@babel/preset-react` (automatic runtime), `jest-environment-jsdom` (separate install since Jest 28), `moduleNameMapper` for CSS/asset imports, and `import.meta.env` does not exist under Jest (ARCH-09 single origin means the client needs no env var, so simply never use `import.meta`). **Vitest** (3.x Jan 2025, 4.x Oct 2025) reads `vite.config.js` directly, has the same `describe/it/expect` API and `vi.fn`, and is what create-vite users are pointed to. See finding H-1 for the decision the team must make. | `npm view jest version`; jestjs.io/docs/ecmascript-modules; vitest.dev/guide/comparisons | confident on the friction; the choice is the team's |
| 12 | **bcrypt** | Exists. Native addon (`bcrypt` 5.1.x → 6.0.0 in 2025, Node ≥18). Pure-JS alternative `bcryptjs` 3.x (2025, ESM + types) is API-compatible. | Native build is the classic Docker blocker: `node:*-alpine` (musl) + a multi-stage build that installs on one base and runs on another produces "invalid ELF header". Either build and run on the same base image, or use `bcryptjs`, or Node's built-in `crypto.scrypt`. NFR-2 wording ("bcrypt hashes") is satisfied by `bcryptjs` too. | `docker build . && docker run <image> node -e "require('bcrypt')"` on the *final* stage | likely |
| 13 | **express-session** | Exists (1.18.x). Plain middleware; unaffected by the Express 5 router changes. | Rolling 8-hour idle expiry = `rolling: true, cookie: { maxAge: 8*60*60*1000 }`, `resave: false`, `saveUninitialized: false`. **Production gotcha:** Render terminates TLS at its proxy; with `cookie.secure = true` and without `app.set('trust proxy', 1)` express-session silently *does not set the cookie* — login "works" and every next request is 401. `SameSite=Lax` is correct for single origin (ARCH-09). | `npm view express-session version`; expressjs.com/en/resources/middleware/session.html ("cookie.secure", "trust proxy"); first deploy: log in on the Render URL and check the `Set-Cookie` header in DevTools | confident |
| 14 | **connect-pg-simple** | Exists (major 10.x, Node ≥18). Uses a `session` table (`sid`, `sess`, `expire`); ships `table.sql`. Accepts a `pg.Pool` or `conString`. | Works with pg 8 and Express 5. Prefer `createTableIfMissing: false` and a Knex migration containing `table.sql`, so the whole schema is under migrations (the ERD already draws SESSION). Default `pruneSessionInterval` is 60 s — a `DELETE` every minute keeps a Neon compute from auto-suspending while Render is awake (see L-2). | `npm view connect-pg-simple version`; github.com/voxpelli/node-connect-pg-simple README | likely (major number); confident it fits |
| 15 | **Docker Compose** | Exists. `docker compose` (v2 plugin) is the only supported CLI; the v1 `docker-compose` binary is gone. | `docker-compose.yml` is still recognised; canonical name is now `compose.yaml`. The top-level `version:` key is obsolete and prints a warning. `postgres:17` is multi-arch (Apple Silicon fine). For the disposable test DB, create a second database (`careerbridge_test`) via an init script in `/docker-entrypoint-initdb.d/`. | `docker compose version`; docs.docker.com/compose/ | confident |
| 16 | **GitHub Actions Postgres service container** | Exists. `services.postgres.image: postgres:17`, `env.POSTGRES_PASSWORD`, `ports: 5432:5432`, `options: --health-cmd pg_isready …`. Linux runners only (`ubuntu-latest` = 24.04). | Pair with `actions/checkout@v4`/`@v5` and `actions/setup-node@v4`/`@v5` with `cache: npm` (v5 of both appeared in 2025 on the Node 24 runner). Free minutes: unlimited on public repos, 2,000/month on private. | docs.github.com/actions/use-cases-and-examples/using-containerized-services/creating-postgresql-service-containers | confident |
| 17 | **Render free web service** | Exists. Docker runtime is available on the free instance type. | Spins down after **15 minutes** of inactivity; wake-up on the next request "can take up to a minute" (typically 30–60 s). 512 MB RAM, 0.1 CPU, 750 free instance-hours per workspace per month (one always-available service fits), 500 free build-pipeline minutes per month (Docker builds count — a 4-minute image build ≈ 120 deploys/month). **Render's free Postgres is not used by the spine — correct, because it expires 30 days after creation** (1 GB, one per workspace). Auto-deploy: Render deploys on push by default; deploying only "on green" requires the Auto-Deploy setting "After CI checks pass" or a Deploy Hook called from the workflow. | render.com/docs/free; render.com/docs/deploys#automatic-git-deploys | likely on all numbers; confident on sleep and the free-Postgres expiry as of 2025 |
| 18 | **Neon free tier ~0.5 GB** | Exists. Serverless Postgres, branches, connection pooler endpoint. | The 0.5 GB per-project figure was correct through 2025; Neon repriced after its 2025 acquisition and the project count/branch limits moved (10 branches per project was the free number; project count rose). Free compute auto-suspends after 5 minutes idle (cold start ≈ 0.5–2 s on the first query); monthly compute budget ≈ 190 CU-hours (an always-awake 0.25 CU compute = 180). History retention on free ≈ 1 day, and deleted resume rows count against storage until it lapses. One personal branch per member (5) fits under any plausible branch cap. | neon.com/pricing (the domain moved from neon.tech to neon.com in 2025); the Neon console shows the project's actual storage and compute-hours gauges | unsure on exact storage and branch numbers; likely on suspend/cold-start |
| 19 | **Cloud Run + Cloud SQL** | Both exist. Cloud Run runs the same image; Cloud SQL Postgres 17 exists. | "Cloud SQL has no free tier" is **correct**: it is absent from GCP's Always Free list; the smallest instance costs roughly $7–10/month (new accounts get a $300/90-day credit; students may get education credits). Cloud Run itself *does* have an always-free allowance. **Cloud Run + Neon** is therefore a cheaper "on GCP" fallback than Cloud Run + Cloud SQL and needs no code change either. Cloud SQL from Cloud Run needs the instance attached (`--add-cloudsql-instances`) and a Unix-socket host in the URL — still environment-only. | cloud.google.com/free (Always Free list); cloud.google.com/sql/pricing | confident |
| 20 | **Vite proxy (`/api`)** | Exists, unchanged across Vite 5/6/7. | `changeOrigin` not needed for same-host; cookies pass through. | vite.dev/config/server-options.html#server-proxy | confident |
| 21 | **Express serving `client/dist` (ARCH-09)** | Exists (`express.static`). | Express 5 SPA fallback: `app.get('/{*splat}', …)` or `app.use((req, res) => res.sendFile(...))` — `app.get('*')` throws at startup in Express 5. Order: `/api` routers first, static second, fallback last, and the fallback must *not* swallow unknown `/api/*` (return 404 JSON there). | Start the built image locally and request `/some/client/route` and `/api/nope` | confident |
| 22 | **Postgres CHECK + trigger for insert-only audit** | Exists. | CHECK cannot express "no UPDATE/DELETE"; a `BEFORE UPDATE OR DELETE … FOR EACH ROW EXECUTE FUNCTION … RAISE EXCEPTION` trigger does. **Loopholes:** `TRUNCATE` bypasses row triggers (add `BEFORE TRUNCATE` statement trigger if it matters), and the table owner can `ALTER TABLE … DISABLE TRIGGER` — on Neon the app user *is* the owner, so the trigger is a guard against code bugs, not against an admin; a `REVOKE UPDATE, DELETE` from a separate app role would be the stronger form. Test setup that resets the DB must drop/recreate or roll back migrations rather than `DELETE FROM audit_events`. | Write the migration, then in `psql`: `UPDATE audit_events SET reason='x'` must error | confident |
| 23 | **npm workspaces, root `npm test`** | Exists (npm ≥7; Node 22/24 ship npm 10/11). | Root script `"test": "npm test --workspaces --if-present"`; single root lockfile; `npm ci` at root installs both. Jest hoists fine. | `npm test` at root on a clean clone | confident |
| 24 | **Railway** (memlog only, not in spine) | Exists, but **no free tier since Aug 2023** (one-time trial credit, then Hobby $5/month). The spine correctly does not name it. | — | railway.com/pricing | confident |
| 25 | **File-upload middleware** (implied by ARCH-17, unnamed) | `multer` 2.x (2025) works with Express 5; memory storage + `limits.fileSize = 2*1024*1024` gives the 2 MB cap before bytes reach the business layer. | — | `npm view multer version` | likely |

---

## 2. Findings

Tiers: **critical** = a committed decision rests on something false; **high** = fails at scaffold time or on presentation day if not addressed; **medium** = stale or unverified number/version that will be copied somewhere; **low** = nit or positive confirmation worth recording.

### Critical

None. Every named technology exists, fits plain JavaScript, and the pairings are mutually compatible.

### High

**H-1 — Jest on the Vite client is a decision, not a given (Stack table row "Jest 30.x"; rationale "one runner for backend and frontend").**
Jest cannot read `vite.config.js`; the client suite needs a Babel transform, a jsdom environment, CSS/asset mappers and a ban on `import.meta`. Vitest gives the same API with none of that. The team must pick one of: (A) Jest everywhere — server CommonJS zero-config, client via `babel-jest` + `@babel/preset-react` + `jest-environment-jsdom` + `moduleNameMapper`; (B) Jest on the server, Vitest on the client — reword the rationale to "one Jest-style API on both sides, one `npm test`"; (C) Vitest on both — simplest, but memlog line 13 records Jest as `[ADOPTED]`, so it needs Dr. Ren-facing wording. Whichever it is, the *module system* must be stated: the server is CommonJS (the `require('knex')` grep already assumes it).
*Spine edit:* in **Stack**, change the Jest row to `Jest 30.x (server, CommonJS); client runner: Jest via babel-jest or Vitest — decided in the scaffold story`; add to **Consistency Conventions › Tests**: "server package is CommonJS; client is ESM/JSX under Vite; client code never uses `import.meta`"; in the **Rationale › Jest** paragraph, replace "one runner for backend and frontend" with "the Jest test API on both backend and frontend" if option B is taken.

**H-2 — Express 5 SPA fallback syntax (ARCH-09).**
`app.get('*', …)` throws in Express 5 (path-to-regexp v8). Whoever scaffolds from an Express 4 tutorial will hit this on day one, and the fallback can also swallow unknown `/api` routes into `index.html`.
*Spine edit:* ARCH-09 rule, append: "Express 5 path syntax: the SPA fallback is `app.get('/{*splat}', …)` after the `/api` routers and static files; unknown `/api/*` returns the 404 envelope, never `index.html`."

**H-3 — Secure cookie behind Render's proxy (ARCH-08).**
Render terminates TLS. With `cookie.secure: true` and no `app.set('trust proxy', 1)`, express-session never sets the cookie in production; login appears to succeed and every following request is 401 — a presentation-day failure that no local test catches.
*Spine edit:* ARCH-08 rule, append: "`cookie.secure` is true outside development and the app sets `trust proxy` to 1 because Render and Cloud Run terminate TLS in front of Express."

**H-4 — Express 5 async error forwarding should be stated so nobody "fixes" it (ARCH-03 / error envelope).**
Express 5 forwards rejected promises from async handlers to the error middleware. This is what makes the single `presentation/errors.js` mapping work. If unstated, someone will add `express-async-errors` (Express 4 tooling) or wrap every route in try/catch, producing the multiple error conventions the spine is trying to prevent.
*Spine edit:* Consistency Conventions › Error envelope, append: "handlers are `async` and simply throw; Express 5 forwards the rejection to `errors.js` — no wrapper library, no per-route try/catch."

### Medium

**M-1 — Node 22 is Maintenance LTS, not the active LTS (Stack).**
Node 24 has been the active LTS since Oct 2025; Node 26 becomes LTS about a month after this document's date. 22 still works with everything named (Vite 7 needs 22.12+), but a table that says "22 LTS" in Sept 2026 reads as unresearched.
*Spine edit:* Stack row → `Node.js | 24 LTS (or the active LTS at scaffold time; ≥22.12 minimum for Vite 7)`; pin the same major in the Dockerfile, `.node-version`, `engines`, and `setup-node`.

**M-2 — Vite 6.x is stale; MUI 7.x may be (Stack).**
`npm create vite@latest` produces Vite 7 (possibly 8). MUI may have shipped 8 in 2026. Both rows are hedged by the table's preamble, but the numbers will be copied into stories.
*Spine edit:* `React + Vite | 19 + current (7.x or later)`; `MUI | current major (7.x or later)`; keep the "confirm at scaffold time" line and add the confirming commands: `npm create vite@latest`, `npm view @mui/material version`.

**M-3 — Neon free-tier numbers are asserted (Open Question 2, ARCH-17, Rationale).**
"About 0.5 GB" and the implicit branch count were true through 2025; Neon repriced in 2025 and the free-plan quotas moved. The 2 MB resume cap and the "two hundred files" arithmetic hang on this number, and it is repeated to Dr. Ren. Also unmentioned: free compute auto-suspends after 5 minutes idle and has a monthly compute-hours budget, so the "warm before presentation" step applies to Neon too, and the unread-count poll plus connect-pg-simple's 60-second prune keep Neon awake whenever Render is awake.
*Spine edit:* Open Question 2 → "Neon free-tier storage (**verify at neon.com/pricing before the team meeting**; ~0.5 GB per project as of 2025). Free compute also auto-suspends after 5 minutes idle; the pre-presentation warm-up hits the database too." Keep the 2 MB cap but mark it "subject to the verified quota".

**M-4 — "Render auto-deploys `main` on green" names an outcome, not a mechanism (ARCH-16).**
Render's default auto-deploy is on push, before CI runs. The gate exists but must be chosen: Render's Auto-Deploy setting "After CI checks pass", or auto-deploy off plus a Deploy Hook `curl` at the end of the workflow.
*Spine edit:* ARCH-16 rule, replace "Render auto-deploys `main` on green" with "Render auto-deploys `main` only after the GitHub check passes (Render setting *After CI checks pass*, or a Deploy Hook called from the last CI step)".

**M-5 — Postgres major: 18 exists (Stack, Open Question 3).**
PostgreSQL 18 shipped Sept 2025; Neon's default for a new project today may be 18. Open Question 3 already says "pin to whatever Neon provisions" — correct — but the Stack table and both diagrams say 17 unconditionally.
*Spine edit:* Stack row → `PostgreSQL | 17 or 18 — whichever major Neon provisions; pinned identically in Compose and CI`.

**M-6 — TLS in `DATABASE_URL` is the one hidden per-environment difference (ARCH-02).**
Neon requires TLS; Compose Postgres has none. The rule "DATABASE_URL is the only per-environment difference" survives only if the TLS mode rides in the URL (`?sslmode=require`), and pg 8.x's handling of `sslmode` changed across minors.
*Spine edit:* ARCH-02 rule, append: "TLS mode is part of the URL (`?sslmode=require` on Neon, none on Compose/CI); no `ssl` object in code."

**M-7 — Jest workers versus one disposable database (ARCH-02, Tests convention).**
Jest runs test files in parallel workers by default; repository and route tests sharing one database will interfere and produce flaky failures that look like transaction bugs. The suite-speed argument in the memlog depends on this being handled deliberately.
*Spine edit:* Consistency Conventions › Tests, append: "database-backed server tests run serially (`--runInBand`) or each worker gets its own schema keyed by `JEST_WORKER_ID`; the scaffold story picks one."

**M-8 — bcrypt native build in the Docker image (ARCH-08, ARCH-16).**
`bcrypt` is a native addon; a multi-stage Alpine build that installs on one base and copies `node_modules` to another fails at runtime. `bcryptjs` 3.x is API-compatible and pure JS; NFR-2 is still met.
*Spine edit:* Stack row → `bcrypt (or bcryptjs 3.x if the native build fights the Docker image)`; ARCH-16, append "the image is built and run on the same base image".

### Low

**L-1 — React Router mode name.** Current docs call it *Declarative* mode (with *Data* and *Framework* as the alternatives); the package is `react-router`, not `react-router-dom`. *Edit:* Stack row → `React Router 7.x (Declarative mode, package react-router)`.

**L-2 — connect-pg-simple prune interval and Neon compute hours.** Default `pruneSessionInterval` is 60 s. Set it to several hours (sessions expire by `expire` column anyway) so an idle-but-awake Render service does not keep the Neon compute billing hours. *Edit:* none required; note for the scaffold story.

**L-3 — Audit trigger loopholes.** `TRUNCATE` bypasses row triggers and the owning role can disable the trigger; the test reset must roll back or drop/recreate rather than `DELETE`. *Edit:* ARCH-18, append "…raises on UPDATE, DELETE and TRUNCATE; tests reset the database by rolling back migrations, not by deleting audit rows".

**L-4 — Session table under migrations.** Use `createTableIfMissing: false` and put connect-pg-simple's `table.sql` in a Knex migration so the ERD's SESSION entity has a migration like everything else. *Edit:* none; scaffold story.

**L-5 — Docker Compose file conventions.** Drop the `version:` key; `docker compose` v2 only; `compose.yaml` is the canonical name (the spine's `docker-compose.yml` still works). *Edit:* none.

**L-6 — Render free build minutes.** Docker builds consume the 500 free pipeline minutes per month; fine at student cadence, but a runaway CI/deploy loop can exhaust it. *Edit:* none; note in ARCH-16 rationale if desired.

**L-7 — Cloud Run + Neon is a cheaper GCP fallback than Cloud Run + Cloud SQL.** Both are environment-only changes. *Edit:* ARCH-16, "Cloud Run plus Cloud SQL (or Neon) is the named alternative if GCP is required".

**L-8 — Upload middleware is unnamed.** ARCH-17 needs multipart parsing; `multer` 2.x with memory storage and `limits.fileSize` enforces the 2 MB cap before the business layer. *Edit:* add to **Deferred** with the validation library.

**L-9 — Positive confirmations worth keeping.** Express 5 async error forwarding (confident); `gen_random_uuid()` built into PG ≥13 so UUID PKs need no extension (confident); Knex `predicate` for partial unique indexes with `knex.raw` as the always-works fallback (likely); Railway correctly omitted — no free tier since 2023 (confident); Render free Postgres correctly avoided — expires after 30 days (likely); "Cloud SQL has no free tier" is accurate (confident).

---

## 3. What was confirmed versus asserted

| Claim in spine | Status in this run |
| --- | --- |
| Stack table versions | Asserted; hedged by the table's own preamble. Rows 1, 7, 10 are stale or at risk (M-1, M-2). |
| Express 5, Knex, pg, express-session, connect-pg-simple, bcrypt exist and pair | Confirmed from knowledge (confident), with three build-time gotchas (H-2, H-3, M-8). |
| Jest on both sides | Asserted; real friction on the client (H-1). |
| Render free tier sleeps; warm before presentation | Confirmed (15 min / up to 1 min wake), Neon needs the same warm-up (M-3). |
| Neon ~0.5 GB, branch fallback | Asserted; plausible for 2025, unverified for Sept 2026 (M-3). |
| Cloud SQL no free tier | Confirmed (confident). |
| Postgres partial unique index, insert-only trigger | Confirmed (confident), with TRUNCATE/owner loopholes (L-3). |
| "Auto-deploy on green" | Mechanism unspecified (M-4). |

**Before the Monday 2026-09-07 meeting**, the five commands/pages that close the unsure items: `npm view express knex pg react vite react-router @tanstack/react-query @mui/material jest bcrypt express-session connect-pg-simple version` (one command), `npm create vite@latest`, neon.com/pricing, render.com/docs/free, and a Neon project's `SELECT version();`.

# Epic 1 Context: Iteration 1 skeleton — shared platform every use case builds on

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Deliver the working full stack every use-case owner starts from: one repository with server and client workspaces, the complete Postgres schema with seeds and a disposable test database, session login and logout, server-side role guards on every route, an insert-only audit trail written with every state change, recipient-only Notification delivery, the MUI application shell with shared components, green CI on every push, and a Render deploy against Neon. It is the one deliberate technical-layer epic: shared infrastructure must be finished before Iteration 2, and the whole schema must land before any use-case branch opens, so this epic precedes every other.

## Stories

- Story 1.1: One repository, two workspaces, and a green CI
- Story 1.2: Stored enums and the two state machines
- Story 1.3: Initial schema, indexes, audit trigger, seeds, and test support
- Story 1.4: Persistence core, error vocabulary, and the audit and notification writers
- Story 1.5: Log in, log out, and server-side role guards
- Story 1.6: Notification delivery: list and unread count
- Story 1.7: Client shell: theme, API wrapper, auth context, AppBar, routing, and login page
- Story 1.8: Shared presentational components
- Story 1.9: One image, Render deploy after green CI, health, backup
- Story 1.10: Team workflow: issues, branches, protected main, review

## Requirements & Constraints

- Any Account logs in with email and password and logs out; a failed login returns one generic message whether the email is unknown or the password is wrong.
- Every page and API operation outside the public set (Job List, Posting detail, Applicant registration, Recruiter request form, login) requires a logged-in Account with the role the feature names; everyone else is refused as forbidden, on the server, independently of the UI.
- Notifications are in-app only and visible only to their recipient.
- Every status or Stage change, approval, rejection, and business-rule change records actor, timestamp, old and new values; the record can never be edited or deleted.
- Administrator Accounts come only from setup (seed) or an existing Administrator; no public route may create one.
- Passwords stored only as non-reversible hashes; sessions end after 8 idle hours (sliding).
- Every state change is validated in the business layer and refused with a human-readable message that leaves data unchanged; exhaustive state-machine tests are the evidence.
- Data survives restart; no Application, Posting, or Notification exists without its owner.
- Public URL reachable at each presentation; the free host sleeps, so a health endpoint warms it.
- Every FR has an automated test whose name contains the FR ID verbatim; the full suite runs on every push.
- Four separate layers (presentation, business, persistence, data) with one-way dependencies.
- Works at 375 px; visible label on every field, keyboard-reachable actions, colour never the only status indicator.

## Technical Decisions

- **Stack:** Node LTS, Express 5, Knex, pg, PostgreSQL (one pinned major everywhere: Docker Compose in dev, service container in CI, Neon in production); React 19, Vite, React Router 7, TanStack Query, MUI 7 core + icons only; Jest on both sides (server CommonJS with supertest; client via babel-jest, jsdom, React Testing Library). Plain JavaScript, no TypeScript. npm workspaces `server/` and `client/`; root `npm test` runs both.
- **Layers:** `server/src/{presentation,business,persistence,data}`; dependencies flow only `client → presentation → business → persistence → data`. `require('knex')` only under `persistence/` (migrations and seeds receive knex as a parameter). Business never sees `req`/`res` or sets HTTP status. `server/src/config.js` is the only reader of `process.env`; `client/src/config.js` the only reader of `import.meta.env`. The live Application Cap is never config.
- **Business modules:** one `business/<area>/verbNoun.js` per use-case action, signature `async (actor, input)`, `actor` null for visitors; modules never import each other; shared pure logic in `business/domain/`; repositories hold no rules. Business tests mock repositories with `jest.mock`; route tests hit the real disposable database, server suite `--runInBand`.
- **State machines:** `business/domain/postingStatus.js` and `applicationStage.js` are pure, expose `assertTransition(from, to)` and `assertPostingAllows(effectiveStatus, toStage)`, and throw `InvalidTransitionError`. Database CHECKs enforce valid values only, never transitions.
- **Data ownership:** Recruiter approval status and Organization live on `organization_members` (UNIQUE account_id), never on `accounts`. Every reason and all history live only in `audit_events` (no `*_reason` columns; `auditRepository.record` is the sole writer; reads order by `created_at, seq`; trigger raises on UPDATE/DELETE). Notifications reference their audit event, are never deleted, only `read_at` changes. Default `settings` and `stage_labels` rows come from migrations, not seeds. Partial unique indexes: one non-withdrawn Application per applicant per posting; one `offer` per posting. UUID v4 keys, `timestamptz`, plural `snake_case` tables, `camelCase` JS.
- **Transactions:** `withTransaction(fn)` in `persistence/db.js` commits on return, rolls back on throw, never nests. Repository functions take `conn` first and return plain camelCase objects, never Knex builders. Transition UPDATEs are guarded on stored status; zero rows updated throws `ConcurrentChangeError`. Postgres `23505` on the named indexes is rethrown as the matching 409 class. No EventEmitter or bus; Notifications are written inside the use-case transaction.
- **Expiry:** stored status stays `live`; one Knex fragment in `postingRepository` derives `expired` from `expires_at <= now()`; Postgres `now()` is the only clock; expiry writes no audit row.
- **Errors:** `business/errors.js` classes (400 validation, 401 unauthenticated/suspended, 403 forbidden, 404 not found, 409 rule violation and subclasses) mapped once in `presentation/errors.js` to `{ error: { code, message, details } }`; unknown errors are `500 internal` with no stack; unknown `/api` paths return the 404 envelope, never HTML.
- **Sessions and guards:** express-session on a `sessions` table via connect-pg-simple using the pool from `persistence/db.js` (the one presentation → persistence import); HttpOnly, SameSite=Lax, Secure outside development, `trust proxy` 1, rolling idle expiry; bcrypt. `middleware/auth.js` reloads Account and membership every request and builds `req.actor = { accountId, role, organizationId, recruiterStatus, accountStatus }` (every field present, `null` not `undefined`) or `null`. Only two guards, `requireAuth(...roles)` and `requireApprovedRecruiter`, mounted once per scope router (`public`, `auth`, `me`, `org`, `admin`); no handler switches on role. Suspended Account: session destroyed, `401 account_suspended`. CSRF defence is single origin plus JSON-only mutation bodies; only login is rate limited.
- **API conventions:** all under `/api`, no version prefix; Vite proxies in development; production Express serves `client/dist` via the Express 5 splat fallback after the routers. Lists take `?page&pageSize&sort=field:asc|desc` (cap 100) and return `{ items, page, pageSize, total }`; a single resource is the object; mutations return the resource; 204 only for logout. `GET /api/health` returns 200 after `SELECT 1`.
- **Seeds and tests:** base seed creates one Administrator from env plus default categories and locations, idempotent, every environment. Demo seed (only when `SEED_DEMO=true`: dev, CI, deployed demo) creates the PRD cast and is the sole source of Recruiter and Applicant Accounts until Iteration 2. Jest `globalSetup` migrates once; truncate non-reference tables before each file; factories create rows; tests never assume seeds.
- **Client:** all HTTP through `client/src/api.js` (components never call `fetch`), which throws `ApiError { status, code, message, details }` and handles 401 once; server state in TanStack Query with mutation invalidation; unread count is one polled query; one `useAuth` context; no state library.
- **Deploy and CI:** one Docker image, start `knex migrate:latest` then the server, env vars only, nothing written to disk. CI on every push: lint, migrate up / rollback-all / up, both suites against a Postgres service container. Render deploys `main` only after green CI. Backups via local `pg_dump`, never committed.
- **Deferred to Story 1.1:** one request-validation library for both workspaces; ESLint/Prettier with the three boundary greps (knex outside persistence, fetch outside api.js, EventEmitter/emit in server) as lint rules or CI steps.
- **Workflow:** one GitHub issue per use case with FR IDs as a checklist; branch `<issue>-<slug>`; protected `main` needs green CI and one non-author review; merge commits, never squash; merge is deploy.

## UX & Interaction Patterns

- MUI defaults plus a small brand delta (navy primary, slate secondary, light page surface, five stage colour tokens, fixed type scale, radii 4/8/full, Roboto with no webfont); flat elevation. Destructive actions are `outlined color="error"`, never filled red; one contained primary button per region; one `h1` per page; body text stays 16 px on every screen.
- AppBar on every page with role-specific link sets, a bell with unread Badge (hidden at zero, "99+" above 99, accessible name with the count) polled every `UNREAD_POLL_MS` (60 s) and refetched after own mutations; links collapse into a Drawer below 900 px.
- Landing after login by role (Applicant applications, Approved Recruiter postings, Pending/Rejected Recruiter status page, Administrator requests); wrong role redirects to its landing; `/login?next=` returns there. Client guards only decide what to render; the server refuses on its own.
- One `<ErrorAlert>` with `role="alert"` renders the server message verbatim and maps codes to placement: `forbidden` is a full page with no record fields, `not_found` reads as "not available", `internal` offers Retry, `validation_failed` becomes per-field helper text, 401 redirects to login with a one-line reason.
- Shared vocabulary: StageChip/StatusChip (icon + label from `stage_labels`, colour by stored enum), ResponsiveTable (table at 900 px+, cards below), FilterBar (state in URL query), ReasonDialog/ConfirmDialog (focus trapped, primary disabled until valid), PipelineStepper (five steps, terminal stages freeze it), HistoryTimeline (audit rows oldest first, role not name except for Administrators), EmptyState, SkeletonList, Snackbar with `aria-live="polite"`. Only irreversible actions confirm; advances and approvals are one click plus Snackbar.

## Cross-Story Dependencies

- 1.1 precedes everything; 1.2 creates `business/errors.js` that 1.4 maps to HTTP and 1.5 throws.
- 1.3 (schema, seeds, harness) precedes 1.4, 1.5, 1.6 and every use-case branch in Epics 2 to 16.
- 1.4 supplies `withTransaction`, audit and notification repositories, base finders, and the error handler that 1.5 and 1.6 build on; 1.6 extends `notificationRepository`.
- 1.5 produces the five scope routers with placeholder routes that 1.6 and later epics replace, and the session mechanics the client's 401 handling in 1.7 assumes.
- 1.7 wires the unread-count endpoint from 1.6 into the bell; 1.8 reads stage labels from a reference endpoint Epic 2 serves (falls back to stored names until then).
- 1.9 relies on the CI workflow from 1.1 and the app assembled in 1.5; 1.10 is process only.
- Epics 2, 3, 4 run on the demo seed cast from 1.3 because self-registration arrives in Iteration 2; Epics 15 and 16 depend only on this epic.

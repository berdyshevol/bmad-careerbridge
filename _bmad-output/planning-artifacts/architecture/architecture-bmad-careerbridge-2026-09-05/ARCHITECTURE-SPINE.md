---
name: CareerBridge
type: architecture-spine
purpose: build-substrate
altitude: feature
paradigm: four-layer web application; business layer as one transaction-script module per use case
scope: the whole CareerBridge system for CSI 5324 Iterations 1-3 (UC-A1..UC-M4, FR-X, NFR-1..11)
status: final
created: 2026-09-05
updated: 2026-09-05
binds: [UC-A1, UC-A2, UC-A3, UC-A4, UC-A5, UC-R1, UC-R2, UC-R3, UC-R4, UC-R5, UC-R6, UC-M1, UC-M2, UC-M3, UC-M4, FR-X-1..5, NFR-1..11]
sources: [prds/prd-bmad-careerbridge-2026-09-05/prd.md, prds/prd-bmad-careerbridge-2026-09-05/addendum.md, briefs/brief-bmad-careerbridge-2026-09-05/addendum.md, inputs/DECISIONS.md, inputs/group-project-overview.md]
companions: [SHAPES.md, CAPABILITY-MAP.md]
---

# Architecture Spine — CareerBridge

`ARCH-nn` ids are stable; stories, issues, and tests cite them. Only decisions two members could make incompatibly are here. `SHAPES.md` (S1..S16) holds the exact vocabularies and mechanics and binds by reference; `CAPABILITY-MAP.md` holds the use-case map, diagrams, tree, and seed cast; `.memlog.md` holds rationale. The last section is the Iteration 1 stack rationale for Dr. Ren.

## Design Paradigm

Four layers as top-level folders under `server/src/`; the business layer is **one module per use case**, the only place business rules live. Dependencies flow one way and never skip: `client → presentation → business → persistence → data`. Business code never sees `req` or `res`; `data/` has no importable module.

## Invariants & Rules

### ARCH-01 — PostgreSQL is the only data store [ADOPTED]
*Binds data and persistence. Prevents a second engine and PRD rules enforced only in code.*
**Rule:** The offer-acceptance cascade (FR-R6-2/3) is one transaction; the partial unique indexes, foreign keys, and audit trigger are exactly S3.

### ARCH-02 — One Postgres, three places
*Binds every environment. Prevents dialect drift and a slow suite nobody runs.*
**Rule:** Docker Compose Postgres for development, a service container in CI, Neon in production, same major everywhere; `DATABASE_URL` is the only per-environment difference; tests run only against a disposable database. A personal Neon branch is the fallback for a laptop without Docker.

### ARCH-03 — Express 5 and Knex; only `persistence/` touches the database
*Binds server. Prevents a query from a service blurring the graded boundary.*
**Rule:** `require('knex')` appears only under `server/src/persistence/` (migrations and seeds receive `knex` as a parameter). Check: `grep -rlE "require\(['\"]knex['\"]\)" server/src | grep -v persistence/` is empty. Handlers are `async` and throw; no wrapper library, no per-route try/catch.

### ARCH-04 — One business module per use case
*Binds server, NFR-10, SC-3. Prevents merge conflicts on shared services and FRs with no file to trace to.*
**Rule:** Each use-case action is `business/<area>/<verbNoun>.js` with the S8 signature, owned by the use-case owner, with `<verbNoun>.test.js` beside it whose test names contain the FR IDs verbatim. Use-case modules never import each other; shared pure logic lives in `business/domain/`, shared I/O in per-entity repositories that hold no business rules.

### ARCH-05 — One repository, npm workspaces [ADOPTED]
*Binds repo and CI. Prevents split commit history.*
**Rule:** `server/` and `client/` are workspaces of `careerbridge-csi5324`; root `npm test` runs both suites and CI runs exactly that.

### ARCH-06 — Frontend: React Router, TanStack Query, one API wrapper, no state library
*Binds client. Prevents five loading and error conventions, stale lists, and a Redux in week eight.*
**Rule:** All HTTP goes through `client/src/api.js` (S9); components never call `fetch`. Server state lives in TanStack Query, mutations invalidate queries, the unread count is one polled query that exists from Iteration 1 (FR-X-3). The logged-in Account lives in one `useAuth` context. No global state library. Check: `grep -rn "fetch(" client/src | grep -v api.js` is empty.

### ARCH-07 — Component library is chosen by the UX document
*Binds client. Prevents hand-rolled CSS failing NFR-8 and NFR-9.*
**Rule:** The library must ship accessible form controls (labels, keyboard) and work at 375 px; MUI is the default until the UX document names one.

### ARCH-08 — Server-side session in Postgres, HTTP-only cookie
*Binds FR-X-1, NFR-2, FR-M3-2, FR-M3-4. Prevents a JWT in `localStorage` because the tutorial did it.*
**Rule:** Express-session on the `sessions` table with the S12 cookie, proxy, CSRF, and rate-limit settings; bcrypt hashes; every request reloads the Account and membership row, so suspension and role changes bite on the next request. Decided against JWT: FR-M3-2 and the sliding 8-hour timeout make statelessness unusable, and browser storage adds an XSS surface.

### ARCH-09 — Single origin
*Binds client, server, deployment. Prevents CORS and cross-site cookie debugging.*
**Rule:** The API lives under `/api`; Vite proxies it in development; in production Express serves `client/dist` with the Express 5 fallback `app.get('/{*splat}', …)` after the routers, and an unknown `/api` path returns the 404 envelope, never `index.html`.

### ARCH-10 — Role in presentation, scope in business, Organization in the query
*Binds NFR-1, NFR-3, FR-X-2, FR-R3-3, FR-R3-4. Prevents another Organization's rows leaking through a route that forgot a check.*
**Rule:** (1) `middleware/auth.js` builds `req.actor` (S7) and the only guards are `requireAuth(...roles)` and `requireApprovedRecruiter`, mounted once per scope router (S10); (2) every use-case module takes `actor` first (`null` for a visitor) and refuses out-of-scope work itself; (3) recruiter-facing **list** queries take `organizationId` as a mandatory `WHERE` parameter, never filtering afterwards, while a **single-record** use case loads by id and throws `ForbiddenError` when the record's Organization differs. The FR-R3-3 demo proof is a test of (2) and (3).

### ARCH-11 — Refusals and ids
*Binds presentation and data. Prevents mixed 403/404 behaviour and enumerable ids.*
**Rule:** A record outside the actor's Organization scope is `403 forbidden` (FR-R3-3); a Posting that is not effectively Live is `404 not_found` to visitors and to Applicants who have not applied to it (FR-A2-2). All primary keys are UUIDs. Codes and envelope are S9.

### ARCH-12 — State machines are pure business modules
*Binds NFR-4 and PRD §3. Prevents transition checks scattered across use cases or hidden in triggers.*
**Rule:** `business/domain/postingStatus.js` and `applicationStage.js` export the transition maps over the S1 strings, `assertTransition(from, to)`, and `assertPostingAllows(postingEffectiveStatus, toStage)` for FR-R4-4, throwing `InvalidTransitionError` with a human-readable message; no I/O. Their exhaustive edge tests are the NFR-4 evidence. The database enforces valid values only (CHECK), never transitions.

### ARCH-13 — Every state change is one guarded transaction
*Binds every status or Stage change and creation, FR-X-4, FR-A3-4, FR-R6-2/3. Prevents a change without its audit row, double advances, split cascades, and cap races.*
**Rule:** One `withTransaction` (S8) contains the row UPDATE guarded on the stored status, the audit row (S5), and any Notification (S6), with the S13 mechanics (effective-versus-stored guard, `ConcurrentChangeError`, creation rows, `FOR UPDATE` cap check). A cascade is one use-case module, one transaction.

### ARCH-14 — No event bus
*Binds server. Prevents an emitter writing Notifications outside the transaction and outside traceability.*
**Rule:** No in-process event emitter or message bus for domain events; Notifications are written by the use-case module inside its transaction through the notification repository. Check: `grep -rn "EventEmitter\|\.emit(" server/src` is empty.

### ARCH-15 — Expired is derived on read
*Binds FR-M2-4, FR-A2-1, FR-A3-1, FR-R4-4, FR-M4-4, FR-R6-2. Prevents a scheduler on a sleeping host, a list that forgot expiry, and two clocks.*
**Rule:** Stored status stays `live`; every Posting read selects `effective_status` from the single S4 fragment; business code reads only `effective_status`; Postgres `now()` is the only clock. FR-R4-4 tests `effective_status NOT IN ('filled','closed')`, not "is Live". Expiry writes no audit row.

### ARCH-16 — One image, environment variables only; Render and Neon
*Binds deployment, operations, NFR-5, NFR-7, NFR-10. Prevents host lock-in, code assuming a local disk, and migrations run by hand.*
**Rule:** The deployable is one Docker image running Express, configured only through S11, writing nothing to local disk, operated per S14 (migrate on start, CI steps, deploy after CI, health, logging, backup). Host: Render web service plus Neon; Cloud Run plus Cloud SQL is the named alternative if GCP is required.

### ARCH-17 — Resumes are immutable `bytea` rows
*Binds FR-A1-3, FR-A3-5, NFR-3. Prevents files on disk, a second storage account, a copy per Application, and the current file shown as the submitted one.*
**Rule:** `resume_files` (S2) holds the bytes; a new upload inserts a row and repoints the profile; an Application references the row it was submitted with. Upload and download mechanics, the 2 MB cap (Open Question 2), and the two scoped read modules are S15.

### ARCH-18 — Data ownership
*Binds NFR-5, FR-X-3, FR-R1-1/3, FR-M1-2, FR-A4-1/2, FR-R2-2. Prevents two owners of one fact, status on the wrong table, and Stage history disagreeing with audit.*
**Rule:** Status-bearing columns are exactly S2; Recruiter approval status and Organization live on `organization_members`, never on `accounts` (check: `accounts` has no `organization_id`). An Application has two NOT NULL parents, is created only by `submitApplication`, and is mutated only through ARCH-12 transitions; the only caches are the S2 timestamp columns written in the same UPDATE as the status. Stage history, every reason, and change history are read from `audit_events` (S5), never stored a second time; the detail response is the single S10 shape. Interviews belong to the Application. A Notification (S6) belongs to its recipient, is written only inside a use-case transaction, references its audit event, is never deleted, and only `read_at` changes. Hard delete exists only for Postings in `draft`, `pending_approval`, `rejected` and writes an audit row. Cap, reference data, and Stage labels live in S2 tables and change only through audited use cases.

### ARCH-19 — One audit table, one writer, insert-only
*Binds FR-X-4, FR-A4-2, FR-R3-2, FR-M4-5. Prevents three audit vocabularies and an empty history view.*
**Rule:** `audit_events` is exactly S5; `auditRepository.record` is its only writer; reads order by `created_at, seq`; the S3 trigger raises on UPDATE or DELETE; history shown to Applicants and Recruiters carries the actor's role only.

### ARCH-20 — Migrations, seeds, test data
*Binds data, scaffold story, CI. Prevents two branches creating one table, a demo cast where it does not belong, and tests that depend on seeds.*
**Rule:** The Project Librarian lands the whole S2/S3 schema as one initial migration set before any use-case branch opens; later migrations are add-only, one per PR, timestamp-named, never renumbered, never importing `business/`; base and demo seeds, factories, and truncation follow S16.

### ARCH-21 — Repository workflow [ADOPTED: GitHub Issues]
*Binds repo, SC-3, SC-4. Prevents unreviewed pushes deploying to production and squash merges erasing graded per-member history.*
**Rule:** One GitHub issue per use case (FR IDs as a checklist) and per NFR needing work; branch `<issue>-<slug>` from `main`; PR into protected `main` with CI green and one non-author reviewer; merge commits, never squash; commit messages reference the issue. Merge is deploy.

### ARCH-22 — Jest everywhere [ADOPTED: Jest]
*Binds NFR-10, client, server. Prevents Vitest on the client by Vite default and three route-test styles.*
**Rule:** Server is CommonJS and runs Jest zero-config with supertest against the Express app and the disposable database; `business/` unit tests mock repositories with `jest.mock`. Client runs Jest through `babel-jest` with jsdom and React Testing Library, `*.test.jsx` beside the component; only `client/src/config.js` touches `import.meta.env`.

## Consistency Conventions

| Concern | Convention |
| --- | --- |
| Naming | tables plural `snake_case`; JS `camelCase`; enum strings S1; use-case files `verbNoun.js`; paths and verbs S10 |
| Data | UUID v4 keys; `timestamptz`, ISO 8601 in JSON; list-serving indexes S3; `expires_at` end-of-day in `TZ` |
| Errors | classes and codes S9; one HTTP mapping in `presentation/errors.js`; one `<ErrorAlert>` on the client |
| Responses | single resource is the object; lists use the S10 envelope; mutations return the resource |
| Config | S11 only, read once in `server/src/config.js`; the live Application Cap is never config |

## Stack

Majors as known at authoring; confirm at scaffold time (no web research was allowed in this run).

| Name | Version |
| --- | --- |
| Node.js / PostgreSQL | current LTS (22 or 24) / Neon's default major (17 or 18), pinned in `docker-compose.yml` and `ci.yml` |
| Express / Knex / pg | 5.x / 3.x / 8.x |
| React / Vite / React Router (library mode) / TanStack Query / MUI | 19 / 7.x / 7.x / 5.x / 7.x |
| Jest / babel-jest / jest-environment-jsdom / React Testing Library / supertest | 30.x / 30.x / 30.x / 16.x / 7.x |
| express-session / connect-pg-simple / bcrypt / multer / pino / express-rate-limit | current majors |

## Deferred

- **Request validation library** (server routes, reusable in client forms): scaffold story picks one library for both sides.
- **ESLint and Prettier**: scaffold story; the ARCH-03, ARCH-06, ARCH-14 greps become lint rules or a CI step.
- **Component library**: UX document (ARCH-07).
- **Poll interval, page sizes, sort fields**: story level.
- **Admin model option B** (D-005): UC-M5 adds modules under `business/organizations/`; the membership table already allows it.
- **Approving an already-expired Posting, lowering the cap below an Applicant's count, role-change side effects**: rules inside `reviewPosting`, `updateSettings`, `changeRole`; no shape changes.
- **Email notifications, AI features**: stretch; new use-case modules behind ARCH-13, never an event bus.

## Open Questions

1. **Render approval.** Requested in the rationale section; fallback is ARCH-16's Cloud Run alternative.
2. **Resume cap 2 MB versus PRD A-2's 5 MB.** Neon's free tier is about 0.5 GB, so `bytea` at 2 MB fits roughly two hundred files. Oleg confirms with the team; the PRD addendum carries the note; the escape hatch is an S3-compatible bucket behind the same `resumeFileRepository`.
3. **Postgres major** to pin once Neon provisions.

## Stack Rationale for Iteration 1 (departure from the course default)

*Audience: Dr. Ren. Course text: "It must be Maven-based, tested with JUnit… Alternative technologies are allowed when the team can provide an appropriate technical rationale; they must be properly documented during Iteration 1."*

| Course default | CareerBridge choice | Status |
| --- | --- | --- |
| Java, Spring Boot | Node.js, Express 5, plain JavaScript | approved verbally, early September 2026 (D-004); rationale below |
| Maven | npm workspaces | equivalent build tool |
| JUnit | Jest | "or an equivalent automated testing framework" |
| React | React 19 with Vite | as recommended |
| PostgreSQL or MySQL | PostgreSQL | as recommended |
| Google Cloud Platform | Render web service plus Neon Postgres | **approval requested** under "another approved deployment environment" |
| GitHub or GitLab, issue tracker | GitHub, GitHub Issues | as recommended |

**Node.js and JavaScript on both sides instead of Spring Boot.** The course already recommends React, so a Java backend makes this a two-language project. All five members know JavaScript; Java and Spring experience is uneven. One language means one build tool, one test runner, one set of conventions, and every member can work in any layer, which matters because each member must own at least three use cases end to end and commit history is graded per member. We chose JavaScript rather than TypeScript deliberately: a fifteen-week project with mixed experience gains more from removing a compile step and type ceremony than from static typing. The safety types would give at boundaries comes instead from request validation at the presentation layer, a fixed error vocabulary, and exhaustive state-machine tests (ARCH-12).

**The course's engineering goals are language-independent, and this document shows how each is met.** Multi-layered architecture: presentation, business logic, persistence, and data are four folders with a one-way dependency rule and a checkable boundary (ARCH-03, ARCH-04). Build: npm workspaces replace Maven; one `npm ci && npm test` builds and tests both halves (ARCH-05). Automated testing: Jest replaces JUnit on backend and frontend, with the requirement ID in every test name so a grep from any FR reaches its tests (NFR-10, ARCH-22). Traceability and tracking: GitHub Issues in the team repository, one issue per use case listing its FR IDs, commits referencing the issue, and each use case implemented as one business module owned by one student, so requirement → issue → design element → code → test is an issue number plus a file path (SC-3, ARCH-21). Continuous integration and deployment: GitHub Actions runs the full suite on every push and deploys only on green (ARCH-16). Exceptions and failure conditions: one business error vocabulary mapped once to HTTP (S9).

**PostgreSQL, derived from the requirements rather than preference (ARCH-01).** Three PRD rules are cheapest and safest to enforce in a relational engine. Accepting an offer must atomically move the Application to Hired, the Posting to Filled, every other active Application to Rejected, and create their Notifications, which is one transaction (FR-R6-2, FR-R6-3, NFR-4). "At most one open Offer per Posting" and "one non-withdrawn Application per Applicant per Posting", so that re-applying is possible only after a withdrawal, are partial unique indexes (A-18, FR-A3-3). The audit trail must be impossible to edit or delete, which a trigger guarantees (FR-X-4, NFR-5). PostgreSQL is also the course's recommended database and gives the Iteration 2 data-model deliverable a real schema. MongoDB was considered on the "JavaScript everywhere" argument and rejected because it would move all three rules back into application code.

**Jest** is the JUnit equivalent: one test API on backend and frontend, first-class in the Node ecosystem, supported by GitHub Actions without extra tooling.

**Deployment: Render plus Neon, with a request for approval.** Google Cloud Platform is the course's named environment; for a student team, Cloud SQL has no free tier and the billing, IAM, and CLI setup is a recurring cost of attention. Render's free web service and Neon's free Postgres cover NFR-7 (a public URL, reachable at each presentation) at no cost. The application is one Docker image configured only by environment variables (ARCH-16), so if GCP is required it deploys to Cloud Run with Cloud SQL without code changes. **We ask Dr. Ren to approve Render and Neon as the deployment environment.**

**Trade-offs we accept.** No static types, mitigated as above. A free host that sleeps, so the service is warmed through its health endpoint before each presentation. Free-tier database storage that bounds resume uploads at 2 MB for the semester (Open Question 2).

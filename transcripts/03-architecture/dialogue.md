

## Turn 01 — Oleg

/bmad-architecture _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05

Create the architecture "spine" for CareerBridge from the finalized PRD in that folder (`prd.md`, `addendum.md`, `.memlog.md`; the brief is in `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/`, team inputs in `inputs/`).

Please use **coaching mode** — I want to weigh the real trade-offs with you, not receive a draft. Ask me one decision at a time; I will answer and sometimes disagree.

What is already fixed by the team and must not be reopened:
- JavaScript end to end: Node.js backend, React frontend, deliberately **not TypeScript** (D-004). Dr. Ren approved the departure from the course default (Maven + JUnit) verbally; the **written rationale is due in Iteration 1** and must be a section of this document.
- Web application with a multi-layered architecture: presentation, business logic, persistence, data. The course grades layer separation and traceability (requirement ID → design → code → test).
- Tests with Jest; GitHub Actions on every push (NFR-10); GitHub Issues for tracking.

What is open and where I want your help:
- Database: the team leans PostgreSQL but has not ratified it. Argue it with me.
- Backend framework and project layout (Express vs Fastify vs NestJS-without-TS), and how the four layers map to folders so five students can work in parallel without merge conflicts.
- Frontend: React with which router / data-fetching approach, and whether we need any state library at all for this size.
- Authentication and role-based authorization (three roles, strict per-organization privacy — NFR-1, NFR-3).
- Where the state machines for Posting and Application live (PRD §3) and how the business layer enforces transitions (NFR-4).
- Deployment target: Google Cloud Platform (course default) vs a free tier such as Render or Railway for students.
- Data ownership: who owns Applications, Notifications, the audit records (FR-X-4).

Rules for the spine: record **only decisions that would conflict if two team members decided independently**, each with a stable ID (e.g. ARCH-01) so stories can cite it. No web research; no external handoffs; local files only. Keep it under two pages plus the rationale section.


## Turn 01 — Agent

Workspace is at `_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/` (`ARCHITECTURE-SPINE.md` seeded, `.memlog.md` running). Coaching path, one decision at a time, IDs as `ARCH-nn`.

My reading of the deliverable, correct me if wrong: the spine is the team's consistency contract, and it carries one extra section, the written stack rationale, whose reader is Dr. Ren at Iteration 1. I will keep the rationale in that section and out of the spine body.

**Decision 1: the database. Here is the argument.**

The strongest reason for PostgreSQL is not "the data is relational", it is three specific PRD rules that a relational engine enforces for you and a document store makes you hand-write:

- **Atomic cascade (FR-R6-2, FR-R6-3, NFR-4).** Accepting an offer moves the Application to Hired, the Posting to Filled, every other Active Application to Rejected, and creates a Notification per loser. NFR-4 says an invalid change leaves data unchanged. That is one transaction or it is a bug waiting for the demo.
- **"At most one Offer per Posting" (A-18) and "one active Application per Applicant per Posting" (FR-A3-3).** Both are partial unique indexes in Postgres. The business layer checks them, but the index makes the check impossible to bypass from a second code path.
- **Audit records that cannot be edited (FR-X-4).** Foreign keys plus a table with insert-only grants, which is also what "no Application without its owner" (NFR-5) means concretely.

The honest alternatives I weighed:

- **SQLite.** Zero setup, runs in CI with no service container, more than enough for 1,000 Postings and 10,000 Applications. It supports partial unique indexes and transactions too. It loses on one thing: on a free host like Render or Railway the filesystem is wiped on redeploy, so NFR-5 fails unless you pay for a disk. Developing on SQLite and deploying on Postgres is the worst of both, because dialect differences surface on demo day.
- **MySQL.** Equivalent to Postgres for this shape but no partial unique indexes and fewer free hosted tiers. Nothing gained.
- **MongoDB.** Already rejected in the brief for the Iteration 2 data-model deliverable, and it would put all three rules above back into application code.

The real cost of Postgres is setup friction: five laptops each need a local instance, and GitHub Actions needs a Postgres service container. Both are solved by one `docker-compose.yml` and about eight lines of workflow YAML, but someone owns that in Iteration 1.

So my lean is PostgreSQL, ratified now, with the setup cost named. What is actually holding the team back from ratifying it: setup friction, someone still arguing for Mongo, or just not having got to it? And do you see a fourth option I have missed?

<!-- turn 01 · 2026-09-05 20:38 · 93s · agent turns 15 · in 194 + cache 308014 / out 6962 tok · $1.5523235 -->


## Turn 02 — Oleg

Honest answer: nothing principled is holding the team back. The stack poll (D-004) only covered "JavaScript on both sides"; the database never came to a vote. One teammate did float MongoDB with the "JavaScript everywhere" argument, and the brief already answered that. The real hesitation is exactly what you named — five laptops, five local Postgres installs, and nobody has owned the setup.

So: **PostgreSQL ratified. Record it as ARCH-01.** Your three PRD-driven reasons (atomic cascade, partial unique indexes, insert-only audit) are better than the one I had, and I want them in the stack rationale section — Dr. Ren will like that the choice is derived from requirements, not from taste.

**Fourth option, on the setup friction, not on the engine:** a hosted serverless Postgres with a free tier — **Neon** (or Supabase's Postgres). No Docker on anyone's laptop; each developer gets a connection string; Neon can branch the database per Git branch, which fits five people working in parallel; and the same provider serves the deployed app on Render or Railway, so dev and prod are the same engine and the same dialect. Cost: one more external account and the free tier's limits (compute autosuspend, a few GB) — fine for 1,000 Postings. Risk: the demo depends on an internet service being up. Please weigh **Neon vs. local docker-compose + a Postgres service container in GitHub Actions**, and decide. I lean Neon for dev and prod, with `docker-compose.yml` kept in the repo as the offline fallback and for CI. Push back if that is the worst of both worlds again.

Also: I have a team meeting Monday. To finish in time, please take the remaining decisions **two at a time**, in this order: (2) backend framework + layer-to-folder layout, (3) frontend router/data-fetching/state, (4) auth + role-based authorization + per-organization privacy, (5) where the state machines live and how transitions are enforced, (6) deployment target, (7) data ownership for Applications, Notifications, audit records. Same style — your argument, your lean, then ask me.


## Turn 02 — Agent

ARCH-01 recorded with your three requirement-derived reasons earmarked for the rationale section.

**On Neon: not the worst of both worlds, but I would flip the default.** SQLite-dev/Postgres-prod was bad because the dialect differed. Neon and Docker are the same engine, so the only real question is where each developer's *test* database lives. Two things push me to local-first:

- **The Jest suite is the graded artifact (NFR-10) and it runs after every change.** Integration tests against a remote database with autosuspend pay a wake-up of a few seconds plus a network round trip per query. Locally the same suite runs in well under a second per test. Over a semester that is the difference between people running tests and people skipping them.
- **CI must be a service container regardless.** GitHub Actions should not hold a Neon secret that every pull request can read, and CI needs a throwaway schema per run. So Docker configuration exists in the repo either way.

Where Neon genuinely wins is production, and as the escape hatch for a teammate whose laptop cannot run Docker. So the decision I would record:

**ARCH-02 · One Postgres, three places.** Local Docker Compose is the default developer database and the CI database (service container). Neon hosts the deployed database. Same Postgres major version pinned in all three. The only thing that differs between environments is `DATABASE_URL`, and tests run only against a disposable database. A personal Neon branch is the sanctioned fallback for a developer who cannot run Docker.

If you still prefer Neon as the dev default, say so and I will flip it, with the cold-start caveat noted. Otherwise I record it as above.

---

**Decision 2: backend framework and layout.**

*Framework.* Performance is irrelevant at 25 users, so this is about structure and about what five students can learn from existing material.

- **NestJS without TypeScript.** Nest's value is enforced structure through decorators and dependency injection. In plain JavaScript that needs a Babel decorator setup and every tutorial is TypeScript. You would be paying Nest's ceremony while forgoing its payoff, and it quietly reverses D-004. Reject.
- **Fastify.** Faster and has JSON-schema validation built in, which is real value. Cost: far less teaching material, and its plugin encapsulation model surprises beginners.
- **Express 5.** Everybody has seen it, and version 5 finally propagates rejected promises from async handlers, so one error handler catches everything. It imposes no structure, which is fine because the spine imposes it.

Lean: Express 5. Verify the exact version when scaffolding.

*Query layer.* This is the persistence layer's identity, so it conflicts hard if left open.

- **Prisma.** Best developer experience. But the persistence layer collapses into `prisma.application.findMany` calls that students will make from services, which blurs the graded boundary, and partial unique indexes need hand-written SQL in its migrations anyway.
- **Raw `pg`.** Maximum clarity, but five people writing string SQL diverge on parameter style and error handling.
- **Knex plus `pg`.** Migrations in JavaScript, partial indexes supported, SQL still visible, and repositories are explicit functions. The rule "only files under persistence import knex" is one grep.

Lean: Knex.

*Layout.* The course wants to *see* four layers, and you want five people not colliding. Layer-first folders satisfy the grader. The collision problem is inside the business layer: the Application entity is touched by seven use cases owned by different people, so one `applicationService.js` would be a permanent merge conflict. The fix is granularity, not folder shape:

```text
server/src/
  presentation/   # express app, routers by resource, request validation, error→HTTP mapping
  business/       # one file per use case (e.g. applications/withdraw.js), domain errors
  persistence/    # one repository per entity, transactions; only place that imports knex
  data/           # migrations (timestamp-named), seeds, schema docs
client/src/
```

Business layer: one module per use case, named by the use case. That file is owned by the use-case owner, it is the "design element" a FR traces to, and its test file carries the FR IDs. Repositories are per entity and shared, so they hold no business rules, only queries and transactions. Routers are thin one-liners per endpoint, so conflicts there are trivial. Migrations are timestamp-named and never renumbered.

Dependency direction is one rule: presentation → business → persistence → data, never the reverse and never skipping. Business code never sees `req` or `res`.

Two things I want your call on: **(a)** Express and Knex, or do you want Fastify's built-in validation badly enough to take the smaller ecosystem? **(b)** one repo with `server/` and `client/` and root npm workspaces so CI runs one `npm test`, or two repositories? I lean one repo, since commit history and traceability are graded in one place.

---

**Decision 3: frontend.**

*Router.* Next.js is a server framework and would put presentation logic on the server, muddying the layer story. TanStack Router is excellent but TypeScript-first. React Router in plain library mode is the boring, documented choice. Lean: Vite + React + React Router.

*Data fetching.* This is the biggest divergence risk on the frontend. If five people write `useEffect` plus `fetch`, you get five loading states, five error conventions, and stale lists after every mutation. TanStack Query fixes all three: mutations invalidate queries, so advancing an Application refreshes the queue, and the unread-Notification count on every page (FR-A5-1) is one query with a refetch interval, which is the "light poll" the addendum already assumed. Pair it with a single `api.js` wrapper that owns base URL, cookies, and turning the server's error envelope into a thrown error. Lean: TanStack Query plus one wrapper, and a rule that components never call `fetch` directly.

*State library.* No. Server state lives in TanStack Query, the logged-in Account lives in one `useAuth` context, form state stays local. I would write the rule as a prohibition, because someone will otherwise add Redux in week eight.

*Component library.* The one you did not list, but it conflicts on day one and NFR-9 (labels, keyboard) and NFR-8 (375 px) depend on it. Hand-rolled CSS across five people fails both. Lean: MUI, because its form controls ship labels and keyboard handling. Tailwind is the alternative if the Design Engineer wants control, at the cost of building accessibility by hand.

Your call on: **(c)** TanStack Query plus wrapper, no state library, as stated? **(d)** MUI, Tailwind, or leave the component library to the UX document?

<!-- turn 02 · 2026-09-05 20:40 · 115s · agent turns 2 · in 34 + cache 82668 / out 7011 tok · $1.648577 -->

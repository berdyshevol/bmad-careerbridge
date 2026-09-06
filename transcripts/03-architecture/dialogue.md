

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


## Turn 03 — Oleg

You convinced me on the database placement. The test-speed argument is the one that matters — if the Jest suite is slow, people stop running it, and that suite is graded. **Record ARCH-02 as you wrote it:** local Docker Compose is the developer and CI database, Neon hosts production, same major version pinned, `DATABASE_URL` is the only difference, personal Neon branch is the fallback for a laptop that cannot run Docker.

Decision 2:
- **(a) Express 5 + Knex — agreed.** Your reason for rejecting Prisma is the one I will repeat to the team: it makes the persistence boundary invisible, and the boundary is graded. Record the rule "only files under `persistence/` import knex" as a checkable rule in the spine, not as prose.
- **(b) One repository, npm workspaces — agreed.** The team repo already exists (`careerbridge-csi5324`); the `server/` + `client/` layout goes into it in Iteration 1.
- The **one module per use case** idea in the business layer is the best thing in this document so far. It solves merge conflicts and gives every FR a file to trace to. Please make it explicit that the use-case module's test file is the place where FR IDs appear in test names (NFR-10).

Decision 3:
- **(c) Vite + React Router + TanStack Query + one `api.js` wrapper, no state library — agreed**, including the prohibition. Write the rule as "components never call fetch; no global state library" so it is greppable.
- **(d) Component library — pushback.** This is a UX decision and it belongs to our Design Engineer, not to the spine. Record only the *constraint* the library must satisfy: accessible form controls out of the box (labels, keyboard — NFR-9) and usable at 375 px (NFR-8). Name MUI as the default if the UX document does not choose otherwise, so nobody starts hand-rolling CSS in week one. `bmad-ux` runs right after this, so the decision will not stay open long.

I trust the pattern now. To save time, give me **decisions 4 to 7 in one message** — auth and role-based authorization with per-organization privacy; where the two state machines live and how transitions are enforced (NFR-4); deployment target; data ownership for Applications, Notifications, and audit records. Same style: argument, lean, and the questions you need me to answer. After my reply, finalize the spine with the stack rationale section for Dr. Ren.


## Turn 03 — Agent

ARCH-02 through ARCH-07 are logged as you settled them. Here are decisions 4 to 7.

---

**Decision 4: authentication, roles, per-organization privacy.**

*Session mechanism.* The PRD quietly rules out stateless tokens. Suspending an Account must refuse its existing session on the next request (FR-M3-2), and the 8-hour *idle* timeout (A-26) is a sliding window. Both need the server to look at the Account on every request, so a JWT would buy statelessness you cannot use, and storing it in the browser adds an XSS surface for nothing. Lean: server-side session stored in Postgres, HTTP-only SameSite cookie, rolling 8-hour expiry, bcrypt for passwords. The per-request session load also makes a role change effective immediately, which FR-M3-4 will need.

*Single origin.* Cookies get painful across origins, and CORS is a week of student debugging. If Express serves the built client in production and Vite proxies `/api` in development, there is one origin, no CORS, and the cookie just works. This also makes deployment one service. Lean: single origin, API under `/api`.

*Where authorization lives.* The addendum's three-step check (role, then Organization, then record) is right, but the layers matter for the grade. Role is coarse and declarative, so it belongs in presentation as route middleware. Organization scope and record ownership are business rules that must hold whichever route calls the use case, so they belong in the business layer. The mechanism: every use-case module takes an `actor` (account id, role, organization id, recruiter approval status) as its first argument and refuses out-of-scope work itself. And one subtle rule that makes FR-R3-3's "never appears in any list" true by construction: recruiter-facing repository queries take the Organization as a mandatory parameter and put it in the WHERE clause. Filtering after the query is how another Organization's rows leak.

*Refusal shape.* The PRD says another Organization's record is "refused as forbidden", so 403. The alternative is 404 to hide that the record exists at all (FR-R3-4 is about counts, but IDs leak existence too). I lean following the PRD with 403 and noting that IDs should be non-sequential (UUIDs) so enumeration tells nothing.

Questions: **(a)** cookie session in Postgres, single origin with `/api`, as stated? **(b)** 403 per the PRD, or 404 to hide existence?

---

**Decision 5: the two state machines and NFR-4.**

*Where the machines live.* Three places people would put them: scattered `if` checks inside each use case, a database trigger, or one pure module per machine. Scattered checks diverge by week three. Triggers hide the rule from the graded business layer and are hard to unit-test. Lean: two pure modules in the business layer, `postingStatus.js` and `applicationStage.js`, each exporting the allowed-transition map and an `assertTransition(from, to)` that throws a human-readable `InvalidTransitionError`. No I/O, so the exhaustive unit test of every allowed and forbidden edge is cheap, and that test *is* the NFR-4 evidence. The database enforces only valid values (CHECK constraint), never transitions.

*How a change is committed.* This is the rule that prevents the most divergence. Every state change is one transaction containing three things: the row update guarded by `WHERE status = <expected from>`, the audit row, and any Notification the change creates. The guard means two recruiters clicking at the same time cannot both succeed. The business layer decides the boundary but must not import Knex, so persistence exposes `withTransaction(fn)` and the use case passes the handle to repositories opaquely.

*Cascades.* Accepting an offer touches both machines and other Applications (FR-R6-2, R6-3). Lean: a cascade is one use-case module, one transaction. Explicitly no in-process event bus, because "emit `application.rejected`, a listener writes the Notification" is exactly what someone will build in week six, and it puts the Notification outside the transaction and outside traceability.

*Expiry.* A scheduler on a free host that sleeps is unreliable, and expiry has no actor so it cannot even produce a proper audit row. Lean: Expired is a derived state. The stored status stays Live; one predicate in the posting repository defines "effectively Live" as Live and not past expiry, and every reader (Job List, apply check, oversight counts) goes through it. The state module treats Expired as computed input for the Expired to Filled edge.

Questions: **(c)** pure transition modules in the business layer, database checks values only? **(d)** expiry computed on read, no scheduler? **(e)** no event bus, Notifications written inside the use-case transaction?

---

**Decision 6: deployment.**

*Host.* Google Cloud Platform means Cloud Run plus Cloud SQL. Cloud Run has a free tier but Cloud SQL does not, and the billing account, IAM, and `gcloud` setup is a real tax on a five-student team. Render's free web service sleeps after inactivity and takes about a minute to wake, which is fine for NFR-7 if someone warms it before the presentation. Render's free Postgres expires after thirty days, which is why Neon holds the database. Railway no longer has a lasting free tier as far as I know, only trial credit. Lean: Render web service plus Neon, with Cloud Run as the alternative if Dr. Ren insists on GCP. The invariant that makes the host swappable: the app ships as one Docker image running Express serving the built client, configured only by environment variables, no local disk. The course text says "or another approved environment", so the rationale section should ask for Render's approval explicitly.

*Resume bytes.* This falls out of "no local disk". Object storage means another account and signed URLs. Postgres `bytea` at 5 MB per file and demo scale is trivial and keeps one connection string and one backup. Lean: `bytea` in a separate `resume_files` table so list queries never drag bytes, immutable rows, which also gives FR-A3-5's snapshot for free.

*CI.* GitHub Actions on every push runs lint and both Jest suites against a Postgres service container; Render auto-deploys `main` on green.

Questions: **(f)** Render plus Neon with Cloud Run as the named alternative, and a request for approval in the rationale? **(g)** resumes as immutable `bytea` rows in Postgres?

---

**Decision 7: data ownership.**

"Owner" here means the parent whose existence the row cannot outlive (NFR-5), plus which layer may write it.

- **Application.** Two mandatory parents: the Applicant Account and the Posting. Created only by the apply use case, mutated only by the transition modules. Stage history is *not* a second table. It is read from the audit table. The rejection reason lives only on the audit event, never duplicated on the Application row, so the two cannot disagree. Interviews are their own table owned by the Application.
- **Notification.** Owned by the recipient Account. Written only inside a use-case transaction. The recipient may flip read/unread and nothing else. It carries an entity type and id so FR-A5-2's link is data, not a URL string. Never deleted.
- **Audit events.** One table for everything FR-X-4 names: entity type and id, field, old value, new value, actor, reason, timestamp. Insert-only, enforced by a database trigger that raises on UPDATE or DELETE, so the guarantee does not depend on discipline. It serves the Applicant's Stage history (FR-A4-2), the Recruiter's view (FR-R3-2), and the Administrator's change history (FR-M4-5). Cascade rows record the actor whose action triggered them, so "Position filled" rejections carry the accepting Applicant.
- **Business rules and Reference Data.** A `settings` table for the Application Cap and similar, small tables with an `active` flag for categories and locations, a label table for Stage names. Changes are audited like any other transition.
- **Resume.** Owned by the Applicant; a new upload inserts a new immutable row and points the profile at it, so past Applications keep their version.

Questions: **(h)** Stage history read from the audit table rather than stored twice? **(i)** immutability enforced by trigger, not convention? **(j)** anything above where your team already has a different instinct?

Answer these and I finalize: distill the spine, reconcile against the PRD, run the reviewer gate, write the rationale section for Dr. Ren.

<!-- turn 03 · 2026-09-05 20:43 · 141s · agent turns 3 · in 66 + cache 175367 / out 9590 tok · $2.0099417500000003 -->


## Turn 04 — Oleg

Answers, then finalize.

**Decision 4.** (a) Yes: server-side session in Postgres, HTTP-only SameSite cookie, rolling 8-hour expiry, bcrypt; single origin with the API under `/api`, Vite proxy in dev, Express serving the built client in prod. The "actor as first argument of every use-case module" rule and "Organization is a mandatory WHERE parameter in recruiter-facing repository queries" are the two rules I want written as checkable rules in the spine — they are how we will *prove* FR-R3-3 in the demo. (b) **403 per the PRD, plus UUIDs.** I do not want to reopen a PRD decision from the architecture document; if Dr. Ren prefers hiding existence we change one line later.

**Decision 5.** (c) Yes, pure transition modules in the business layer, database checks values only. (d) Yes, expiry computed on read, no scheduler — and please make the single "effectively Live" predicate an explicit rule, because the first bug in week seven will be a list that forgot it. (e) Yes, no event bus; Notifications written inside the use-case transaction. Record the event-bus prohibition the same way as the state-library one.

**Decision 6.** (f) Yes: Render web service + Neon, Cloud Run as the named alternative, one Docker image configured by environment variables, and an explicit request for Render's approval in the rationale section. (g) **Pushback on resumes as `bytea`.** Neon's free tier is about 0.5 GB of storage. At the PRD's 5 MB per file, one hundred resumes fill it — and our demo data plus five developers testing uploads will get there faster than you think. Two options: lower the cap to 2 MB and accept that the limit is a known risk for the semester, or use object storage now. I lean **`bytea` with a 2 MB cap and the storage limit recorded as a named risk with object storage as the escape hatch** — it keeps one connection string, which matters more to a student team than elegance. Adjust the PRD assumption A-2 via the addendum note; I will confirm with the team.

**Decision 7.** (h) Stage history read from the audit table — yes, but record it as a conscious trade-off: it couples the applicant-facing history to the audit format. Acceptable for one semester because it removes a whole table and a class of "two sources disagree" bugs. (i) Yes, trigger, not convention. (j) Two team instincts you should pre-empt in the spine, because someone will propose each by week six: a JWT in localStorage "because that is what the tutorial did", and an in-process event emitter for notifications. You have already answered both; just make them explicit "we decided against" lines with the reason.

Now finalize: distill the spine (only conflict-if-independent decisions, ARCH-nn IDs), reconcile against the PRD, run the reviewer gate, and write the **stack rationale section for Dr. Ren** — Node/React/JavaScript-not-TypeScript instead of Maven/JUnit, PostgreSQL derived from the PRD rules, Jest, Render + Neon with the approval request. Local files only, no external handoffs. Tell me the final paths and what BMAD recommends next.


## Turn 04 — Agent

Lint is clean. The spine body is about 2,400 words, which is over the two-page target, so I will cut after the reviewers report. Six reconcile and review agents are running in parallel now; I'll apply their fixes when they return.

<!-- turn 04 · 2026-09-05 20:46 · 1560s · agent turns 13 · in 162 + cache 491255 / out 21554 tok · $24.96200375 -->



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

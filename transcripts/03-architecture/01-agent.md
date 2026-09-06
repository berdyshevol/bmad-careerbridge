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
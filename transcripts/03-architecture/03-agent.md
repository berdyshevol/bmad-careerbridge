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
---
title: "Adversary review — ARCHITECTURE-SPINE.md (CareerBridge)"
lens: adversary
target: ../ARCHITECTURE-SPINE.md (draft, 2026-09-05)
prd: ../../../prds/prd-bmad-careerbridge-2026-09-05/prd.md
reviewed: 2026-09-05
verdict: NOT YET BUILD-SAFE — 2 critical, 8 high, 6 medium, 3 low holes; all closable with tightened rules and convention rows, no paradigm change
---

# Adversary review

**Method.** The level below the spine is five students on parallel branches, each writing use-case modules (`business/<area>/<useCase>.js`), shared repositories, routes, migrations, and React pages. For each finding I construct two units that each obey every ARCH rule to the letter and still cannot be merged or run together, then state the rule that would have stopped it. Rule text is written in the spine's Binds / Prevents / Rule style so it can be pasted.

**Verdict.** The spine fixes the big shapes well (one module per use case, guarded transaction, audit as history, derived Expired, actor-in-business). What it leaves open is the *vocabulary* that separately written units share: string literals (`entity_type`, enum values, error codes), parameter positions (the transaction handle), one predicate that is defined twice by accident (stored vs effective Posting status), and file-level merge collisions (migrations, one route file serving two roles). Every hole below is closable in the spine; none requires a new component.

---

## Critical

### C1 — ARCH-13's guard and ARCH-15's derived status disagree about "from" for an Expired Posting

**Units.** Student A writes `applications/acceptOffer.js`; Student B writes `business/domain/postingStatus.js`.

**How each obeys.** B (ARCH-12) copies PRD §3 verbatim: the map has `expired → filled` and `live → filled`, states include `expired`. A (ARCH-13, ARCH-15) reads the Posting, computes the effective status with `isEffectivelyLive`, calls `assertTransition(effective, 'filled')`, then runs the guarded update `WHERE status = <expected from>`.

**Clash.** For an Expired Posting the effective status is `expired` but the stored status is `live` (ARCH-15: "the stored status stays `live`"). A's guard `WHERE status = 'expired'` matches zero rows, A interprets zero rows as a concurrent change (that is what ARCH-13 says the guard is for) and returns 409. FR-R6-2 ("from Live or Expired to Filled") fails on exactly the demo path UJ-3 sets up. A second student who guards on the stored value instead (`WHERE status = 'live'`) passes, so the two implementations of "the same rule" differ, and the exhaustive ARCH-12 test cannot catch it because the mismatch is between layers. The same trap hits `postings/closePosting` (FR-R2-6 "Live"), `admin/closePosting` (FR-M2-5), `submitPosting`, and every reader of FR-R4-4 ("Filled or Closed", where Expired continues normally, so `isEffectivelyLive` is the *wrong* predicate and a student who reaches for it because ARCH-15 calls it the only definition breaks A-20).

**Close — tighten ARCH-13 and ARCH-15.**
- ARCH-15 Rule, add: "Every Posting read selects `effective_status` = `CASE WHEN status = 'live' AND expires_at <= now() THEN 'expired' ELSE status END` from one Knex fragment in `postingRepository`; `isEffectivelyLive` is `effective_status = 'live'`. Business code reads only `effective_status`; the stored `status` never leaves persistence except as the guard value. FR-R4-4 uses `effective_status NOT IN ('filled','closed')`, not `isEffectivelyLive`."
- ARCH-13 Rule, add: "`assertTransition(from, to)` takes the *effective* status; the guarded UPDATE compares the *stored* status: `postingRepository.transition(conn, id, { expectedStored, to })` maps `expired` → `'live'` internally so no use case ever writes `WHERE status = 'expired'`. Zero rows updated throws `ConcurrentChangeError` (409), never a silent no-op."

### C2 — Three audit writers, no shared row vocabulary; the history views are built by a fourth student on empty results

**Units.** Student A audits a Stage change in `advanceApplication.js`; Student B audits a Posting status change in `admin/reviewPosting.js`; Student C audits the cap change in `admin/updateSettings.js`; Student D builds FR-A4-2 (`getMyApplication`) and FR-M4-5 (`admin/viewRecordHistory`).

**How each obeys.** ARCH-18 lists the columns by meaning only: "entity type and id, field, old and new value, actor, reason, timestamp". A writes `entity_type: 'application', field: 'stage', old: 'applied', new: 'screening', reason: null`. B writes `entity_type: 'postings'` (table name, per the naming row "tables plural"), `field: 'status'`. C writes `entity_type: 'settings', entity_id: <settings row uuid>, field: 'application_cap', old: '5', new: '3'`, or, equally rule-abiding, `entity_type: 'setting', entity_id: null` because the setting's natural key is a string and the column is `uuid` (ARCH-11 "all primary keys are UUIDs"). D queries `WHERE entity_type = 'application' AND field = 'stage' ORDER BY created_at`.

**Clash.** D's Application history works for A and is empty for anyone who wrote `'applications'`; the admin history for a Posting is empty for B's rows; C's row either violates NOT NULL on `entity_id` or cannot be joined back to a setting. Nullable `reason` is undecided (A: null; the cascade rows: "Position filled"; a student adding `NOT NULL` in the migration breaks A). `old`/`new` column types are undecided (`text` vs `jsonb`; C might store the number 5 as jsonb, A a string). The timestamp column is named three ways (`created_at`, `occurred_at`, `at`). Recruiter-request approval (FR-M1-2) changes two entities; one student writes one row (`entity_type: 'recruiter_request'`, an entity that has no table), another writes two. Nothing in ARCH-18 stops any of this, and the failure is silent: no exception, just a blank history at the demo.

**Close — new ARCH-19 (split out of ARCH-18) with the row fixed verbatim.**
- **Binds:** FR-X-4, FR-A4-2, FR-R3-2, FR-M4-5, `persistence/auditRepository`
- **Prevents:** history views that read rows written under a different vocabulary
- **Rule:** `audit_events(id uuid, seq bigserial unique, entity_type text CHECK IN ('account','organization','organization_member','posting','application','setting','category','location','stage_label'), entity_id uuid NOT NULL, field text NOT NULL, old_value text NULL, new_value text NULL, actor_account_id uuid NOT NULL REFERENCES accounts, reason text NULL, created_at timestamptz NOT NULL DEFAULT now())`. `entity_type` is the singular of the table name; `field` is the column name as stored; values are the stored enum strings or the value cast to text. Reference rows (`settings`, `categories`, `locations`, `stage_labels`) have UUID ids so `entity_id` is never null. One row per entity changed; a use case that changes two entities writes two rows in one transaction. `auditRepository.record(conn, { entityType, entityId, field, oldValue, newValue, actorAccountId, reason })` is the only writer. History reads `ORDER BY created_at, seq` (Postgres `now()` is transaction-stable, so cascade rows share a timestamp; `seq` breaks ties). Creation writes a row with `old_value NULL` so every Application's history begins with `applied`.

---

## High

### H1 — Application Cap under concurrency: ARCH-13's guard is an UPDATE guard; `submitApplication` is an INSERT

**Units.** Student A writes `applications/submitApplication.js`; Student B writes `admin/updateSettings.js`.

**How each obeys.** A opens `withTransaction`, counts the Applicant's Active Applications, compares to the cap, inserts, writes audit and no notification. Every step is inside one transaction as ARCH-13 demands. B stores the cap in `settings` (ARCH-18).

**Clash.** Two simultaneous submissions by one Applicant both count 4, both insert, the Applicant ends at 6 with cap 5. Postgres READ COMMITTED does not stop it; the FR-A3-3 partial index is per Posting and does not either; ARCH-13's `WHERE status = <expected from>` has nothing to attach to on an INSERT. Separately, the convention row says "the 8-hour timeout and default cap are environment values", so a rule-abiding A reads `config.applicationCap` from `config.js` on every request; B's change to the `settings` table is then ignored and UJ-3's "the Administrator changes the cap and the next submission obeys it" fails live.

**Close — tighten ARCH-13 and the Auth-and-config row.**
- ARCH-13 Rule, add: "An insert whose admissibility depends on a count (FR-A3-4) first locks the Applicant's `applicant_profiles` row `FOR UPDATE` in the same transaction, then counts, then inserts. The cap is read inside that transaction through `settingsRepository.get(conn, 'application_cap')`, never from config."
- Convention row, replace: "config read once from environment in `server/src/config.js`; the 8-hour idle timeout is an environment value; the *default* cap is inserted by the settings migration (5) and the live value is only ever read from `settings`."

### H2 — `actor` has a listed shape but no builder, no null case, and no fixed request property

**Units.** Student A writes `middleware/auth.js` and `routes/postings.js`; Student B writes `routes/applications.js` and `routes/organizations.js` (FR-R1-3 status page).

**How each obeys.** ARCH-10 lists the four fields; ARCH-08 says every request reloads the Account. A builds `req.actor = { accountId, role, organizationId, recruiterStatus }` and, for a visitor on the public Job List, passes `null` to `listLivePostings(actor, ...)`. B builds `req.user`, gives Applicants `organizationId: undefined` (A gives `null`), passes `{ role: 'visitor' }` for anonymous, and for a Pending Recruiter sets `organizationId` to the pending Organization because FR-R1-3 needs to show it, whereas A sets it only once Approved because ARCH-10's role check says "for Recruiters, Approved status". A names the middleware `requireRole('recruiter')` and folds the Approved check into it; B needs the same role *without* the Approved check for the status page route and writes `requireRecruiterAnyStatus`. A suspended Account: A destroys the session and returns 401; B returns 403 "forbidden".

**Clash.** Two request properties (`req.actor` vs `req.user`); `organizationId === null` checks in business fail on `undefined`; `getPosting` (FR-A2-2, visitor *or* applicant-who-applied) receives `null` from one route and an object from another; the Pending Recruiter cannot see which Organization on B's page under A's builder.

**Close — tighten ARCH-10 and the Auth row.**
- ARCH-10 Rule, add: "`middleware/auth.js` builds `req.actor` on every request: `{ accountId, role: 'applicant'|'recruiter'|'administrator', organizationId: uuid|null, recruiterStatus: 'pending_approval'|'approved'|'rejected'|null, accountStatus }`; fields are always present, `null` not `undefined`; `organizationId` is the membership row's Organization whatever its status. An anonymous request has `req.actor = null` and public use cases accept `null`. Exactly two guards exist: `requireAuth(...roles)` and `requireApprovedRecruiter`; no route writes its own. A Suspended Account gets its session destroyed and 401 with code `account_suspended`."

### H3 — `isEffectivelyLive` is named as one thing but must be three: a WHERE fragment, a row predicate, and a count expression

**Units.** Student A writes `postings/listLivePostings.js` + `postingRepository.listLive`; Student B writes `applications/submitApplication.js`; Student C writes `admin/oversightCounts.js` (FR-M4-4 "Postings by status").

**How each obeys.** ARCH-15 says `postingRepository.isEffectivelyLive` is the only definition. A needs it in SQL (1,000 Postings, NFR-6, pagination) and writes `whereRaw("status = 'live' AND expires_at > now()")`. B loads the row and writes `postingRepository.isEffectivelyLive(row)` as a JS predicate using `new Date()`. C needs Expired as a bucket and writes a `CASE` in SQL. All three call theirs `isEffectivelyLive` or defer to it.

**Clash.** Three definitions, two clocks (Render's Node process vs Neon's `now()`), and one type question the spine never settles: FR-R2-1 says "expiry *date*", so one student declares `expires_at date` (expires at midnight of which zone?) and another `timestamptz` per the Ids-dates-enums row. Around expiry the Job List and the apply check give different answers and UJ-3's "Expired Postings are absent" can pass in the list and fail in the apply.

**Close — folded into C1's ARCH-15 tightening, plus:** "`expires_at timestamptz`, set by `createPosting` to the end of the chosen calendar day in the server's configured zone (`TZ` env); the database clock `now()` is the only clock for expiry and audit timestamps; business code never calls `Date.now()` for a rule."

### H4 — The transaction handle: three ways to pass it, all "opaque"

**Units.** Student A writes `applicationRepository`; Student B writes `postingRepository`; Student C writes `notificationRepository`.

**How each obeys.** ARCH-13: "passes the handle to repositories opaquely". A: `updateStage(trx, id, from, to)`. B: `transition(id, from, to, { trx })`. C: a factory, `notificationRepository(trx).create(...)`. All opaque, all tested.

**Clash.** `acceptOffer.js` calls all three in one transaction and needs three calling conventions; a read-only use case (`listMyApplications`) has no transaction and A's signature forces `updateStage(db, …)` while B's allows omitting the option. Business code cannot import `knex` (ARCH-03), so the only source of `db` is `persistence/db.js`, which the spine never says business may import (ARCH-04 says business → persistence is fine, ARCH-03's grep only catches `knex`, so this is legal but unstated).

**Close — new convention row "Repositories".** "Every repository function takes `conn` as its first parameter (a Knex instance or transaction); use cases pass the `trx` from `withTransaction(async trx => …)` for writes and `db` (exported by `persistence/db.js`, the one import business may take from persistence besides repositories) for reads. `withTransaction` returns the callback's value, rolls back on throw, is never nested. Repository functions return plain objects with `camelCase` keys (one `toCamel` in `persistence/`), never Knex builders."

### H5 — Error envelope has no room for FR-A3-4's count and cap or FR-A3-2's profile link; `api.js` has no error contract for pages

**Units.** Student A writes `submitApplication` + `routes/applications.js`; Student B writes `api.js` and the Job Detail page; Student C writes the Withdraw button.

**How each obeys.** The envelope row is `{ error: { code, message } }`. A must show "the current count and the cap" (FR-A3-4) and "links to the profile page" (FR-A3-2), so A either bakes numbers into `message` or adds `details` (breaking the row). B makes `api.js` reject with the raw `Response`; C makes it throw `new Error(message)`. B's page shows a Snackbar, C's a Dialog, a third page catches nothing. A 401 from an expired session is handled by every page or by none. `code` values are invented per use case (`'INVALID_TRANSITION'`, `'invalid-transition'`, `'cap_reached'`).

**Clash.** The Job Detail page cannot render the cap refusal or the profile link without parsing English; each page renders a 409 differently, and NFR-8's five-minute usability test sees three error styles.

**Close — tighten the Error-envelope row.** "`{ error: { code, message, details? } }`; `code` is lowercase `snake_case` from the fixed list exported by `presentation/errors.js` (`validation_failed`, `unauthenticated`, `account_suspended`, `forbidden`, `not_found`, `invalid_transition`, `concurrent_change`, `duplicate_application`, `application_cap_reached` with `details: { count, cap }`, `profile_incomplete` with `details: { missing: [...] }`, `offer_already_open`, `rule_violation`). `client/src/api.js` throws `ApiError { status, code, message, details }`, handles 401 once (clears `useAuth`, redirects to login), and pages render any other error through one `<ErrorAlert error={…}>`. Postgres `23505` on the two partial indexes is caught in the repository and rethrown as `DuplicateApplicationError` / `OfferAlreadyOpenError` (409); every other database error is 500, never swallowed."

### H6 — Migrations on parallel branches: two students create the same table or the same trigger

**Units.** Student A (UC-A5 owner) writes `20260912_create_notifications.js`; Student B (UC-R4 owner, needs to write Notifications for FR-A5-3) writes `20260913_create_notifications.js`. Student C (UC-A3) creates `applications`; Student D (UC-R5) creates `interviews` with a FK to `applications` and, because C's branch is not merged yet, also creates `applications` "temporarily".

**How each obeys.** The data-layer rule is only `<timestamp>_<name>.js, never renumbered`. Every file is well-formed and each branch's CI is green against its own disposable database.

**Clash.** After merge, `migrate:latest` fails on the second `CREATE TABLE`; or, if both used `createTableIfNotExists`, the second silently skips and the columns it needed are missing. Knex runs pending migrations in timestamp order, so a branch merged later with an earlier timestamp reorders production's history on Neon relative to CI.

**Close — new ARCH-20 (data layer).**
- **Binds:** `data/migrations`, scaffold story, CI
- **Prevents:** two branches creating one table; a trigger defined twice; down migrations nobody ran
- **Rule:** the scaffold story lands the whole ER diagram (every table drawn, the four reference tables, `sessions`, the audit trigger, the two partial indexes, default rows for `settings` and `stage_labels`) as one initial migration set owned by the Project Librarian before any use-case branch opens. Later migrations only add columns or indexes, one migration per PR, never create a table already drawn, and a column on a shared table (`applications`, `postings`, `accounts`) is added by the Librarian on request. CI runs `migrate:latest` from an empty database, then `migrate:rollback --all`, then `migrate:latest` again. Migration files never import from `business/`.

### H7 — One route file, one path, two roles, two meanings: `GET /api/applications`

**Units.** Student A (UC-A4) writes `GET /api/applications` returning the Applicant's own list in `routes/applications.js`; Student B (UC-R3) writes `GET /api/applications?postingId=` returning the Organization's list in the same file.

**How each obeys.** Naming row: "routes plural nouns, actions as `POST /api/<resource>/:id/<verb>`". Both are plural nouns; both go through ARCH-10 middleware.

**Clash.** Same method and path registered twice; Express takes the first. A merge produces one handler that must switch on role, which moves the role decision from middleware into the handler (against ARCH-10 (1)) and lets one forgotten branch return the wrong scope (against FR-R3-4). `GET /api/postings/:id` likewise means "public detail" (A2) and "org detail with rejection reason" (R2-5) and "admin read-only with history" (M4-5).

**Close — tighten the Naming row.** "Paths are scoped by who is acting: `/api/postings…` public reads only; `/api/me/…` the actor's own records (Applicant profile, applications, notifications, recruiter status page); `/api/org/…` the Approved Recruiter's Organization (`/api/org/postings`, `/api/org/postings/:id/applications`, `/api/org/applications/:id/advance`); `/api/admin/…` Administrator. One router file per scope prefix (`routes/public.js`, `me.js`, `org.js`, `admin.js`, `auth.js`), each mounting its guard once at the top. A resource reachable in two scopes has two paths and two use-case modules, never one handler switching on role."

### H8 — Recruiter status has three candidate homes; `actor.recruiterStatus` is read from one, written to another

**Units.** Student A writes `organizations/requestRecruiter.js` (FR-R1-1/2); Student B writes `admin/reviewRecruiterRequest.js` (FR-M1-2/3); Student C writes `middleware/auth.js`.

**How each obeys.** PRD §3: "a Recruiter Account is additionally Pending Approval, Approved, or Rejected"; the ER diagram has `ORGANIZATION_MEMBER`. A creates the membership row on request with `status: 'pending_approval'`. B, reading "Recruiter *Account* is Pending", updates `accounts.recruiter_status`. C reads `organization_members.status`. Each cites ARCH-18 ("two owners of one entity" prevented) and each thinks the entity is theirs.

**Clash.** Approval never reaches the actor; every Approved Recruiter is refused at `requireApprovedRecruiter`. FR-M1-1's queue joins the wrong table. If instead B creates the membership row only on approval, A's Pending Recruiter has no Organization to show on FR-R1-3's status page and H2's `organizationId` is null.

**Close — tighten ARCH-18.** "Recruiter status lives only on `organization_members(account_id unique, organization_id, status, decided_at)`, created `pending_approval` by `requestRecruiter`, mutated only by `reviewRecruiterRequest` and `admin/changeRole` (which inserts or updates the row). `organizations.status` is separate and moves to `approved` in the same transaction when the request created the Organization. `accounts` carries `role` and `status` (`active`/`suspended`) only. `actor.recruiterStatus` and `actor.organizationId` are read from the membership row."

---

## Medium

### M1 — Notification body: composed text or a `kind` the client renders? Who computes the link?

**Units.** Student A writes `notificationRepository.create` for `advanceApplication` with `{ recipientAccountId, entityType, entityId, message: 'Your application to Acme was moved to Screening' }`; Student B writes `rejectApplication` with `{ …, kind: 'application_rejected', reason }` and no message, expecting the client to render "Rejected: <reason>"; Student C writes the Applicant Notifications page; Student D the Recruiter one.

**How each obeys.** ARCH-18 requires only recipient, `entity_type`, `entity_id`, `read_at`. FR-R4-2 requires the reason "verbatim", FR-A5-2 requires "follow it to the Application or Posting". Both A and B satisfy the letter.

**Clash.** C's page renders `message` and shows blank for B's rows; D's page maps `application → /org/applications/:id` and C's maps `application → /me/applications/:id`; two pages, two link tables, and a Recruiter notification about a Posting (FR-M2-2) that D forgot links nowhere. A message that bakes in a Stage label at write time contradicts FR-M4-3 once labels change (minor, but two students will argue it).

**Close — tighten ARCH-18 (Notification sentence).** "`notifications(id, recipient_account_id NOT NULL REFERENCES accounts, kind text CHECK IN (application_advanced, application_rejected, offer_extended, interview_recorded, position_filled, offer_declined, posting_approved, posting_rejected, posting_closed, recruiter_request_decided), entity_type, entity_id, body text NOT NULL, read_at NULL, created_at)`. `body` is composed server-side at write time by the use case, contains any reason verbatim, and names Stages by their *stored* value; the client substitutes labels. The link is computed on the client by one function `notificationHref(actor, entityType, entityId)` in `client/src/notifications/href.js`; there is one Notifications page for all roles. Unread count is `GET /api/me/notifications/unread-count`, one query, one refetch interval."

### M2 — Stage history: creation row, "last Stage change" time, interview placement, ordering

**Units.** Student A writes `submitApplication` (no audit row: "nothing changed, it was created"); Student B writes `listMyApplications` (FR-A4-1 "time of the last Stage change" as `MAX(audit.created_at)`); Student C writes `getMyApplication` merging Interview rows into the history timeline; Student D writes `recruiter getOrgApplication` returning `interviews` as a separate array.

**How each obeys.** ARCH-18: history read from audit only, Interviews owned by the Application. All four comply.

**Clash.** B's list shows null for every brand-new Application; the 10,000-Application list (NFR-6) does a correlated subquery per row; C and D return different JSON for what the Applicant and the Recruiter both call "the history" (FR-A4-2 and FR-R3-2), so a shared `<StageHistory>` component cannot exist. Ties inside one transaction sort randomly (see C2 `seq`).

**Close — tighten ARCH-18.** "`applications` carries `stage` and `stage_changed_at`, both written in the same guarded UPDATE (a cache of the latest audit row, allowed because it is written in the same statement as the change; `applications.created_at` doubles as the first value). `submitApplication` writes the `NULL → applied` audit row. Application detail responses for Applicant, Recruiter, and Administrator share one shape: `{ application, history: [{ at, field, oldValue, newValue, reason, actorRole }], interviews: [{ scheduledAt, notes, outcome, outcomeNotes }] }`, built by one `applicationRepository.findWithHistory(conn, id)`; Interviews are never merged into `history`."

### M3 — Seeds: tests that depend on Sam, tests that truncate Sam

**Units.** Student A's route test logs in as seeded `sam@acme.example` and asserts on his Postings; Student B's repository test truncates every table in `beforeEach`; Student C's `submitApplication` test truncates and then crashes because the `settings` cap row was a seed.

**How each obeys.** ARCH-02: "tests run only against a disposable database". Nothing says whether seeds are part of that database or what a test may assume.

**Clash.** Suite order decides who passes. The FR-X-5 Administrator seed must run on Neon; the demo people must not; both live in `seeds/`.

**Close — new convention row "Seeds and fixtures".** "`data/seeds/00_administrator.js` is idempotent, runs in every environment, takes the password from `ADMIN_PASSWORD`. `data/seeds/demo/` (Acme Waco, Bear Staffing, Sam, Maria, Devon, Priya, one Live and one Expired Posting) runs only via `npm run seed:demo`, never in CI. Default rows for `settings`, `stage_labels`, `categories`, `locations` are inserted by migrations, not seeds. Tests never assume a seed: each test file creates its own rows through `server/test/factories.js` and the harness truncates all non-reference tables once before each file."

### M4 — FR-A3-3 partial index: two predicates that both read as "one active Application"

**Units.** Student A writes `CREATE UNIQUE INDEX … ON applications(applicant_account_id, posting_id) WHERE stage IN ('applied','screening','interview','offer')`; Student B writes `… WHERE stage <> 'withdrawn'`.

**How each obeys.** ARCH-01 says "one non-withdrawn Application", which is B, but A read PRD §3's "Active Application" definition and the migration is in the data layer where no test names FR-A3-3. Column naming: A uses `applicant_account_id`, B `applicant_id` (FK to `applicant_profiles`), C `account_id`.

**Clash.** A allows a re-apply after Rejected, breaking FR-A3-3; the code check in `submitApplication` (which must also exist, ARCH-01 "not only in code") uses whichever repository column name its author guessed.

**Close — add to ARCH-01 verbatim.** "`applications_one_open_per_applicant_posting`: `UNIQUE (applicant_account_id, posting_id) WHERE stage <> 'withdrawn'`. `postings_one_offer`: `UNIQUE (posting_id) WHERE stage = 'offer'`. `applications.applicant_account_id REFERENCES accounts(id)`, `posting_id REFERENCES postings(id)`, `resume_file_id REFERENCES resume_files(id)`, all NOT NULL. The repository test for FR-A3-3 asserts the index by inserting twice."

### M5 — Enum literals are written twice (domain module and CHECK constraint) with no rule saying they must match

**Units.** Student A writes `postingStatus.js` with `'pending'`; Student B writes the migration CHECK with `'pending_approval'`; Student C writes `applicationStage.js` with `'no-show'` for an interview outcome, Student D's CHECK has `'no_show'`.

**How each obeys.** ARCH-12 puts the map in the domain module; migrations cannot import business (dependency direction), so the literals are necessarily duplicated. The Ids-dates-enums row says lowercase `snake_case` but never lists them.

**Clash.** Every transition write fails the CHECK, discovered in the first integration test rather than at review.

**Close — add to ARCH-12.** "The stored values are exactly: Posting `draft, pending_approval, live, filled, expired (derived, never stored), closed, rejected`; Application `applied, screening, interview, offer, hired, rejected, withdrawn, declined`; Account `active, suspended`; membership and Organization `pending_approval, approved, rejected`; interview outcome `passed, failed, no_show`; employment type `full_time, part_time, internship, contract`. `business/domain/*.js` export these as constants; a test in `persistence/` asserts each CHECK constraint accepts exactly the exported set."

### M6 — Decision reasons for Postings and Recruiter requests: column or audit?

**Units.** Student A writes `listOrgPostings` (FR-R2-5, "for a Rejected Posting, the Administrator's reason") adding `postings.rejection_reason`; Student B writes `admin/reviewPosting` writing the reason only to `audit_events` (ARCH-18 says the *Application's* rejection reason lives there and B generalises).

**Clash.** A's list shows null; B's status page for FR-R1-3 needs a lateral join nobody wrote. Two owners of one fact.

**Close — tighten ARCH-18.** "All decision reasons (Application rejection, Posting rejection and administrative close, Recruiter-request rejection, Account suspension) are stored once, in `audit_events.reason`. `auditRepository.latestReason(conn, entityType, entityId, field)` serves lists; no `*_reason` column exists on any entity table."

---

## Low

### L1 — Two `closePosting` modules (`postings/closePosting`, `admin/closePosting`) with different guards

Both write `live → closed`. Recruiter close requires the actor's Organization and no reason; Administrator close requires a reason and notifies the Recruiter. Both are correct under ARCH-13 once C1 fixes the guard. Only risk: one author checks `effective_status = 'live'` and the other `status = 'live'`, letting an Administrator (but not a Recruiter) close an Expired Posting. Close by C1; note in the Capability map that the two modules share `postingRepository.transition` and differ only in actor scope and notification.

### L2 — FR-R2-2 "delete" a Rejected Posting leaves a Notification (FR-M2-3) pointing at nothing

Student A hard-deletes; Student B soft-deletes with a status not in the state model. Close: "Hard delete is allowed only in `draft`, `pending_approval`, `rejected` (FR-R2-2) and writes an audit row `field = 'deleted'`; `notifications.entity_id` has no FK; following a Notification to a 404 shows one `not_found` message from `<ErrorAlert>`." Fits the H5 envelope.

### L3 — Use-case modules importing each other

`acceptOffer` needs cascade rejections; the tempting route is `require('./rejectApplication')`, whose actor scope check (Recruiter of the Organization) refuses Maria. Nothing in ARCH-04 forbids the import. Close — add to ARCH-04: "Use-case modules never import each other. Shared pure logic lives in `business/domain/`; shared I/O lives in repositories (`applicationRepository.rejectAllActiveForPosting(trx, postingId, { reason, actorAccountId })` writes the rows, the audit rows, and returns the recipients; the use case writes the Notifications)."

---

## Proposed spine changes, consolidated

| Where | Change | Closes |
| --- | --- | --- |
| ARCH-01 | Index names, predicates, FK column names verbatim | M4 |
| ARCH-04 | No use-case-to-use-case imports; shared I/O in repositories | L3 |
| ARCH-10 | `req.actor` exact shape, `null` for anonymous, two named guards, suspended → 401 `account_suspended` | H2 |
| ARCH-12 | Stored enum literals listed; CHECK-equals-export test | M5 |
| ARCH-13 | Guard on stored status, transition on effective; zero rows → `ConcurrentChangeError`; `FOR UPDATE` on profile row for the cap insert; cap read from `settings` in-transaction | C1, H1 |
| ARCH-15 | One SQL fragment `effective_status`; `expires_at timestamptz`; DB clock only; FR-R4-4 predicate named | C1, H3 |
| ARCH-18 | Split audit into ARCH-19; membership row owns recruiter status; `stage_changed_at` cache; creation audit row; one detail shape; reasons only in audit; notification `kind`/`body`, one page, one `notificationHref` | C2, H8, M1, M2, M6 |
| ARCH-19 (new) | `audit_events` columns, `entity_type` vocabulary, `seq`, single writer | C2 |
| ARCH-20 (new) | Initial migration set owned by Librarian; add-only afterwards; rollback in CI | H6 |
| Conventions: Naming | Scope-prefixed paths `/api/{postings,me,org,admin}`; one router per scope | H7 |
| Conventions: Error envelope | `details?`, fixed code list, `ApiError`, 401 once, `<ErrorAlert>`, 23505 mapping | H5 |
| Conventions: Auth and config | Default cap in migration, not env | H1 |
| Conventions: Repositories (new) | `conn` first parameter; `db` for reads; camelCase rows | H4 |
| Conventions: Seeds and fixtures (new) | Admin seed vs demo seed; defaults in migrations; factories, no seed dependence in tests | M3 |

**What I could not break.** ARCH-03/05/06/09/14/16/17 held against every pair I tried; the grep checks are the reason. ARCH-08 held except for the suspended-status code (H2). The one-module-per-use-case rule is sound once L3 closes the cross-import.

# Rubric review — ARCHITECTURE-SPINE.md (CareerBridge)

Reviewer: rubric walker (reviewer gate). Date: 2026-09-05. Inputs: `ARCHITECTURE-SPINE.md`, `.memlog.md`, `prds/.../prd.md`, `prds/.../addendum.md`. Local files only, no web. ARCH-nn ids are by author's choice and are not flagged.

**Gate verdict: CONDITIONAL PASS.** No critical findings. Four high findings, each fixable with a sentence or a table row; the spine is otherwise a real build substrate for five parallel use-case owners. Fix the highs before stories are cut.

## Checklist

| # | Item | Verdict | Evidence (spine line numbers) |
| --- | --- | --- | --- |
| 1 | Fixes the real divergence points for five parallel use-case owners, misses none | **Partial** | ARCH-01..18 cover DB, layout, session, scope, transitions, audit, notifications, expiry, deployment. Missed: list-response shape (five list endpoints by five owners, L223 pushes only page size/sort to stories); Notification content columns (L135 names only `entity_type`, `entity_id`); location of Recruiter approval status (account vs membership row, L95 uses `recruiterStatus`, ERD L184 silent); HTTP verb for edits (L141 covers only `POST .../<verb>`); expiry date type and timezone (L120 "expiry after now"); test-database reset strategy (L145). See H-2, H-1, M-1, L-4, M-3, M-4. |
| 2 | Every Rule enforceable and actually prevents its divergence | **Partial** | 15 of 18 rules are greppable or reviewable. ARCH-03's own grep (L60) matches every Knex migration and seed under `server/src/data/` because migration files take `knex` as a parameter, so the check as written always fails (H-3). ARCH-17 "Read access follows NFR-3" (L130) restates the PRD instead of naming the mechanism (M-8). ARCH-16 "the service is warmed before every presentation" (L125) is an aspiration with no owner or mechanism (L-7). |
| 3 | Nothing Deferred/Open could let two units diverge before decided | **Partial** | Validation library, lint, component library, admin option B, email/AI are safely deferred (scaffold precedes stories, MUI default, membership table already allows B). But "page size and sort of lists: story level" (L223) leaves the response envelope undecided (H-2), and the Deferred validation library leaves the field-level error shape undecided (M-2). Open Q2 (2 MB cap) is safe only if the cap is a config value, which L144 does not list (L-9). |
| 4 | Named tech plausibly current, no inconsistent pairs | **Pass with notes** | Express 5, Knex 3 + pg 8, PG 17, React 19, Router 7 library mode, TanStack Query 5, MUI 7, Jest 30, express-session + connect-pg-simple all plausible and mutually compatible. Vite 6.x (L157) is a major behind (memlog L38 said "6/7"); Node 22 LTS is in maintenance by Sep 2026 with 24 LTS available (L-1). Jest for a Vite client is workable but needs babel/jsdom/`import.meta` shims; the pairing is the one friction point in the table (M-9). |
| 5 | Seed minimal and consistent with the rules | **Pass with notes** | Every table named in a rule appears in the ERD or the "not drawn" list (L197): `resume_files`, `audit_events`, `settings`, `categories`, `locations`, `stage_labels`, sessions, membership, interviews. Every folder a rule names is in the tree except `server/src/config.js` (named L144) and `knexfile.js` (needed by the Knex CLI for L40 migrations); both missing from L32-43 (L-2). Deployment diagram matches ARCH-02/09/16. ERD is minimal. |
| 6 | Capability map covers every UC and FR-X; rows cite governing ARCH ids correctly | **Partial** | All 15 UCs and FR-X-1..5 present (L203-214). Citation gaps: UC-R1 cites "membership table", which is not an ARCH id and the membership rule is not in any ARCH (M-5); UC-R2 and UC-R4..R6 omit ARCH-10 although recruiter scope is the main leak risk there (M-6); UC-A3 omits ARCH-15 although ARCH-15 binds FR-A3-1 (L118) and omits ARCH-17 although the Application references a resume row (L130); UC-A5 omits ARCH-12 (accept/decline are transitions). NFR-6 is in `binds` (L11) but no rule or convention addresses it (L-10). |
| 7 | Every owned dimension decided, deferred, or open; silent = finding | **Partial** | Decided: paradigm, boundaries, state mutation, data ownership, auth, config location, deployment/environments, provider, accessibility (via ARCH-07), testing (partly). **Silent:** logging/observability and health endpoint (H-4); migrations-in-production and which seeds run where (H-4); backups (M-10); CSRF specifics, upload content validation, rate limiting (M-11); test-DB reset strategy (M-4); expiry timezone (M-3); 500 mapping and client-side error type (L-5); API versioning stated only implicitly by `/api` (L-6). |
| 8 | Internal consistency between rules/conventions | **Partial** | ARCH-18 "rejection reason … never stored a second time" (L135) vs FR-R4-2 notification "shows the reason verbatim" and ARCH-18's Notification carrying only `entity_type`/`entity_id`: no path from Notification to reason (H-1). ARCH-01 rule "non-withdrawn" (L50) is correct against FR-A3-3, but the Dr. Ren rationale (L241) says "one active Application per Applicant per Posting", which would permit re-apply after rejection, contradicting FR-A3-3/A-5 (M-7). ARCH-15 "expiry writes no audit row" (L120) vs ARCH-13 (L110) is consistent by construction (no stored change) but leaves the Expired→Filled audit `old` value and the CHECK enum's `expired` member undecided (L-8). ARCH-11 403 vs FR-R3-4 is acceptable with UUIDs; the memlog records the deliberate choice; only the non-Live-Posting case for visitors is undecided (L-3). ARCH-10 rule (2) "every use-case module takes `actor`" vs public UC-A2 modules: `actor` for a visitor undefined (L-4b). |

## Findings

### Critical

None.

### High

**H-1. Notification cannot show the rejection reason without violating ARCH-18.** FR-R4-2 and FR-R6-3 require the Applicant's Notification to show the reason verbatim; FR-M2-3, FR-M1-3, FR-M2-5 likewise carry reasons to Recruiters. ARCH-18 (L135) says the reason is read only from `audit_events` and the Notification carries `entity_type` and `entity_id` only. Five owners (R4, R6, M1, M2, M3) will each invent a `message` column, a `kind` enum, or a join. *Edit (ARCH-18, Notification sentence):* "A Notification carries `kind` (lowercase enum: `stage_changed`, `rejected`, `offer_extended`, `interview_recorded`, `posting_approved`, `posting_rejected`, `posting_closed`, `offer_declined`, `request_decided`), `entity_type`, `entity_id`, and `audit_event_id` (FK, NOT NULL). The client renders the text from `kind` and the joined audit event, so the reason is still stored once." Add `AUDIT_EVENT ||--o{ NOTIFICATION : explains` to the ERD.

**H-2. List response shape and pagination are undecided.** `listLivePostings`, `listMyApplications`, `listOrgApplications`, `listOrgPostings`, `listAccounts`, `listNotifications`, the two admin queues, and `oversightCounts` are built by at least five owners; L223 defers only page size and sort. Without a fixed envelope the client gets arrays from some routes and `{items,total}` from others, and NFR-6 (1,000 Postings, 10,000 Applications) makes unbounded lists a real risk for FR-R3-1/FR-A4-1. *Edit (Consistency Conventions, new row "Lists"):* "Every list route accepts `?page=1&pageSize=20&sort=<field>:<asc|desc>` (server caps `pageSize` at 100) and returns `{ "items": [...], "page", "pageSize", "total" }`. Filters are query parameters named after the column. Page size defaults and allowed sort fields are story level."

**H-3. ARCH-03's check defeats itself.** `grep -rl knex server/src | grep -v persistence` (L60) matches every file in `server/src/data/migrations/` and `seeds/` because Knex migrations are `exports.up = (knex) => …`. The rule is right; the check reports a violation on day one and will be ignored thereafter. *Edit (ARCH-03 Rule):* "Check: `grep -rlE \"require\\(['\\\"]knex['\\\"]\\)\" server/src | grep -v '^server/src/persistence/'` returns nothing (migrations and seeds receive `knex` as a parameter and are exempt). `knexfile.js` lives at `server/` root, outside `src/`." Also fold this into the deferred lint rule (L221).

**H-4. Operations are silent where they cause divergence: migrations in production, seeds per environment, logging, health endpoint.** Nothing says who runs `knex migrate:latest` against Neon (Docker `CMD`, Render pre-deploy command, or a human), so the first student to add a migration after the first deploy breaks production or is told "run it by hand". Nothing distinguishes the production seed (one Administrator, FR-X-5/A-25, plus reference data) from the demo cast (Sam, Maria, Devon, Priya). Nothing names a request log, an error log destination, or a health path for Render and for the pre-demo warm-up. *Edit (new ARCH-19 "Operations", or a "Deploy and run" convention row):* "(1) The image's start command runs `knex migrate:latest` then starts Express; a failed migration fails the deploy. Migrations are forward-only; a mistake is fixed by a new migration. (2) `seeds/base/` (Administrator from `ADMIN_EMAIL`/`ADMIN_PASSWORD`, reference data, stage labels, default cap) runs in every environment and is idempotent; `seeds/demo/` (the PRD §2 cast) runs only when `SEED_DEMO=true` (dev, CI, and the demo database). (3) Structured request and error logging to stdout via one logger (pino) configured in `config.js`; never log passwords, resume bytes, or session ids. (4) `GET /api/health` returns 200 after a `SELECT 1`; Render's health check and the pre-presentation warm-up (a curl in the demo runbook) both hit it."

### Medium

**M-1. Where the Recruiter approval status lives is undecided.** PRD §3 puts Pending Approval/Approved/Rejected on the Recruiter Account and on the Organization; ARCH-10 reads `actor.recruiterStatus`; the ERD has `ORGANIZATION_MEMBER` with no attributes. UC-R1's owner and UC-M1's owner will put the column in different tables. *Edit (ARCH-18):* "`accounts.status` is `active | suspended` only. `organization_members` (`account_id`, `organization_id`, `status` in `pending_approval | approved | rejected`, one row per Account for now, UNIQUE on `account_id`) holds the Recruiter approval status; `organizations.status` holds the Organization's. `actor.recruiterStatus` is read from the membership row on every request (ARCH-08)."

**M-2. Field-level validation errors have no shape.** The envelope (L143) is `{ error: { code, message } }`; client forms need per-field messages, and the validation library is deferred. *Edit (Error envelope row):* "Validation failures add `details: [{ "field", "message" }]`; `field` is the JSON path of the offending property."

**M-3. Expiry date type and timezone are undecided.** FR-R2-1 collects "an expiry date"; ARCH-15 compares "expiry after now". Whether `expires_at` is a `date` (expires at midnight in which zone?) or a `timestamptz`, and whether "today" is still Live, decides UJ-3's "Expired Posting absent from the Job List" proof. *Edit (ARCH-15 Rule):* "`postings.expires_at` is `timestamptz`; the form collects a calendar date and the server stores 23:59:59 America/Chicago of that date; Live means `status = 'live' AND expires_at > now()`."

**M-4. Test-database reset strategy is undecided.** L145 says repository and route tests run against the disposable database, not how it is prepared or isolated. Five owners will pick truncate-in-`beforeEach`, per-test transactions with rollback, or nothing. *Edit (Tests row):* "Jest `globalSetup` runs migrations and base seeds once; each test file truncates all non-reference tables in `beforeEach` via `persistence/testSupport.js`; test files never share rows; Jest runs server tests with `--runInBand`."

**M-5. Organization membership is a load-bearing decision but not an ARCH.** The memlog (L14) records it as an adopted brief constraint; the capability map cites "membership table" (L207) as if it were a rule; no ARCH states it. *Edit:* fold into ARCH-18 with M-1's wording, and change the UC-R1 row to cite ARCH-10, ARCH-18.

**M-6. Capability map omits ARCH-10 on the recruiter mutation rows.** UC-R2 (edit/close another Organization's Posting) and UC-R4..R6 (advance/reject/offer on another Organization's Application) are where scope leaks happen; the rows cite only 12/13/14/15. *Edit:* add ARCH-10 to UC-R2 and UC-R4..R6; add ARCH-15 and ARCH-17 to UC-A3/A4; add ARCH-12 to UC-A5; add ARCH-12 to UC-M1/M2.

**M-7. The Dr. Ren rationale misstates the FR-A3-3 index.** L241: "one active Application per Applicant per Posting"; ARCH-01 (L50) correctly says "one non-withdrawn". "Active" would allow re-applying after rejection or decline, which FR-A3-3/A-5 forbid, and this is the section the customer reads. *Edit (L241):* "…and 'one non-withdrawn Application per Applicant per Posting' (FR-A3-3, so re-applying is possible only after a withdrawal) are partial unique indexes". Also fix memlog L17 if it is kept as rationale.

**M-8. ARCH-17 read-access sentence restates NFR-3 instead of fixing the mechanism.** "Read access follows NFR-3: owner, Recruiters of Organizations applied to, Administrators" is the PRD verbatim; the divergence is *which* file version a Recruiter gets and which module checks. *Edit:* "Downloads go through `profiles/getResume(actor, resumeFileId)`: the owner and Administrators may read any of the owner's rows; a Recruiter may read a row only if an Application to their Organization references it (`resumeFileRepository.findForActor` joins `applications` and `postings` with `organization_id` in the WHERE, ARCH-10 rule 3). Recruiters always see the submitted version (FR-R3-2), never the current profile file."

**M-9. Jest + Vite client pairing needs a stated setup or a Vitest exception.** "One runner" is the argument to Dr. Ren (L243), but Jest on a Vite/React 19 client needs babel-jest, jsdom, and an `import.meta.env` shim; the scaffold owner will otherwise reach for Vitest and the rationale becomes untrue. *Edit (Stack table or Deferred):* either "Client tests: Jest 30 with `babel-jest`, `jest-environment-jsdom`, React Testing Library; `import.meta.env` replaced by a `vite-plugin`-free `process.env` shim in `client/jest.setup.js`" or "Client tests: Vitest (Jest-compatible API, same test names); the rationale's 'one runner' becomes 'one test API'". Pick one at the spine, not the scaffold.

**M-10. Backups are silent.** Neon's free tier keeps a short history window; a wrong migration or a demo mishap before Iteration 3 has no stated recovery. *Edit (Operations):* "Before each presentation and each migration to production, `pg_dump` to the Project Librarian's machine (`scripts/backup.sh`); the dump is not committed."

**M-11. Security basics under-specified: CSRF value, upload content check, rate limiting.** ARCH-08 says "SameSite" without `Lax`/`Strict`; the CSRF defense is implied, not stated. ARCH-17 caps size but not content (Q-006 says PDF). Login has no brute-force limit. *Edit (ARCH-08):* "`SameSite=Lax`, `Secure` in production; with single origin (ARCH-09) and JSON-only bodies (`express.json`, reject non-JSON content types on mutations) this is the CSRF defense; no CSRF token." *Edit (ARCH-17):* "Uploads are `multipart/form-data` via multer memory storage with `limits.fileSize`; the server checks the `%PDF-` magic bytes, not the extension; the cap is `RESUME_MAX_BYTES`." *Edit (Conventions, Auth row):* "`POST /api/auth/login` is rate-limited per IP and per email (express-rate-limit, 10/min); nothing else is."

**M-12. Applicant-facing history exposes other Applicants' identity through cascade actor rows.** ARCH-18: cascade rows record the triggering actor; FR-A4-2 shows Stage history to the Applicant; ARCH-18 reads history from `audit_events`. Devon's "Position filled" row has Maria's `accountId` as actor. *Edit (ARCH-18):* "History returned to an Applicant or Recruiter carries the actor's role only (`by: 'recruiter' | 'applicant' | 'administrator' | 'system'`), never the actor id or name; Administrators (FR-M4-5) see the actor."

**M-13. Application creation has no audit row, so FR-A4-2 history lacks its first entry.** ARCH-13 covers "state changes"; ARCH-18 reads Stage history from `audit_events`; `submitApplication` inserts Stage `applied` with no prior value. *Edit (ARCH-13):* "Creation of a Posting or Application writes an audit row with `old_value` NULL and `new_value` the initial status/Stage, in the same transaction, so history starts at creation."

### Low

**L-1. Stack table versions.** Vite 6.x → 7.x (memlog already said 6/7); Node 22 LTS → note "24 LTS if Render and the team's laptops have it; 22 otherwise". Open Q3 already handles Postgres 17/18. *Edit:* two cells.

**L-2. Tree omits two files the rules name.** `server/src/config.js` (L144) and `server/knexfile.js`. *Edit (tree):* add `server/knexfile.js` and `server/src/config.js`.

**L-3. Non-Live Posting for a visitor: 403 or 404?** ARCH-11 fixes 403 for Organization scope only; FR-A2-2 lets an Applicant open a non-Live Posting they applied to. UC-A2 and UC-R2 owners will differ. *Edit (ARCH-11):* "A Posting that is not effectively Live is 404 to visitors and to Applicants who have not applied to it; 403 is only for Organization scope."

**L-4. HTTP verbs for edits and deletes.** L141 covers reads and verb actions only; `updateProfile`, `editPosting`, `updateOrganization`, `updateSettings` and FR-R2-2 delete need a verb. *Edit (Naming row):* "create `POST /api/<resource>`, edit `PATCH /api/<resource>/:id` (partial body), read `GET`, delete only `DELETE /api/postings/:id` (FR-R2-2, Draft/Pending/Rejected)". **L-4b.** ARCH-10 rule (2): state "`actor` is `null` for a visitor; public modules accept `null` and treat it as no scope".

**L-5. Error mapping lacks the default.** L143 lists 400/401/403/404/409 only; unique-index violations (A-18 race) and unexpected errors are unmapped. *Edit:* "Postgres unique violations from the ARCH-01 indexes map to 409; anything else is 500 with `code: 'internal'` and no stack in the body; `api.js` throws `ApiError { status, code, message, details }`."

**L-6. API versioning is implicit.** *Edit (Conventions):* "No API version prefix; breaking changes are not expected within the semester."

**L-7. ARCH-16 warm-up sentence is an aspiration.** Fold into H-4's health endpoint and the demo runbook; remove from the Rule.

**L-8. Expired→Filled audit `old_value` and the CHECK enum.** ARCH-15 keeps stored status `live`; ARCH-12's map has `expired` as a from-state. *Edit (ARCH-15):* "The `postings.status` CHECK does not include `expired`; the Expired→Filled audit row records `old_value = 'expired'` (effective status) and the update guard is `WHERE status = 'live'`."

**L-9. Make the resume cap a config value so Open Q2 cannot diverge.** *Edit (Auth and config row):* add `RESUME_MAX_BYTES` (default 2 MB) beside the timeout and cap.

**L-10. NFR-6 has no rule.** Harmless for divergence, but the spine binds it. *Edit (Conventions, new row "Indexes"):* "Every FK column and every column used in a list WHERE or ORDER BY (`postings(status, approved_at)`, `applications(posting_id, stage)`, `applications(applicant_account_id, stage)`, `notifications(account_id, read_at)`) is indexed in the migration that creates the column."

**L-11. Session table naming vs the plural convention.** connect-pg-simple defaults to a `session` table with its own DDL. *Edit (ARCH-08):* "The session table is created by a migration from connect-pg-simple's `table.sql`, named `sessions` via `tableName`, and is the one table without an audit trail."

**L-12. Generalize "reason" storage.** ARCH-18 names only the rejection reason; FR-M1-3, FR-M2-3, FR-M2-5, FR-M3-2 and FR-R2-5 also surface reasons. *Edit:* "Every reason (rejection, closure, suspension, request decision) lives only on its audit event."

**L-13. FR-R4-4 cross-entity guard has no home.** ARCH-12's `assertTransition(from, to)` cannot see the Posting. *Edit (ARCH-12):* "Guards that depend on another entity (FR-R4-4: only rejection on a Filled or Closed Posting) live in one helper in `business/domain/applicationStage.js`, `assertPostingAllows(postingStatus, to)`, still pure."

## Summary of required edits by location

- ARCH-03: replace grep (H-3).
- ARCH-08: SameSite value, session table (M-11, L-11).
- ARCH-10: `actor` null for visitors (L-4b).
- ARCH-11: non-Live Posting 404 (L-3).
- ARCH-12: cross-entity guard helper (L-13).
- ARCH-13: creation audit row (M-13).
- ARCH-15: `expires_at` type and zone; CHECK enum; Expired→Filled old value (M-3, L-8).
- ARCH-16: drop warm-up sentence into Operations (L-7).
- ARCH-17: download mechanism; magic bytes; config cap (M-8, M-11, L-9).
- ARCH-18: Notification columns with `kind` and `audit_event_id`; membership status; actor role in history; all reasons on audit (H-1, M-1, M-5, M-12, L-12).
- New ARCH-19 Operations or convention rows: migrations on start, seeds base/demo, logging, health, backups, rate limit (H-4, M-10, M-11).
- Conventions: Lists row; validation `details`; verbs; 500 default; versioning; indexes (H-2, M-2, L-4, L-5, L-6, L-10).
- Tests row: reset strategy; client runner decision (M-4, M-9).
- Stack: Vite 7, Node note (L-1). Tree: `config.js`, `knexfile.js` (L-2).
- Capability map: ARCH-10 on R2/R4-6, ARCH-15/17 on A3, ARCH-12 on A5/M1/M2, UC-R1 cites ARCH-18 (M-6, M-5).
- Rationale L241: "non-withdrawn" (M-7).

---
title: "Second-pass recheck — ARCHITECTURE-SPINE.md + SHAPES.md + CAPABILITY-MAP.md (CareerBridge)"
lens: recheck (closure of first-pass C/H findings; new contradictions introduced by the revision; residual build holes)
targets: ../ARCHITECTURE-SPINE.md, ../SHAPES.md, ../CAPABILITY-MAP.md (all 2026-09-05)
inputs: review-adversary.md, review-rubric.md, review-reality.md, reconcile-addenda.md, reconcile-course.md, prd.md (spot checks only)
reviewed: 2026-09-05
verdict: BUILD-SAFE WITH FIXES — 42 of 44 tracked findings closed, 1 partial, 1 open; the revision introduced 4 medium and 5 low internal contradictions and leaves 2 concrete two-student holes, all closable with one-line edits to SHAPES.md and two ARCH sentences.
---

# Second-pass recheck

Method. Read the three files in full; then, for every critical/high finding in the five first-pass reviews (plus the rubric's M-1..M-13 and the course review's B-M1..B-M8 as asked), located the ARCH rule or S-section that now carries the decision and judged whether it closes the divergence the finding described, not merely mentions it. Then read the revised package against itself for contradictions the revision created (rule citing a section that says something else; vocabulary drift between S-sections; map vs rules; mermaid; frontmatter; seed-vs-binding). Finally, re-ran the adversary's two-student test on the new text. No files edited.

---

## 1. Closure table

Legend: **closed** = the divergence is now decided in one place and the citation is correct; **partial** = decided but a contradiction or gap remains; **open** = not addressed.

### review-adversary.md

| Id | Finding (short) | Status | Closed by |
| --- | --- | --- | --- |
| C1 | Guard on stored vs assert on effective status for Expired Postings | closed | ARCH-13 (`postingRepository.transition(trx, id, { from, to })` maps `expired`→stored `live`; zero rows → `ConcurrentChangeError`), ARCH-15, S4 |
| C2 | Three audit vocabularies; empty history views | closed | ARCH-19 + S5 (columns, `entity_type` CHECK, singular names, `seq`, single writer, `ORDER BY created_at, seq`) |
| H1 | Cap race on INSERT; cap read from config | closed | ARCH-13 (`FOR UPDATE` on `applicant_profiles`, cap from `settings` in-transaction), Config row, S11 |
| H2 | `req.actor` shape, null case, guards, suspended code | closed | ARCH-10 (1) + S7 |
| H3 | Three `isEffectivelyLive` definitions, two clocks, `expires_at` type | closed | ARCH-15 + S4 (one fragment, `timestamptz`, `TZ`, `now()`); Data row |
| H4 | Transaction handle passed three ways | closed | S8 (`conn` first, `withTransaction` from `persistence/db`, never nested) |
| H5 | Error envelope, `details`, `ApiError`, 401 once | closed | S9 + Errors row |
| H6 | Parallel branches creating one table | closed | ARCH-20 (initial migration set by Librarian; add-only after; CI up/down/up) |
| H7 | One path, two roles | closed | S10 (scope prefixes, one router per scope, two paths = two modules) + ARCH-10 (1) |
| H8 | Recruiter status has three homes | closed | ARCH-18 + S2 `organization_members` |

### review-rubric.md

| Id | Finding (short) | Status | Closed by |
| --- | --- | --- | --- |
| H-1 | Notification cannot carry the reason | closed | S6 (`kind`, `body` composed server-side with reason verbatim, `audit_event_id NOT NULL`); ERD `AUDIT_EVENT ||--o{ NOTIFICATION` |
| H-2 | List envelope and pagination | closed | S10 + Responses row |
| H-3 | ARCH-03 grep defeats itself | closed | ARCH-03 (regex on `require('knex')`, `knexfile.js` at `server/`) |
| H-4 | Migrations in production, seeds per env, logging, health | closed | ARCH-16 (migrate on start, pino, `/api/health`, backup) + ARCH-20 (`seeds/base` vs `seeds/demo`) |
| M-1 | Recruiter approval home | closed | ARCH-18, S2 |
| M-2 | Validation `details` shape | closed | S9 (`[{ field, message }]`) |
| M-3 | Expiry type and zone | closed | S4 |
| M-4 | Test-DB reset strategy | closed | ARCH-20 (`testSupport.js` truncates before each file), ARCH-22 (`--runInBand`) |
| M-5 | Membership as an ARCH rule | closed | ARCH-18 (Check: `accounts` has no `organization_id`) |
| M-6 | Map citations (ARCH-10 on R2/R4-6, 15/17 on A3, 12 on A5/M1/M2) | closed | CAPABILITY-MAP table, all rows updated |
| M-7 | Rationale said "one active Application" | closed | Rationale ¶ PostgreSQL: "one non-withdrawn Application ... only after a withdrawal" |
| M-8 | Resume read mechanism | closed | ARCH-17 (`profiles/getResume`, org in WHERE, submitted version) — but see contradiction N4 |
| M-9 | Jest on Vite client | closed | ARCH-22 (babel-jest, jsdom, RTL; `config.js` only `import.meta`) |
| M-10 | Backups | closed | ARCH-16 (`scripts/backup.sh`) |
| M-11 | SameSite, CSRF, magic bytes, rate limit | closed | ARCH-08, ARCH-17 |
| M-12 | Cascade actor identity leak in history | closed | ARCH-19 + S5 (`by:` role only; Administrators see the actor) |
| M-13 | Creation audit row | closed | ARCH-13 |

### review-reality.md

| Id | Finding (short) | Status | Closed by |
| --- | --- | --- | --- |
| H-1 | Jest/Vite decision; CommonJS stated | closed | ARCH-22 ("server is CommonJS ... zero-config") |
| H-2 | Express 5 SPA fallback syntax; `/api` 404 | closed | ARCH-09 (`app.get('/{*splat}', …)` after routers; unknown `/api` → 404 envelope) |
| H-3 | `trust proxy` behind Render | closed | ARCH-08 |
| H-4 | Express 5 async forwarding, no wrapper | closed | ARCH-03 |

### reconcile-addenda.md

| Id | Finding (short) | Status | Closed by |
| --- | --- | --- | --- |
| H1 | GitHub Issues traceability chain and "tracking" rationale | closed | ARCH-21; Rationale ¶ "Traceability and tracking" |
| H2 | FR-X-3 delivery mapped to Iteration 3 | closed | CAPABILITY-MAP FR-X row (`listNotifications`, `unreadCount`); ARCH-06 ("exists from Iteration 1") |
| H3 | Iteration 1 needs the demo cast | **partial** | CAPABILITY-MAP "Demo seed cast" + ARCH-20 `seeds/demo/` define the cast — but S11 says `SEED_DEMO` is "never production" and ARCH-20 lists "a demo cast in production" as prevented, while the Iteration 1 presentation runs on the public Render URL (NFR-7; ARCH-16 warms and backs up production "before each presentation") and the map says the seed is "the only source of Recruiter and Applicant Accounts" until Iteration 2. The cast is defined; where it may run is contradictory. See N1. |
| H4 | Membership constraint has no ARCH rule | closed | ARCH-18 + S2 |

### reconcile-course.md

| Id | Finding (short) | Status | Closed by |
| --- | --- | --- | --- |
| B-M1 | Branch/merge/review policy; Issues unnamed | closed | ARCH-21 |
| B-M2 | Client test tooling | closed | ARCH-22 + Stack row |
| B-M3 | Business error vocabulary | closed | S9 |
| B-M4 | Test data strategy | closed | ARCH-20 (factories, truncate), ARCH-22 |
| B-M5 | Session store's pool vs layer rule | closed | ARCH-08 ("the one presentation → persistence import"); Paradigm ("`data/` has no importable module") |
| B-M6 | Success/list envelope | closed | Responses row + S10 |
| B-M7 | Use-case signature, repository access | closed | S8 |
| B-M8 | Seed Administrator credentials | closed | ARCH-20 + S11 |
| C (length) | Body ≈ 5.3 pages vs "under two pages" | **open** | Not in the requested id list but it was the course review's only critical. Measured now: spine 3,404 words total; 2,643 before the Rationale section (frontmatter included). Body shrank ~10% while gaining ARCH-19..22 and moving seed to companions; it is still ≈ 4.5–5 pages. Either the "under two pages" rule is formally relaxed (record in `.memlog.md`) or the course review's C-1/C-12 format cuts (drop "Prevents" lines, one paragraph per ARCH) still apply. |

**Counts:** 42 closed · 1 partial (addenda H3) · 1 open (course length critical). Of the 32 critical/high ids strictly named in the task (C1, C2, H1-H8; rubric H-1..H-4; reality H-1..H-4; addenda H1-H4; course B-M1..B-M8): 31 closed, 1 partial, 0 open.

---

## 2. New internal contradictions introduced by the revision

Tiers: **medium** = two students obeying the letter produce incompatible rows or responses; **low** = text contradicts text but the build converges anyway.

### N1 [medium] Demo cast: forbidden in production, required at the Iteration 1 presentation
- S11: `SEED_DEMO` "(true in dev and CI, never production)". ARCH-20 Prevents: "a demo cast in production".
- CAPABILITY-MAP, Demo seed cast: "Until UC-R1 and UC-A1 ship in Iteration 2, this seed is the only source of Recruiter and Applicant Accounts." UC-R2 and UC-M1 are Iteration 1 and need Sam (Approved) and Priya (Pending).
- ARCH-16: `GET /api/health` serves "the pre-presentation warm-up"; `scripts/backup.sh` runs "before each presentation" — both presuppose the presentation is the Render/Neon deployment (NFR-7).
- Result: the Librarian obeying S11 deploys an Iteration 1 build with one Administrator and nothing to demo; the UC-R2 owner obeying the map assumes Sam exists on the public URL. Fix: S11 `SEED_DEMO` → "true in dev, CI, and the semester's demo database; false only for a production database that holds real accounts (none this semester)"; ARCH-20 Prevents → "a demo cast in a real production database".

### N2 [medium] S1/ARCH-12/S1-test: `expired` must be in the transition map but must not be in the CHECK, and the same exported constant is asserted equal to both
- ARCH-12: state machines "export the transition maps over the S1 strings", and the map necessarily contains `expired → filled` and `expired → closed` (FR-R6-2, FR-M2-5).
- S1: `expired` "is derived, never stored"; "`business/domain/enums.js` exports these constants; the migrations' CHECK constraints list the same strings; a persistence test asserts each CHECK accepts exactly the exported set."
- Result: student A (domain owner) exports `POSTING_STATUSES` including `expired` because the map needs it; student B (persistence test owner) asserts the CHECK equals the export and the test fails on day one, or B "fixes" the CHECK to accept `expired` and ARCH-15's invariant (stored status never `expired`) is no longer enforced by the database. Fix (S1): "`enums.js` exports `POSTING_STORED_STATUS` (the six CHECK values) and `POSTING_EFFECTIVE_STATUS = POSTING_STORED_STATUS ∪ {'expired'}`; the CHECK test uses the stored set; the transition map is keyed by the effective set."

### N3 [medium] Interview recording needs an audit row (S6) but no audit vocabulary exists for it (S5)
- S6: `audit_event_id uuid NOT NULL REFERENCES audit_events`; `kind` includes `interview_recorded`. FR-A5-3 requires that Notification.
- S5: `entity_type` CHECK is `account, organization, organization_member, posting, application, setting, category, location, stage_label` — no `interview`; `field` "is the stored column name (`stage`, `status`, `value`, `role`, `deleted`)".
- ARCH-13: an audit row accompanies "every status or Stage change, creation"; ARCH-18: "Interviews are a table owned by the Application"; `recordInterview` changes no Application column.
- Result: the UC-R5 owner must invent a row to satisfy the NOT NULL: `entity_type='application', field='interview'` (not a column; violates S5's rule), or `entity_type='interview'` (CHECK violation), or skips the Notification (violates FR-A5-3). `recordInterviewOutcome` has the same problem for `outcome NULL → passed`. Fix (S5): add `interview` to the CHECK; `recordInterview` writes `('interview', interviews.id, 'scheduled_at', NULL, <iso>)`, `recordInterviewOutcome` writes `('interview', id, 'outcome', NULL, <outcome>)`; extend the `field` parenthetical with `scheduled_at`, `outcome`, `label`, `name`, `active` or mark it "for example".

### N4 [medium] `organization_members` has no primary key in S2, yet three rules need a uuid for it
- S2: `organization_members(account_id UNIQUE, organization_id, status, decided_at)` — no `id`; ARCH-11: "All primary keys are UUIDs"; S2 preamble: "Column lists name only what a rule depends on".
- S5: `entity_type` includes `organization_member` with `entity_id uuid NOT NULL`; S5 `latestReason(conn, entityType, entityId, field)` serves FR-R1-3's status page; S6 `recruiter_request_decided` carries `entity_id`.
- Result: the UC-M1 owner (`reviewRecruiterRequest`, writer) and the UC-R1 owner (`getMyRecruiterStatus`, reader) are different students. One uses `account_id` as `entity_id` (it is a UUID and UNIQUE), the other adds a surrogate `id` and uses it; the rejection reason on the Pending/Rejected status page (FR-R1-3) never appears and no test catches it until the demo. Fix (S2): "`organization_members(id uuid PK, account_id UNIQUE, …)`; audit and notification `entity_id` for `organization_member` is `id`" — or, if `account_id` is the PK, say so.

### N5 [low] ARCH-17 single `getResume` module vs S10 "two scopes, two modules"
- ARCH-17: all downloads "go through `profiles/getResume(actor, resumeFileId)`" for owner, Administrator and Recruiter, with role logic inside the module. CAPABILITY-MAP lists it only under UC-A1.
- S10: "A resource reachable in two scopes has two paths and two use-case modules; no handler switches on role." The Recruiter path (`/api/org/…`) is not listed among S10's org resources either.
- Converges at runtime, but the UC-R3 owner obeying S10 will write `applications/getOrgResume`, duplicating ARCH-17's check. Fix: either exempt `getResume` in S10 ("except `profiles/getResume`, which is one module called from `/api/me/resume/:id`, `/api/org/applications/:id/resume`, and `/api/admin/…`") or split it into three modules over one `resumeFileRepository.findForActor`.

### N6 [low] "`applications.stage_changed_at` is the one permitted cache" (ARCH-18) vs S2's `postings.approved_at` and `organization_members.decided_at`
Both are timestamps of audit-recorded transitions (S3 even indexes `postings(status, approved_at)`). Harmless (each is written in the same UPDATE), but a literal reader of ARCH-18 refuses to write `approved_at`. Fix: "the permitted caches are `stage_changed_at`, `approved_at`, `decided_at`, each written in the same UPDATE as the status."

### N7 [low] S5 "values are stored strings cast to text" vs ARCH-15 "the Expired → Filled row records `old_value = 'expired'`"
`expired` is never a stored string. Add to S5: "…or the effective Posting status (`expired`) for transitions out of Expired (ARCH-15)."

### N8 [low] `account_suspended` (S7, S9 code list) has no class in `business/errors.js`
S9 names `UnauthenticatedError` 401 only; S7 says the middleware answers `401 account_suspended`. Convention row: one HTTP mapping in `errors.js`. One student adds `AccountSuspendedError` (non-compliant with the S9 class list as written); another writes the JSON inline in `auth.js` (bypasses the one mapping). Same wire result, two conventions. Fix: add `AccountSuspendedError` (401) to S9, or give `UnauthenticatedError` a `code` argument.

### N9 [low] Frontmatter status drift
SPINE `status: draft`; SHAPES and CAPABILITY-MAP `status: final`. Binding companions cannot be more final than the spine they bind by reference. Set all three to the same value.

### Checked and found clean
- No `{token}` placeholders, TODO/TBD, or leftover frontmatter fields in any of the three files.
- Mermaid: the environments `flowchart LR` (subgraph ids used as edge endpoints, cylinder nodes, `|label|` edges) and the `erDiagram` (quoted multi-word labels) are syntactically valid.
- CAPABILITY-MAP module list vs ARCH-18/S8: every mutator ARCH-18 names has a module (`submitApplication`, `reviewRecruiterRequest`, `changeRole`, `deletePosting`, `markRead`, `updateSettings`, `updateReferenceData`, `updateStageLabels`); the two `closePosting` modules and the `acceptOffer` → `rejectAllActiveForPosting` boundary match ARCH-04/S8; no module in the map imports another.
- Column names are consistent across S2/S3/S5/S6/S10 (`applicant_account_id`, `posting_id`, `resume_file_id`, `recipient_account_id`, `read_at`, `stage_changed_at`, `expires_at`, `effective_status`).
- S9 codes ↔ S9 classes ↔ ARCH-11/ARCH-13 error names agree (`invalid_transition`, `concurrent_change`, `duplicate_application`, `offer_already_open`, `application_cap_reached`, `profile_incomplete`).
- S10 `/api/org/organization` under `requireApprovedRecruiter` matches FR-R1-4 (only Approved Recruiters edit the Organization); `/api/me/…` "recruiter status" matches FR-R1-3.
- S6 `kind` list covers every PRD notification (FR-A5-3, FR-A5-5, FR-M1-3, FR-M2-2/3/5, FR-R6-3); no PRD FR requires a withdraw or offer-accepted notification, so the CHECK is complete.

### Seed rather than binding in SHAPES.md (could be cut without loss)
SHAPES' own preamble says "Column lists name only what a rule depends on; migrations own the rest." These violate it: `organizations(description, website, location)`, `applicant_profiles(full_name, phone, location, headline, education, summary)`, `postings(title, description, requirements)`, `interviews(notes, outcome_notes, recorded_at)`, `resume_files(size, uploaded_at)`. Cutting them (~35 words) loses nothing a rule cites and stops S2 from being mistaken for the schema. The S8 example `rejectAllActiveForPosting(...)` is borderline but binds the cascade boundary (ARCH-04/L3), so keep it. The index name `postings_one_open_offer` on the `applications` table is misleading but verbatim, so harmless; `applications_one_open_offer` would be truer.

---

## 3. Remaining two-student holes (not covered above or in the first pass)

### R1 [high] FR-R3-3 "forbidden" (403) cannot be produced by a repository that filters on `organization_id` in the WHERE
- ARCH-10 (3): "every recruiter-facing repository query takes `organizationId` as a mandatory parameter inside the `WHERE`, never filtering afterwards."
- ARCH-11: "a record outside the actor's Organization scope is `403 forbidden` (FR-R3-3)"; PRD FR-R3-3 says "refused as forbidden" and SC-2 demos it live.
- A scoped read of another Organization's Posting returns zero rows; the use case cannot tell "does not exist" from "belongs elsewhere" and can only throw `NotFoundError` (404). To throw `ForbiddenError` it must first read the row unscoped and compare `organization_id` in business code, which is exactly "filtering afterwards". Student A obeys ARCH-10 (3) and returns 404; student B obeys ARCH-11 and does an unscoped `findById` then compares. Both have green tests, the FR-R3-3 test they each write asserts a different status, and the merged suite is red. The first pass discussed 403 vs 404 only for visitors (rubric L-3) and recorded 403 as deliberate; the interaction with rule (3) was not examined.
- Fix, one sentence in ARCH-10 (3): "Lists and all UPDATE/DELETE statements carry `organization_id` in the WHERE. Single-record reads by id use `findById(conn, id)` unscoped; the use case compares `row.organizationId` to `actor.organizationId` and throws `ForbiddenError` (ARCH-11) before doing anything else." Alternatively change ARCH-11 to 404 for Organization scope and accept that FR-R3-3's "forbidden" is satisfied by refusal, not by the status word — but that needs the PRD owner's agreement since SC-2 demos it.

### R2 [medium] Who creates the `applicant_profiles` row that ARCH-13 locks
- ARCH-13's cap guard is "first locks the Applicant's `applicant_profiles` row `FOR UPDATE`". S2 makes `applicant_profiles.account_id` the PK with no rule on when the row is inserted. `registerApplicant` (UC-A1 owner) and `submitApplication` (UC-A3 owner) are different students.
- If registration creates only the `accounts` row and the profile is inserted lazily by `updateProfile`, an Applicant who never opened the profile page has no row: `SELECT … FOR UPDATE` locks nothing, and two concurrent submissions pass the cap (the exact race H1 closed). If instead `submitApplication` treats "no row" as `ProfileIncompleteError`, the race is closed but only by accident of one student's choice.
- Fix (ARCH-18 or S2): "`registerApplicant` inserts the `applicant_profiles` row (all optional columns NULL) in the same transaction as the `accounts` row; the demo seed does the same; `submitApplication` may assume the row exists."

### Noted, not counted (story-level or already deferred)
- `field` for non-status edits (`editPosting` changing `title`; `updateReferenceData` changing `name`/`active`): ARCH-13 binds only status/Stage changes and creation, so whether Draft edits are audited is a story decision; FR-M4-5 "change history" will show only what ARCH-13 mandates. Acceptable, but say so in ARCH-13 to stop the UC-R2 owner from auditing every field.
- Route-test location (beside `routes/*.js` or under `server/test/`) is unstated; Jest finds both, so no incompatibility.
- `DATABASE_URL` must carry `?sslmode=require` for Neon (reality M-6, medium, outside this recheck's id list); ARCH-02's "only per-environment difference" survives only if that is stated.

---

## 4. Recommended edits, in priority order (all one to three sentences)

1. ARCH-10 (3): scoped WHERE for lists and writes; unscoped `findById` + business comparison for single reads (R1).
2. S5: add `interview` to the `entity_type` CHECK; extend the `field` list (N3).
3. S2: give `organization_members` a uuid `id` PK and name it as the audit/notification `entity_id` (N4).
4. S1: split `POSTING_STORED_STATUS` from `POSTING_EFFECTIVE_STATUS`; CHECK test uses the stored set (N2).
5. S11 / ARCH-20: allow `SEED_DEMO=true` on the semester's demo (Render) database (N1).
6. ARCH-18 or S2: `registerApplicant` creates the profile row (R2).
7. S10 or ARCH-17: reconcile the single `getResume` module with "two scopes, two modules" (N5).
8. S9: `AccountSuspendedError`; ARCH-18: list the three timestamp caches; S5: `expired` as a permitted `old_value`; align frontmatter `status` (N6–N9).
9. Decide the length rule: relax it in the memlog or apply the course review's format cuts (course C, open).

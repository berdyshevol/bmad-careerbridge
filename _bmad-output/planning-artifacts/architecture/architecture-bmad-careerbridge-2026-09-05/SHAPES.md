---
title: "CareerBridge — Shared Shapes and Mechanics (binding companion to ARCHITECTURE-SPINE.md)"
status: final
created: 2026-09-05
updated: 2026-09-05
---

# Shared Shapes and Mechanics

The exact vocabularies and mechanics that ARCH rules cite. Binding: a module that writes a different string, column, or path is non-compliant. Change a shape here first, then the code, never the reverse. Column lists name only what a rule depends on; migrations own the rest.

## S1 Stored enum values (ARCH-12)

| Enum | Values (stored exactly) |
| --- | --- |
| Posting status | `draft`, `pending_approval`, `live`, `filled`, `closed`, `rejected`; `expired` is derived, never stored (ARCH-15) |
| Application stage | `applied`, `screening`, `interview`, `offer`, `hired`, `rejected`, `withdrawn`, `declined` |
| Active stages | `applied`, `screening`, `interview`, `offer` |
| Account status | `active`, `suspended` |
| Account role | `applicant`, `recruiter`, `administrator` |
| Membership and Organization status | `pending_approval`, `approved`, `rejected` |
| Interview outcome | `passed`, `failed`, `no_show` |
| Employment type | `full_time`, `part_time`, `internship`, `contract` |

`business/domain/enums.js` exports the stored sets above as constants plus `POSTING_STATUS_EFFECTIVE` (the stored set plus `expired`) for the transition map; the migrations' CHECK constraints list the stored strings; a persistence test asserts each CHECK accepts exactly the exported stored set.

## S2 Status-bearing tables (ARCH-18)

- `accounts(id, email UNIQUE, password_hash, role, status, created_at)` — role and account status only; **no** `organization_id`, **no** recruiter status.
- `organization_members(id PK, account_id UNIQUE, organization_id, status, decided_at)` — the Recruiter's approval status and Organization; `id` is the audit `entity_id`. `UNIQUE(account_id)` is the semester's one-Organization rule; dropping it enables Q-002 later.
- `organizations(id, name, description, website, location, status)`.
- `applicant_profiles(account_id PK, full_name, phone, location, headline, education, summary, current_resume_file_id NULL)`.
- `resume_files(id, account_id, bytes bytea, size, uploaded_at)` — immutable rows.
- `postings(id, organization_id, title, description, requirements, category_id, location_id, employment_type, expires_at timestamptz, status, approved_at NULL, created_by_account_id, created_at)`.
- `applications(id, applicant_account_id NOT NULL, posting_id NOT NULL, resume_file_id NOT NULL, note, stage, stage_changed_at, created_at)`.
- `interviews(id, application_id, scheduled_at, notes, outcome NULL, outcome_notes, recorded_at)` — creating one and recording its outcome each write an audit row (`entity_type = 'interview'`, `field = 'scheduled_at'` or `'outcome'`).
- Permitted caches, each written in the same UPDATE as the status it mirrors: `applications.stage_changed_at`, `postings.approved_at`, `organization_members.decided_at`.
- `settings(id, key UNIQUE, value text)` with the row `application_cap = '5'` inserted by migration; `categories(id, name, active)`, `locations(id, name, active)`, `stage_labels(id, stage UNIQUE, label)`.
- `sessions` — created from connect-pg-simple's DDL with `tableName: 'sessions'`; the one table without audit.

## S3 Indexes and constraints (ARCH-01)

```sql
CREATE UNIQUE INDEX applications_one_open_per_applicant_posting
  ON applications (applicant_account_id, posting_id) WHERE stage <> 'withdrawn';
CREATE UNIQUE INDEX postings_one_open_offer
  ON applications (posting_id) WHERE stage = 'offer';
-- audit_events: trigger BEFORE UPDATE OR DELETE ... RAISE EXCEPTION 'audit_events is insert-only'
```

List-serving indexes, created in the migration that creates the column: `postings(status, approved_at)`, `postings(organization_id)`, `applications(posting_id, stage)`, `applications(applicant_account_id, stage)`, `notifications(recipient_account_id, read_at)`, `audit_events(entity_type, entity_id)`.

## S4 Effective Posting status (ARCH-15)

One Knex fragment in `postingRepository`:

```sql
CASE WHEN status = 'live' AND expires_at <= now() THEN 'expired' ELSE status END AS effective_status
```

Every Posting read selects it. `isEffectivelyLive` means `effective_status = 'live'`. FR-R4-4 uses `effective_status NOT IN ('filled','closed')`. `expires_at` is stored as 23:59:59 of the chosen calendar date in the `TZ` zone. Postgres `now()` is the only clock for rules and audit timestamps.

## S5 `audit_events` (ARCH-19)

```sql
audit_events(
  id uuid PK, seq bigserial UNIQUE,
  entity_type text CHECK IN ('account','organization','organization_member','posting','application','interview','setting','category','location','stage_label'),
  entity_id uuid NOT NULL, field text NOT NULL,
  old_value text NULL, new_value text NULL,
  actor_account_id uuid NOT NULL REFERENCES accounts,
  reason text NULL, created_at timestamptz NOT NULL DEFAULT now())
```

- `entity_type` is the singular table name; `field` is the stored column name (`stage`, `status`, `value`, `role`, `deleted`); values are stored strings cast to text. Creation writes `old_value NULL`. Hard delete writes `field = 'deleted'`.
- One row per entity changed; a use case that changes two entities writes two rows in one transaction. Cascade rows carry the triggering actor.
- `auditRepository.record(conn, { entityType, entityId, field, oldValue, newValue, actorAccountId, reason })` is the only writer. History reads `ORDER BY created_at, seq`.
- Every reason (Application rejection, Posting rejection and administrative close, request rejection, suspension) lives only here; `auditRepository.latestReason(conn, entityType, entityId, field)` serves lists. No `*_reason` column exists on any entity table.
- History returned to Applicants and Recruiters carries `by: 'applicant' | 'recruiter' | 'administrator'`, never the actor id; Administrators (FR-M4-5) see the actor.

## S6 `notifications` (ARCH-18)

```sql
notifications(id uuid PK, recipient_account_id uuid NOT NULL REFERENCES accounts,
  kind text CHECK IN ('application_advanced','application_rejected','offer_extended','interview_recorded',
                      'position_filled','offer_declined','posting_approved','posting_rejected','posting_closed','recruiter_request_decided'),
  entity_type text, entity_id uuid, audit_event_id uuid NOT NULL REFERENCES audit_events,
  body text NOT NULL, read_at timestamptz NULL, created_at timestamptz NOT NULL DEFAULT now())
```

`body` is composed server-side by the use case, contains any reason verbatim, and names Stages by stored value (the client substitutes labels). "Notifies the Recruiter" means one row per Approved member of the Organization. The link is `notificationHref(actor, entityType, entityId)` in `client/src/notifications/href.js`; one Notifications page serves all roles. `entity_id` has no FK; a link to a deleted Posting renders the standard `not_found` alert.

## S7 `req.actor` (ARCH-10)

```js
req.actor = { accountId, role, organizationId, recruiterStatus, accountStatus }  // or null when anonymous
```

Built only by `presentation/middleware/auth.js`; every field present, `null` not `undefined`; `organizationId` and `recruiterStatus` come from the membership row whatever its status. Guards: `requireAuth(...roles)` and `requireApprovedRecruiter`, nothing else. A Suspended Account gets its session destroyed and `401 account_suspended`.

## S8 Use-case and repository signatures (ARCH-04, ARCH-13)

```js
// business/<area>/verbNoun.js
module.exports = async function verbNoun(actor, input) { ... }        // throws business/errors.js classes only
// persistence/<entity>Repository.js
async function findX(conn, ...args) { ... }                             // conn = db or trx, always first
const { db, withTransaction } = require('../persistence/db');           // the only non-repository import business takes
await withTransaction(async (trx) => { ... });                          // returns the callback's value; never nested
```

Repositories return plain objects with `camelCase` keys and never expose Knex builders. Use-case modules never import each other; shared pure logic lives in `business/domain/`, shared I/O in repositories (for example `applicationRepository.rejectAllActiveForPosting(trx, postingId, { reason, actorAccountId })`, which returns the recipients).

## S9 Errors (ARCH-11, conventions)

`business/errors.js`: `ValidationError` 400, `UnauthenticatedError` 401, `AccountSuspendedError` 401, `ForbiddenError` 403, `NotFoundError` 404, `RuleViolationError` 409 with subclasses `InvalidTransitionError`, `ConcurrentChangeError`, `DuplicateApplicationError`, `OfferAlreadyOpenError`, `ApplicationCapReachedError`, `ProfileIncompleteError`. Business never sets an HTTP status.

Envelope: `{ "error": { "code", "message", "details" } }`, `code` in `validation_failed`, `unauthenticated`, `account_suspended`, `forbidden`, `not_found`, `invalid_transition`, `concurrent_change`, `duplicate_application`, `offer_already_open`, `application_cap_reached` (`details: { count, cap }`), `profile_incomplete` (`details: { missing: [] }`), `rule_violation`, `internal`. Validation `details` is `[{ field, message }]`. Postgres `23505` on the S3 indexes is rethrown by the repository as the matching 409 class; any other database error is `500 internal` with no stack in the body and a server-side log.

Client: `api.js` throws `ApiError { status, code, message, details }`, handles 401 once (clears `useAuth`, redirects to login), and pages render every other error through one `<ErrorAlert error={...} />`.

## S10 API paths and envelopes (conventions)

| Scope | Prefix | Guard mounted once in |
| --- | --- | --- |
| Public reads | `/api/postings…`, `/api/reference…` | `routes/public.js` (none) |
| Auth | `/api/auth/login`, `/logout`, `/register`, `/recruiter-requests` | `routes/auth.js` |
| Own records | `/api/me/…` (profile, resume, applications, notifications, recruiter status) | `routes/me.js` `requireAuth()` |
| Organization | `/api/org/…` (postings, applications, organization) | `routes/org.js` `requireApprovedRecruiter` |
| Administrator | `/api/admin/…` | `routes/admin.js` `requireAuth('administrator')` |

A resource reachable in two scopes has two paths and two use-case modules; no handler switches on role. Verbs: create `POST /api/<scope>/<resource>`, edit `PATCH …/:id`, action `POST …/:id/<verb>`, delete only `DELETE /api/org/postings/:id`. Lists accept `?page=1&pageSize=20&sort=<field>:<asc|desc>` plus filters named after columns (server caps `pageSize` at 100) and return `{ "items": [], "page", "pageSize", "total" }`. A single resource is the object; mutations return the updated resource; 204 only for logout. Unread count: `GET /api/me/notifications/unread-count`. Health: `GET /api/health` (200 after `SELECT 1`). No version prefix.

Application detail (Applicant, Recruiter, Administrator) is one shape from `applicationRepository.findWithHistory(conn, id)`:

```json
{ "application": {}, "history": [{ "at": "", "field": "", "oldValue": "", "newValue": "", "reason": "", "by": "" }],
  "interviews": [{ "scheduledAt": "", "notes": "", "outcome": "", "outcomeNotes": "" }] }
```

## S11 Environment variables (ARCH-16)

`DATABASE_URL`, `SESSION_SECRET`, `SESSION_IDLE_HOURS` (8), `ADMIN_EMAIL`, `ADMIN_PASSWORD` (base seed refuses to run without both), `RESUME_MAX_BYTES` (2097152), `TZ` (America/Chicago), `SEED_DEMO` (true wherever the PRD §2 cast must exist: development, CI, and the deployed demo; false on any database holding real people's data), `PORT`, `NODE_ENV`. Read once in `server/src/config.js`. The live Application Cap is **not** an environment value; it is read from `settings` inside the submitting transaction. Client config comes only from `client/src/config.js`, the single file allowed to touch `import.meta.env` (mocked in tests).

## S12 Session and security mechanics (ARCH-08)

- Cookie: `HttpOnly`, `SameSite=Lax`, `Secure` outside development; `app.set('trust proxy', 1)` because Render and Cloud Run terminate TLS; rolling idle expiry from `SESSION_IDLE_HOURS`.
- Store: connect-pg-simple on `sessions` (S2), given the `pg` pool exported by `persistence/db.js`; this is the one presentation → persistence import.
- CSRF: single origin (ARCH-09) plus JSON-only mutation bodies (`express.json`, non-JSON content types on mutations rejected with `validation_failed`); no token.
- Rate limit: `POST /api/auth/login` 10 per minute per IP and per email (express-rate-limit); nothing else is limited.
- Suspended Account: session destroyed, `401 account_suspended`.

## S13 Transaction mechanics (ARCH-13)

- Transitions are asserted on the effective status (S4) and guarded on the stored one: `postingRepository.transition(trx, id, { from, to })` maps `from = 'expired'` to stored `live` and issues `UPDATE … WHERE status = <stored from>`; `applicationRepository.transition` guards on `stage`. Zero rows updated throws `ConcurrentChangeError` (409), never a silent no-op.
- Creating a Posting or Application writes an audit row with `old_value NULL` and `new_value` the initial status, in the same transaction.
- The Expired → Filled audit row records `old_value = 'expired'`.
- An insert whose admissibility depends on a count (FR-A3-4) first locks the Applicant's `applicant_profiles` row `FOR UPDATE`, then reads `application_cap` from `settings` through the same `trx`, then counts Active Applications, then inserts.
- A use case that changes two entities writes two audit rows; `acceptOffer` calls `applicationRepository.rejectAllActiveForPosting` for the cascade and writes the resulting Notifications itself.

## S14 Operations (ARCH-16)

- Image start command: `knex migrate:latest` then `node server/src/index.js`; a failed migration fails the deploy. Migrations are forward-only in production; a mistake is fixed by a new migration.
- CI on every push: lint; `migrate:latest` from an empty database, `migrate:rollback --all`, `migrate:latest` again; both Jest suites against the Postgres service container. Render deploys `main` only after CI passes ("wait for CI" setting or a deploy hook from the workflow).
- `GET /api/health` returns 200 after `SELECT 1`; Render's health check and the pre-presentation warm-up (a `curl` in the demo runbook, which also wakes Neon) both hit it.
- Logging: one pino logger configured in `config.js`, structured request and error logs to stdout; never passwords, resume bytes, or session ids.
- Backup: `scripts/backup.sh` runs `pg_dump` against production before each presentation and each production migration; dumps stay on the Librarian's machine, never committed.

## S15 Resume mechanics (ARCH-17)

- Upload: `multipart/form-data` through multer memory storage with `limits.fileSize = RESUME_MAX_BYTES`; the server checks the `%PDF-` magic bytes, not the extension; the row is inserted and `applicant_profiles.current_resume_file_id` repointed in one transaction.
- Two read modules, two paths (S10): `profiles/getMyResume` (`GET /api/me/resume`, owner) and `applications/getSubmittedResume` (`GET /api/org/applications/:id/resume` and `/api/admin/applications/:id/resume`), which loads the Application, checks scope per ARCH-10, and returns the referenced row, never the profile's current file.
- `resumeFileRepository` is the only reader of `bytes`; list queries never select the column.

## S16 Migrations, seeds, test data (ARCH-20, ARCH-22)

- A column on `applications`, `postings`, or `accounts` is added by the Project Librarian on request; anyone may add a column or index elsewhere, one migration per PR.
- `seeds/base/`: the Administrator from `ADMIN_EMAIL` and `ADMIN_PASSWORD` (refuses to run without both), default categories and locations; idempotent; runs in every environment after migrations. Default `settings` and `stage_labels` rows come from migrations, not seeds.
- `seeds/demo/`: the PRD §2 cast (`CAPABILITY-MAP.md`); runs only when `SEED_DEMO=true`; idempotent by email and Organization name.
- Tests: Jest `globalSetup` migrates once; `persistence/testSupport.js` truncates all non-reference tables before each test file; `server/test/factories.js` creates rows; tests never assume a seed; server suite runs `--runInBand`.

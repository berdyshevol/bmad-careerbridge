---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/SHAPES.md
  - _bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/CAPABILITY-MAP.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-careerbridge-2026-09-05/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-careerbridge-2026-09-05/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-bmad-careerbridge-2026-09-05/wireframes/wireframes.md
  - _bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/brief.md
  - _bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/addendum.md
headless: true
created: 2026-09-05
updated: 2026-09-05
---

# CareerBridge - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for CareerBridge, decomposing the requirements from the PRD, the UX design contract (draft, owned by the Design Engineer), and the Architecture spine into implementable stories.

Run mode: headless (no questions asked). Choices the workflow would normally confirm with the user are marked `[ASSUMPTION]`. The UX pair is `status: draft`; stories cite it but the Design Engineer's revisions win on conflict.

## Requirements Inventory

### Functional Requirements

Wording is condensed; the PRD text is normative. `(UJ-n)` marks the journey an FR realizes.

**UC-A1 Register and maintain applicant profile (M, Iteration 2)**
- FR-A1-1: A visitor self-registers as an Applicant with a unique email and a password of 8+ characters and is logged in on completion, no approval step. (UJ-1)
- FR-A1-2: An Applicant views and edits full name, phone, location, headline, education, and free-text summary.
- FR-A1-3: An Applicant uploads exactly one Resume as a PDF of at most 5 MB (architecture proposes 2 MB, open); a new upload replaces the previous one. (UJ-1)

**UC-A2 Browse and search open postings (M, Iteration 1)**
- FR-A2-1: Any visitor sees the Job List containing only Live Postings, most recently approved first. (UJ-1, UJ-3)
- FR-A2-2: Any visitor opens a Live Posting's detail (title, Organization, category, location, employment type, description, requirements, expiry); an Applicant can also open any Posting they applied to, whatever its status.
- FR-A2-3: Any visitor filters the Job List by case-insensitive keyword on title and description, category, and location, alone or combined.

**UC-A3 Apply to a posting (M, Iteration 2)**
- FR-A3-1: A logged-in Applicant with a full name and a Resume submits an Application (optional note up to 1,000 characters) to a Live Posting, created in Stage Applied. (UJ-1)
- FR-A3-2: The system refuses an Application when the Applicant has no Resume or no full name and links to the profile page.
- FR-A3-3: The system refuses a second Application to the same Posting while an earlier one is Active, Rejected, or Declined, but allows one after a Withdrawn Application while the Posting is Live.
- FR-A3-4: The system refuses an Application when the Applicant's Active count equals the Application Cap and shows count and cap. (UJ-3)
- FR-A3-5: A submitted Application keeps the Resume as it was at submission and cannot be edited afterward.

**UC-A4 Track application Stage; withdraw (S, Iteration 2)**
- FR-A4-1: An Applicant lists all their Applications with Posting title, Organization, current Stage, and time of last Stage change.
- FR-A4-2: An Applicant opens one Application and sees full Stage history with timestamps, the rejection reason if rejected, and the interview date and outcome if recorded. (UJ-2)
- FR-A4-3: An Applicant withdraws an Application in Applied, Screening, or Interview; it moves to Withdrawn and stops counting toward the cap.
- FR-A4-4: The system refuses withdrawal in Stage Offer or any terminal Stage.

**UC-A5 Receive notifications; accept or decline an offer (M, Iteration 3)**
- FR-A5-1: A logged-in Account sees its unread-Notification count on every page and can open its Notifications newest first.
- FR-A5-2: An Account marks a Notification read and follows it to the Application or Posting it concerns.
- FR-A5-3: An Applicant is notified on advance, rejection (with reason), offer, interview recorded, and "Position filled" rejection. (UJ-1, UJ-2)
- FR-A5-4: An Applicant accepts an offer on an Application in Stage Offer, moving it to Hired. (UJ-1)
- FR-A5-5: An Applicant declines an offer, moving it to Declined, leaving the Posting Live, and notifying the Recruiter.

**UC-R1 Register organization and recruiter; maintain org profile (M, Iteration 2)**
- FR-R1-1: A visitor requests a Recruiter Account with a new Organization (name, description, website, location); both are created Pending Approval.
- FR-R1-2: A visitor requests a Recruiter Account for an existing Approved Organization; the request is Pending Approval.
- FR-R1-3: A Pending or Rejected Recruiter can log in but sees only a status page (decision and reason once made) and the public pages.
- FR-R1-4: An Approved Recruiter edits their Organization's description, website, and location but not its name.

**UC-R2 Create, edit, and submit a posting; set expiry (M, Iteration 1)**
- FR-R2-1: An Approved Recruiter creates a Draft Posting with title, description, requirements, category and location from Reference Data, employment type (Full-time, Part-time, Internship, Contract), and a future expiry date. (UJ-1)
- FR-R2-2: A Recruiter edits or deletes their Organization's Posting while Draft, Pending Approval, or Rejected.
- FR-R2-3: A Recruiter submits a Draft or Rejected Posting; it moves to Pending Approval and stays hidden until approved. (UJ-1, UJ-3)
- FR-R2-4: A Recruiter edits description and requirements of a Live Posting without re-approval and is refused changes to title, category, location, or expiry.
- FR-R2-5: A Recruiter lists all their Organization's Postings with status and, for a Rejected Posting, the Administrator's reason.
- FR-R2-6: A Recruiter closes a Live Posting manually; it moves to Closed and leaves the Job List.

**UC-R3 Review applications for own organization only (M, Iteration 2)**
- FR-R3-1: A Recruiter lists Applications to each Posting of their own Organization, optionally filtered by Stage, with Applicant name, Stage, and submission time. (UJ-1)
- FR-R3-2: A Recruiter opens one Application and sees the profile, the Resume as submitted, the note, and the Stage history.
- FR-R3-3: A Recruiter's request for another Organization's Posting or Application is refused as forbidden, and such items never appear in any list. (UJ-3)
- FR-R3-4: A Recruiter cannot see an Applicant's Applications to other Organizations, nor how many exist.

**UC-R4 Advance or reject through the fixed pipeline; record reason (L, Iteration 2)**
- FR-R4-1: A Recruiter advances an Application from Applied to Screening and from Screening to Interview. (UJ-1)
- FR-R4-2: A Recruiter rejects an Application in Applied, Screening, or Interview with a reason of 10+ characters; the rejection creates the Applicant's Notification showing the reason verbatim. (UJ-2)
- FR-R4-3: The system refuses a backward move, a skipped Stage, and any change to a terminal Application.
- FR-R4-4: The system refuses any Stage change other than rejection on an Application whose Posting is Filled or Closed; Applications to an Expired Posting continue normally.

**UC-R5 Record that an interview was scheduled and its outcome (S, Iteration 3)**
- FR-R5-1: A Recruiter records, for an Application in Interview, that an interview was scheduled, with date, time, and optional notes. (UJ-1)
- FR-R5-2: A Recruiter records the outcome of a recorded interview as Passed, Failed, or No-show with optional notes; the outcome gates nothing.

**UC-R6 Extend an offer; posting auto-closes when filled (M, Iteration 3)**
- FR-R6-1: A Recruiter extends an offer on an Application in Interview (recorded interview or not); it moves to Offer and notifies the Applicant; at most one Application per Posting may be in Offer. (UJ-1)
- FR-R6-2: When an Applicant accepts an offer, the Posting moves from Live or Expired to Filled automatically and leaves the Job List. (UJ-1)
- FR-R6-3: When a Posting becomes Filled, every other Active Application to it moves to Rejected with reason "Position filled" and each Applicant is notified; the hired Applicant's other Applications are unchanged.

**UC-M1 Approve or reject organization and recruiter requests (M, Iteration 1)**
- FR-M1-1: An Administrator sees a queue of Pending Organization and Recruiter requests with submitted details and request time.
- FR-M1-2: An Administrator approves a request; the Recruiter Account becomes Approved and, if included, the new Organization becomes Approved. (UJ-1)
- FR-M1-3: An Administrator rejects a request with a mandatory reason, which the requester sees on their status page.

**UC-M2 Approve or reject postings; handle expiry (M, Iteration 2)**
- FR-M2-1: An Administrator sees a queue of Pending Approval Postings and opens each in full.
- FR-M2-2: An Administrator approves a Posting; it moves to Live, is public immediately, and the Recruiter is notified. (UJ-1)
- FR-M2-3: An Administrator rejects a Posting with a mandatory reason; it moves to Rejected and the Recruiter is notified with the reason.
- FR-M2-4: A Live Posting past its expiry date becomes Expired without anyone acting, leaves the Job List, and refuses new Applications; existing Applications keep their Stage. (UJ-3)
- FR-M2-5: An Administrator closes any Live Posting with a mandatory reason; it moves to Closed and the Recruiter is notified.

**UC-M3 Manage user accounts and roles (M, Iteration 3)**
- FR-M3-1: An Administrator lists and searches all Accounts by name, email, role, Organization, and status.
- FR-M3-2: An Administrator suspends an Account with a reason; it cannot log in and any existing session is refused on its next request.
- FR-M3-3: An Administrator reactivates a Suspended Account.
- FR-M3-4: An Administrator changes an Account's role among Applicant, Recruiter (with Organization), and Administrator.
- FR-M3-5: The system refuses an Administrator's attempt to suspend their own Account or change its role.

**UC-M4 Maintain business rules, reference data, and an oversight view (M, Iteration 3)**
- FR-M4-1: An Administrator sets the Application Cap to a whole number from 1 to 20; the new value applies to later submissions without changing existing Applications. (UJ-3)
- FR-M4-2: An Administrator adds, renames, and retires categories and locations; a retired value stays on existing Postings but cannot be chosen for new ones.
- FR-M4-3: An Administrator edits the display label of each pipeline Stage without changing the number or order of Stages.
- FR-M4-4: An Administrator views an oversight page with counts of Accounts by role and status, Postings by status, Applications by Stage, and each approval queue's length.
- FR-M4-5: An Administrator opens any Posting, Application, or Account read-only, with its change history.

**Cross-cutting (shared infrastructure, Iteration 1, not an owned use case)**
- FR-X-1: Any Account logs in with email and password and logs out; a failed login reports one generic message.
- FR-X-2: Every page and operation other than Job List, Posting detail, Applicant registration, the Recruiter request form, and login requires a logged-in Account with the named role; everyone else is refused as forbidden.
- FR-X-3: Every Notification is delivered in-app only and is visible only to its recipient.
- FR-X-4: Every status or Stage change, approval, rejection, and business-rule change records actor, timestamp, previous and new values; the record cannot be edited or deleted.
- FR-X-5: Administrator Accounts are created by system setup or by an existing Administrator, never by self-registration.

Total: 66 FRs (61 use-case FRs plus FR-X-1..5).

### NonFunctional Requirements

- NFR-1 Server-side authorization: every request is authorized on the server independently of the UI; a hand-crafted request for another Organization's data is refused.
- NFR-2 Credential safety: passwords stored only non-reversibly; a session ends after 8 hours of inactivity.
- NFR-3 Applicant privacy: profile and Resume readable only by the Applicant, Recruiters of Organizations they applied to, and Administrators.
- NFR-4 Integrity of transitions: every state change is validated by the business layer; an invalid change is refused with a human-readable message and leaves data unchanged.
- NFR-5 Persistence: all data survives restart; no Application, Posting, or Notification exists without its owner.
- NFR-6 Performance: Job List, Posting detail, and Application list pages respond within 2 s at p95 (server-measured) with 1,000 Postings and 10,000 Applications; 25 concurrent users without errors.
- NFR-7 Availability: deployed at a public URL and reachable at each iteration presentation.
- NFR-8 Usability and compatibility: three first-time testers complete UJ-1 unaided in under five minutes before Iteration 3; current Chrome, Firefox, Safari, Edge; viewports down to 375 px.
- NFR-9 Accessibility: visible label on every form field, every action keyboard-reachable, colour never the only status indicator.
- NFR-10 Testability and traceability: every FR covered by at least one automated test whose name contains the FR ID; full suite runs on every push.
- NFR-11 Maintainability: separate presentation, business, persistence, and data layers so a business-rule change touches one layer.

### Additional Requirements

From the Architecture spine (ARCH-01..22) and its binding companions (SHAPES S1..S16, CAPABILITY-MAP). No starter template is named; the scaffold is hand-built per the CAPABILITY-MAP source tree.

- **Starter / scaffold (ARCH-05, ARCH-03, ARCH-22):** npm workspaces `server/` and `client/` under `careerbridge-csi5324`; root `npm test` runs both Jest suites; server CommonJS, Jest zero-config with supertest; client Jest via babel-jest, jsdom, React Testing Library; only `client/src/config.js` touches `import.meta.env`. Express 5, Knex 3, pg 8; React 19, Vite 7, React Router 7, TanStack Query 5, MUI 7. Deferred to the scaffold story: request-validation library (one for both sides), ESLint and Prettier with the ARCH-03/06/14 greps as lint rules or CI step.
- **Four layers (paradigm, ARCH-03, ARCH-04):** `server/src/{presentation,business,persistence,data}`; dependencies flow one way and never skip; `require('knex')` only under `persistence/`; business never sees `req`/`res`; one business module per use-case action `business/<area>/<verbNoun>.js` with `<verbNoun>.test.js` beside it; use-case modules never import each other; shared pure logic in `business/domain/`, shared I/O in per-entity repositories with no business rules.
- **Database (ARCH-01, ARCH-02, ARCH-20, S2, S3, S16):** PostgreSQL only; Docker Compose for dev, service container in CI, Neon in production, `DATABASE_URL` the only difference; whole S2/S3 schema lands as one initial migration set before any use-case branch opens; later migrations add-only, one per PR, timestamp-named; partial unique indexes `applications_one_open_per_applicant_posting` and `postings_one_open_offer`; audit trigger insert-only; list-serving indexes; base seed (Administrator from `ADMIN_EMAIL`/`ADMIN_PASSWORD`, default categories and locations, idempotent) and demo seed (PRD §2 cast, `SEED_DEMO=true`); Jest `globalSetup` migrates once, `persistence/testSupport.js` truncates, `server/test/factories.js`, `--runInBand`.
- **Enums and state machines (ARCH-12, S1):** `business/domain/enums.js` exports stored sets; `postingStatus.js` and `applicationStage.js` export transition maps, `assertTransition`, `assertPostingAllows`, throwing `InvalidTransitionError`; exhaustive edge tests are the NFR-4 evidence; CHECK constraints enforce values only.
- **Transactions and audit (ARCH-13, ARCH-14, ARCH-19, S5, S13):** every state change is one `withTransaction` with a guarded UPDATE, an audit row via `auditRepository.record` (the only writer), and any Notification; zero rows updated throws `ConcurrentChangeError`; no event bus; `audit_events` insert-only; history reads `ORDER BY created_at, seq`; reasons live only in audit; `latestReason` helper serves lists; non-admin history shows role only.
- **Expiry (ARCH-15, S4):** `expired` derived on read via the single `effective_status` fragment in `postingRepository`; Postgres `now()` the only clock; `expires_at` end-of-day in `TZ`; no audit row on expiry.
- **Sessions and auth (ARCH-08, ARCH-10, S7, S12):** express-session on `sessions` via connect-pg-simple, HTTP-only `SameSite=Lax` cookie, `Secure` outside dev, `trust proxy`, rolling 8 h idle; bcrypt; every request reloads Account and membership into `req.actor` (all fields present, `null` when anonymous); guards `requireAuth(...roles)` and `requireApprovedRecruiter` mounted once per scope router; suspended Account gets session destroyed and `401 account_suspended`; login rate limit 10/min per IP and per email; JSON-only mutation bodies as CSRF defence.
- **Authorization layering (ARCH-10, ARCH-11):** role in presentation, scope in business (actor first, refuse out-of-scope), Organization in the query for recruiter lists (`organizationId` mandatory WHERE), single record loads by id and throws `ForbiddenError` (403) when Organization differs; not-effectively-Live Posting is 404 to visitors and non-applicants; UUID keys.
- **API surface (ARCH-09, S9, S10):** single origin, `/api` prefix, Vite proxy in dev, Express serves `client/dist` with `/{*splat}` fallback after routers, unknown `/api` path returns 404 envelope; scope routers `public`, `auth`, `me`, `org`, `admin`; verbs `POST` create, `PATCH` edit, `POST …/:id/<verb>` action, `DELETE` only for org postings; lists `?page&pageSize&sort` capped at 100 returning `{items,page,pageSize,total}`; error classes in `business/errors.js` mapped once in `presentation/errors.js`; envelope `{error:{code,message,details}}`; Postgres 23505 on S3 indexes rethrown as the matching 409 class; health `GET /api/health`; unread count `GET /api/me/notifications/unread-count`; Application detail one shape from `applicationRepository.findWithHistory`.
- **Client conventions (ARCH-06, ARCH-07, S9):** all HTTP through `client/src/api.js` (throws `ApiError`, handles 401 once); TanStack Query for server state, mutations invalidate; one `useAuth` context; no global state library; unread count one polled query from Iteration 1; one `<ErrorAlert>`; MUI 7 per the UX contract; `client/src/notifications/href.js` builds Notification links.
- **Resumes (ARCH-17, S15):** `resume_files` immutable `bytea` rows; multer memory storage with `RESUME_MAX_BYTES` (2 MB default); `%PDF-` magic-byte check; insert and repoint in one transaction; `getMyResume` and `getSubmittedResume` as two scoped read modules; `resumeFileRepository` the only reader of bytes.
- **Deployment and operations (ARCH-16, S11, S14):** one Docker image running Express, config only via S11 environment variables read once in `server/src/config.js`; start command `knex migrate:latest` then `node server/src/index.js`; CI on every push: lint, migrate up/rollback/up from empty database, both Jest suites against a Postgres service container; Render deploys `main` after CI green; Render health check on `/api/health`; pino structured logging (never passwords, resume bytes, session ids); `scripts/backup.sh` `pg_dump` before presentations and production migrations.
- **Repository workflow (ARCH-21):** one GitHub issue per use case (FR IDs as checklist) and per NFR needing work; branch `<issue>-<slug>`; PR into protected `main` with CI green and one non-author reviewer; merge commits, never squash; commit messages reference the issue.
- **Data ownership (ARCH-18):** Recruiter approval status and Organization live on `organization_members`, never on `accounts`; Application created only by `submitApplication`; caches only `stage_changed_at`, `approved_at`, `decided_at`; Stage history read from audit; interviews belong to the Application; Notifications never deleted, only `read_at` changes; hard delete only for Postings in draft/pending_approval/rejected with an audit row; cap, reference data, and Stage labels in S2 tables changed only through audited use cases.

### UX Design Requirements

Source: the bmad-ux spine pair (draft) plus wireframes. Items realized by the skeleton epic are marked (skeleton); the rest belong to the use-case epic that owns the screen.

- UX-DR1 (skeleton): MUI 7 theme with the DESIGN.md brand delta: primary `#1F4E79`, secondary `#5E6B7A`, page surface `#F5F7FA`, stage tokens `stage-active`, `stage-offer #B26A00`, `stage-success #2E7D32`, `stage-danger #C62828`, `stage-neutral`; typography h1 28/600, h2 20/600, body 16, caption 13, nothing below 13 px; radii 4/8/full; MUI 8 px spacing; content max 1200 px, reading max 720 px; Roboto via MUI defaults, no webfont.
- UX-DR2 (skeleton): `AppBar` on every page: navy, 56 px mobile / 64 px desktop, elevation 0 with divider; wordmark links home; role links per role (Visitor: Jobs · Log in · Register · For recruiters; Applicant: Jobs · My Applications · Profile; Approved Recruiter: Jobs · Postings · Organization; Pending/Rejected Recruiter: Jobs · Status; Administrator: Requests · Postings · Accounts · Settings · Oversight); bell `IconButton` with `Badge color="error"` and accessible name "Notifications, N unread" (hidden at zero, "99+" above 99, visitors have no bell); avatar `Menu` with Log out; below 900 px links collapse into a left `Drawer` behind a button labelled "Menu".
- UX-DR3 (skeleton): Client route guards and landing rules: Applicant → `/me/applications`, Recruiter → `/org/postings` (or `/org/status` when not Approved), Administrator → `/admin/requests`; wrong role redirected to their landing; visitor hitting Apply sent to `/login?next=/jobs/:id` and returned; a 401 clears `useAuth` and shows `/login` with "Your session ended. Log in again." `[ASSUMPTION A-UX-6]`.
- UX-DR4 (skeleton): `ErrorAlert` component rendering the S9 envelope verbatim with severity by code (`error` for forbidden, invalid transition, internal; `warning` for cap reached, profile incomplete; `info` for "You applied"; `success` after approvals), `role="alert"`; per-code treatments: `validation_failed` → helper text under each field and focus on the first error; `forbidden` → full-page "You do not have access to this page" with a link home and no record fields; `not_found` → "This posting is not available"; `internal` → "Something went wrong. Try again." with Retry; `account_suspended`/`unauthenticated` → redirect to `/login` with a one-line reason.
- UX-DR5 (skeleton): `StageChip` / `StatusChip`: outlined `Chip`, 24 px, full radius, icon + label from `stage_labels`, colour keyed to the stored enum (applied paper-plane, screening magnifier, interview calendar, offer star, hired check, rejected x, withdrawn undo, declined slash); same component for Posting status and Account status with their own icon sets; colour never the only indicator.
- UX-DR6 (skeleton): `ResponsiveTable`: MUI `Table` (`size="small"` on Recruiter and Admin screens) at ≥ 900 px; one `Card` per row below 900 px repeating fields as label–value pairs with actions at the bottom as full-width outlined buttons.
- UX-DR7 (skeleton): `EmptyState` (one sentence, at most one action), `Skeleton` loading rows matching the layout (no spinners over content), `Snackbar` with `aria-live="polite"` for one-click actions, page `<h1>` naming the screen and document title following.
- UX-DR8 (skeleton): `FilterBar` pattern: keyword `TextField` plus `Select`s, all with visible labels, state kept in the URL query so filtered lists are shareable and Back works; filters stack full-width under 600 px.
- UX-DR9 (skeleton): `ReasonDialog`: multiline reason with visible label, inline minimum-length enforcement (10 characters), primary button disabled until valid, focus trapped, Escape closes, focus returns to trigger; used by reject, close, suspend, reject request.
- UX-DR10 (skeleton): Confirmation policy `[A-UX-2 settled]`: Dialog only for irreversible actions (reject, extend offer, accept offer, decline offer, withdraw, admin close, suspend, reject request); advances and approvals are one click plus Snackbar, no undo; Recruiter queue helper text "Advancing cannot be undone; the pipeline only moves forward."
- UX-DR11 (skeleton): Button conventions: one contained primary per screen region; secondary `outlined`; destructive or terminal actions `outlined color="error"`, never filled red.
- UX-DR12 (skeleton): Pagination 20 per page with MUI `Pagination`, no infinite scroll; tap targets ≥ 44 px on public and Applicant surfaces; layout breakpoints xs 375–599 (single column, Drawer, cards, sticky Apply), sm/md 600–899 (Drawer, filters in one row), md+ ≥ 900 (inline links, two-column Job Detail 8/4, tables).
- UX-DR13 (skeleton): Unread poll `UNREAD_POLL_MS = 60000` in `client/src/config.js`, refetched after any mutation via TanStack Query invalidation `[A-UX-1 settled]`.
- UX-DR14 (UC-A2): Job List `/` per wireframe 1: h1 "Open positions", FilterBar (keyword, category, location, Search, Clear), Cards with title, employment-type chip, Organization · category · location, "Approved ‹relative› · Expires ‹date›", "Showing a–b of n", Pagination; empty "No live postings match. Clear filters."
- UX-DR15 (UC-A2 / UC-A3): Job Detail `/jobs/:id` per wireframe 2: "‹ Back to jobs", h1 title, meta line with employment-type chip, expiry, h2 Description, h2 Requirements, reading-max width; Apply card in the 4-column slot (UC-A3): "N of cap active applications" hint `[A-UX-3 settled]`, Resume name from profile, optional Note with 0/1000 counter, contained Apply; variants: Visitor "Log in to apply" + "New here? Register"; `profile_incomplete` warning listing `missing` with "Complete profile" → `/me/profile`; `application_cap_reached` "You have N of M active applications. Withdraw one to apply." + "My Applications"; `duplicate_application` info "You applied on ‹date›. Stage: chip" + "View application"; not Live → 404 page. 375 px: single column, Apply card first, sticky Apply button.
- UX-DR16 (UC-A4 / UC-A5): My Applications `/me/applications` per wireframe 3: h1 "My applications", "Active N of cap · Browse jobs", rows with title, Organization, StageChip, "changed ‹relative›", chevron; empty "You have not applied yet. Browse jobs." Detail `/me/applications/:id`: `PipelineStepper` (five steps, horizontal on md+, vertical on xs, labels from `stage_labels`, terminal state freezes it and adds a chip), Offer panel with Accept offer (contained) and Decline offer (`outlined color="error"`) each behind a confirm Dialog (UC-A5), Interview card when recorded (date, time, outcome, notes), h2 History as `HistoryTimeline` (audit rows oldest first per wireframe, "‹from› → ‹to› · by ‹role› · ‹timestamp›", reason inline), h2 Your submission (Resume as submitted with Download, note); Rejected variant with `Alert(error)` "Rejected: ‹reason verbatim›" and no actions; Withdraw (`outlined color="error"`, confirm Dialog, no reason field) in Applied/Screening/Interview, hidden at Offer and terminal.
- UX-DR17 (UC-R3 / UC-R4 / UC-R5 / UC-R6): Recruiter application queue `/org/postings/:id/applications` per wireframe 4: "‹ Postings", h1 Posting title with status chip, expiry, Edit and Close…; Stage filter Select, "N applications", helper caption; `ResponsiveTable` columns Applicant, Stage, Submitted, Actions (inline row actions `[ASSUMPTION A-UX-7]`, open for the Design Engineer); per-stage button rules (applied → Advance → Screening · Reject; screening → Advance → Interview · Reject; interview → Record interview · Record outcome · Extend offer · Reject; offer → "Offer extended, awaiting applicant"; terminal → none; Posting filled/closed → only Reject plus banner "This posting is filled."); Advance one click + Snackbar "‹name› moved to ‹Stage›"; Reject `ReasonDialog` "Reason (shown to the applicant)"; Extend offer confirm Dialog "Extend an offer to ‹name›? Only one offer can be open per posting."; Record interview / Record outcome as inline-form Dialogs; refused transitions as `Alert(error)` above the table with refetch; row click → `/org/applications/:id` (profile, Resume as submitted, note, history, same actions; never the Applicant's other Applications or their count).
- UX-DR18 (UC-M1 / UC-M2): Admin approvals per wireframe 5: h1 "Approvals", two `Tabs` mapping to `/admin/requests` and `/admin/postings` with counts `[ASSUMPTION A-UX-4]`; request Cards (name · email, "requested ‹date›", "New organization: ‹name› · ‹website› · ‹location›" plus description, or "Join existing organization: ‹name›"), Reject… (`ReasonDialog` "Reason (shown to the requester)") and Approve (one click + Snackbar "Approved"); Postings tab Cards with title, Organization, category, location, expiry, "Open in full" link, Reject… with reason, Approve → Live; empty "Nothing waiting."; 375 px: full-width buttons Approve then Reject; `lg` inline detail panel.
- UX-DR19 (UC-R1): Recruiter status page `/org/status` Card: "Your request for ‹Org› is waiting for review." or "Rejected: ‹reason›"; Recruiter request form `/recruiters/request` with new-Organization fields or an existing-Organization select; Organization profile `/org/profile` with name read-only.
- UX-DR20 (UC-R2): Posting editor `/org/postings/new` and `/org/postings/:id/edit`: single-column MUI form (title, description, requirements, category Select, location Select, employment type Select, expiry date) with visible labels; on a Live Posting the frozen fields (title, category, location, expiry) show a lock icon and helper text; actions Save as Draft, Submit (Snackbar "Posting submitted. An administrator will review it."), Delete, Close; My Postings `/org/postings` list with `StatusChip` and rejection reason.
- UX-DR21 (UC-A1): Applicant registration `/register` (Applicants only; no Administrator sign-up) and Profile `/me/profile` with profile fields and Resume upload (PDF, size limit shown), current file name shown.
- UX-DR22 (UC-A5): Notifications page `/notifications`: newest first, unread rows bold with a dot icon, click marks read and follows `notificationHref`; one page serves all roles; Stage names substituted from labels; link to a deleted Posting renders the `not_found` alert.
- UX-DR23 (UC-M3 / UC-M4): Accounts `/admin/accounts` (`FilterBar` search by name, email, role, Organization, status; suspend via `ReasonDialog`, reactivate, change role); Settings `/admin/settings` (Application Cap 1–20, categories and locations add/rename/retire, Stage labels); Oversight `/admin/oversight` (counts only); Record view `/admin/records/:type/:id` read-only with `HistoryTimeline` showing the actor.
- UX-DR24 (all): Voice: reasons verbatim ("Rejected: Position filled"), "3 of 5 active applications", "You do not have access to this page", "Posting submitted. An administrator will review it.", Stage names exactly as the label table says.
- UX-DR25 (all): Accessibility floor: visible label on every input including filters and reason fields; every action a `button` or `a` reachable by Tab in reading order; Dialogs trap focus, close on Escape, return focus; status and Stage carry text and icon; Alerts `role="alert"`; browsers current Chrome, Firefox, Safari, Edge; no dark mode, no offline.

### FR Coverage Map

Every FR maps to exactly one epic (the epic whose business module realizes it). Two crossings are noted.

- FR-X-1, FR-X-2, FR-X-3, FR-X-4, FR-X-5: Epic 1 - login/logout, role guards, notification delivery, audit trail, seeded Administrator
- FR-A2-1, FR-A2-2, FR-A2-3: Epic 2 - public Job List, Posting detail, filters
- FR-R2-1, FR-R2-2, FR-R2-3, FR-R2-4, FR-R2-5, FR-R2-6: Epic 3 - Posting create, edit, delete, submit, Live edit, list, close
- FR-M1-1, FR-M1-2, FR-M1-3: Epic 4 - request queue, approve, reject with reason
- FR-A1-1, FR-A1-2, FR-A1-3: Epic 5 - Applicant registration, profile, Resume upload
- FR-R1-1, FR-R1-2, FR-R1-3, FR-R1-4: Epic 6 - Recruiter and Organization request, status page, Organization profile
- FR-M2-1, FR-M2-2, FR-M2-3, FR-M2-4, FR-M2-5: Epic 7 - Posting queue, approve, reject, expiry, administrative close
- FR-A3-1, FR-A3-2, FR-A3-3, FR-A3-4, FR-A3-5: Epic 8 - submit Application with profile, duplicate, cap, and snapshot rules
- FR-A4-1, FR-A4-2, FR-A4-3, FR-A4-4: Epic 9 - My Applications, detail with history, withdraw
- FR-R3-1, FR-R3-2, FR-R3-3, FR-R3-4: Epic 10 - Organization-scoped Application queue and detail, privacy
- FR-R4-1, FR-R4-2, FR-R4-3, FR-R4-4: Epic 11 - advance, reject with reason, transition refusals
- FR-R5-1, FR-R5-2: Epic 12 - record interview and outcome
- FR-R6-1: Epic 13 - extend offer, one open offer per Posting
- FR-R6-2, FR-R6-3: Epic 14 - realized inside `applications/acceptOffer` (the ARCH-13 fill cascade). `[ASSUMPTION]` The PRD files these under UC-R6, but CAPABILITY-MAP places the cascade module under UC-A5 and ARCH-13 forbids splitting a cascade across modules, so the business tests named FR-R6-2 and FR-R6-3 live in `acceptOffer.test.js` (Epic 14). Epic 13 delivers the persistence half (`applicationRepository.rejectAllActiveForPosting`, Expired → Filled mapping in `postingRepository.transition`) with persistence tests also named FR-R6-2 and FR-R6-3, so the UC-R6 owner still builds "auto-closes when filled".
- FR-A5-1, FR-A5-2, FR-A5-3, FR-A5-4, FR-A5-5: Epic 14 - Notifications page, mark read, Applicant notification events, accept and decline offer. `[ASSUMPTION]` FR-A5-3 names events created by Epics 11, 12, 13, 14 (rejection, advance, interview recorded, offer, position filled); each of those epics writes its Notification row inside its own transaction (ARCH-14) and names FR-A5-3 in its own test; Epic 14 owns the FR ID and the end-to-end test that every listed event reaches the Applicant.
- FR-M3-1, FR-M3-2, FR-M3-3, FR-M3-4, FR-M3-5: Epic 15 - Accounts list and search, suspend, reactivate, change role, self-protection
- FR-M4-1, FR-M4-2, FR-M4-3, FR-M4-4, FR-M4-5: Epic 16 - Application Cap, reference data, Stage labels, oversight counts, record history view

Coverage check: 66 FRs, 66 mapped, 0 unmapped.

## Epic List

Ordered by iteration and then by dependency flow. Every epic has an empty `owner:` field for Monday's meeting. Epic 1 is the one deliberate departure from the "no technical-layer epic" principle: the course requires the shared skeleton to be finished before Iteration 2, and FR-X-1..5 are user-facing requirements in their own right (log in, be refused, see Notifications, trust the audit trail).

Ownership convention for shared files `[ASSUMPTION]`: business modules are never shared (ARCH-04). Repositories, `server/test/factories.js`, and client pages composed from several use cases (Job Detail, Application detail, Recruiter Application detail) are shared files; each epic adds its own functions or its own component file (for example `ApplyCard.jsx`, `WithdrawButton.jsx`, `OfferPanel.jsx`, `InterviewDialog.jsx`, `ExtendOfferDialog.jsx`) and one mount line, never edits another epic's component.

### Epic 1: Iteration 1 skeleton — shared platform every use case builds on
owner:
iteration: 1
Any Account can log in and out, every page and API route is guarded by role on the server, every state change leaves an audit row, every Notification reaches only its recipient, and the system runs from one repository through CI to a public URL. After this epic a use-case owner starts from a working full stack: schema, seeds, sessions, `req.actor`, state machines, repositories, error envelope, MUI shell, route guards, shared components, CI, and Render deploy.
**FRs covered:** FR-X-1, FR-X-2, FR-X-3, FR-X-4, FR-X-5
**NFRs advanced:** NFR-1, NFR-2, NFR-4 (state machines), NFR-5, NFR-7, NFR-9 (shell), NFR-10, NFR-11
**ARCH rules:** ARCH-01..22 (all), S1..S16
**UX-DRs:** UX-DR1..13, UX-DR24, UX-DR25

### Epic 2: UC-A2 Browse and search open postings
owner:
iteration: 1
Any visitor, logged in or not, finds Live Postings, filters them by keyword, category, and location, and reads a Posting in full; expired and pending Postings are invisible.
**FRs covered:** FR-A2-1, FR-A2-2, FR-A2-3
**ARCH rules:** ARCH-11, ARCH-15, S4, S10
**UX-DRs:** UX-DR14, UX-DR15 (detail half)

### Epic 3: UC-R2 Create, edit, and submit a posting; set expiry
owner:
iteration: 1
An Approved Recruiter drafts a Posting, submits it for approval, edits the allowed fields at each status, lists their Organization's Postings with reasons, and closes a Live one.
**FRs covered:** FR-R2-1, FR-R2-2, FR-R2-3, FR-R2-4, FR-R2-5, FR-R2-6
**ARCH rules:** ARCH-10, ARCH-12, ARCH-13, ARCH-15, ARCH-18 (hard delete rule)
**UX-DRs:** UX-DR20

### Epic 4: UC-M1 Approve or reject organization and recruiter requests
owner:
iteration: 1
An Administrator sees every pending Organization and Recruiter request and approves or rejects it with a reason that the requester can read.
**FRs covered:** FR-M1-1, FR-M1-2, FR-M1-3
**ARCH rules:** ARCH-12, ARCH-13, ARCH-18 (membership), ARCH-19
**UX-DRs:** UX-DR18 (requests tab)

### Epic 5: UC-A1 Register and maintain applicant profile
owner:
iteration: 2
A visitor becomes an Applicant in one step, maintains a profile, and keeps exactly one Resume that later Applications snapshot.
**FRs covered:** FR-A1-1, FR-A1-2, FR-A1-3
**ARCH rules:** ARCH-08, ARCH-17, S15
**UX-DRs:** UX-DR21

### Epic 6: UC-R1 Register organization and recruiter; maintain org profile
owner:
iteration: 2
A visitor requests a Recruiter Account with a new or existing Organization, sees their approval status while waiting, and once Approved maintains the Organization profile.
**FRs covered:** FR-R1-1, FR-R1-2, FR-R1-3, FR-R1-4
**ARCH rules:** ARCH-10, ARCH-18 (membership)
**UX-DRs:** UX-DR19

### Epic 7: UC-M2 Approve or reject postings; handle expiry
owner:
iteration: 2
An Administrator reviews pending Postings, makes them Live or rejects them with a reason, closes any Live Posting with a reason, and expiry removes Postings from the public without anyone acting.
**FRs covered:** FR-M2-1, FR-M2-2, FR-M2-3, FR-M2-4, FR-M2-5
**ARCH rules:** ARCH-12, ARCH-13, ARCH-15, S4
**UX-DRs:** UX-DR18 (postings tab)

### Epic 8: UC-A3 Apply to a posting
owner:
iteration: 2
A logged-in Applicant with a complete profile applies to a Live Posting with an optional note; the system enforces the complete-profile, no-duplicate, and Application Cap rules and freezes the submission.
**FRs covered:** FR-A3-1, FR-A3-2, FR-A3-3, FR-A3-4, FR-A3-5
**ARCH rules:** ARCH-01, ARCH-11, ARCH-13, ARCH-15, ARCH-17, ARCH-18, S3, S13
**UX-DRs:** UX-DR15 (Apply card)

### Epic 9: UC-A4 Track application Stage; withdraw
owner:
iteration: 2
An Applicant sees every Application with its Stage, opens one to read the full history, reasons, and interview record, and withdraws while that is still allowed.
**FRs covered:** FR-A4-1, FR-A4-2, FR-A4-3, FR-A4-4
**ARCH rules:** ARCH-12, ARCH-13, ARCH-18, ARCH-19, S10 (detail shape)
**UX-DRs:** UX-DR16 (list, Stepper, history, withdraw)

### Epic 10: UC-R3 Review applications for own organization only
owner:
iteration: 2
A Recruiter reviews the Applications to their Organization's Postings, opens each with the Resume as submitted, and never sees another Organization's data or an Applicant's other Applications.
**FRs covered:** FR-R3-1, FR-R3-2, FR-R3-3, FR-R3-4
**ARCH rules:** ARCH-10, ARCH-11, ARCH-17, S10, S15
**UX-DRs:** UX-DR17 (queue and detail, read side)

### Epic 11: UC-R4 Advance or reject through the fixed pipeline; record reason
owner:
iteration: 2
A Recruiter moves an Application forward one Stage at a time or rejects it with a reason the Applicant reads verbatim; backward, skipped, and terminal changes are refused.
**FRs covered:** FR-R4-1, FR-R4-2, FR-R4-3, FR-R4-4
**ARCH rules:** ARCH-10, ARCH-12, ARCH-13, ARCH-14, ARCH-19
**UX-DRs:** UX-DR17 (advance and reject actions), UX-DR9, UX-DR10

### Epic 12: UC-R5 Record that an interview was scheduled and its outcome
owner:
iteration: 3
A Recruiter records that an interview was scheduled and later its outcome, and the Applicant sees both.
**FRs covered:** FR-R5-1, FR-R5-2
**ARCH rules:** ARCH-10, ARCH-13, ARCH-18 (interviews), ARCH-19
**UX-DRs:** UX-DR17 (interview Dialogs), UX-DR16 (interview card, read side)

### Epic 13: UC-R6 Extend an offer; posting auto-closes when filled
owner:
iteration: 3
A Recruiter extends one offer at a time per Posting, and the persistence layer can fill a Posting and reject its other Active Applications in one call.
**FRs covered:** FR-R6-1 (business); persistence half of FR-R6-2, FR-R6-3 (see coverage map)
**ARCH rules:** ARCH-01, ARCH-10, ARCH-12, ARCH-13, S3, S13
**UX-DRs:** UX-DR17 (Extend offer Dialog)

### Epic 14: UC-A5 Receive notifications; accept or decline an offer
owner:
iteration: 3
Any Account reads its Notifications and follows them; an Applicant is told of every decision on their Applications and accepts or declines an offer, with acceptance filling the Posting.
**FRs covered:** FR-A5-1, FR-A5-2, FR-A5-3, FR-A5-4, FR-A5-5, FR-R6-2, FR-R6-3
**ARCH rules:** ARCH-12, ARCH-13, ARCH-14, ARCH-18, S6, S13
**UX-DRs:** UX-DR22, UX-DR16 (Offer panel)

### Epic 15: UC-M3 Manage user accounts and roles
owner:
iteration: 3
An Administrator finds any Account, suspends or reactivates it, and changes its role, while the system protects the Administrator from locking themselves out.
**FRs covered:** FR-M3-1, FR-M3-2, FR-M3-3, FR-M3-4, FR-M3-5
**ARCH rules:** ARCH-08, ARCH-13, ARCH-18 (membership), ARCH-19
**UX-DRs:** UX-DR23 (Accounts)

### Epic 16: UC-M4 Maintain business rules, reference data, and an oversight view
owner:
iteration: 3
An Administrator tunes the Application Cap, reference data, and Stage labels, watches platform counts, and opens any record with its change history.
**FRs covered:** FR-M4-1, FR-M4-2, FR-M4-3, FR-M4-4, FR-M4-5
**ARCH rules:** ARCH-13, ARCH-15, ARCH-18, ARCH-19
**UX-DRs:** UX-DR23 (Settings, Oversight, Record view)

### Dependencies between epics

- Epic 1 precedes every other epic (ARCH-20: the schema lands before any use-case branch opens).
- Epics 2, 3, 4 (Iteration 1) run on the demo seed for Accounts and Organizations (CAPABILITY-MAP seed cast) because Epics 5 and 6 arrive in Iteration 2.
- Epic 8 needs Epic 5 (a Resume to snapshot); Epics 9, 10, 11 need Epic 8 (Applications to show and move).
- Epic 12 and 13 need Epic 11 (an Application in Interview); Epic 14's accept and decline need Epic 13 (an Application in Offer).
- Epic 7's approval creates the Live Postings that Epics 2 and 8 read; until then the demo seed supplies one Live and one expired Posting.
- Epics 15 and 16 depend only on Epic 1.

### Story conventions

Every story carries four fields under its user story. `Realizes` lists the FR IDs (or NFRs for infrastructure stories). `Obeys` lists the ARCH rules and S-shapes that bind it. `Tests` names the file(s) whose test names contain the FR IDs verbatim (NFR-10, ARCH-04). `Touches` bounds the files so the story fits one `bmad-build` session (about 500 lines including tests). Server business tests sit beside the module (`<verbNoun>.test.js`, repositories mocked with `jest.mock`); route tests use supertest against the app and the disposable database under `server/src/presentation/routes/<scope>.test.js`; client tests are `*.test.jsx` beside the component. `[ASSUMPTION]` Where an FR is realized in an earlier story's module, the later story extends the same module and test file rather than creating a second module (ARCH-04: one module per use-case action).

---

## Epic 1: Iteration 1 skeleton — shared platform every use case builds on

owner:
iteration: 1

Any Account can log in and out, every page and API route is guarded by role on the server, every state change leaves an audit row, every Notification reaches only its recipient, and the system runs from one repository through CI to a public URL. After this epic a use-case owner starts from a working full stack.

`[ASSUMPTION]` ARCH-20 overrides the workflow's "create tables only when needed" principle: the Project Librarian lands the whole S2/S3 schema in Story 1.3 before any use-case branch opens. `[ASSUMPTION]` The skeleton also owns the pure state machines (Story 1.2) and the shared presentational components (Story 1.8), because Iteration 1 and Iteration 2 use cases would otherwise each build their own.

### Story 1.1: One repository, two workspaces, and a green CI

As a team member,
I want one repository with server and client workspaces, a local Postgres, lint, Jest on both sides, and a CI run on every push,
So that every use-case branch starts from the same toolchain and a red build is visible before review.

- **Realizes:** NFR-10 (suite on every push), NFR-11 (layer folders), NFR-7 groundwork; no FR
- **Obeys:** ARCH-02, ARCH-03 (grep as lint rule), ARCH-05, ARCH-06 (grep as lint rule), ARCH-09 (Vite proxy), ARCH-14 (grep as lint rule), ARCH-22, S11, S14 (CI steps)
- **Tests:** `server/src/presentation/routes/health.test.js` (`NFR-7 GET /api/health returns 200 after SELECT 1`), `client/src/App.test.jsx` (renders without crashing)
- **Touches:** root `package.json` (workspaces, `npm test`, `npm run lint`), `docker-compose.yml`, `.github/workflows/ci.yml`, `.eslintrc`/`prettier` config, `server/package.json`, `server/knexfile.js`, `server/src/config.js`, `server/src/index.js`, `server/src/presentation/app.js` (health route only), `client/package.json`, `client/vite.config.js`, `client/babel.config.js`, `client/jest.config.js`, `client/src/config.js`, `client/src/main.jsx`, `client/src/App.jsx`, `README.md` (run instructions)

**Acceptance Criteria:**

**Given** a fresh clone with Docker running
**When** a developer runs `docker compose up -d`, `npm ci`, and `npm test` at the root
**Then** Postgres (pinned major) starts, both Jest suites run, and the run exits 0
**And** `npm run lint` fails on any `require('knex')` outside `server/src/persistence/`, any `fetch(` in `client/src` outside `api.js`, and any `EventEmitter` or `.emit(` in `server/src`

**Given** `server/src/config.js`
**When** the server starts
**Then** every S11 variable (`DATABASE_URL`, `SESSION_SECRET`, `SESSION_IDLE_HOURS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESUME_MAX_BYTES`, `TZ`, `SEED_DEMO`, `PORT`, `NODE_ENV`) is read there and nowhere else, missing required values fail fast with a named error, and one pino logger is configured with request logging to stdout

**Given** the CI workflow
**When** any branch is pushed
**Then** CI runs lint, `migrate:latest` from an empty database, `migrate:rollback --all`, `migrate:latest` again, and both Jest suites against a Postgres service container of the same major, and the server suite runs `--runInBand`

**Given** the Vite dev server
**When** the client requests `/api/health`
**Then** the request is proxied to Express on port 3000 and returns `{ "status": "ok" }` with 200

**Given** the request-validation choice deferred by the spine
**When** the story is done
**Then** one validation library is installed for both workspaces and named in `README.md` with a one-line rationale `[ASSUMPTION: zod, usable in Express handlers and React forms alike]`

### Story 1.2: Stored enums and the two state machines

As a use-case owner,
I want the stored enum strings and the Posting and Application transition rules in pure modules with exhaustive tests,
So that every state change in every use case asks the same code and NFR-4 has one piece of evidence.

- **Realizes:** NFR-4; groundwork for FR-R2-3, FR-R2-6, FR-R4-1, FR-R4-3, FR-R4-4, FR-A4-3, FR-A4-4, FR-R6-1, FR-R6-2, FR-A5-4, FR-A5-5, FR-M2-2, FR-M2-3, FR-M2-5 (their tests are in their own epics)
- **Obeys:** ARCH-04 (`business/domain/` is shared pure logic), ARCH-12, S1, S9 (`InvalidTransitionError`)
- **Tests:** `server/src/business/domain/postingStatus.test.js` (`NFR-4 …` one test per cell of the transition matrix), `server/src/business/domain/applicationStage.test.js` (`NFR-4 …`), `server/src/business/domain/enums.test.js`
- **Touches:** `server/src/business/errors.js` (S9 classes, created here), `server/src/business/domain/enums.js`, `postingStatus.js`, `applicationStage.js`

**Acceptance Criteria:**

**Given** `enums.js`
**When** imported
**Then** it exports the S1 sets exactly: `POSTING_STATUS` (`draft`, `pending_approval`, `live`, `filled`, `closed`, `rejected`), `POSTING_STATUS_EFFECTIVE` (plus `expired`), `APPLICATION_STAGE`, `ACTIVE_STAGES`, `ACCOUNT_STATUS`, `ACCOUNT_ROLE`, `MEMBERSHIP_STATUS`, `INTERVIEW_OUTCOME`, `EMPLOYMENT_TYPE`, all frozen

**Given** `postingStatus.js`
**When** `assertTransition(from, to)` is called with the PRD §3 map (`draft → pending_approval`, `pending_approval → live | rejected`, `rejected → pending_approval`, `live → filled | closed`, `expired → filled`)
**Then** allowed pairs return, every other pair (including same-to-same and any move out of `filled`, `closed`) throws `InvalidTransitionError` whose message names both statuses in words ("A live posting cannot go back to draft")
**And** `assertPostingAllows(effectiveStatus, toStage)` throws when `effectiveStatus` is `filled` or `closed` and `toStage` is anything but `rejected`, and passes for `expired` (FR-R4-4)

**Given** `applicationStage.js`
**When** `assertTransition(from, to)` is called
**Then** exactly these pass: `applied → screening | rejected | withdrawn`, `screening → interview | rejected | withdrawn`, `interview → offer | rejected | withdrawn`, `offer → hired | declined`; every other pair throws, including `applied → interview` (skip), `interview → screening` (backward), `offer → withdrawn`, `offer → rejected`, and anything out of `hired`, `rejected`, `withdrawn`, `declined`
**And** the test file has one named case per pair of the full 8×8 matrix so the NFR-4 evidence is exhaustive

**Given** either module
**When** its source is inspected
**Then** it imports nothing but `enums.js` and `errors.js` and performs no I/O

### Story 1.3: Initial schema, indexes, audit trigger, seeds, and test support

As the Project Librarian,
I want the whole S2/S3 schema as one initial migration set with base and demo seeds and the Jest database harness,
So that no two use-case branches create the same table and every test runs against a real, disposable Postgres.

- **Realizes:** NFR-5, FR-X-5 (the seeded Administrator), groundwork for FR-X-4 (trigger)
- **Obeys:** ARCH-01, ARCH-02, ARCH-18, ARCH-19 (trigger), ARCH-20, S1 (CHECKs), S2, S3, S5, S6, S11 (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SEED_DEMO`), S16
- **Tests:** `server/src/persistence/schema.test.js` (`NFR-5 …`, `FR-X-4 audit_events rejects UPDATE`, `FR-X-4 audit_events rejects DELETE`, S1 CHECK-versus-enum assertions, S3 partial unique indexes), `server/src/data/seeds/seeds.test.js` (`FR-X-5 base seed creates exactly one Administrator from ADMIN_EMAIL`, `FR-X-5 base seed refuses to run without ADMIN_EMAIL and ADMIN_PASSWORD`, demo seed idempotent)
- **Touches:** `server/src/data/migrations/<timestamp>_initial_schema.js` (may be split into two or three files by area, all landing in this story), `server/src/data/seeds/base/*.js`, `server/src/data/seeds/demo/*.js`, `server/src/persistence/testSupport.js`, `server/test/globalSetup.js`, `server/test/factories.js` (accounts, organizations, memberships, postings, applications, resume files), `server/jest.config.js`

**Acceptance Criteria:**

**Given** an empty database
**When** `knex migrate:latest` runs
**Then** every S2 table exists with the listed columns, UUID v4 primary keys, `timestamptz` timestamps, CHECK constraints listing exactly the S1 stored strings, `accounts` has no `organization_id` and no recruiter status, `organization_members.account_id` is UNIQUE, `applications.applicant_account_id`, `posting_id`, `resume_file_id` are NOT NULL foreign keys, `sessions` matches connect-pg-simple's DDL, `settings` holds `application_cap = '5'`, and `stage_labels` holds one row per S1 stage with the stage name as the default label
**And** `migrate:rollback --all` then `migrate:latest` succeeds

**Given** the S3 indexes
**When** a second `applications` row for the same applicant and posting is inserted while the first is not `withdrawn`, or a second `offer` row for one posting
**Then** Postgres raises `23505` on `applications_one_open_per_applicant_posting` or `postings_one_open_offer`
**And** the six list-serving indexes exist

**Given** an `audit_events` row
**When** any UPDATE or DELETE is attempted
**Then** the trigger raises `audit_events is insert-only`

**Given** `ADMIN_EMAIL` and `ADMIN_PASSWORD` set
**When** the base seed runs twice
**Then** exactly one Administrator Account exists with a bcrypt hash, default categories and locations exist once, and the seed is a no-op the second time; with either variable missing the seed throws before touching the database

**Given** `SEED_DEMO=true`
**When** the demo seed runs
**Then** it creates the CAPABILITY-MAP cast: Acme Waco (approved) with Sam (approved member), Bear Staffing (pending) with Priya (pending member), Maria and Devon (applicants with profiles and one `resume_files` row each), one Live and one already-expired Acme Posting (each with a creation audit row), idempotent by email and Organization name; with `SEED_DEMO` unset it does nothing

**Given** the Jest harness
**When** the server suite starts
**Then** `globalSetup` migrates once, `testSupport.truncateAll()` empties all non-reference tables before each test file, factories create valid rows without relying on seeds, and no test asserts on seeded data

### Story 1.4: Persistence core, error vocabulary, and the audit and notification writers

As a use-case owner,
I want `withTransaction`, the S9 error classes mapped once to HTTP, and repositories for audit and Notifications plus base finders per entity,
So that my module writes its state change, its audit row, and its Notification inside one transaction without touching Knex.

- **Realizes:** FR-X-4 (record mechanics), FR-X-3 (write side), NFR-4 (refusal envelope), NFR-11
- **Obeys:** ARCH-03, ARCH-04 (repositories hold no rules), ARCH-11 (envelope), ARCH-13, ARCH-14, ARCH-15 (S4 fragment lives in `postingRepository`), ARCH-18, ARCH-19, S4, S5, S6, S8, S9, S13 (`ConcurrentChangeError`, 23505 mapping)
- **Tests:** `server/src/persistence/auditRepository.test.js` (`FR-X-4 record stores actor, timestamp, old and new values`, `FR-X-4 latestReason returns the newest reason for a field`), `server/src/persistence/notificationRepository.test.js` (`FR-X-3 create stores recipient, kind, body, audit_event_id`), `server/src/persistence/db.test.js` (`withTransaction commits, rolls back on throw, never nests`), `server/src/persistence/postingRepository.test.js` (`ARCH-15 effective_status is expired when expires_at has passed`, `S13 transition throws ConcurrentChangeError on zero rows`), `server/src/presentation/errors.test.js` (one case per S9 class → status and code; `internal` hides the stack)
- **Touches:** `server/src/persistence/db.js`, `auditRepository.js`, `notificationRepository.js`, `accountRepository.js` (findByEmail, findById), `membershipRepository.js` (findByAccountId), `organizationRepository.js` (findById), `postingRepository.js` (S4 fragment, findById, `transition`), `applicationRepository.js` (findById, `transition`), `settingsRepository.js` (get), `server/src/presentation/errors.js`, `server/src/presentation/app.js` (JSON body parser, error handler, 404 envelope for unknown `/api` paths)

**Acceptance Criteria:**

**Given** `persistence/db.js`
**When** business code requires it
**Then** it exports `db`, the `pg` pool, and `withTransaction(fn)` which returns `fn`'s value, commits on return, rolls back on throw, and throws if called inside an open transaction
**And** every repository function takes `conn` first, returns plain `camelCase` objects, and never returns a Knex builder

**Given** `auditRepository.record(conn, { entityType, entityId, field, oldValue, newValue, actorAccountId, reason })`
**When** called
**Then** one `audit_events` row is inserted with `seq` assigned by the database and `created_at` from `now()`; `latestReason(conn, entityType, entityId, field)` returns the newest reason ordered by `created_at, seq`; `listForEntity` returns rows in that order

**Given** `postingRepository.transition(trx, id, { from, to })`
**When** `from` is `expired`
**Then** the UPDATE is guarded on stored status `live`; when zero rows update, `ConcurrentChangeError` is thrown; `applicationRepository.transition` guards on `stage` and writes `stage_changed_at` in the same UPDATE; `postingRepository.transition` to `live` writes `approved_at`

**Given** any repository insert that violates an S3 partial unique index
**When** Postgres returns `23505`
**Then** the repository rethrows `DuplicateApplicationError` or `OfferAlreadyOpenError` by index name; any other database error propagates unchanged

**Given** `presentation/errors.js`
**When** a handler throws an S9 class
**Then** the response is `{ "error": { "code", "message", "details" } }` with the S9 status and code, `application_cap_reached` carries `details: { count, cap }`, `profile_incomplete` carries `details: { missing: [] }`, validation carries `[{ field, message }]`, and an unknown error is `500 internal` with a server-side log and no stack in the body
**And** a request to an unknown `/api` path returns the `404 not_found` envelope, never HTML

### Story 1.5: Log in, log out, and server-side role guards

As any Account holder,
I want to log in with email and password and be refused wherever my role is not allowed,
So that the server, not the interface, decides what I can do.

- **Realizes:** FR-X-1, FR-X-2, FR-X-5 (no registration route creates an Administrator), NFR-1, NFR-2
- **Obeys:** ARCH-08, ARCH-09 (`/api` prefix), ARCH-10 (guards mounted once per scope router), ARCH-11, S7, S9, S10, S12
- **Tests:** `server/src/business/accounts/login.test.js` (`FR-X-1 logs in with correct credentials`, `FR-X-1 wrong password and unknown email return the same generic message`, `NFR-2 password is stored as a bcrypt hash`), `server/src/business/accounts/logout.test.js` (`FR-X-1 logout destroys the session`), `server/src/presentation/middleware/auth.test.js` (`FR-X-2 anonymous request to /api/me is 401`, `FR-X-2 applicant request to /api/org is 403`, `FR-X-2 pending recruiter request to /api/org is 403`, `FR-X-2 recruiter request to /api/admin is 403`, `FR-X-2 public routes need no session`, `FR-X-5 POST /api/auth/register with role administrator is refused`, `S7 req.actor has every field and null when anonymous`, `S12 suspended account gets 401 account_suspended and its session destroyed`, `NFR-2 session expires after SESSION_IDLE_HOURS of inactivity`), `server/src/presentation/routes/auth.test.js` (`S12 login is rate limited to 10 per minute per IP and per email`)
- **Touches:** `server/src/business/accounts/login.js`, `logout.js`, `server/src/presentation/middleware/auth.js`, `server/src/presentation/routes/public.js`, `auth.js`, `me.js`, `org.js`, `admin.js` (routers with their guard mounted once, each with one placeholder `GET` that later stories replace), `server/src/presentation/app.js` (session, `trust proxy`, rate limit, JSON-only mutations, router mounting), `server/src/presentation/session.js`

**Acceptance Criteria:**

**Given** an Active Account
**When** `POST /api/auth/login` receives its email and password as JSON
**Then** the response is 200 with `{ accountId, role, organizationId, recruiterStatus }` and an `HttpOnly`, `SameSite=Lax` session cookie (`Secure` outside development) backed by the `sessions` table with rolling expiry of `SESSION_IDLE_HOURS`
**And** a wrong password and an unknown email both return `401 unauthenticated` with the identical message "Email or password is incorrect"

**Given** a logged-in session
**When** `POST /api/auth/logout` is called
**Then** the session row is destroyed and the response is 204; a subsequent `/api/me` request is 401

**Given** any request
**When** `middleware/auth.js` runs
**Then** it reloads the Account and its membership row on every request and sets `req.actor = { accountId, role, organizationId, recruiterStatus, accountStatus }` (all fields present, `null` where absent) or `null` when anonymous; a Suspended Account has its session destroyed and receives `401 account_suspended`

**Given** the five scope routers
**When** mounted under `/api`
**Then** `public.js` has no guard, `auth.js` has none, `me.js` mounts `requireAuth()`, `org.js` mounts `requireApprovedRecruiter`, `admin.js` mounts `requireAuth('administrator')`, and no handler switches on role; an Applicant on `/api/org/*` and a Recruiter on `/api/admin/*` receive `403 forbidden`; a Pending or Rejected Recruiter on `/api/org/*` receives `403 forbidden`

**Given** the mutation routes
**When** a request arrives with a non-JSON content type
**Then** it is refused with `400 validation_failed` (the S12 CSRF defence), and `POST /api/auth/login` is limited to 10 per minute per IP and per email

**Given** the auth router
**When** a request tries to create an Account with role `administrator` through any public path
**Then** no such route exists (404) and the only Administrator comes from the base seed (FR-X-5)

### Story 1.6: Notification delivery: list and unread count

As a logged-in Account holder,
I want to fetch my own Notifications and my unread count,
So that decisions made in Iteration 2 use cases reach me in-app before the Notifications page exists.

- **Realizes:** FR-X-3 (delivery, recipient-only visibility)
- **Obeys:** ARCH-04, ARCH-06 (one polled query on the client, wired in Story 1.7), ARCH-10, ARCH-18 (Notification belongs to recipient, never deleted), S6, S8, S10
- **Tests:** `server/src/business/notifications/listNotifications.test.js` (`FR-X-3 returns only the actor's notifications newest first`, `FR-X-3 another account's notifications are never returned`), `server/src/business/notifications/unreadCount.test.js` (`FR-X-3 counts rows with read_at null for the actor only`), `server/src/presentation/routes/me.test.js` (`FR-X-3 GET /api/me/notifications requires a session`)
- **Touches:** `server/src/business/notifications/listNotifications.js`, `unreadCount.js`, `server/src/persistence/notificationRepository.js` (add `listForRecipient`, `countUnread`), `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** a logged-in Account with Notifications
**When** `GET /api/me/notifications?page=1&pageSize=20` is called
**Then** the S10 list envelope returns only rows whose `recipient_account_id` is the actor, newest first, each with `id`, `kind`, `entityType`, `entityId`, `body`, `readAt`, `createdAt`

**Given** the same Account
**When** `GET /api/me/notifications/unread-count` is called
**Then** it returns `{ "count": n }` counting only the actor's rows with `read_at` null

**Given** a visitor
**When** either path is called
**Then** the response is `401 unauthenticated`

### Story 1.7: Client shell: theme, API wrapper, auth context, AppBar, routing, and login page

As any user,
I want a consistent application shell with the brand theme, role-aware navigation, an unread bell, and a login page,
So that every screen built later drops into the same frame and follows the same error and session rules.

- **Realizes:** FR-X-1 (client side), FR-X-2 (client guards, informational only), FR-X-3 (bell)
- **Obeys:** ARCH-06, ARCH-07, ARCH-09, ARCH-22, S9 (`ApiError`, 401 handled once), S10, S11 (`client/src/config.js`)
- **Tests:** `client/src/api.test.js` (`S9 throws ApiError with status, code, message, details`, `S9 a 401 clears useAuth and redirects to /login once`), `client/src/auth/useAuth.test.jsx`, `client/src/components/AppBar.test.jsx` (`UX-DR2 visitor links`, `UX-DR2 applicant links`, `UX-DR2 pending recruiter sees Jobs and Status only`, `UX-DR2 badge hidden at zero and shows 99+ above 99`, `UX-DR2 bell has accessible name "Notifications, 3 unread"`), `client/src/pages/LoginPage.test.jsx` (`FR-X-1 submits email and password and lands by role`, `FR-X-1 generic failure message`), `client/src/routes/guards.test.jsx` (`UX-DR3 wrong role redirected to landing`, `UX-DR3 next parameter returns to the job`)
- **Touches:** `client/src/theme.js`, `client/src/api.js`, `client/src/auth/useAuth.jsx`, `client/src/components/AppBar.jsx`, `client/src/components/ErrorAlert.jsx`, `client/src/components/Layout.jsx`, `client/src/routes/index.jsx`, `client/src/routes/guards.jsx`, `client/src/pages/LoginPage.jsx`, `client/src/pages/NotFoundPage.jsx`, `client/src/pages/ForbiddenPage.jsx`, `client/src/notifications/useUnreadCount.js`, `client/src/App.jsx`

**Acceptance Criteria:**

**Given** the MUI theme
**When** the app renders
**Then** the DESIGN.md brand delta is applied (UX-DR1): primary `#1F4E79`, secondary `#5E6B7A`, page surface `#F5F7FA`, h1 28/600, h2 20/600, body 16, caption 13, radii 4/8, Roboto via defaults with no webfont, and the five stage colour tokens are exported from `theme.js`

**Given** `client/src/api.js`
**When** any request fails
**Then** it throws `ApiError { status, code, message, details }`; a 401 clears `useAuth` and navigates to `/login` with "Your session ended. Log in again." exactly once; components never call `fetch`

**Given** the AppBar
**When** rendered for each role
**Then** it shows the UX-DR2 link sets (Visitor: Jobs · Log in · Register · For recruiters; Applicant: Jobs · My Applications · Profile; Approved Recruiter: Jobs · Postings · Organization; Pending or Rejected Recruiter: Jobs · Status; Administrator: Requests · Postings · Accounts · Settings · Oversight), the bell with `Badge color="error"` fed by one TanStack query polling every `UNREAD_POLL_MS` (60000, in `config.js`) and invalidated after any mutation, hidden at zero, "99+" above 99, accessible name "Notifications, N unread", an avatar menu with Log out, and below 900 px a Drawer behind a button labelled "Menu"

**Given** the router
**When** a user lands after login
**Then** Applicants go to `/me/applications`, Approved Recruiters to `/org/postings`, Pending or Rejected Recruiters to `/org/status`, Administrators to `/admin/requests` (UX-DR3); a wrong role is redirected to their landing; `/login?next=` returns to `next`; every route not yet built renders a placeholder page with the correct `<h1>` so navigation is complete from day one

**Given** `<ErrorAlert error={apiError} />`
**When** rendered
**Then** it maps S9 codes to severities and copy per UX-DR4 (`forbidden` → full-page "You do not have access to this page" with a link home; `not_found` → "This posting is not available"; `internal` → "Something went wrong. Try again." with Retry; `validation_failed` → per-field helper text handled by forms), uses `role="alert"`, and renders the server message verbatim otherwise

**Given** the login page
**When** submitted
**Then** it posts through `api.js`, populates `useAuth`, and on failure shows the generic message; every field has a visible label (NFR-9)

### Story 1.8: Shared presentational components

As a use-case owner building a screen,
I want the StageChip, ResponsiveTable, FilterBar, ReasonDialog, EmptyState, PipelineStepper, HistoryTimeline, and Snackbar helpers ready and tested,
So that fifteen screens share one vocabulary and one accessibility floor.

- **Realizes:** NFR-8, NFR-9; UX-DR5, UX-DR6, UX-DR7, UX-DR8, UX-DR9, UX-DR10 (Snackbar half), UX-DR11, UX-DR12 (Pagination), UX-DR16 (Stepper and timeline primitives), UX-DR24, UX-DR25
- **Obeys:** ARCH-06, ARCH-07, S5 (history `by` role), S10 (history and interviews shape)
- **Tests:** `client/src/components/StageChip.test.jsx` (`NFR-9 renders icon and label for every stored stage and status`, `UX-DR5 uses stage_labels label`), `ResponsiveTable.test.jsx` (`UX-DR6 renders a table at 900px and cards at 375px`), `FilterBar.test.jsx` (`UX-DR8 state lives in the URL query`, `NFR-9 every control has a visible label`), `ReasonDialog.test.jsx` (`UX-DR9 primary disabled under 10 characters`, `NFR-9 traps focus, closes on Escape, returns focus`), `PipelineStepper.test.jsx` (`UX-DR16 five steps, terminal state freezes and adds chip`), `HistoryTimeline.test.jsx` (`UX-DR16 renders from → to, by role, timestamp, reason inline`), `EmptyState.test.jsx`
- **Touches:** `client/src/components/StageChip.jsx`, `StatusChip.jsx`, `ResponsiveTable.jsx`, `FilterBar.jsx`, `ReasonDialog.jsx`, `ConfirmDialog.jsx`, `EmptyState.jsx`, `PipelineStepper.jsx`, `HistoryTimeline.jsx`, `SkeletonList.jsx`, `useSnackbar.jsx`, `client/src/stageMeta.js` (icon and colour per stored enum), `client/src/reference/useStageLabels.js` (reads `GET /api/reference/stage-labels`, served from Story 2.1; until then falls back to stored names)

**Acceptance Criteria:**

**Given** `StageChip` with any S1 stage or Posting or Account status
**When** rendered
**Then** it shows the UX-DR5 icon, the label from `stage_labels` (falling back to the stored name), and the DESIGN.md colour as an outlined 24 px chip; colour is never the only signal

**Given** `ResponsiveTable` with columns, rows, and row actions
**When** the viewport is 900 px or wider
**Then** it renders an MUI `Table` (`size="small"` when `dense`); below 900 px it renders one `Card` per row with label–value pairs and full-width outlined action buttons, same fields and actions

**Given** `FilterBar`
**When** the user changes a filter
**Then** the URL query updates so the list is shareable and Back works; controls stack full-width under 600 px; every control has a visible label

**Given** `ReasonDialog` with `minLength = 10`
**When** opened
**Then** focus is trapped, the reason field has a visible label, the primary button stays disabled until the minimum length is met, Escape closes, and focus returns to the trigger; `ConfirmDialog` is the same without a field

**Given** `PipelineStepper` with a stage
**When** rendered
**Then** it shows five steps (labels from `stage_labels`), completed steps checked, the current step filled navy, horizontal on md+ and vertical on xs; `rejected`, `withdrawn`, `declined` freeze it at the last active step and add a `StageChip`; `hired` completes all five

**Given** `HistoryTimeline` with the S10 `history` array
**When** rendered
**Then** each row reads "‹from› → ‹to› · by ‹role› · ‹timestamp›" with the reason inline, oldest first, and shows the actor only when `showActor` is set (Administrators)

**Given** `useSnackbar`
**When** a one-click action completes
**Then** a Snackbar announces with `aria-live="polite"`; `EmptyState` renders one sentence and at most one action; `SkeletonList` matches the row layout

### Story 1.9: One image, Render deploy after green CI, health, backup

As the team,
I want the application deployed as one Docker image on Render against Neon, migrated on start, deployed only after CI passes, and warm before each presentation,
So that NFR-7 is met from Iteration 1 and merge to `main` is the deploy.

- **Realizes:** NFR-5, NFR-7; ARCH-16 operations
- **Obeys:** ARCH-02 (Neon, same major), ARCH-09 (serve `client/dist`, splat fallback, `/api` 404 envelope), ARCH-16, S11, S14
- **Tests:** `server/src/presentation/routes/static.test.js` (`ARCH-09 unknown /api path returns 404 envelope not index.html`, `ARCH-09 unknown non-api path returns index.html in production`), a documented manual check in `docs/runbook.md`
- **Touches:** `Dockerfile`, `.dockerignore`, `render.yaml` (or Render dashboard settings recorded in `docs/runbook.md`), `server/src/presentation/app.js` (static serving after routers), `scripts/backup.sh`, `docs/runbook.md` (warm-up `curl`, backup, env var checklist, Neon branch fallback), `.github/workflows/ci.yml` (deploy hook after green on `main`)

**Acceptance Criteria:**

**Given** the Dockerfile
**When** the image starts
**Then** it runs `knex migrate:latest` then `node server/src/index.js`, reads configuration only from S11 variables, writes nothing to local disk, and a failed migration fails the start

**Given** `main` receives a merge
**When** CI passes
**Then** Render deploys that commit (via "wait for CI" or a deploy hook from the workflow) and not before; a red CI never deploys

**Given** production
**When** a browser requests any non-`/api` path
**Then** Express serves `client/dist/index.html` through the Express 5 fallback `app.get('/{*splat}', …)` mounted after the routers; an unknown `/api` path returns the 404 envelope

**Given** Render's health check and the runbook
**When** `GET /api/health` is hit
**Then** it returns 200 after `SELECT 1`, waking Neon; `scripts/backup.sh` runs `pg_dump` against `DATABASE_URL` into a local, git-ignored folder

**Given** the deployed demo
**When** `SEED_DEMO=true` is set
**Then** the CAPABILITY-MAP cast exists at the public URL and the Iteration 1 use cases can be demonstrated with it

### Story 1.10: Team workflow: issues, branches, protected main, review

As the Project Librarian,
I want one issue per use case with its FR checklist, branch and PR conventions, and a protected `main`,
So that every commit traces to an issue and a use case and the grader can follow requirement → issue → code → test.

- **Realizes:** NFR-10 (traceability chain), SC-3, SC-4
- **Obeys:** ARCH-21
- **Tests:** none (process story); verified by the checklist in `CONTRIBUTING.md`
- **Touches:** `.github/ISSUE_TEMPLATE/use-case.md` (FR IDs as a checklist), `.github/ISSUE_TEMPLATE/nfr.md`, `.github/pull_request_template.md` (issue link, FR IDs touched, ARCH greps run), `CONTRIBUTING.md` (branch `<issue>-<slug>`, merge commits never squash, commit message references the issue, one non-author reviewer, the three ARCH greps), GitHub branch protection on `main` (CI required, one review, no force push, merge commits only), sixteen issues (one per epic in this document with the epic's FR IDs) and one issue per NFR needing work

**Acceptance Criteria:**

**Given** the repository settings
**When** anyone pushes to `main` directly or opens a PR with red CI or no reviewer
**Then** GitHub refuses the merge; squash merging is disabled

**Given** the issue tracker
**When** the story is done
**Then** one issue exists per use case (UC-A1 … UC-M4) and one for the skeleton, each listing its FR IDs as checkboxes, plus one issue per NFR that needs work (NFR-6, NFR-8 at least), and the epic `owner:` field in this document is mirrored by the issue assignee once Monday's meeting assigns it

**Given** `CONTRIBUTING.md`
**When** a new member reads it
**Then** they can create a branch, run the suite, run the three ARCH greps, open a PR with the template, and know that test names must contain the FR ID verbatim

---

## Epic 2: UC-A2 Browse and search open postings

owner:
iteration: 1

Any visitor, logged in or not, finds Live Postings, filters them by keyword, category, and location, and reads a Posting in full; expired and pending Postings are invisible.

### Story 2.1: Public Job List API with filters and reference data

As a visitor,
I want to fetch the list of Live Postings, filtered by keyword, category, and location and ordered newest-approved first,
So that I can find openings without an account.

- **Realizes:** FR-A2-1, FR-A2-3; `[ASSUMPTION]` also the public reference-data read (`GET /api/reference`) that the filters and the Posting editor need, owned here as the first consumer
- **Obeys:** ARCH-04, ARCH-10 (visitor actor `null`), ARCH-15, S4, S8, S10 (list envelope, `pageSize` cap 100, filters named after columns)
- **Tests:** `server/src/business/postings/listLivePostings.test.js` (`FR-A2-1 returns only effectively live postings`, `FR-A2-1 excludes expired, pending_approval, draft, rejected, filled, closed`, `FR-A2-1 orders by approved_at desc`, `FR-A2-3 keyword matches title or description case-insensitively`, `FR-A2-3 filters by category`, `FR-A2-3 filters by location`, `FR-A2-3 combines all three`), `server/src/business/reference/listReferenceData.test.js` (`FR-M4-2 read side: only active categories and locations are returned for selection`), `server/src/presentation/routes/public.test.js` (`FR-A2-1 GET /api/postings needs no session`, `S10 pageSize is capped at 100`)
- **Touches:** `server/src/business/postings/listLivePostings.js`, `server/src/business/reference/listReferenceData.js`, `server/src/persistence/postingRepository.js` (add `listLive(conn, { keyword, categoryId, locationId, page, pageSize })` selecting `effective_status` and joining category, location, organization names), `server/src/persistence/referenceRepository.js` (new: `listCategories`, `listLocations`, `listStageLabels`), `server/src/presentation/routes/public.js`

**Acceptance Criteria:**

**Given** Postings in every stored status plus a `live` one whose `expires_at` has passed
**When** `GET /api/postings` is called with no session
**Then** only Postings with `effective_status = 'live'` are returned, most recently `approved_at` first, in the S10 envelope, each item carrying `id`, `title`, `organizationName`, `categoryName`, `locationName`, `employmentType`, `approvedAt`, `expiresAt`, never `description` bytes beyond what a card needs `[ASSUMPTION: cards do not show description]`

**Given** `?keyword=intern`
**When** the list is fetched
**Then** Postings whose title or description contains "intern" in any case are returned; `?categoryId=` and `?locationId=` filter by column; all three combine with AND

**Given** `?page=3&pageSize=500`
**When** the list is fetched
**Then** `pageSize` is capped at 100 and `total` reflects the filtered count

**Given** `GET /api/reference`
**When** called by anyone
**Then** it returns `{ categories: [active only], locations: [active only], stageLabels: [all] }`; retired values are absent from `categories` and `locations`

### Story 2.2: Posting detail API with the not-Live rules

As a visitor or Applicant,
I want to open a Posting and read it in full,
So that I can decide whether to apply, while Postings that are not Live stay invisible unless I applied to them.

- **Realizes:** FR-A2-2
- **Obeys:** ARCH-10, ARCH-11 (404 for not effectively Live to visitors and non-applicants), ARCH-15, S4, S9, S10
- **Tests:** `server/src/business/postings/getPosting.test.js` (`FR-A2-2 returns all detail fields for a live posting to a visitor`, `FR-A2-2 expired posting is not_found to a visitor`, `FR-A2-2 pending_approval posting is not_found to a visitor`, `FR-A2-2 applicant who applied can open a filled posting`, `FR-A2-2 applicant who did not apply gets not_found for an expired posting`, `FR-M2-4 expired posting is absent from public detail`)
- **Touches:** `server/src/business/postings/getPosting.js`, `server/src/persistence/postingRepository.js` (add `findByIdWithNames`), `server/src/persistence/applicationRepository.js` (add `existsForApplicantAndPosting`), `server/src/presentation/routes/public.js`

**Acceptance Criteria:**

**Given** a Live Posting
**When** `GET /api/postings/:id` is called by anyone
**Then** the object contains `title`, `organizationName`, `categoryName`, `locationName`, `employmentType`, `description`, `requirements`, `expiresAt`, `effectiveStatus`

**Given** a Posting whose `effective_status` is not `live`
**When** a visitor, or an Applicant with no Application to it, requests it
**Then** the response is `404 not_found` with "This posting is not available" and no fields

**Given** an Applicant who has an Application (any Stage) to a Posting in any status
**When** they request it with `req.actor` set
**Then** the full object is returned with its `effectiveStatus`

**Given** an unknown id or a non-UUID
**When** requested
**Then** the response is `404 not_found`

### Story 2.3: Job List page

As a visitor on a phone or a desktop,
I want a Job List page with a keyword field, category and location selects, cards, and pagination,
So that I can find openings and share a filtered link.

- **Realizes:** FR-A2-1, FR-A2-3 (client); UX-DR14, UX-DR8, UX-DR12
- **Obeys:** ARCH-06 (TanStack Query, `api.js`), ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/JobListPage.test.jsx` (`FR-A2-1 renders live postings newest approved first`, `FR-A2-3 keyword, category, and location update the URL query and refetch`, `FR-A2-3 Clear resets filters`, `UX-DR14 empty state text`, `NFR-9 filters have visible labels`)
- **Touches:** `client/src/pages/JobListPage.jsx`, `client/src/postings/PostingCard.jsx`, `client/src/postings/usePostings.js`, `client/src/reference/useReference.js`

**Acceptance Criteria:**

**Given** the route `/`
**When** it loads
**Then** the page shows `h1` "Open positions", a `FilterBar` with Keyword, Category, Location, Search, and Clear, `SkeletonList` while loading, and one `PostingCard` per item with title, employment-type chip, "‹Organization› · ‹category› · ‹location›", "Approved ‹relative time› · Expires ‹date›"

**Given** a filter change
**When** applied
**Then** the URL query carries `keyword`, `categoryId`, `locationId`, `page`; reloading the URL reproduces the list; Back restores the previous filters

**Given** no results
**When** rendered
**Then** `EmptyState` reads "No live postings match." with a "Clear filters" action; pagination shows "Showing a–b of n" and MUI `Pagination` at 20 per page

**Given** a 375 px viewport
**When** rendered
**Then** filters stack full-width, cards are single-column, tap targets are at least 44 px, and the Drawer holds the navigation

### Story 2.4: Job Detail page with the visitor Apply slot

As a visitor,
I want a Job Detail page that shows the full Posting and tells me to log in or register to apply,
So that the golden path can start from a shared link.

- **Realizes:** FR-A2-2 (client); UX-DR15 (detail half, visitor Apply variant); the Apply card proper is Story 8.4
- **Obeys:** ARCH-06, ARCH-11 (404 rendering), UX-DR3 (`/login?next=`), NFR-8
- **Tests:** `client/src/pages/JobDetailPage.test.jsx` (`FR-A2-2 renders every detail field`, `FR-A2-2 not_found renders "This posting is not available"`, `UX-DR15 visitor sees Log in to apply linking to /login?next=/jobs/:id`, `UX-DR15 two columns at 900px and Apply slot first at 375px`)
- **Touches:** `client/src/pages/JobDetailPage.jsx`, `client/src/postings/usePosting.js`, `client/src/postings/ApplySlot.jsx` (renders children or the visitor variant; Epic 8 supplies `ApplyCard` as the child)

**Acceptance Criteria:**

**Given** `/jobs/:id` for a Live Posting
**When** it loads
**Then** it shows "‹ Back to jobs", `h1` title, the meta line (Organization · category · location · employment-type chip), "Expires ‹date›", `h2` Description, `h2` Requirements, at reading width 720 px, with an 8/4 two-column layout at 900 px and the Apply slot first in a single column below it

**Given** a visitor
**When** the Apply slot renders
**Then** it shows "Log in to apply" linking to `/login?next=/jobs/:id` and "New here? Register" linking to `/register?next=/jobs/:id`

**Given** a `404 not_found`
**When** rendered
**Then** the page shows "This posting is not available" via `ErrorAlert` and no Posting fields; the document title follows the `h1`

---

## Epic 3: UC-R2 Create, edit, and submit a posting; set expiry

owner:
iteration: 1

An Approved Recruiter drafts a Posting, submits it for approval, edits the allowed fields at each status, lists their Organization's Postings with reasons, and closes a Live one.

### Story 3.1: Create a Draft Posting and list my Organization's Postings

As an Approved Recruiter,
I want to create a Posting as a Draft and see all my Organization's Postings with their status and any rejection reason,
So that I can prepare an opening before submitting it.

- **Realizes:** FR-R2-1, FR-R2-5
- **Obeys:** ARCH-04, ARCH-10 (Organization in the query for lists), ARCH-13 (creation audit row), ARCH-15 (list shows `effective_status`), ARCH-19 (`latestReason` for the rejection reason), S1 (employment type), S2, S4, S5, S8, S10, S13
- **Tests:** `server/src/business/postings/createPosting.test.js` (`FR-R2-1 creates a draft with all fields and a creation audit row`, `FR-R2-1 refuses a past or today expiry date`, `FR-R2-1 refuses a retired category or location`, `FR-R2-1 refuses an unknown employment type`, `FR-R2-1 stores expires_at as end of day in TZ`), `server/src/business/postings/listOrgPostings.test.js` (`FR-R2-5 lists only the actor's organization postings with effective status`, `FR-R2-5 includes the administrator's reason for a rejected posting`, `FR-R3-3 never includes another organization's postings`)
- **Touches:** `server/src/business/postings/createPosting.js`, `listOrgPostings.js`, `server/src/persistence/postingRepository.js` (add `insert`, `listByOrganization`), `server/src/persistence/referenceRepository.js` (add `isActiveCategory`, `isActiveLocation`), `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** an Approved Recruiter
**When** `POST /api/org/postings` receives title, description, requirements, `categoryId`, `locationId`, `employmentType`, and `expiresOn` (calendar date)
**Then** a Posting is inserted with `status = 'draft'`, `organization_id` from `actor.organizationId`, `created_by_account_id`, `expires_at` set to 23:59:59 of that date in `TZ`, an `audit_events` row (`entity_type = 'posting'`, `field = 'status'`, `old_value NULL`, `new_value 'draft'`) in the same transaction, and the resource is returned

**Given** an expiry date not in the future, a retired or unknown category or location, or an employment type outside S1
**When** submitted
**Then** the response is `400 validation_failed` with `details: [{ field, message }]` and nothing is written

**Given** `GET /api/org/postings`
**When** called by an Approved Recruiter
**Then** the query takes `organizationId` as a mandatory WHERE parameter and returns the S10 envelope with each Posting's `effectiveStatus`, `expiresAt`, and for `rejected` Postings `rejectionReason` from `auditRepository.latestReason`

### Story 3.2: Edit and delete a Posting by status

As a Recruiter,
I want to edit or delete my Organization's Posting while it is Draft, Pending Approval, or Rejected, and edit only description and requirements once it is Live,
So that mistakes are fixable before approval and a Live Posting stays what the Administrator approved.

- **Realizes:** FR-R2-2, FR-R2-4
- **Obeys:** ARCH-10 (single record loads by id, `ForbiddenError` on other Organization), ARCH-11, ARCH-13 (delete writes an audit row), ARCH-15 (`effective_status` decides the rule), ARCH-18 (hard delete only in draft, pending_approval, rejected), S5 (`field = 'deleted'`), S10 (`PATCH`, `DELETE /api/org/postings/:id`)
- **Tests:** `server/src/business/postings/editPosting.test.js` (`FR-R2-2 edits every field while draft`, `FR-R2-2 edits while pending_approval and rejected`, `FR-R2-4 live posting accepts description and requirements`, `FR-R2-4 live posting refuses title, category, location, expiry with validation_failed naming the field`, `FR-R2-4 expired posting follows the live rule`, `FR-R2-2 filled or closed posting refuses any edit`, `FR-R3-3 another organization's posting is forbidden`), `server/src/business/postings/deletePosting.test.js` (`FR-R2-2 deletes a draft, pending, or rejected posting and writes field=deleted audit row`, `FR-R2-2 refuses to delete a live, filled, or closed posting`, `FR-R3-3 forbidden for another organization`)
- **Touches:** `server/src/business/postings/editPosting.js`, `deletePosting.js`, `server/src/persistence/postingRepository.js` (add `update`, `hardDelete`), `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** a Posting of the actor's Organization with `effective_status` in `draft`, `pending_approval`, `rejected`
**When** `PATCH /api/org/postings/:id` sends any subset of the Story 3.1 fields
**Then** the fields are validated as in creation and updated; the updated resource is returned; no audit row is written for field edits `[ASSUMPTION: FR-X-4 covers status changes, not field edits]`

**Given** a Posting with `effective_status` `live` or `expired`
**When** the PATCH contains only `description` and/or `requirements`
**Then** it succeeds without changing status; when it contains `title`, `categoryId`, `locationId`, or `expiresOn`, the response is `400 validation_failed` with the frozen field named and nothing changes

**Given** a Posting with `effective_status` `filled` or `closed`
**When** any PATCH arrives
**Then** the response is `409 invalid_transition` with a readable message

**Given** `DELETE /api/org/postings/:id`
**When** the stored status is `draft`, `pending_approval`, or `rejected`
**Then** the row is hard-deleted inside a transaction that first writes an audit row (`field = 'deleted'`, `old_value` the status, `new_value NULL`) and the response is 204; for any other status the response is `409 invalid_transition`

**Given** a Posting of another Organization
**When** edited or deleted
**Then** the response is `403 forbidden` before any field is read

### Story 3.3: Submit for approval and close a Live Posting

As a Recruiter,
I want to submit a Draft or Rejected Posting for approval and to close a Live one myself,
So that my opening reaches the Administrator and I can take it down when it no longer applies.

- **Realizes:** FR-R2-3, FR-R2-6
- **Obeys:** ARCH-10, ARCH-12 (`postingStatus.assertTransition`), ARCH-13 (guarded UPDATE plus audit row in one transaction), ARCH-15 (a Live Posting past expiry is `expired`, and `expired → closed` is not a transition), S10 (`POST …/:id/submit`, `POST …/:id/close`), S13
- **Tests:** `server/src/business/postings/submitPosting.test.js` (`FR-R2-3 draft becomes pending_approval with an audit row`, `FR-R2-3 rejected becomes pending_approval`, `FR-R2-3 pending posting is absent from the public list`, `FR-R2-3 live posting cannot be submitted`, `S13 concurrent submit throws ConcurrentChangeError`, `FR-R3-3 forbidden for another organization`), `server/src/business/postings/closePosting.test.js` (`FR-R2-6 live becomes closed with an audit row and no reason`, `FR-R2-6 closed posting is absent from the public list`, `FR-R2-6 expired, draft, filled posting cannot be closed`, `FR-R3-3 forbidden for another organization`)
- **Touches:** `server/src/business/postings/submitPosting.js`, `closePosting.js`, `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** a Posting of the actor's Organization in `draft` or `rejected`
**When** `POST /api/org/postings/:id/submit` is called
**Then** inside one `withTransaction` the status is asserted by `postingStatus.assertTransition`, updated with `WHERE status = <from>`, and an audit row (`field = 'status'`, old, new, actor) is written; the resource is returned with `status = 'pending_approval'`; `GET /api/postings` no longer nor yet lists it

**Given** a Posting in any other status
**When** submitted
**Then** the response is `409 invalid_transition`

**Given** a Posting with `effective_status = 'live'`
**When** `POST /api/org/postings/:id/close` is called by its Organization's Recruiter
**Then** it becomes `closed` with an audit row and no reason, leaves the Job List, and the resource is returned; an `expired`, `draft`, `pending_approval`, `rejected`, `filled`, or `closed` Posting returns `409 invalid_transition`

**Given** two concurrent submits
**When** the second UPDATE matches zero rows
**Then** `409 concurrent_change` is returned and no second audit row exists

### Story 3.4: My Postings page

As a Recruiter,
I want a page listing my Organization's Postings with status chips, expiry, and rejection reasons,
So that I can see what is Draft, waiting, Live, or rejected and act on each.

- **Realizes:** FR-R2-5 (client); UX-DR20 (list), UX-DR6, UX-DR7
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/org/OrgPostingsPage.test.jsx` (`FR-R2-5 lists postings with StatusChip and expiry`, `FR-R2-5 shows the rejection reason on a rejected posting`, `UX-DR20 New posting button leads to /org/postings/new`, `UX-DR6 cards at 375px`, `UX-DR7 empty state "Nothing waiting."`)
- **Touches:** `client/src/pages/org/OrgPostingsPage.jsx`, `client/src/postings/useOrgPostings.js`

**Acceptance Criteria:**

**Given** `/org/postings`
**When** it loads for an Approved Recruiter
**Then** it shows `h1` "My postings", a contained "New posting" button, and a `ResponsiveTable` (dense) with Title, Status (`StatusChip` on `effectiveStatus`), Expires, Updated, and a row link to the editor; a `rejected` row shows "Rejected: ‹reason›" as body text

**Given** no Postings
**When** rendered
**Then** `EmptyState` reads "Nothing waiting." with the New posting action

**Given** a Pending or Rejected Recruiter
**When** they navigate here
**Then** the client guard redirects to `/org/status` (server still refuses with 403)

### Story 3.5: Posting editor with save, submit, delete, and close

As a Recruiter,
I want one editor to create a Posting, edit it, submit it, delete it, or close it, with frozen fields shown locked once it is Live,
So that every Posting action is on one screen and I never guess which field I may change.

- **Realizes:** FR-R2-1, FR-R2-2, FR-R2-3, FR-R2-4, FR-R2-6 (client)
- **Obeys:** ARCH-06 (mutations invalidate the list and the detail), S9 (`validation_failed` → per-field helper text), UX-DR20, UX-DR9/UX-DR10 (Delete and Close confirm; Submit is one click plus Snackbar), UX-DR11, NFR-9
- **Tests:** `client/src/pages/org/PostingEditorPage.test.jsx` (`FR-R2-1 creates a draft with every field and a future date`, `FR-R2-1 shows validation_failed details under the fields`, `FR-R2-2 edits and deletes a draft after confirmation`, `FR-R2-3 Submit shows "Posting submitted. An administrator will review it."`, `FR-R2-4 live posting locks title, category, location, expiry with lock icon and helper text`, `FR-R2-6 Close asks for confirmation then updates the status chip`, `NFR-9 every field has a visible label`)
- **Touches:** `client/src/pages/org/PostingEditorPage.jsx`, `client/src/postings/PostingForm.jsx`, `client/src/postings/usePostingMutations.js`

**Acceptance Criteria:**

**Given** `/org/postings/new`
**When** rendered
**Then** a single-column form shows Title, Description, Requirements, Category (Select from `/api/reference`), Location (Select), Employment type (Select with the four S1 values labelled Full-time, Part-time, Internship, Contract), Expiry date (date input), and one contained "Save as draft" button; every input has a visible label

**Given** `/org/postings/:id/edit` for a Draft, Pending, or Rejected Posting
**When** rendered
**Then** all fields are editable; actions are Save (contained), Submit for approval (outlined; one click, Snackbar "Posting submitted. An administrator will review it."), Delete (`outlined color="error"`, ConfirmDialog); a Rejected Posting shows the reason in an `Alert(error)` above the form

**Given** a Live or Expired Posting
**When** rendered
**Then** Title, Category, Location, and Expiry are disabled with a lock icon and helper text "Locked while live"; Description and Requirements save without re-approval; Close (`outlined color="error"`, ConfirmDialog) appears only for Live

**Given** a `400 validation_failed`
**When** returned
**Then** each `details[].field` shows its message as helper text and focus moves to the first; any other error renders in `ErrorAlert` above the form; after any mutation the postings list and this Posting are refetched

---

## Epic 4: UC-M1 Approve or reject organization and recruiter requests

owner:
iteration: 1

An Administrator sees every pending Organization and Recruiter request and approves or rejects it with a reason that the requester can read.

### Story 4.1: Pending request queue API

As an Administrator,
I want to list every Pending Approval Recruiter request with its Organization details and request time,
So that nothing waits unseen.

- **Realizes:** FR-M1-1
- **Obeys:** ARCH-04, ARCH-10 (`requireAuth('administrator')` in `admin.js`), ARCH-18 (status lives on `organization_members` and `organizations`), S2, S8, S10
- **Tests:** `server/src/business/admin/listRecruiterRequests.test.js` (`FR-M1-1 lists pending memberships with account email, organization details, and requested time oldest first`, `FR-M1-1 distinguishes a new organization request from a join request to an approved organization`, `FR-M1-1 excludes approved and rejected memberships`), `server/src/presentation/routes/admin.test.js` (`FR-X-2 recruiter on /api/admin/recruiter-requests is 403`)
- **Touches:** `server/src/business/admin/listRecruiterRequests.js`, `server/src/persistence/membershipRepository.js` (add `listPendingWithDetails`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** memberships in every S1 status
**When** `GET /api/admin/recruiter-requests` is called by an Administrator
**Then** only `pending_approval` memberships are returned, oldest first, each with `membershipId`, `account: { email, name }`, `organization: { id, name, description, website, location, status }`, `requestedAt`, and `kind: 'new_organization' | 'join_existing'` derived from the Organization's status `[ASSUMPTION: a request whose Organization is itself pending is "new"; one whose Organization is approved is "join"]`

**Given** a non-Administrator
**When** the path is requested
**Then** the response is `403 forbidden`

### Story 4.2: Approve or reject a request with audit and notification

As an Administrator,
I want to approve a request in one action or reject it with a reason,
So that the Recruiter can start posting, or knows exactly why not.

- **Realizes:** FR-M1-2, FR-M1-3; writes the `recruiter_request_decided` Notification (FR-X-3 producer)
- **Obeys:** ARCH-12 (membership and Organization status moves are `pending_approval → approved | rejected`; `[ASSUMPTION]` these two small maps live in `business/domain/membershipStatus.js` added here), ARCH-13 (one transaction: guarded UPDATEs, one audit row per entity, Notification), ARCH-14, ARCH-18 (`decided_at` written in the same UPDATE), ARCH-19 (reason lives only in audit), S5, S6, S10 (`POST …/:id/approve`, `POST …/:id/reject`)
- **Tests:** `server/src/business/admin/reviewRecruiterRequest.test.js` (`FR-M1-2 approve sets membership approved and decided_at`, `FR-M1-2 approve also approves a pending organization`, `FR-M1-2 approve of a join request leaves the approved organization unchanged`, `FR-M1-2 writes one audit row per entity changed`, `FR-M1-3 reject requires a reason`, `FR-M1-3 reject stores the reason only in audit_events`, `FR-M1-3 reject also rejects a pending organization created by this request`, `FR-M1-2 and FR-M1-3 create a recruiter_request_decided notification for the requester`, `S13 already-decided request throws ConcurrentChangeError`)
- **Touches:** `server/src/business/admin/reviewRecruiterRequest.js`, `server/src/business/domain/membershipStatus.js`, `server/src/persistence/membershipRepository.js` (add `transition`), `server/src/persistence/organizationRepository.js` (add `transition`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** a pending membership whose Organization is also pending
**When** `POST /api/admin/recruiter-requests/:id/approve` is called
**Then** in one transaction the membership becomes `approved` with `decided_at`, the Organization becomes `approved`, two audit rows are written (`organization_member.status`, `organization.status`), and one Notification (`kind = 'recruiter_request_decided'`, body naming the Organization and the decision) is written for the requester referencing the membership's audit row

**Given** a pending membership whose Organization is already approved
**When** approved
**Then** only the membership changes and one audit row plus one Notification are written

**Given** `POST /api/admin/recruiter-requests/:id/reject` with `reason`
**When** the reason is empty
**Then** the response is `400 validation_failed`; with a reason, the membership becomes `rejected` (and a pending Organization created by this request becomes `rejected`), the reason is stored in the audit row(s) and repeated verbatim in the Notification body, and no `*_reason` column is written

**Given** a membership that is no longer pending
**When** approved or rejected
**Then** the response is `409 invalid_transition` (or `409 concurrent_change` when it was decided between read and write) and nothing changes

### Story 4.3: Approvals page, Recruiter requests tab

As an Administrator,
I want an Approvals page with a Recruiter requests tab of cards I can approve in one click or reject with a reason,
So that the Iteration 1 demo shows the gate working.

- **Realizes:** FR-M1-1, FR-M1-2, FR-M1-3 (client); UX-DR18 (requests tab; the Postings tab is a placeholder until Story 7.4), UX-DR9, UX-DR10
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9, `[ASSUMPTION A-UX-4]` two Tabs mapping to two routes
- **Tests:** `client/src/pages/admin/ApprovalsPage.test.jsx` (`FR-M1-1 renders request cards with details and request time`, `FR-M1-1 join request reads "Join existing organization"`, `FR-M1-2 Approve is one click and shows Snackbar "Approved"`, `FR-M1-3 Reject opens ReasonDialog and posts the reason`, `UX-DR18 tab counts and empty state "Nothing waiting."`, `UX-DR18 375px buttons full width, Approve then Reject`)
- **Touches:** `client/src/pages/admin/ApprovalsPage.jsx` (Tabs shell, used again by Story 7.4), `client/src/pages/admin/RecruiterRequestsTab.jsx`, `client/src/admin/RequestCard.jsx`, `client/src/admin/useRecruiterRequests.js`

**Acceptance Criteria:**

**Given** `/admin/requests`
**When** it loads
**Then** it shows `h1` "Approvals", `Tabs` "Recruiter requests (n)" and "Postings (n)" bound to `/admin/requests` and `/admin/postings`, and one card per request: "‹name› · ‹email›", "requested ‹date›", "New organization: ‹name› · ‹website› · ‹location›" plus description, or "Join existing organization: ‹name›", with Reject… and Approve

**Given** Approve
**When** clicked
**Then** one request is posted, the card disappears, the Snackbar reads "Approved", and the requests query and the AppBar badge refetch

**Given** Reject…
**When** clicked
**Then** `ReasonDialog` titled "Reason (shown to the requester)" opens, the primary button enables at 1+ characters `[ASSUMPTION: FR-M1-3 says mandatory, not 10 characters; the 10-character minimum is FR-R4-2's]`, and on submit the card disappears with Snackbar "Rejected"

**Given** an empty queue or a 375 px viewport
**When** rendered
**Then** `EmptyState` reads "Nothing waiting."; cards keep one per row with full-width buttons in the order Approve then Reject

---

## Epic 5: UC-A1 Register and maintain applicant profile

owner:
iteration: 2

A visitor becomes an Applicant in one step, maintains a profile, and keeps exactly one Resume that later Applications snapshot.

### Story 5.1: Applicant self-registration with immediate login

As a visitor,
I want to register as an Applicant with my email and a password and be logged in at once,
So that I can apply without waiting for anyone.

- **Realizes:** FR-A1-1, FR-X-5 (registration creates Applicants only)
- **Obeys:** ARCH-08 (bcrypt, session created on completion), ARCH-13 (creation audit row for the Account), ARCH-18 (an `applicant_profiles` row is created with the Account), S2, S9, S10 (`POST /api/auth/register`)
- **Tests:** `server/src/business/accounts/registerApplicant.test.js` (`FR-A1-1 creates an active applicant account, an empty profile, and a creation audit row`, `FR-A1-1 refuses an email another account uses`, `FR-A1-1 refuses a password under 8 characters`, `FR-A1-1 stores a bcrypt hash never the password`, `FR-X-5 role is always applicant whatever the request says`), `server/src/presentation/routes/auth.test.js` (`FR-A1-1 registration responds with a session cookie and the actor`)
- **Touches:** `server/src/business/accounts/registerApplicant.js`, `server/src/persistence/accountRepository.js` (add `insert`), `server/src/persistence/profileRepository.js` (new: `insertEmpty`, `findByAccountId`), `server/src/presentation/routes/auth.js`

**Acceptance Criteria:**

**Given** an email no Account uses and a password of at least 8 characters
**When** `POST /api/auth/register` is called
**Then** in one transaction an `accounts` row (`role = 'applicant'`, `status = 'active'`, bcrypt hash), an `applicant_profiles` row, and an audit row (`entity_type = 'account'`, `field = 'status'`, `old_value NULL`, `new_value 'active'`) are written; the session is created as in login and the response is 201 with the actor

**Given** an email already in `accounts` (case-insensitive) or a password under 8 characters
**When** submitted
**Then** the response is `400 validation_failed` naming the field, and the email message does not reveal whether the Account exists beyond "already in use" `[ASSUMPTION: acceptable for a course project]`

**Given** a request body carrying `role: 'administrator'` or `'recruiter'`
**When** submitted
**Then** the field is ignored and the Account is an Applicant

### Story 5.2: View and edit my profile

As an Applicant,
I want to view and edit my full name, phone, location, headline, education, and summary,
So that Recruiters see who I am when I apply.

- **Realizes:** FR-A1-2
- **Obeys:** ARCH-10 (`/api/me`, record ownership by `actor.accountId`), NFR-3 (only the owner reads it here), S10 (`GET /api/me/profile`, `PATCH /api/me/profile`)
- **Tests:** `server/src/business/profiles/getMyProfile.test.js` (`FR-A1-2 returns the actor's profile with resume metadata`, `NFR-3 a recruiter cannot use the me path`), `server/src/business/profiles/updateProfile.test.js` (`FR-A1-2 updates every profile field`, `FR-A1-2 refuses an empty full name once set`, `FR-A1-2 ignores unknown fields`)
- **Touches:** `server/src/business/profiles/getMyProfile.js`, `updateProfile.js`, `server/src/persistence/profileRepository.js` (add `update`), `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** a logged-in Applicant
**When** `GET /api/me/profile` is called
**Then** it returns `fullName`, `phone`, `location`, `headline`, `education`, `summary`, and `resume: { fileId, size, uploadedAt } | null`, never resume bytes

**Given** `PATCH /api/me/profile` with any subset of the six fields
**When** called
**Then** the fields are validated (lengths `[ASSUMPTION: 200 characters for single-line fields, 2,000 for summary]`) and updated; the updated profile is returned

**Given** a Recruiter or Administrator
**When** they call `/api/me/profile`
**Then** the response is `403 forbidden` `[ASSUMPTION: the route is mounted with requireAuth('applicant')]`

### Story 5.3: Upload and download my one Resume

As an Applicant,
I want to upload a PDF Resume that replaces my previous one and download the current one,
So that I always apply with my latest Resume while earlier Applications keep what they were submitted with.

- **Realizes:** FR-A1-3 (with the 2 MB cap under Open Question 2 unless the team confirms 5 MB), FR-A3-5 groundwork (immutable rows)
- **Obeys:** ARCH-17, S11 (`RESUME_MAX_BYTES`), S15 (multer memory storage, `%PDF-` magic bytes, insert and repoint in one transaction, `getMyResume` owner path, `resumeFileRepository` only reader of bytes)
- **Tests:** `server/src/business/profiles/uploadResume.test.js` (`FR-A1-3 inserts an immutable resume_files row and repoints current_resume_file_id`, `FR-A1-3 second upload leaves the first row unchanged`, `FR-A1-3 refuses a non-PDF by magic bytes regardless of extension`, `FR-A1-3 refuses a file over RESUME_MAX_BYTES`), `server/src/business/profiles/getMyResume.test.js` (`FR-A1-3 streams the current resume with application/pdf`, `NFR-3 another account cannot read it`)
- **Touches:** `server/src/business/profiles/uploadResume.js`, `getMyResume.js`, `server/src/persistence/resumeFileRepository.js` (new: `insert`, `findBytes`, `findMeta`), `server/src/persistence/profileRepository.js` (add `setCurrentResume`), `server/src/presentation/routes/me.js` (multer middleware on `POST /api/me/resume` only)

**Acceptance Criteria:**

**Given** `POST /api/me/resume` as `multipart/form-data` with a PDF at or under `RESUME_MAX_BYTES`
**When** received
**Then** the bytes are checked for `%PDF-`, a `resume_files` row is inserted, `applicant_profiles.current_resume_file_id` is repointed in the same transaction, and `{ fileId, size, uploadedAt }` is returned

**Given** a file whose bytes do not start with `%PDF-` or that exceeds the limit
**When** uploaded
**Then** the response is `400 validation_failed` with a message naming the rule ("PDF only", "at most 2 MB") and nothing is written

**Given** a second upload
**When** completed
**Then** the first `resume_files` row still exists unchanged and any Application referencing it still resolves to it

**Given** `GET /api/me/resume`
**When** called by the owner
**Then** the current file streams with `Content-Type: application/pdf`; with no Resume the response is `404 not_found`

### Story 5.4: Register page and Profile page with Resume upload

As a visitor turning Applicant,
I want a registration form and a profile page where I fill my details and upload my Resume,
So that the "Complete profile" step in the golden path takes one visit.

- **Realizes:** FR-A1-1, FR-A1-2, FR-A1-3 (client); UX-DR21, UX-DR3 (`next` after registration)
- **Obeys:** ARCH-06, ARCH-07, S9 (`validation_failed` helper text), NFR-8, NFR-9
- **Tests:** `client/src/pages/RegisterPage.test.jsx` (`FR-A1-1 registers and returns to next`, `FR-A1-1 shows field errors`, `FR-X-5 offers no role choice`), `client/src/pages/me/ProfilePage.test.jsx` (`FR-A1-2 shows and saves the six fields`, `FR-A1-3 uploads a PDF and shows the file name and date`, `FR-A1-3 shows the size limit and rejects non-PDF client-side with the server as the authority`, `NFR-9 visible labels`)
- **Touches:** `client/src/pages/RegisterPage.jsx`, `client/src/pages/me/ProfilePage.jsx`, `client/src/profile/ResumeUpload.jsx`, `client/src/profile/useProfile.js`

**Acceptance Criteria:**

**Given** `/register`
**When** rendered
**Then** it shows Email and Password (with "at least 8 characters" helper text) and a contained Register button, no role selector; success populates `useAuth` and navigates to `next` or `/me/applications`

**Given** `/me/profile`
**When** rendered
**Then** it shows the six profile fields with visible labels and Save, and a Resume section with the current file name, size, upload date, a Download link, and an upload control labelled "Resume (PDF, up to 2 MB)"; after upload the profile query refetches

**Given** a `validation_failed`
**When** returned by either form
**Then** helper text appears under the named fields and focus moves to the first

---

## Epic 6: UC-R1 Register organization and recruiter; maintain org profile

owner:
iteration: 2

A visitor requests a Recruiter Account with a new or existing Organization, sees their approval status while waiting, and once Approved maintains the Organization profile.

### Story 6.1: Request a Recruiter Account with a new or existing Organization

As a visitor who hires,
I want to request a Recruiter Account together with a new Organization, or for an existing Approved Organization,
So that an Administrator can approve me and I can post.

- **Realizes:** FR-R1-1, FR-R1-2; `[ASSUMPTION]` also the public list of Approved Organizations for the select (`GET /api/organizations`), owned here as the first consumer
- **Obeys:** ARCH-08 (bcrypt), ARCH-13 (creation audit rows), ARCH-18 (status on `organization_members` and `organizations`, never on `accounts`), S2, S10 (`POST /api/auth/recruiter-requests`)
- **Tests:** `server/src/business/organizations/requestRecruiter.test.js` (`FR-R1-1 creates an account, a pending organization, and a pending membership in one transaction with audit rows`, `FR-R1-1 refuses a duplicate organization name`, `FR-R1-2 creates an account and a pending membership for an approved organization`, `FR-R1-2 refuses a pending or rejected organization`, `FR-R1-1 accounts row has no organization column`, `FR-R1-1 refuses an email in use`), `server/src/business/organizations/listApprovedOrganizations.test.js` (`FR-R1-2 lists approved organizations by name`)
- **Touches:** `server/src/business/organizations/requestRecruiter.js`, `listApprovedOrganizations.js`, `server/src/persistence/organizationRepository.js` (add `insert`, `listApproved`, `findByName`), `server/src/persistence/membershipRepository.js` (add `insert`), `server/src/presentation/routes/auth.js`, `routes/public.js`

**Acceptance Criteria:**

**Given** a request with email, password, and `organization: { name, description, website, location }`
**When** `POST /api/auth/recruiter-requests` is called
**Then** in one transaction an `accounts` row (`role = 'recruiter'`), an `organizations` row (`pending_approval`), and an `organization_members` row (`pending_approval`) are created, each with a creation audit row, and the response is 201 with `{ membershipId, organization, status: 'pending_approval' }`; the request does not log the requester in `[ASSUMPTION: they log in and see the status page]`

**Given** a request with `organizationId` of an Approved Organization instead
**When** called
**Then** only the Account and the membership are created; for a pending, rejected, or unknown Organization the response is `400 validation_failed`

**Given** `GET /api/organizations`
**When** called by anyone
**Then** it returns Approved Organizations' `id` and `name` sorted by name

### Story 6.2: Recruiter status and Organization profile APIs

As a Recruiter,
I want to read my approval status with the decision reason, and once Approved read and edit my Organization's description, website, and location,
So that I know where I stand and keep my Organization's page current.

- **Realizes:** FR-R1-3, FR-R1-4
- **Obeys:** ARCH-10 (status under `/api/me` for any Recruiter; Organization edit under `/api/org` behind `requireApprovedRecruiter`), ARCH-19 (`latestReason` for the rejection), S7, S10 (`GET /api/me/recruiter-status`, `GET /api/org/organization`, `PATCH /api/org/organization`)
- **Tests:** `server/src/business/organizations/getMyRecruiterStatus.test.js` (`FR-R1-3 pending recruiter gets status and organization name`, `FR-R1-3 rejected recruiter gets the reason from audit`, `FR-R1-3 pending recruiter is forbidden on /api/org/postings`), `server/src/business/organizations/updateOrganization.test.js` (`FR-R1-4 edits description, website, location`, `FR-R1-4 refuses a name change with validation_failed`, `FR-R3-3 recruiter cannot edit another organization`), `server/src/business/organizations/getMyOrganization.test.js`
- **Touches:** `server/src/business/organizations/getMyRecruiterStatus.js`, `getMyOrganization.js`, `updateOrganization.js`, `server/src/persistence/organizationRepository.js` (add `update`), `server/src/presentation/routes/me.js`, `routes/org.js`

**Acceptance Criteria:**

**Given** a logged-in Recruiter whose membership is `pending_approval` or `rejected`
**When** `GET /api/me/recruiter-status` is called
**Then** it returns `{ status, organizationName, decidedAt, reason }` with `reason` from `auditRepository.latestReason('organization_member', membershipId, 'status')`, and any `/api/org/*` request is `403 forbidden`

**Given** an Approved Recruiter
**When** `PATCH /api/org/organization` sends description, website, or location
**Then** the actor's Organization is updated and returned; a body containing `name` is refused with `400 validation_failed` naming `name`

**Given** any Recruiter
**When** they try to reach another Organization by id
**Then** no such path exists under `/api/org` (the Organization is always `actor.organizationId`)

### Story 6.3: Recruiter request form, status page, and Organization profile page

As a Recruiter,
I want a request form, a status page while I wait, and an Organization page once Approved,
So that the whole recruiter onboarding is visible on screen.

- **Realizes:** FR-R1-1, FR-R1-2, FR-R1-3, FR-R1-4 (client); UX-DR19, UX-DR2 (Pending Recruiter sees Jobs and Status only)
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/RecruiterRequestPage.test.jsx` (`FR-R1-1 submits a new organization request`, `FR-R1-2 selects an existing organization`, `NFR-9 labels`), `client/src/pages/org/OrgStatusPage.test.jsx` (`FR-R1-3 shows "waiting for review"`, `FR-R1-3 shows "Rejected: reason"`), `client/src/pages/org/OrgProfilePage.test.jsx` (`FR-R1-4 name read-only, other fields editable`)
- **Touches:** `client/src/pages/RecruiterRequestPage.jsx`, `client/src/pages/org/OrgStatusPage.jsx`, `client/src/pages/org/OrgProfilePage.jsx`, `client/src/organizations/useOrganization.js`

**Acceptance Criteria:**

**Given** `/recruiters/request`
**When** rendered
**Then** it shows Email, Password, a toggle between "New organization" (Name, Description, Website, Location) and "Existing organization" (Select from `/api/organizations`), and a contained "Request account" button; success shows "Request sent. Log in to see its status." with a link to `/login`

**Given** `/org/status` for a Pending Recruiter
**When** rendered
**Then** a card reads "Your request for ‹Org› is waiting for review."; for a Rejected Recruiter it reads "Rejected: ‹reason›" in an `Alert(error)`; the AppBar shows only Jobs and Status

**Given** `/org/profile` for an Approved Recruiter
**When** rendered
**Then** Name is read-only with helper text "Ask an administrator to change the name", the other three fields are editable with visible labels, and Save patches and refetches

---

## Epic 7: UC-M2 Approve or reject postings; handle expiry

owner:
iteration: 2

An Administrator reviews pending Postings, makes them Live or rejects them with a reason, closes any Live Posting with a reason, and expiry removes Postings from the public without anyone acting.

### Story 7.1: Pending Posting queue and approve or reject

As an Administrator,
I want to list Pending Approval Postings, open each in full, and approve it or reject it with a reason,
So that nothing reaches the public unreviewed and the Recruiter learns the decision.

- **Realizes:** FR-M2-1, FR-M2-2, FR-M2-3; writes `posting_approved` and `posting_rejected` Notifications (FR-X-3 producer)
- **Obeys:** ARCH-12 (`postingStatus.assertTransition`), ARCH-13 (guarded UPDATE, `approved_at` in the same UPDATE, audit row, Notifications in one transaction), ARCH-14, ARCH-15 (`[ASSUMPTION]` approving a Posting whose expiry has already passed is refused with `validation_failed` "expiry date has passed", per the spine's deferred rule), ARCH-19, S5, S6 ("notifies the Recruiter" is one row per Approved member of the Organization), S10 (`GET /api/admin/postings?status=pending_approval`, `GET /api/admin/postings/:id`, `POST …/:id/approve`, `POST …/:id/reject`)
- **Tests:** `server/src/business/admin/listPendingPostings.test.js` (`FR-M2-1 lists pending postings oldest first with organization name`), `server/src/business/admin/getPostingForAdmin.test.js` (`FR-M2-1 returns the full posting in any status`), `server/src/business/admin/reviewPosting.test.js` (`FR-M2-2 approve makes it live, sets approved_at, writes an audit row`, `FR-M2-2 approved posting appears first in the public list`, `FR-M2-2 notifies every approved recruiter of the organization with kind posting_approved`, `FR-M2-2 refuses to approve a posting whose expiry has passed`, `FR-M2-3 reject requires a reason and stores it only in audit`, `FR-M2-3 notification body carries the reason verbatim`, `FR-M2-2 approve of a non-pending posting is invalid_transition`, `S13 concurrent decision throws ConcurrentChangeError`)
- **Touches:** `server/src/business/admin/listPendingPostings.js`, `getPostingForAdmin.js`, `reviewPosting.js`, `server/src/persistence/postingRepository.js` (add `listPending`), `server/src/persistence/membershipRepository.js` (add `listApprovedAccountIds(conn, organizationId)`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** Postings in `pending_approval`
**When** `GET /api/admin/postings?status=pending_approval` is called by an Administrator
**Then** they are returned oldest first with `organizationName`, `categoryName`, `locationName`, `expiresAt`; `GET /api/admin/postings/:id` returns the full Posting in any status

**Given** `POST /api/admin/postings/:id/approve`
**When** the Posting is `pending_approval` and its expiry is in the future
**Then** in one transaction the status becomes `live` with `approved_at = now()` in the same UPDATE, an audit row is written, and one `posting_approved` Notification per Approved member of the Organization is written; the Posting is now first in `GET /api/postings`

**Given** `POST /api/admin/postings/:id/reject` with a non-empty `reason`
**When** the Posting is `pending_approval`
**Then** it becomes `rejected`, the reason is in the audit row and verbatim in each `posting_rejected` Notification body, and the Recruiter's `listOrgPostings` shows the reason

**Given** a Posting not in `pending_approval`, or an empty reason
**When** either action is called
**Then** the response is `409 invalid_transition` or `400 validation_failed` and nothing changes

### Story 7.2: Administrator closes any Live Posting with a reason

As an Administrator,
I want to close any Live Posting with a reason,
So that a Posting that breaks the rules leaves the public and the Recruiter knows why.

- **Realizes:** FR-M2-5; writes `posting_closed` Notification
- **Obeys:** ARCH-12, ARCH-13, ARCH-15 (only `effective_status = 'live'` may be closed; an expired one is already off the list), ARCH-19 (reason only in audit), S6, S10 (`POST /api/admin/postings/:id/close`); CAPABILITY-MAP note: shares `postingRepository.transition` with Story 3.3, differs in actor scope, reason, and Notification
- **Tests:** `server/src/business/admin/closePosting.test.js` (`FR-M2-5 closes a live posting with a reason and an audit row`, `FR-M2-5 requires a reason`, `FR-M2-5 notifies every approved recruiter with the reason verbatim`, `FR-M2-5 closed posting leaves the public list`, `FR-M2-5 expired, filled, draft postings cannot be closed`)
- **Touches:** `server/src/business/admin/closePosting.js`, `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** a Posting with `effective_status = 'live'`
**When** `POST /api/admin/postings/:id/close` is called with `reason`
**Then** it becomes `closed` with an audit row carrying the reason and one `posting_closed` Notification per Approved member of the Organization with the reason verbatim; the resource is returned

**Given** an empty reason or a Posting not effectively Live
**When** called
**Then** `400 validation_failed` or `409 invalid_transition` is returned and nothing changes

### Story 7.3: Expiry without anyone acting

As an Applicant or Recruiter,
I want a Live Posting past its expiry date to disappear from the Job List and refuse new Applications while its existing Applications carry on,
So that expiry is a real rule and not a reminder.

- **Realizes:** FR-M2-4 (the refusal of new Applications is additionally asserted by Story 8.1's test named FR-M2-4; the continued pipeline on an Expired Posting by Story 11.1's test named FR-R4-4)
- **Obeys:** ARCH-15 (derived on read, no scheduler, no audit row, Postgres `now()` the only clock), S4, S13 (Expired → Filled audit row records `old_value = 'expired'`, exercised in Epic 14)
- **Tests:** `server/src/persistence/postingRepository.expiry.test.js` (`FR-M2-4 a live posting with expires_at in the past reads as expired`, `FR-M2-4 a live posting expiring later today reads as live`, `FR-M2-4 stored status stays live and no audit row is written`, `FR-M2-4 expired posting is absent from listLive`, `FR-M2-4 expired posting has no status transition to closed`), `server/src/presentation/routes/public.test.js` (`FR-M2-4 GET /api/postings/:id for an expired posting is 404 to a visitor`), `server/src/business/admin/oversightCounts` is Epic 16's concern and counts `expired` from `effective_status`
- **Touches:** `server/src/persistence/postingRepository.js` (only if a gap is found; the S4 fragment landed in Story 1.4), the two test files above, `docs/runbook.md` (a note that the demo seed's expired Posting proves UJ-3 step 2)

**Acceptance Criteria:**

**Given** a stored `live` Posting with `expires_at` earlier than `now()`
**When** any Posting read runs
**Then** `effective_status` is `expired`, the stored status is still `live`, no audit row exists for the change, the Posting is absent from `listLive`, and `GET /api/postings/:id` is `404` to a visitor

**Given** a `live` Posting with `expires_at` at 23:59:59 today in `TZ`
**When** read before that moment
**Then** `effective_status` is `live`

**Given** an Applicant with an Active Application to an Expired Posting
**When** they read the Application
**Then** its Stage is unchanged and the Posting detail opens for them with `effectiveStatus = 'expired'`

### Story 7.4: Approvals page, Postings tab, with close-with-reason

As an Administrator,
I want the Postings tab of the Approvals page with cards I can open in full, approve in one click, reject with a reason, and a way to close a Live Posting with a reason,
So that posting review and intervention are on one screen.

- **Realizes:** FR-M2-1, FR-M2-2, FR-M2-3, FR-M2-5 (client); UX-DR18 (postings tab), UX-DR9, UX-DR10
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/admin/PostingsTab.test.jsx` (`FR-M2-1 renders pending posting cards with Open in full`, `FR-M2-2 Approve one click plus Snackbar`, `FR-M2-3 Reject opens ReasonDialog`, `FR-M2-5 Live postings section offers Close… with reason`, `UX-DR18 empty state`)
- **Touches:** `client/src/pages/admin/PostingsTab.jsx`, `client/src/admin/PostingReviewCard.jsx`, `client/src/pages/admin/AdminPostingPage.jsx` (`/admin/postings/:id` full view with the same actions), `client/src/admin/useAdminPostings.js`

**Acceptance Criteria:**

**Given** `/admin/postings`
**When** it loads
**Then** the Postings tab shows one card per pending Posting with title, Organization, category, location, expiry, "Open in full" (→ `/admin/postings/:id`), Reject…, and Approve; below it a "Live postings" section lists Live Postings with Close… `[ASSUMPTION: the wireframe shows only the queue; a second section is the smallest way to reach FR-M2-5]`

**Given** Approve
**When** clicked
**Then** the card disappears with Snackbar "Approved" and the AppBar badge and lists refetch; Reject… and Close… open `ReasonDialog` and post the reason

**Given** `/admin/postings/:id`
**When** rendered
**Then** the full Posting is shown read-only with the same actions valid for its status, and `HistoryTimeline` shows the status history with the actor `[ASSUMPTION: the full view reuses the S10 history shape via GET /api/admin/postings/:id]`

---

## Epic 8: UC-A3 Apply to a posting

owner:
iteration: 2

A logged-in Applicant with a complete profile applies to a Live Posting with an optional note; the system enforces the complete-profile, no-duplicate, and Application Cap rules and freezes the submission.

### Story 8.1: Submit an Application with a complete profile

As an Applicant with a full name and a Resume,
I want to apply to a Live Posting with an optional note,
So that my Application enters the pipeline at Applied with my Resume frozen as submitted.

- **Realizes:** FR-A3-1, FR-A3-2, FR-A3-5 (snapshot reference); asserts FR-M2-4 (Expired refuses new Applications)
- **Obeys:** ARCH-04, ARCH-10, ARCH-11 (not effectively Live → `404 not_found`), ARCH-13 (creation audit row `old_value NULL`, `new_value 'applied'`), ARCH-15, ARCH-17 (`resume_file_id` is the profile's current file at submission), ARCH-18 (an Application is created only here), S2, S9 (`ProfileIncompleteError` with `details.missing`), S10 (`POST /api/me/applications`), S13
- **Tests:** `server/src/business/applications/submitApplication.test.js` (`FR-A3-1 creates an application in stage applied with the note and a creation audit row`, `FR-A3-1 note over 1000 characters is refused`, `FR-A3-2 refuses with profile_incomplete listing resume when no resume exists`, `FR-A3-2 refuses listing full_name when the name is empty`, `FR-A3-2 lists both when both are missing`, `FR-A3-5 stores the current resume_file_id and a later upload does not change it`, `FR-A3-1 posting that is not effectively live is not_found`, `FR-M2-4 expired posting refuses a new application`, `FR-X-2 a recruiter cannot apply`)
- **Touches:** `server/src/business/applications/submitApplication.js`, `server/src/persistence/applicationRepository.js` (add `insert`), `server/src/persistence/profileRepository.js` (add `lockForUpdate`, used in Story 8.2), `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** a logged-in Applicant whose profile has a non-empty `full_name` and a `current_resume_file_id`, and a Posting with `effective_status = 'live'`
**When** `POST /api/me/applications` receives `{ postingId, note }` with `note` at most 1,000 characters or absent
**Then** in one transaction an `applications` row is inserted with `stage = 'applied'`, `stage_changed_at = now()`, `resume_file_id` equal to the profile's current file, and an audit row (`entity_type = 'application'`, `field = 'stage'`, `old_value NULL`, `new_value 'applied'`, actor the Applicant); the response is 201 with the Application

**Given** a profile missing the Resume, the full name, or both
**When** submitted
**Then** the response is `409 profile_incomplete` with `details: { missing: ['resume'] | ['full_name'] | both }` and nothing is written

**Given** a Posting whose `effective_status` is not `live` (including `expired`)
**When** submitted
**Then** the response is `404 not_found` and nothing is written

**Given** a submitted Application
**When** the Applicant uploads a new Resume afterward
**Then** the Application's `resume_file_id` is unchanged and no route exists to edit an Application (`PATCH /api/me/applications/:id` is 404)

### Story 8.2: Duplicate and Application Cap rules

As the platform,
I want a second Application to the same Posting refused unless the earlier one was withdrawn, and any Application refused once the Applicant holds as many Active Applications as the cap,
So that the cap and the one-open-Application rule are enforced, not decorative.

- **Realizes:** FR-A3-3, FR-A3-4; reads the live cap set by FR-M4-1
- **Obeys:** ARCH-01 (partial unique index is the backstop), ARCH-13 and S13 (`FOR UPDATE` on `applicant_profiles`, then read `application_cap` from `settings` through `trx`, then count Active, then insert), S3, S9 (`DuplicateApplicationError`, `ApplicationCapReachedError` with `details: { count, cap }`), S11 (cap never from config)
- **Tests:** `server/src/business/applications/submitApplication.test.js` (extend: `FR-A3-3 refuses a second application while the first is active`, `FR-A3-3 refuses after rejection`, `FR-A3-3 refuses after a declined offer`, `FR-A3-3 allows a new application after withdrawal while the posting is live`, `FR-A3-3 database index rejects a race as duplicate_application`, `FR-A3-4 refuses when active count equals the cap and returns count and cap`, `FR-A3-4 withdrawn, rejected, declined, hired do not count`, `FR-A3-4 a raised cap admits the next submission without changing existing applications`, `FR-A3-4 two concurrent submissions at cap minus one admit exactly one`)
- **Touches:** `server/src/business/applications/submitApplication.js`, `server/src/persistence/applicationRepository.js` (add `countActiveForApplicant`, `findLatestForApplicantAndPosting`, 23505 mapping already in Story 1.4), `server/src/persistence/settingsRepository.js` (add `getApplicationCap(trx)`)

**Acceptance Criteria:**

**Given** an existing Application by the same Applicant to the same Posting in any Stage but `withdrawn`
**When** a new one is submitted
**Then** the response is `409 duplicate_application` and nothing is written; after a `withdrawn` one and while the Posting is Live, the new Application is created

**Given** an Applicant whose count of Applications in `applied`, `screening`, `interview`, `offer` equals the `application_cap` row in `settings`
**When** they submit
**Then** the response is `409 application_cap_reached` with `details: { count, cap }`; the check runs inside the transaction after locking the Applicant's `applicant_profiles` row `FOR UPDATE`, so two concurrent submissions at the boundary admit exactly one

**Given** the Administrator raises the cap
**When** the same Applicant submits again
**Then** the submission succeeds and no existing Application changed

### Story 8.3: Apply status for the Apply card

As an Applicant on a Job Detail page,
I want to know before clicking whether I already applied, how many Active Applications I hold against the cap, and whether my profile is complete,
So that the Apply card can show the right variant while the server stays the authority.

- **Realizes:** FR-A3-2, FR-A3-3, FR-A3-4 (read side), FR-A3-5 (exposes the submitted Resume metadata for "Your submission"); `[ASSUMPTION]` one read module `applications/getApplyStatus` owned by UC-A3
- **Obeys:** ARCH-04, ARCH-10, S10 (`GET /api/me/apply-status?postingId=`), NFR-1 (the card never trusts this; the submit rules in 8.1 and 8.2 decide)
- **Tests:** `server/src/business/applications/getApplyStatus.test.js` (`FR-A3-4 returns activeCount and cap`, `FR-A3-3 returns the existing application id, stage, and createdAt when one exists that is not withdrawn`, `FR-A3-2 returns profileComplete false with missing list`, `FR-A3-1 returns canApply true when everything passes`)
- **Touches:** `server/src/business/applications/getApplyStatus.js`, `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** `GET /api/me/apply-status?postingId=<id>` by an Applicant
**When** called
**Then** it returns `{ activeCount, cap, existingApplication: { id, stage, createdAt } | null, profileComplete, missing: [], postingEffectiveStatus }` computed with the same repository functions the submit path uses

### Story 8.4: Apply card on Job Detail

As an Applicant,
I want the Apply card to show the cap hint, my Resume, a note field with a counter, and the right variant when I cannot apply,
So that UJ-1 step 7 and UJ-3 steps 3 to 5 work on screen.

- **Realizes:** FR-A3-1, FR-A3-2, FR-A3-3, FR-A3-4, FR-A3-5 (client); UX-DR15 (Apply card and variants), UX-DR4, `[A-UX-3 settled]` cap hint, UX-DR12 (sticky Apply at 375 px)
- **Obeys:** ARCH-06 (mutation invalidates apply-status, my applications, unread count), S9 codes drive the variants, NFR-1 (Apply stays enabled at cap so the rule is the server's), NFR-9
- **Tests:** `client/src/postings/ApplyCard.test.jsx` (`FR-A3-1 submits with a note and shows "You applied today" with the Applied chip`, `FR-A3-4 shows "N of cap active applications" and the cap alert from details without disabling Apply`, `FR-A3-2 shows the missing list and Complete profile linking to /me/profile`, `FR-A3-3 shows "You applied on date" with View application`, `FR-A3-1 note counter caps at 1000`, `UX-DR15 sticky Apply at 375px`)
- **Touches:** `client/src/postings/ApplyCard.jsx`, `client/src/applications/useApplyStatus.js`, `client/src/applications/useSubmitApplication.js`, `client/src/pages/JobDetailPage.jsx` (one mount line inside `ApplySlot`)

**Acceptance Criteria:**

**Given** a logged-in Applicant on `/jobs/:id`
**When** the Apply card renders
**Then** it shows "‹activeCount› of ‹cap› active applications", "Resume: ‹file name› ✓" or the incomplete variant, a Note field labelled "Note (optional)" with a live "n / 1000" counter, and a contained Apply button; on success it becomes "You applied today. Stage: [Applied]" with "View application"

**Given** the server returns `application_cap_reached`
**When** rendered
**Then** an `Alert(warning)` reads "You have ‹count› of ‹cap› active applications. Withdraw one to apply." with a "My Applications" link, Apply stays enabled, and after the Administrator raises the cap a second click succeeds without reload and the hint reads the new cap

**Given** `profile_incomplete` or an existing Application
**When** rendered
**Then** the card shows "Add a resume and your full name to apply." with "Complete profile", or "You applied on ‹date›. Stage: chip" with "View application"

**Given** a 375 px viewport
**When** rendered
**Then** the Apply card is first and the Apply button is sticky at the bottom of the viewport

---

## Epic 9: UC-A4 Track application Stage; withdraw

owner:
iteration: 2

An Applicant sees every Application with its Stage, opens one to read the full history, reasons, and interview record, and withdraws while that is still allowed.

### Story 9.1: My Applications list and detail with history

As an Applicant,
I want to list my Applications and open one to see its Stage history with timestamps, the rejection reason, and any interview record,
So that I always know where I stand and why.

- **Realizes:** FR-A4-1, FR-A4-2 (interview fields render once Epic 12 writes them); `[ASSUMPTION]` creates `applicationRepository.findWithHistory` (the single S10 detail shape) as the first consumer; Epics 10 and 16 reuse it
- **Obeys:** ARCH-10 (record ownership: an Application of another Applicant is `403`), ARCH-18 (history read from audit, never stored twice), ARCH-19 (history carries `by` role only), S5, S10 (`GET /api/me/applications`, `GET /api/me/applications/:id`, detail shape)
- **Tests:** `server/src/business/applications/listMyApplications.test.js` (`FR-A4-1 lists the actor's applications with posting title, organization, stage, stage_changed_at newest change first`, `FR-A4-1 supports ?postingId= and ?stage= filters`, `NFR-3 never lists another applicant's applications`), `server/src/business/applications/getMyApplication.test.js` (`FR-A4-2 returns application, history ordered by created_at and seq, and interviews`, `FR-A4-2 history rows carry by role and reason inline`, `FR-A4-2 includes the rejection reason verbatim`, `FR-A4-2 another applicant's application is forbidden`), `server/src/persistence/applicationRepository.test.js` (`S10 findWithHistory returns the single detail shape`)
- **Touches:** `server/src/business/applications/listMyApplications.js`, `getMyApplication.js`, `server/src/persistence/applicationRepository.js` (add `listForApplicant`, `findWithHistory`), `server/src/persistence/interviewRepository.js` (new: `listForApplication`), `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** `GET /api/me/applications`
**When** called by an Applicant
**Then** the S10 envelope lists their Applications with `postingId`, `postingTitle`, `organizationName`, `stage`, `stageChangedAt`, `createdAt`, most recent Stage change first, and accepts `?postingId=` and `?stage=`

**Given** `GET /api/me/applications/:id`
**When** the Application belongs to the actor
**Then** the response is `{ application, history, interviews }` where `history` comes from `audit_events` for `entity_type = 'application'` ordered by `created_at, seq`, each row `{ at, field, oldValue, newValue, reason, by }` with `by` the actor's role and never an id, and `interviews` lists `{ scheduledAt, notes, outcome, outcomeNotes }`; the `application` carries the submitted Resume's file id and the note

**Given** an Application of another Applicant
**When** requested
**Then** the response is `403 forbidden`

### Story 9.2: Withdraw an Application

As an Applicant,
I want to withdraw an Application while it is in Applied, Screening, or Interview,
So that it stops counting toward my cap, while an offer must be declined rather than withdrawn.

- **Realizes:** FR-A4-3, FR-A4-4
- **Obeys:** ARCH-10, ARCH-12 (`applicationStage.assertTransition`), ARCH-13 (guarded UPDATE plus audit row in one transaction, `stage_changed_at` in the same UPDATE), S10 (`POST /api/me/applications/:id/withdraw`), S13
- **Tests:** `server/src/business/applications/withdrawApplication.test.js` (`FR-A4-3 applied becomes withdrawn with an audit row`, `FR-A4-3 screening and interview become withdrawn`, `FR-A4-3 withdrawn application no longer counts toward the cap`, `FR-A4-3 a new application to the same live posting is allowed afterward`, `FR-A4-4 offer cannot be withdrawn`, `FR-A4-4 hired, rejected, withdrawn, declined cannot be withdrawn`, `FR-A4-4 refusal leaves data unchanged`, `NFR-3 another applicant's application is forbidden`)
- **Touches:** `server/src/business/applications/withdrawApplication.js`, `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** the actor's Application in `applied`, `screening`, or `interview`
**When** `POST /api/me/applications/:id/withdraw` is called
**Then** in one transaction the stage becomes `withdrawn` with `WHERE stage = <from>`, `stage_changed_at` is updated in the same UPDATE, an audit row is written with the Applicant as actor, and the resource is returned; `countActiveForApplicant` drops by one

**Given** an Application in `offer` or any terminal Stage
**When** withdrawn
**Then** the response is `409 invalid_transition` with a readable message ("An application at Offer can be declined, not withdrawn") and nothing changes

### Story 9.3: My Applications page

As an Applicant,
I want a My Applications page listing each Application with its Stage chip and when it last changed,
So that one glance tells me where everything stands.

- **Realizes:** FR-A4-1 (client); UX-DR16 (list), UX-DR7
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/me/MyApplicationsPage.test.jsx` (`FR-A4-1 lists rows with title, organization, StageChip, "changed relative time"`, `FR-A4-1 header shows Active N of cap`, `UX-DR16 empty state "You have not applied yet. Browse jobs."`, `UX-DR16 row links to /me/applications/:id`)
- **Touches:** `client/src/pages/me/MyApplicationsPage.jsx`, `client/src/applications/useMyApplications.js`

**Acceptance Criteria:**

**Given** `/me/applications`
**When** it loads
**Then** it shows `h1` "My applications", "Active ‹n› of ‹cap›" (from apply-status without a posting `[ASSUMPTION: the endpoint accepts a missing postingId and returns counts only]`), a "Browse jobs" link, and one row per Application with Posting title, Organization, `StageChip`, "changed ‹relative time›", and a chevron linking to the detail

**Given** no Applications
**When** rendered
**Then** `EmptyState` reads "You have not applied yet." with "Browse jobs"

### Story 9.4: Application detail page with Stepper, history, submission, and Withdraw

As an Applicant,
I want an Application detail page with the pipeline Stepper, the interview card when recorded, the history timeline, my submission, and a Withdraw button when allowed,
So that UJ-2's climax (reading the reason) and withdrawal happen on one screen.

- **Realizes:** FR-A4-2, FR-A4-3, FR-A4-4 (client); UX-DR16 (detail minus the Offer panel, which Story 14.4 mounts), UX-DR9/UX-DR10 (Withdraw confirms, no reason field)
- **Obeys:** ARCH-06 (refetch after mutation and after any refusal so buttons match the true state), S9 (`invalid_transition` → alert at the top of the action panel), NFR-9
- **Tests:** `client/src/pages/me/ApplicationDetailPage.test.jsx` (`FR-A4-2 renders Stepper at the current stage, history rows with reason inline, and the interview card`, `FR-A4-2 rejected variant shows frozen Stepper, Rejected chip, Alert "Rejected: reason"`, `FR-A4-3 Withdraw opens ConfirmDialog and posts`, `FR-A4-4 Withdraw hidden at offer and in terminal stages`, `FR-A4-4 server refusal renders in ErrorAlert and refetches`, `FR-A3-5 Your submission shows the resume as submitted with Download and the note`)
- **Touches:** `client/src/pages/me/ApplicationDetailPage.jsx`, `client/src/applications/WithdrawButton.jsx`, `client/src/applications/InterviewCard.jsx`, `client/src/applications/SubmissionCard.jsx`, `client/src/applications/useMyApplication.js`, `client/src/applications/ActionSlot.jsx` (Story 14.4 mounts `OfferPanel` here)

**Acceptance Criteria:**

**Given** `/me/applications/:id`
**When** it loads
**Then** it shows "‹ My applications", `h1` "‹title› · ‹Organization›", `PipelineStepper` at the current Stage, `InterviewCard` when `interviews` is non-empty ("‹date time› · Outcome: ‹outcome› · ‹notes›"), `h2` History with `HistoryTimeline`, and `h2` Your submission with "Resume as submitted: ‹file› [Download]" (`GET /api/me/applications/:id/resume` `[ASSUMPTION: served by getMyApplication's owner as a thin route on the submitted file id]`) and the note

**Given** a `rejected` Application
**When** rendered
**Then** the Stepper is frozen at the last active step, the chip reads Rejected, an `Alert(error)` reads "Rejected: ‹reason verbatim›", and no action renders

**Given** an Application in `applied`, `screening`, or `interview`
**When** rendered
**Then** `WithdrawButton` (`outlined color="error"`) opens a `ConfirmDialog` without a reason field and posts the withdrawal; at `offer` and in terminal Stages the button is absent; an `invalid_transition` from the server renders in `ErrorAlert` and the page refetches

---

## Epic 10: UC-R3 Review applications for own organization only

owner:
iteration: 2

A Recruiter reviews the Applications to their Organization's Postings, opens each with the Resume as submitted, and never sees another Organization's data or an Applicant's other Applications.

### Story 10.1: Organization-scoped Application queue

As a Recruiter,
I want to list the Applications to one of my Organization's Postings, optionally filtered by Stage,
So that I review candidates in one queue and never see another Organization's.

- **Realizes:** FR-R3-1, FR-R3-3 (list side)
- **Obeys:** ARCH-10 (`organizationId` mandatory WHERE parameter, never filtered afterwards; the Posting is loaded by id and `ForbiddenError` thrown when its Organization differs), ARCH-11 (403 for a foreign Posting), S10 (`GET /api/org/postings/:id/applications?stage=`)
- **Tests:** `server/src/business/applications/listOrgApplications.test.js` (`FR-R3-1 lists applications to the posting with applicant name, stage, submitted time`, `FR-R3-1 filters by stage`, `FR-R3-1 orders by submission time`, `FR-R3-3 a posting of another organization is forbidden`, `FR-R3-3 the repository query takes organizationId as a WHERE parameter`, `FR-R3-4 rows carry no count of the applicant's other applications`)
- **Touches:** `server/src/business/applications/listOrgApplications.js`, `server/src/persistence/applicationRepository.js` (add `listForPostingInOrganization(conn, { postingId, organizationId, stage, page, pageSize })`), `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** a Posting of the actor's Organization
**When** `GET /api/org/postings/:id/applications` is called, optionally with `?stage=`
**Then** the S10 envelope lists Applications with `id`, `applicantName`, `stage`, `createdAt`, `stageChangedAt`, ordered oldest submission first, and nothing about the Applicant's other Applications

**Given** a Posting of another Organization
**When** requested
**Then** the response is `403 forbidden` before any Application is read; a hand-crafted request cannot bypass it because the list query itself carries `organizationId`

### Story 10.2: Application detail for Recruiters and the Resume as submitted

As a Recruiter,
I want to open one Application and see the Applicant's profile, the Resume exactly as submitted, the note, and the Stage history,
So that I review what the candidate sent, not what they uploaded later.

- **Realizes:** FR-R3-2, FR-R3-3 (record side), FR-R3-4; `applications/getSubmittedResume` per S15 (also mounted under `/api/admin/applications/:id/resume` for Epic 16)
- **Obeys:** ARCH-10 (single record loads by id, throws `ForbiddenError` when the Posting's Organization differs), ARCH-17, ARCH-19 (history with `by` role only), NFR-3 (profile readable because the Applicant applied to this Organization), S10 (detail shape via `findWithHistory`, `GET /api/org/applications/:id`), S15
- **Tests:** `server/src/business/applications/getOrgApplication.test.js` (`FR-R3-2 returns profile fields, note, submitted resume metadata, history, interviews`, `FR-R3-3 application of another organization is forbidden`, `FR-R3-4 response has no other applications and no count`, `NFR-3 profile is readable only because the applicant applied here`), `server/src/business/applications/getSubmittedResume.test.js` (`FR-R3-2 streams the resume_files row referenced by the application not the profile's current file`, `FR-A3-5 a newer upload is not what the recruiter downloads`, `FR-R3-3 forbidden for another organization`, `FR-M4-5 administrator may download any submitted resume`)
- **Touches:** `server/src/business/applications/getOrgApplication.js`, `getSubmittedResume.js`, `server/src/persistence/applicationRepository.js` (add `findByIdWithPosting`), `server/src/presentation/routes/org.js`, `routes/admin.js` (resume path only)

**Acceptance Criteria:**

**Given** an Application to a Posting of the actor's Organization
**When** `GET /api/org/applications/:id` is called
**Then** the response is the S10 detail shape extended with `applicant: { fullName, phone, location, headline, education, summary }`, `note`, `resume: { fileId, size, uploadedAt }`, `history` with `by` roles, and `interviews`

**Given** `GET /api/org/applications/:id/resume`
**When** called
**Then** the bytes of the `resume_files` row referenced by `applications.resume_file_id` stream as `application/pdf`, even when the Applicant has uploaded a newer file since; `GET /api/admin/applications/:id/resume` does the same for an Administrator

**Given** an Application whose Posting belongs to another Organization
**When** either path is called
**Then** the response is `403 forbidden` with no fields

### Story 10.3: Recruiter Application queue page

As a Recruiter,
I want a queue page for one Posting with a Stage filter, a table of Applicants, and the Posting header with Edit and Close,
So that UJ-1 step 8 starts from one screen.

- **Realizes:** FR-R3-1, FR-R3-3 (client); UX-DR17 (read side; row actions are mounted by Epics 11, 12, 13 into `RowActions`), UX-DR6, UX-DR8
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/org/PostingApplicationsPage.test.jsx` (`FR-R3-1 renders rows with name, StageChip, submitted date`, `FR-R3-1 Stage filter updates the URL and refetches`, `FR-R3-3 forbidden renders the full-page You do not have access with no rows`, `UX-DR17 helper text "Advancing cannot be undone; the pipeline only moves forward."`, `UX-DR6 cards at 375px`)
- **Touches:** `client/src/pages/org/PostingApplicationsPage.jsx`, `client/src/applications/OrgApplicationsTable.jsx`, `client/src/applications/RowActions.jsx` (renders the per-stage action slots; empty until Epics 11 to 13 fill them), `client/src/applications/useOrgApplications.js`

**Acceptance Criteria:**

**Given** `/org/postings/:id/applications`
**When** it loads
**Then** it shows "‹ Postings", `h1` with the Posting title, `StatusChip`, expiry, Edit and Close… (reusing Story 3.5's actions), a Stage `Select`, "‹n› applications", the helper caption, and a dense `ResponsiveTable` with Applicant, Stage, Submitted, Actions; row click opens `/org/applications/:id`

**Given** a `403 forbidden`
**When** rendered
**Then** the full-page "You do not have access to this page" appears with a link home and no table

### Story 10.4: Recruiter Application detail page

As a Recruiter,
I want an Application detail page with the Applicant's profile, a Resume download, the note, the Stepper, and the history,
So that I can read the candidate before I act.

- **Realizes:** FR-R3-2, FR-R3-4 (client); UX-DR17 (detail read side; the action panel slot is filled by Epics 11 to 13)
- **Obeys:** ARCH-06, ARCH-07, NFR-9
- **Tests:** `client/src/pages/org/OrgApplicationDetailPage.test.jsx` (`FR-R3-2 renders profile, note, Download resume, Stepper, HistoryTimeline`, `FR-R3-4 renders nothing about other applications`, `FR-R3-3 forbidden page`)
- **Touches:** `client/src/pages/org/OrgApplicationDetailPage.jsx`, `client/src/applications/ApplicantProfileCard.jsx`, `client/src/applications/OrgActionPanel.jsx` (slot; Epics 11 to 13 add their buttons and dialogs), `client/src/applications/useOrgApplication.js`

**Acceptance Criteria:**

**Given** `/org/applications/:id`
**When** it loads
**Then** it shows "‹ Applications", `h1` with the Applicant's name and the Posting title, `PipelineStepper`, `OrgActionPanel` (empty slot in this story), `ApplicantProfileCard` with the six profile fields, "Resume as submitted [Download]" linking to `/api/org/applications/:id/resume`, the note, `InterviewCard` when present, and `HistoryTimeline` with roles

---

## Epic 11: UC-R4 Advance or reject through the fixed pipeline; record reason

owner:
iteration: 2

A Recruiter moves an Application forward one Stage at a time or rejects it with a reason the Applicant reads verbatim; backward, skipped, and terminal changes are refused.

### Story 11.1: Advance an Application one Stage

As a Recruiter,
I want to advance an Application from Applied to Screening and from Screening to Interview,
So that the candidate moves through the pipeline and is told.

- **Realizes:** FR-R4-1, FR-R4-3, FR-R4-4 (advance side); writes `application_advanced` Notification (FR-A5-3 producer)
- **Obeys:** ARCH-10 (scope check on the Posting's Organization), ARCH-12 (`applicationStage.assertTransition`, `postingStatus.assertPostingAllows`), ARCH-13 (guarded UPDATE, `stage_changed_at`, audit row, Notification in one transaction), ARCH-14, ARCH-15 (`effective_status NOT IN ('filled','closed')`), S6, S10 (`POST /api/org/applications/:id/advance`), S13
- **Tests:** `server/src/business/applications/advanceApplication.test.js` (`FR-R4-1 applied becomes screening with audit row and notification`, `FR-R4-1 screening becomes interview`, `FR-R4-3 interview cannot be advanced here (offer is extendOffer)`, `FR-R4-3 backward move is refused`, `FR-R4-3 terminal application is refused`, `FR-R4-3 refusal leaves data unchanged`, `FR-R4-4 posting filled or closed refuses advance`, `FR-R4-4 expired posting allows advance`, `FR-A5-3 notification names the new stage by stored value`, `FR-R3-3 forbidden for another organization`, `S13 concurrent advance throws ConcurrentChangeError`)
- **Touches:** `server/src/business/applications/advanceApplication.js`, `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** an Application of the actor's Organization in `applied` or `screening` whose Posting's `effective_status` is not `filled` or `closed`
**When** `POST /api/org/applications/:id/advance` is called
**Then** the next Stage is computed (`applied → screening`, `screening → interview`), asserted, written with `WHERE stage = <from>` and `stage_changed_at = now()`, an audit row is written with the Recruiter as actor, and one `application_advanced` Notification is written for the Applicant whose body names the Posting and the new Stage by stored value; the resource is returned

**Given** an Application in `interview`, `offer`, or a terminal Stage, or an explicit target that skips or goes backward
**When** advanced
**Then** the response is `409 invalid_transition` with a readable message and nothing changes

**Given** a Posting with `effective_status` `filled` or `closed`
**When** an advance is attempted
**Then** the response is `409 invalid_transition` ("This posting is filled"); an `expired` Posting allows the advance

### Story 11.2: Reject an Application with a reason

As a Recruiter,
I want to reject an Application in Applied, Screening, or Interview with a reason of at least 10 characters,
So that the candidate is told why, verbatim.

- **Realizes:** FR-R4-2, FR-R4-3, FR-R4-4 (reject side); writes `application_rejected` Notification (FR-A5-3 producer)
- **Obeys:** ARCH-10, ARCH-12, ARCH-13, ARCH-14, ARCH-19 (reason only in audit; Notification body repeats it), S5, S6, S10 (`POST /api/org/applications/:id/reject`), S13
- **Tests:** `server/src/business/applications/rejectApplication.test.js` (`FR-R4-2 applied, screening, interview become rejected with the reason in the audit row`, `FR-R4-2 reason under 10 characters is refused`, `FR-R4-2 notification body carries the reason verbatim`, `FR-A5-3 notification kind is application_rejected`, `FR-R4-3 offer cannot be rejected here`, `FR-R4-3 terminal application is refused`, `FR-R4-4 rejection is allowed on a filled or closed posting`, `FR-R3-3 forbidden for another organization`, `FR-A4-2 the applicant's history shows the reason`)
- **Touches:** `server/src/business/applications/rejectApplication.js`, `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** an Application of the actor's Organization in `applied`, `screening`, or `interview` and a `reason` of at least 10 characters
**When** `POST /api/org/applications/:id/reject` is called
**Then** the Stage becomes `rejected` with a guarded UPDATE, the audit row stores the reason, and one `application_rejected` Notification is written for the Applicant with the reason verbatim in its body; the resource is returned

**Given** a reason under 10 characters
**When** submitted
**Then** the response is `400 validation_failed` naming `reason`

**Given** an Application in `offer` or a terminal Stage
**When** rejected
**Then** the response is `409 invalid_transition`; an Application on a `filled` or `closed` Posting may still be rejected

### Story 11.3: Advance and Reject actions on the queue and the detail page

As a Recruiter,
I want one-click Advance buttons and a Reject dialog on each row and on the detail page, with refusals shown and the list refetched,
So that the pipeline is driven from the screens I already use.

- **Realizes:** FR-R4-1, FR-R4-2, FR-R4-3, FR-R4-4 (client); UX-DR17 (advance and reject actions, per-stage rules, filled banner), UX-DR9, UX-DR10, `[ASSUMPTION A-UX-7]` inline row actions kept
- **Obeys:** ARCH-06 (mutations invalidate queue, detail, unread count), S9 (`invalid_transition`, `concurrent_change` → `Alert(error)` above the table with refetch), NFR-1 (client hides, server refuses), NFR-9
- **Tests:** `client/src/applications/PipelineActions.test.jsx` (`FR-R4-1 applied shows Advance → Screening; one click posts and Snackbar "name moved to Screening"`, `FR-R4-1 screening shows Advance → Interview`, `FR-R4-2 Reject opens ReasonDialog "Reason (shown to the applicant)", disabled under 10 characters, posts the reason`, `FR-R4-3 terminal rows show no actions`, `FR-R4-3 offer shows "Offer extended, awaiting applicant"`, `FR-R4-4 filled posting shows only Reject and the banner "This posting is filled."`, `S9 refused transition renders Alert above the table and refetches`)
- **Touches:** `client/src/applications/PipelineActions.jsx` (Advance and Reject; mounted in `RowActions` and `OrgActionPanel`), `client/src/applications/usePipelineMutations.js`, `client/src/applications/RowActions.jsx` and `OrgActionPanel.jsx` (one mount line each)

**Acceptance Criteria:**

**Given** a row or detail for an Application in `applied` or `screening`
**When** rendered
**Then** an outlined "Advance → ‹next Stage label›" button and a Reject (`outlined color="error"`) button appear; Advance posts on one click and shows Snackbar "‹name› moved to ‹Stage label›"; Reject opens `ReasonDialog` titled "Reason (shown to the applicant)" with the primary disabled until 10 characters

**Given** `interview`
**When** rendered
**Then** Reject appears (Record interview and Extend offer arrive in Epics 12 and 13); at `offer` the row reads "Offer extended, awaiting applicant"; terminal rows show no actions

**Given** the Posting's `effectiveStatus` is `filled` or `closed`
**When** rendered
**Then** only Reject remains and a banner reads "This posting is filled." (or "closed")

**Given** the server refuses with `invalid_transition`, `concurrent_change`, or `offer_already_open`
**When** received
**Then** an `Alert(error)` with the message appears above the table or action panel and the queue and detail refetch

---

## Epic 12: UC-R5 Record that an interview was scheduled and its outcome

owner:
iteration: 3

A Recruiter records that an interview was scheduled and later its outcome, and the Applicant sees both.

### Story 12.1: Record an interview and its outcome

As a Recruiter,
I want to record that an interview was scheduled for an Application in Interview, with date, time, and notes, and later record its outcome,
So that both sides have the record, without the outcome gating anything.

- **Realizes:** FR-R5-1, FR-R5-2; writes `interview_recorded` Notification (FR-A5-3 producer); the Applicant read side is Story 9.1's `interviews` array
- **Obeys:** ARCH-10, ARCH-13 (interview insert or outcome UPDATE, audit row with `entity_type = 'interview'` and `field = 'scheduled_at'` or `'outcome'`, Notification in one transaction), ARCH-18 (interviews belong to the Application), ARCH-19, S1 (`passed`, `failed`, `no_show`), S2, S6, S10 (`POST /api/org/applications/:id/interviews`, `POST /api/org/applications/:id/interviews/:interviewId/outcome`)
- **Tests:** `server/src/business/applications/recordInterview.test.js` (`FR-R5-1 inserts an interview with scheduled_at and notes and an audit row on the interview entity`, `FR-R5-1 refuses when the application is not in interview`, `FR-R5-1 notifies the applicant with kind interview_recorded`, `FR-R5-1 stage is unchanged`, `FR-R3-3 forbidden for another organization`), `server/src/business/applications/recordInterviewOutcome.test.js` (`FR-R5-2 records passed, failed, or no_show with notes and an audit row`, `FR-R5-2 refuses an unknown outcome`, `FR-R5-2 refuses a second outcome on the same interview`, `FR-R5-2 outcome gates nothing: extendOffer is possible with a failed outcome and without any interview (asserted again in Story 13.1)`, `FR-A4-2 the applicant's detail shows date, outcome, and notes`)
- **Touches:** `server/src/business/applications/recordInterview.js`, `recordInterviewOutcome.js`, `server/src/persistence/interviewRepository.js` (add `insert`, `setOutcome`, `findById`), `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** an Application of the actor's Organization in `interview`
**When** `POST /api/org/applications/:id/interviews` receives `{ scheduledAt, notes }`
**Then** in one transaction an `interviews` row is inserted, an audit row (`entity_type = 'interview'`, `field = 'scheduled_at'`, `old_value NULL`) is written, and one `interview_recorded` Notification is written for the Applicant; the Stage does not change and the resource is returned

**Given** an Application in any other Stage
**When** an interview is recorded
**Then** the response is `409 invalid_transition` ("Interviews are recorded at the Interview stage") and nothing is written

**Given** a recorded interview with no outcome
**When** `POST …/interviews/:interviewId/outcome` receives `{ outcome, outcomeNotes }` with `outcome` in `passed`, `failed`, `no_show`
**Then** the row's `outcome`, `outcome_notes`, `recorded_at` are set, an audit row (`field = 'outcome'`) is written, and the Applicant's detail lists the outcome; an unknown outcome is `400 validation_failed`; a second outcome is `409 rule_violation`

### Story 12.2: Interview dialogs on the Recruiter screens and the Applicant's card

As a Recruiter,
I want "Record interview" and "Record outcome" dialogs on the queue row and the detail page for Applications in Interview,
So that recording takes seconds and the Applicant's Interview card fills in.

- **Realizes:** FR-R5-1, FR-R5-2 (client); UX-DR17 (interview Dialogs as inline forms), UX-DR16 (Interview card already rendered by Story 9.4 from `interviews`)
- **Obeys:** ARCH-06, S9 (`validation_failed` helper text), NFR-9
- **Tests:** `client/src/applications/InterviewActions.test.jsx` (`FR-R5-1 Record interview opens a Dialog with date, time, notes and posts`, `FR-R5-2 Record outcome offers Passed, Failed, No-show with notes and posts`, `FR-R5-2 outcome button appears only when an interview without outcome exists`, `FR-R5-1 buttons appear only at interview stage`, `NFR-9 labels and focus return`)
- **Touches:** `client/src/applications/InterviewActions.jsx`, `client/src/applications/InterviewDialog.jsx`, `client/src/applications/OutcomeDialog.jsx`, `client/src/applications/useInterviewMutations.js`, `RowActions.jsx` and `OrgActionPanel.jsx` (one mount line each)

**Acceptance Criteria:**

**Given** an Application in `interview`
**When** the row or action panel renders
**Then** "Record interview" opens a Dialog with Date, Time, and Notes (visible labels) and posts; when an interview without outcome exists, "Record outcome" opens a Dialog with a Select (Passed, Failed, No-show) and Notes; after either, the detail, queue, and unread count refetch and the Recruiter detail shows the interview list

**Given** any other Stage
**When** rendered
**Then** neither button appears

---

## Epic 13: UC-R6 Extend an offer; posting auto-closes when filled

owner:
iteration: 3

A Recruiter extends one offer at a time per Posting, and the persistence layer can fill a Posting and reject its other Active Applications in one call.

### Story 13.1: Extend an offer, one open offer per Posting

As a Recruiter,
I want to extend an offer on an Application in Interview, with or without a recorded interview,
So that the candidate is told and no second offer can be open on the same Posting.

- **Realizes:** FR-R6-1; writes `offer_extended` Notification (FR-A5-3 producer)
- **Obeys:** ARCH-01 (`postings_one_open_offer` index is the backstop), ARCH-10, ARCH-12 (`interview → offer`, `assertPostingAllows`), ARCH-13, ARCH-14, S3, S6, S9 (`OfferAlreadyOpenError` from 23505 or from a pre-check), S10 (`POST /api/org/applications/:id/offer`), S13
- **Tests:** `server/src/business/applications/extendOffer.test.js` (`FR-R6-1 interview becomes offer with audit row and notification offer_extended`, `FR-R6-1 works without a recorded interview`, `FR-R6-1 works with a failed outcome (A-17)`, `FR-R6-1 refuses when another application to the posting is at offer with offer_already_open`, `FR-R6-1 database index catches a race as offer_already_open`, `FR-R6-1 allowed again after the open offer is declined`, `FR-R4-3 refused from applied or screening`, `FR-R4-4 refused on a filled or closed posting, allowed on an expired one`, `FR-R3-3 forbidden for another organization`)
- **Touches:** `server/src/business/applications/extendOffer.js`, `server/src/persistence/applicationRepository.js` (add `existsOpenOfferForPosting`), `server/src/presentation/routes/org.js`

**Acceptance Criteria:**

**Given** an Application of the actor's Organization in `interview` whose Posting's `effective_status` is not `filled` or `closed` and has no other Application in `offer`
**When** `POST /api/org/applications/:id/offer` is called
**Then** the Stage becomes `offer` with a guarded UPDATE, an audit row is written, and one `offer_extended` Notification is written for the Applicant; the resource is returned; a recorded interview or its outcome is not required

**Given** another Application to the same Posting in `offer`
**When** an offer is extended
**Then** the response is `409 offer_already_open` (from the pre-check, or from the S3 index on a race) and nothing changes; after that offer is declined the new one succeeds

**Given** an Application not in `interview`, or a Posting `filled` or `closed`
**When** an offer is extended
**Then** the response is `409 invalid_transition`

### Story 13.2: Persistence for "filled": cascade reject and Expired → Filled

As the owner of UC-R6,
I want repository functions that move a Posting to Filled from Live or Expired and reject every other Active Application to it in one call, returning the recipients,
So that Epic 14's `acceptOffer` can run the whole cascade in one transaction without importing my module.

- **Realizes:** persistence half of FR-R6-2, FR-R6-3 (the business tests are Story 14.2's `acceptOffer.test.js`); `[ASSUMPTION]` see the coverage map
- **Obeys:** ARCH-04 (repositories hold no business rules: the function rejects rows it is told to and returns recipients; the decision to call it is `acceptOffer`'s), ARCH-13, ARCH-15 (`from = 'expired'` maps to stored `live`), ARCH-19 (one audit row per rejected Application with the reason "Position filled" and the triggering actor), S5, S8 (`applicationRepository.rejectAllActiveForPosting(trx, postingId, { reason, actorAccountId, exceptApplicationId })` returns `[ { applicationId, applicantAccountId, auditEventId } ]`), S13
- **Tests:** `server/src/persistence/applicationRepository.cascade.test.js` (`FR-R6-3 rejectAllActiveForPosting moves every applied, screening, interview, offer application except the hired one to rejected`, `FR-R6-3 writes one audit row per rejected application with reason Position filled and the triggering actor`, `FR-R6-3 leaves withdrawn, rejected, declined applications and the hired applicant's other applications unchanged`, `FR-R6-3 returns the recipients with their audit event ids`, `FR-R6-3 stage_changed_at updated in the same statement`), `server/src/persistence/postingRepository.test.js` (extend: `FR-R6-2 transition from expired to filled guards on stored live and records old_value expired`, `FR-R6-2 transition from live to filled`, `FR-R6-2 filled posting is absent from listLive`)
- **Touches:** `server/src/persistence/applicationRepository.js` (add `rejectAllActiveForPosting`), `server/src/persistence/postingRepository.js` (verify `transition` Expired mapping from Story 1.4 and add the `old_value` handling if missing)

**Acceptance Criteria:**

**Given** a Posting with Applications in every Stage and one in `offer` to be hired
**When** `rejectAllActiveForPosting(trx, postingId, { reason: 'Position filled', actorAccountId, exceptApplicationId })` runs
**Then** every other Application in `applied`, `screening`, `interview`, `offer` becomes `rejected` with `stage_changed_at = now()`, one audit row per Application is written through `auditRepository.record` with the reason and the triggering actor, terminal Applications and the hired Applicant's Applications to other Postings are unchanged, and the function returns the recipients with their audit event ids

**Given** `postingRepository.transition(trx, id, { from: 'expired', to: 'filled' })`
**When** run
**Then** the UPDATE is `WHERE status = 'live'`, the returned audit inputs carry `old_value = 'expired'`, and `listLive` no longer returns the Posting

### Story 13.3: Extend offer Dialog and the awaiting-applicant state

As a Recruiter,
I want an "Extend offer" button with a confirmation Dialog on the queue row and detail page, and a clear awaiting state once extended,
So that UJ-1 step 9 is one confirmed click.

- **Realizes:** FR-R6-1 (client); UX-DR17 (Extend offer Dialog, "Offer extended, awaiting applicant"), UX-DR10
- **Obeys:** ARCH-06, S9 (`offer_already_open` → `Alert(error)` and refetch), NFR-9
- **Tests:** `client/src/applications/OfferActions.test.jsx` (`FR-R6-1 Extend offer opens Dialog "Extend an offer to name? Only one offer can be open per posting." and posts on confirm`, `FR-R6-1 offer_already_open renders the server message and refetches`, `FR-R6-1 button appears only at interview stage`, `FR-R4-4 hidden on a filled or closed posting`)
- **Touches:** `client/src/applications/OfferActions.jsx`, `client/src/applications/useOfferMutations.js`, `RowActions.jsx` and `OrgActionPanel.jsx` (one mount line each)

**Acceptance Criteria:**

**Given** an Application in `interview` on a Posting that is not filled or closed
**When** rendered
**Then** an outlined "Extend offer" button opens a `ConfirmDialog` reading "Extend an offer to ‹name›? Only one offer can be open per posting." with Cancel and Extend offer; on confirm it posts, the row reads "Offer extended, awaiting applicant", and the queue, detail, and unread count refetch

**Given** `409 offer_already_open`
**When** received
**Then** the message renders in an `Alert(error)` above the table or panel and the list refetches

---

## Epic 14: UC-A5 Receive notifications; accept or decline an offer

owner:
iteration: 3

Any Account reads its Notifications and follows them; an Applicant is told of every decision on their Applications and accepts or declines an offer, with acceptance filling the Posting.

### Story 14.1: Mark a Notification read and the Notifications page

As a logged-in Account holder,
I want a Notifications page, newest first, where opening one marks it read and takes me to the Application or Posting it concerns,
So that every decision reaches me and I can act on it.

- **Realizes:** FR-A5-1 (count on every page is Story 1.7's bell; this story owns the FR test), FR-A5-2, FR-X-3 (page)
- **Obeys:** ARCH-06 (mark-read invalidates the unread count), ARCH-10 (only the recipient may mark), ARCH-18 (only `read_at` changes, never deleted), S6 (`notificationHref(actor, entityType, entityId)` in `client/src/notifications/href.js`; one page for all roles; deleted Posting renders `not_found`), S10 (`POST /api/me/notifications/:id/read`)
- **Tests:** `server/src/business/notifications/markRead.test.js` (`FR-A5-2 sets read_at once and is idempotent`, `FR-A5-2 another account's notification is forbidden`, `FR-X-3 nothing but read_at changes`), `client/src/pages/NotificationsPage.test.jsx` (`FR-A5-1 lists newest first with unread rows bold and a dot icon`, `FR-A5-1 badge count matches unread rows and drops after reading`, `FR-A5-2 clicking a row marks it read and navigates to the href`, `FR-A5-2 href maps application to /me/applications/:id for applicants and /org/applications/:id for recruiters and posting to /jobs/:id or /org/postings/:id/edit`, `S6 a deleted posting renders the not_found alert`)
- **Touches:** `server/src/business/notifications/markRead.js`, `server/src/persistence/notificationRepository.js` (add `markRead`), `server/src/presentation/routes/me.js`, `client/src/pages/NotificationsPage.jsx`, `client/src/notifications/href.js`, `client/src/notifications/useNotifications.js`

**Acceptance Criteria:**

**Given** `POST /api/me/notifications/:id/read` by the recipient
**When** called
**Then** `read_at` is set if null and the Notification is returned; a second call is a no-op returning 200; another Account's Notification is `403 forbidden`

**Given** `/notifications`
**When** it loads
**Then** it shows `h1` "Notifications", rows newest first with the body as body text, unread rows bold with a dot icon, and 20 per page; clicking a row calls mark-read, invalidates the unread count, and navigates to `notificationHref` (Applicant: `/me/applications/:id`; Recruiter: `/org/applications/:id` or `/org/postings/:id/edit`; Administrator: `/admin/records/:type/:id`; Posting for a visitor role never applies)

### Story 14.2: Accept an offer and fill the Posting

As an Applicant with an offer,
I want to accept it,
So that my Application becomes Hired, the Posting is Filled and leaves the Job List, and every other active candidate is told "Position filled".

- **Realizes:** FR-A5-4, FR-R6-2, FR-R6-3, FR-A5-3 (`position_filled` event); `[ASSUMPTION]` cascade ownership per the coverage map
- **Obeys:** ARCH-01 (one transaction), ARCH-04 (calls `applicationRepository.rejectAllActiveForPosting` from Story 13.2, never imports `rejectApplication`), ARCH-10 (record ownership), ARCH-12 (`offer → hired`; `live | expired → filled`), ARCH-13, ARCH-14 (Notifications written here), ARCH-15 (Expired → Filled allowed), S5, S6 (`position_filled` bodies), S10 (`POST /api/me/applications/:id/accept`), S13
- **Tests:** `server/src/business/applications/acceptOffer.test.js` (`FR-A5-4 offer becomes hired with an audit row by the applicant`, `FR-R6-2 posting moves from live to filled in the same transaction and leaves the public list`, `FR-R6-2 posting moves from expired to filled with old_value expired`, `FR-R6-3 every other active application to the posting becomes rejected with reason Position filled`, `FR-R6-3 each rejected applicant receives a position_filled notification referencing their audit row`, `FR-R6-3 the hired applicant's applications to other postings are unchanged`, `FR-R6-3 withdrawn and declined applications are unchanged`, `FR-A5-4 refused unless the stage is offer`, `FR-A5-4 refused on a filled or closed posting`, `FR-A5-3 the hired applicant is not sent a position_filled notification`, `S13 a failure after the posting update rolls everything back`, `NFR-3 another applicant's application is forbidden`)
- **Touches:** `server/src/business/applications/acceptOffer.js`, `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** the actor's Application in `offer` whose Posting's `effective_status` is `live` or `expired`
**When** `POST /api/me/applications/:id/accept` is called
**Then** in one `withTransaction`: the Application becomes `hired` (guarded UPDATE, audit row, actor the Applicant); the Posting transitions to `filled` (from stored `live`, audit `old_value` `live` or `expired`); `rejectAllActiveForPosting` rejects every other Active Application with "Position filled"; one `position_filled` Notification per rejected Applicant is written referencing their audit row; the resource is returned; `GET /api/postings` no longer lists the Posting

**Given** a failure at any step
**When** it occurs
**Then** the transaction rolls back and no Stage, status, audit row, or Notification is written

**Given** an Application not in `offer`, or a Posting already `filled` or `closed`
**When** accepted
**Then** the response is `409 invalid_transition` and nothing changes

### Story 14.3: Decline an offer

As an Applicant with an offer,
I want to decline it,
So that the Application ends as Declined, the Posting stays Live, and the Recruiter is told.

- **Realizes:** FR-A5-5; writes `offer_declined` Notification
- **Obeys:** ARCH-10, ARCH-12 (`offer → declined`), ARCH-13, ARCH-14, S6 ("notifies the Recruiter" is one row per Approved member), S10 (`POST /api/me/applications/:id/decline`)
- **Tests:** `server/src/business/applications/declineOffer.test.js` (`FR-A5-5 offer becomes declined with an audit row`, `FR-A5-5 posting stays live`, `FR-A5-5 every approved recruiter of the organization receives offer_declined`, `FR-A5-5 refused unless the stage is offer`, `FR-A3-3 no new application to the same posting after declining`, `FR-R6-1 a new offer can be extended to another applicant afterward`)
- **Touches:** `server/src/business/applications/declineOffer.js`, `server/src/presentation/routes/me.js`

**Acceptance Criteria:**

**Given** the actor's Application in `offer`
**When** `POST /api/me/applications/:id/decline` is called
**Then** the Stage becomes `declined` with a guarded UPDATE and an audit row, the Posting's status is untouched, and one `offer_declined` Notification is written per Approved member of the Organization; the resource is returned

**Given** any other Stage
**When** declined
**Then** the response is `409 invalid_transition`

### Story 14.4: Offer panel and the end-to-end Notification proof

As an Applicant,
I want an Offer panel on my Application detail with Accept and Decline behind confirmations, and every decision on my Applications to reach my bell,
So that UJ-1's climax and UJ-2's notification step work on screen.

- **Realizes:** FR-A5-3 (end-to-end test that every listed event reaches the Applicant), FR-A5-4, FR-A5-5 (client); UX-DR16 (Offer panel), UX-DR10, UX-DR11
- **Obeys:** ARCH-06 (accept and decline invalidate detail, my applications, unread count), NFR-9
- **Tests:** `client/src/applications/OfferPanel.test.jsx` (`FR-A5-4 Accept offer opens ConfirmDialog and posts; Stepper completes to Hired`, `FR-A5-5 Decline offer (outlined error) opens ConfirmDialog and posts; chip reads Declined`, `FR-A5-4 panel appears only at offer`), `server/src/presentation/routes/notifications.e2e.test.js` (supertest through the real routes: `FR-A5-3 advance creates application_advanced`, `FR-A5-3 reject creates application_rejected with the reason`, `FR-A5-3 offer creates offer_extended`, `FR-A5-3 interview recorded creates interview_recorded`, `FR-A5-3 accept by another applicant creates position_filled for the rest`, `FR-X-3 none of these is visible to any other account`)
- **Touches:** `client/src/applications/OfferPanel.jsx`, `client/src/applications/useOfferDecision.js`, `client/src/applications/ActionSlot.jsx` (one mount line), the e2e test file

**Acceptance Criteria:**

**Given** `/me/applications/:id` at `offer`
**When** rendered
**Then** an Offer panel reads "‹Organization› extended an offer on ‹date›." with a contained Accept offer and an `outlined color="error"` Decline offer, each behind a `ConfirmDialog`; after accepting, the Stepper completes to Hired; after declining, the chip reads Declined and the Stepper freezes at Offer

**Given** the five FR-A5-3 events performed through the API
**When** the Applicant lists Notifications
**Then** each event produced exactly one row for the right recipient with the Stage by stored value and any reason verbatim, and no other Account can list or read it

---

## Epic 15: UC-M3 Manage user accounts and roles

owner:
iteration: 3

An Administrator finds any Account, suspends or reactivates it, and changes its role, while the system protects the Administrator from locking themselves out.

### Story 15.1: List and search Accounts

As an Administrator,
I want to list and search all Accounts by name, email, role, Organization, and status,
So that I can find any Account in seconds.

- **Realizes:** FR-M3-1
- **Obeys:** ARCH-10, ARCH-18 (Organization and Recruiter status joined from `organization_members`), S10 (`GET /api/admin/accounts?q=&role=&organizationId=&status=`)
- **Tests:** `server/src/business/admin/listAccounts.test.js` (`FR-M3-1 lists accounts with name, email, role, organization, status, recruiter status`, `FR-M3-1 q matches name or email case-insensitively`, `FR-M3-1 filters by role, organization, and status`, `FR-M3-1 paginates`)
- **Touches:** `server/src/business/admin/listAccounts.js`, `server/src/persistence/accountRepository.js` (add `search`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** `GET /api/admin/accounts` with any combination of `q`, `role`, `organizationId`, `status`
**When** called by an Administrator
**Then** the S10 envelope lists Accounts with `id`, `email`, `name` (profile full name or none), `role`, `status`, `organization: { id, name } | null`, `recruiterStatus | null`, `createdAt`, filtered by AND and sorted by `created_at desc` by default

### Story 15.2: Suspend and reactivate an Account

As an Administrator,
I want to suspend an Account with a reason so it cannot log in and its session dies on its next request, and to reactivate it later,
So that I can act on abuse without deleting anything.

- **Realizes:** FR-M3-2, FR-M3-3, FR-M3-5 (self-suspension refused)
- **Obeys:** ARCH-08 (every request reloads the Account, so suspension bites on the next request), ARCH-13, ARCH-19 (reason only in audit), S7 and S12 (`401 account_suspended`, session destroyed), S10 (`POST /api/admin/accounts/:id/suspend`, `POST …/reactivate`)
- **Tests:** `server/src/business/admin/suspendAccount.test.js` (`FR-M3-2 active becomes suspended with reason in the audit row`, `FR-M3-2 requires a reason`, `FR-M3-2 suspended account cannot log in`, `FR-M3-2 an existing session is refused with account_suspended on its next request and destroyed`, `FR-M3-5 administrator cannot suspend their own account`, `FR-M3-2 already suspended is invalid_transition`), `server/src/business/admin/reactivateAccount.test.js` (`FR-M3-3 suspended becomes active with an audit row`, `FR-M3-3 reactivated account can log in`, `FR-M3-3 active account is invalid_transition`)
- **Touches:** `server/src/business/admin/suspendAccount.js`, `reactivateAccount.js`, `server/src/business/domain/accountStatus.js` (`active ↔ suspended`), `server/src/persistence/accountRepository.js` (add `transition`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** an Active Account other than the actor's
**When** `POST /api/admin/accounts/:id/suspend` is called with a non-empty `reason`
**Then** the status becomes `suspended` with a guarded UPDATE and an audit row carrying the reason; a login attempt returns `401 unauthenticated` with the generic message `[ASSUMPTION: login does not reveal suspension]`, and the Account's next request on an existing session returns `401 account_suspended` and destroys the session

**Given** the actor's own Account
**When** suspended
**Then** the response is `409 rule_violation` ("You cannot suspend your own account") and nothing changes

**Given** a Suspended Account
**When** `POST …/reactivate` is called
**Then** it becomes `active` with an audit row and can log in again

### Story 15.3: Change an Account's role

As an Administrator,
I want to change an Account's role among Applicant, Recruiter (with an Organization), and Administrator,
So that people can be reassigned without new Accounts, while I cannot demote myself.

- **Realizes:** FR-M3-4, FR-M3-5 (self role change refused), FR-X-5 (the only way besides the seed to make an Administrator)
- **Obeys:** ARCH-08 (role change bites on the next request), ARCH-13 (audit rows for `account.role` and for any membership created or removed), ARCH-18 (Organization only on `organization_members`; `[ASSUMPTION]` making an Account a Recruiter inserts an `approved` membership for the given Organization; leaving the Recruiter role marks the membership `rejected` rather than deleting it so audit and `entity_id` stay valid; an Applicant profile is created when becoming an Applicant and kept otherwise), S10 (`POST /api/admin/accounts/:id/role` with `{ role, organizationId? }`)
- **Tests:** `server/src/business/admin/changeRole.test.js` (`FR-M3-4 applicant becomes recruiter with an approved membership for the organization`, `FR-M3-4 recruiter becomes applicant and the membership is closed`, `FR-M3-4 applicant becomes administrator`, `FR-M3-4 recruiter role requires an approved organization`, `FR-M3-4 writes an audit row for the role and one per membership change`, `FR-M3-4 the new role applies on the account's next request`, `FR-M3-5 administrator cannot change their own role`, `FR-X-5 administrator created here is the only path besides the seed`)
- **Touches:** `server/src/business/admin/changeRole.js`, `server/src/persistence/accountRepository.js` (add `setRole`), `server/src/persistence/membershipRepository.js` (add `insertApproved`, `closeForAccount`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** an Account other than the actor's and a target role
**When** `POST /api/admin/accounts/:id/role` is called
**Then** in one transaction `accounts.role` changes with an audit row (`field = 'role'`), a target of `recruiter` requires an Approved `organizationId` and inserts an `approved` membership (audit row), leaving `recruiter` closes the membership (audit row), a target of `applicant` ensures a profile row exists, and the Account's next request carries the new `req.actor`

**Given** the actor's own Account
**When** its role is changed
**Then** the response is `409 rule_violation` and nothing changes

### Story 15.4: Accounts page

As an Administrator,
I want an Accounts page with search and filters, and per-row Suspend (with reason), Reactivate, and Change role actions,
So that account management is one screen.

- **Realizes:** FR-M3-1, FR-M3-2, FR-M3-3, FR-M3-4, FR-M3-5 (client); UX-DR23 (Accounts), UX-DR8, UX-DR9, UX-DR6
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/admin/AccountsPage.test.jsx` (`FR-M3-1 FilterBar with q, role, organization, status in the URL`, `FR-M3-2 Suspend opens ReasonDialog and posts`, `FR-M3-3 Reactivate one click`, `FR-M3-4 Change role Dialog shows an Organization select only for recruiter`, `FR-M3-5 own row has no Suspend or Change role`, `UX-DR6 cards at 375px`)
- **Touches:** `client/src/pages/admin/AccountsPage.jsx`, `client/src/admin/AccountRowActions.jsx`, `client/src/admin/ChangeRoleDialog.jsx`, `client/src/admin/useAccounts.js`

**Acceptance Criteria:**

**Given** `/admin/accounts`
**When** it loads
**Then** it shows `h1` "Accounts", a `FilterBar` (Search, Role, Organization, Status) bound to the URL, and a dense `ResponsiveTable` with Name, Email, Role, Organization, Status (`StatusChip`), and actions: Suspend (`ReasonDialog`), Reactivate, Change role (Dialog with a Role select and an Organization select shown only for Recruiter); the Administrator's own row offers none of these

---

## Epic 16: UC-M4 Maintain business rules, reference data, and an oversight view

owner:
iteration: 3

An Administrator tunes the Application Cap, reference data, and Stage labels, watches platform counts, and opens any record with its change history.

### Story 16.1: Set the Application Cap

As an Administrator,
I want to set the Application Cap to any whole number from 1 to 20,
So that the next submission obeys it while existing Applications are untouched.

- **Realizes:** FR-M4-1 (Story 8.2's test asserts the submit side)
- **Obeys:** ARCH-13 (audit row `entity_type = 'setting'`, `field = 'value'`), ARCH-18 (cap lives in `settings`, changed only here), S2, S5, S11 (never config), S10 (`GET /api/admin/settings`, `PATCH /api/admin/settings` with `{ applicationCap }`)
- **Tests:** `server/src/business/admin/updateSettings.test.js` (`FR-M4-1 sets the cap within 1 to 20 with an audit row recording old and new value`, `FR-M4-1 refuses 0, 21, and non-integers`, `FR-M4-1 existing applications are unchanged`, `FR-M4-1 the next submission reads the new cap`), `server/src/business/admin/getSettings.test.js`
- **Touches:** `server/src/business/admin/updateSettings.js`, `getSettings.js`, `server/src/persistence/settingsRepository.js` (add `set`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** `PATCH /api/admin/settings` with `applicationCap` between 1 and 20 inclusive
**When** called by an Administrator
**Then** the `settings` row is updated in a transaction with an audit row (`old_value` the previous cap, `new_value` the new one), the settings object is returned, and an Applicant at the old cap can or cannot submit accordingly on their next attempt

**Given** a value outside 1 to 20 or not an integer
**When** submitted
**Then** the response is `400 validation_failed` naming `applicationCap`

### Story 16.2: Maintain categories, locations, and Stage labels

As an Administrator,
I want to add, rename, and retire categories and locations, and edit the display label of each Stage,
So that reference data stays current without breaking existing Postings or the fixed pipeline.

- **Realizes:** FR-M4-2, FR-M4-3 (Story 2.1's reference read and Story 3.1's validation assert the consumer side)
- **Obeys:** ARCH-13 (audit rows with `entity_type` `category`, `location`, `stage_label`), ARCH-18 (retire, never delete; the Stage enum never changes), S2, S5, S10 (`POST /api/admin/categories`, `PATCH /api/admin/categories/:id` with `{ name?, active? }`, same for locations; `PATCH /api/admin/stage-labels/:stage` with `{ label }`)
- **Tests:** `server/src/business/admin/updateReferenceData.test.js` (`FR-M4-2 adds a category and a location with audit rows`, `FR-M4-2 renames with an audit row`, `FR-M4-2 retires and the value disappears from the public reference list`, `FR-M4-2 a retired value stays on an existing posting`, `FR-M4-2 a retired value is refused on a new posting`, `FR-M4-2 refuses a duplicate name`, `FR-M4-2 no delete route exists`), `server/src/business/admin/updateStageLabels.test.js` (`FR-M4-3 edits the label of a stage with an audit row`, `FR-M4-3 refuses an unknown stage`, `FR-M4-3 the number and order of stages is unchanged`, `FR-M4-3 the public reference list returns the new label`)
- **Touches:** `server/src/business/admin/updateReferenceData.js`, `updateStageLabels.js`, `server/src/persistence/referenceRepository.js` (add `insert`, `update`, `setStageLabel`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** the category and location routes
**When** an Administrator adds, renames, or sets `active: false`
**Then** the row changes with an audit row per change; retired values vanish from `GET /api/reference` yet remain on existing Postings and are refused by `createPosting`; no `DELETE` route exists

**Given** `PATCH /api/admin/stage-labels/:stage` for an S1 stage
**When** called with a non-empty `label`
**Then** the label changes with an audit row and the client's `StageChip` and `PipelineStepper` show it on next load; an unknown stage is `404 not_found`

### Story 16.3: Oversight counts and read-only record view with history

As an Administrator,
I want an oversight endpoint with counts of Accounts by role and status, Postings by status, Applications by Stage, and each queue's length, and a way to open any Posting, Application, or Account read-only with its change history and actor,
So that I can see the platform's state and follow any record's trail.

- **Realizes:** FR-M4-4, FR-M4-5 (the Administrator resume download is Story 10.2's admin path)
- **Obeys:** ARCH-15 (Posting counts use `effective_status`, so `expired` is a bucket), ARCH-19 (Administrators see the actor), S5, S10 (`GET /api/admin/oversight`, `GET /api/admin/records/:type/:id` with `type` in `posting`, `application`, `account`)
- **Tests:** `server/src/business/admin/oversightCounts.test.js` (`FR-M4-4 counts accounts by role and status`, `FR-M4-4 counts postings by effective status including expired`, `FR-M4-4 counts applications by stage`, `FR-M4-4 reports the length of the recruiter request queue and the posting queue`), `server/src/business/admin/viewRecordHistory.test.js` (`FR-M4-5 returns a posting with its status history and actor ids and emails`, `FR-M4-5 returns an application in the S10 detail shape plus actor`, `FR-M4-5 returns an account with role and status history and membership`, `FR-M4-5 unknown type or id is not_found`, `FR-X-4 history includes previous and new values and timestamps`)
- **Touches:** `server/src/business/admin/oversightCounts.js`, `viewRecordHistory.js`, `server/src/persistence/accountRepository.js`, `postingRepository.js`, `applicationRepository.js` (add `countBy…` functions), `server/src/persistence/auditRepository.js` (add `listForEntityWithActor`), `server/src/presentation/routes/admin.js`

**Acceptance Criteria:**

**Given** `GET /api/admin/oversight`
**When** called
**Then** it returns `{ accounts: { byRole: {}, byStatus: {} }, postings: { byEffectiveStatus: {} }, applications: { byStage: {} }, queues: { recruiterRequests: n, postings: n } }` computed by the database with every S1 value present, zero when empty

**Given** `GET /api/admin/records/:type/:id`
**When** called for `posting`, `application`, or `account`
**Then** it returns the record read-only and `history` from `audit_events` ordered by `created_at, seq` with `at`, `field`, `oldValue`, `newValue`, `reason`, `by` (role), and `actor: { accountId, email }`; the Application variant reuses `findWithHistory`

### Story 16.4: Settings page

As an Administrator,
I want a Settings page with the Application Cap, categories, locations, and Stage labels,
So that UJ-3 step 4 (raising the cap) is one form.

- **Realizes:** FR-M4-1, FR-M4-2, FR-M4-3 (client); UX-DR23 (Settings)
- **Obeys:** ARCH-06 (mutations invalidate reference data so filters and chips update), S9, NFR-9
- **Tests:** `client/src/pages/admin/SettingsPage.test.jsx` (`FR-M4-1 cap field accepts 1 to 20 and saves`, `FR-M4-1 shows validation_failed for 21`, `FR-M4-2 add, rename, retire a category and a location; retired rows show a Retired chip`, `FR-M4-3 edits a stage label inline`, `NFR-9 labels`)
- **Touches:** `client/src/pages/admin/SettingsPage.jsx`, `client/src/admin/CapForm.jsx`, `client/src/admin/ReferenceDataTable.jsx`, `client/src/admin/StageLabelsForm.jsx`, `client/src/admin/useSettings.js`

**Acceptance Criteria:**

**Given** `/admin/settings`
**When** it loads
**Then** it shows `h1` "Settings" with three sections: Application Cap (number field 1 to 20 with helper text and Save), Categories and Locations (two `ResponsiveTable`s with Add, Rename inline, Retire; retired rows show a Retired chip and no delete), and Stage labels (five text fields keyed by stored stage, Save); after any save the reference query and settings refetch

### Story 16.5: Oversight page and read-only record view

As an Administrator,
I want an Oversight page of counts and a Record view page showing any Posting, Application, or Account read-only with its history and actors,
So that the traceability demo (SC-3) has a screen to point at.

- **Realizes:** FR-M4-4, FR-M4-5 (client); UX-DR23 (Oversight, Record view), UX-DR16 (`HistoryTimeline` with `showActor`)
- **Obeys:** ARCH-06, ARCH-07, NFR-8, NFR-9
- **Tests:** `client/src/pages/admin/OversightPage.test.jsx` (`FR-M4-4 renders four count groups and two queue lengths as stat tiles with text labels`), `client/src/pages/admin/RecordPage.test.jsx` (`FR-M4-5 posting variant renders fields and HistoryTimeline with actor`, `FR-M4-5 application variant renders Stepper, profile, Download resume via the admin path, and history`, `FR-M4-5 account variant renders role, status, membership, and history`, `FR-M4-5 not_found alert for a bad id`)
- **Touches:** `client/src/pages/admin/OversightPage.jsx`, `client/src/pages/admin/RecordPage.jsx`, `client/src/admin/useOversight.js`, `client/src/admin/useRecord.js`

**Acceptance Criteria:**

**Given** `/admin/oversight`
**When** it loads
**Then** it shows `h1` "Oversight" and stat tiles for Accounts by role and by status, Postings by effective status, Applications by Stage, and the two queue lengths, each tile a number with a text label (never colour alone)

**Given** `/admin/records/:type/:id`
**When** it loads
**Then** it shows the record's fields read-only, a `PipelineStepper` for an Application, "Resume as submitted [Download]" via `/api/admin/applications/:id/resume`, and `HistoryTimeline` with `showActor` so each row names the acting Account; a bad id renders the `not_found` alert

---

## Coverage Summary

| Epic | Use case | Iteration | Stories | FRs |
| --- | --- | --- | --- | --- |
| 1 | Skeleton | 1 | 10 | FR-X-1..5 |
| 2 | UC-A2 | 1 | 4 | FR-A2-1..3 |
| 3 | UC-R2 | 1 | 5 | FR-R2-1..6 |
| 4 | UC-M1 | 1 | 3 | FR-M1-1..3 |
| 5 | UC-A1 | 2 | 4 | FR-A1-1..3 |
| 6 | UC-R1 | 2 | 3 | FR-R1-1..4 |
| 7 | UC-M2 | 2 | 4 | FR-M2-1..5 |
| 8 | UC-A3 | 2 | 4 | FR-A3-1..5 |
| 9 | UC-A4 | 2 | 4 | FR-A4-1..4 |
| 10 | UC-R3 | 2 | 4 | FR-R3-1..4 |
| 11 | UC-R4 | 2 | 3 | FR-R4-1..4 |
| 12 | UC-R5 | 3 | 2 | FR-R5-1..2 |
| 13 | UC-R6 | 3 | 3 | FR-R6-1 (+ persistence of R6-2, R6-3) |
| 14 | UC-A5 | 3 | 4 | FR-A5-1..5, FR-R6-2, FR-R6-3 |
| 15 | UC-M3 | 3 | 4 | FR-M3-1..5 |
| 16 | UC-M4 | 3 | 5 | FR-M4-1..5 |
| **Total** | | | **66** | **66 FRs** |

UX-DR coverage: UX-DR1..13, 24, 25 → Epic 1 (Stories 1.7, 1.8); UX-DR14, 15 → Stories 2.3, 2.4, 8.4; UX-DR16 → Stories 1.8, 9.3, 9.4, 12.2, 14.4; UX-DR17 → Stories 10.3, 10.4, 11.3, 12.2, 13.3; UX-DR18 → Stories 4.3, 7.4; UX-DR19 → Story 6.3; UX-DR20 → Stories 3.4, 3.5; UX-DR21 → Story 5.4; UX-DR22 → Story 14.1; UX-DR23 → Stories 15.4, 16.4, 16.5. All 25 covered.

NFRs without a dedicated story: NFR-6 (performance at 1,000 Postings and 10,000 Applications) and NFR-8's tester study are verification tasks tracked as NFR issues under Story 1.10, not build stories `[ASSUMPTION]`; the list-serving indexes (Story 1.3) and `pageSize` cap (Story 2.1) are the design provisions for NFR-6.

## Assumptions Register

Choices made in headless mode; reverse any by editing the story.

1. Output at `_bmad-output/planning-artifacts/epics.md` (where `bmad-sprint-planning` looks), not a dated run folder.
2. Epic order is by iteration, then dependency flow; epic numbers are not use-case numbers, so every epic title carries its UC ID.
3. ARCH-20 overrides the workflow's "tables only when needed" principle: the whole schema lands in Story 1.3.
4. The skeleton owns the pure state machines (Story 1.2) and shared presentational components including `PipelineStepper` and `HistoryTimeline` (Story 1.8).
5. Shared files (repositories, factories, composed pages) are extended by each epic through its own functions or component files plus one mount line; business modules are never shared.
6. `applications/acceptOffer` with the fill cascade is Epic 14's (per CAPABILITY-MAP and ARCH-13); FR-R6-2 and FR-R6-3 map there, and Epic 13 owns the persistence half with tests of the same names.
7. FR-A5-3's events are written by the epics that cause them; Epic 14 owns the FR ID and an end-to-end test.
8. Public reference-data read (`GET /api/reference`) is owned by Epic 2; public Approved-Organizations list by Epic 6; `getApplyStatus` by Epic 8; `findWithHistory` by Epic 9; `getSubmittedResume` (both paths) by Epic 10 per S15.
9. FR-M2-4's named tests live at the persistence layer (`postingRepository.expiry.test.js`) plus route tests, since expiry has no business module by ARCH-15.
10. Field edits on a Posting write no audit row; FR-X-4 covers status, Stage, approvals, rejections, and business-rule changes.
11. Request rejection (FR-M1-3) and Posting rejection or close reasons are mandatory but have no 10-character minimum; that minimum is FR-R4-2's.
12. Approving a Posting whose expiry has already passed is refused (spine's deferred rule, resolved in Story 7.1).
13. Recruiter request does not log the requester in; they log in to see the status page.
14. Role change to Recruiter inserts an `approved` membership; leaving the Recruiter role closes the membership as `rejected` rather than deleting it.
15. Login of a Suspended Account returns the generic message; suspension is revealed only to an existing session as `account_suspended`.
16. Validation library: zod for both workspaces (Story 1.1 may swap it with a one-line rationale).
17. Resume cap follows the architecture's 2 MB (`RESUME_MAX_BYTES`) until the team confirms 5 MB (Open Question 2).
18. The Admin Postings tab gains a "Live postings" section for FR-M2-5 since the wireframe shows only the queue.
19. `owner:` is empty on every epic for Monday's meeting; `iteration:` is filled from the brief.

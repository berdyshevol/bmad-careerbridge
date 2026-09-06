---
name: CareerBridge
status: draft
created: 2026-09-05
updated: 2026-09-05
sources:
  - _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05/prd.md
  - _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/SHAPES.md
  - _bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/brief.md
companions: [DESIGN.md, wireframes/wireframes.md]
---

# CareerBridge — Experience Spine

First cut on the fast path for Josh (Design Engineer, UX owner) to react to. Every inference is tagged `[ASSUMPTION A-UX-n]`; push back by number. FR and NFR IDs are the PRD's; stored strings, error codes and routes are the architecture's (S1, S9, S10). This spine and `DESIGN.md` win over the wireframes on conflict.

## Foundation

Responsive single-origin web app: React 19, React Router 7, TanStack Query 5, MUI 7 (`DESIGN.md` names the library and the visual identity). Public and Applicant surfaces are designed mobile-first from 375 px because Maria finds and applies to jobs from a phone; Recruiter and Administrator surfaces are desktop-first tables that still stack to cards at 375 px (NFR-8). Client-side route guards only decide what to render; the server refuses on its own (NFR-1, FR-X-2).

## Information Architecture

One route per screen; scopes mirror the API (S10). Iteration is the use case's.

| Role | Route | Screen | Realizes | Iter |
| --- | --- | --- | --- | --- |
| Public | `/` | Job List with filters | FR-A2-1, FR-A2-3 | 1 |
| Public | `/jobs/:id` | Job Detail + Apply panel | FR-A2-2, FR-A3-1..5 | 1 / 2 |
| Public | `/login` | Log in | FR-X-1 | 1 |
| Public | `/register` | Applicant registration (Applicants only; no Administrator sign-up exists) | FR-A1-1, FR-X-5 | 2 |
| Public | `/recruiters/request` | Recruiter + Organization request | FR-R1-1, FR-R1-2 | 2 |
| Any account | `/notifications` | Notifications, newest first | FR-A5-1, FR-A5-2, FR-X-3 | 1 (delivery) / 3 (page) |
| Applicant | `/me/profile` | Profile and Resume | FR-A1-2, FR-A1-3 | 2 |
| Applicant | `/me/applications` | My Applications | FR-A4-1 | 2 |
| Applicant | `/me/applications/:id` | Application detail: Stepper, history, withdraw, accept/decline | FR-A4-2..4, FR-A5-4, FR-A5-5 | 2 / 3 |
| Recruiter | `/org/status` | Pending or Rejected status page | FR-R1-3 | 2 |
| Recruiter | `/org/profile` | Organization profile | FR-R1-4 | 2 |
| Recruiter | `/org/postings` | My Postings with status and reason | FR-R2-5 | 1 |
| Recruiter | `/org/postings/new`, `/org/postings/:id/edit` | Posting editor (create, edit, submit, delete, close) | FR-R2-1..4, FR-R2-6 | 1 |
| Recruiter | `/org/postings/:id/applications` | Application queue for one Posting | FR-R3-1 | 2 |
| Recruiter | `/org/applications/:id` | Application detail with pipeline actions; shows this Application only, never the Applicant's other Applications or their count | FR-R3-2, FR-R3-4, FR-R4-1..4, FR-R5-1..2, FR-R6-1 | 2 / 3 |
| Admin | `/admin/requests` | Approval queue: Organization and Recruiter requests | FR-M1-1..3 | 1 |
| Admin | `/admin/postings` | Approval queue: Postings; close with reason | FR-M2-1..3, FR-M2-5 | 2 |
| Admin | `/admin/accounts` | Accounts: search, suspend, reactivate, role | FR-M3-1..5 | 3 |
| Admin | `/admin/settings` | Application Cap, categories, locations, Stage labels | FR-M4-1..3 | 3 |
| Admin | `/admin/oversight` | Counts | FR-M4-4 | 3 |
| Admin | `/admin/records/:type/:id` | Read-only record with change history | FR-M4-5 | 3 |

Surface closure: every FR in the PRD lands on one row above; every row is reached by a flow below or by the AppBar. The two Admin queues share one Tabs layout `[ASSUMPTION A-UX-4]`.

## Navigation Model

- **AppBar on every page.** Left: wordmark, links to `/`. Centre or Drawer: role links. Visitor: *Jobs · Log in · Register · For recruiters*. Applicant: *Jobs · My Applications · Profile*. Approved Recruiter: *Jobs · Postings · Organization*. Pending or Rejected Recruiter: *Jobs · Status* only (FR-R1-3). Administrator: *Requests · Postings · Accounts · Settings · Oversight*. Right: bell with unread Badge (logged in only), avatar menu with *Log out* (FR-X-1).
- **Below 900 px** the links collapse into a left Drawer behind a labelled menu button; the bell and avatar stay in the bar.
- **Landing after login** `[ASSUMPTION A-UX-6]`: Applicant to `/me/applications`, Recruiter to `/org/postings` (or `/org/status` when not Approved), Administrator to `/admin/requests`. A visitor who hits *Apply* is sent to `/login?next=/jobs/:id` and returned there.
- **Guards** redirect the wrong role to their landing page. A `401` from the API clears the session and shows `/login` with "Your session ended. Log in again." (S9 handled once in `api.js`).

## Behaviour Rules the FRs Imply

**Stage display (FR-A4-1, FR-A4-2, FR-M4-3).** Every Stage or Posting status is a `StageChip`: label from `stage_labels`, plus an icon and a colour keyed to the stored enum, so an Administrator renaming a label never breaks the icon and colour is never the only indicator (NFR-9).

| Stored stage | Icon | Colour token | Applicant sees on detail | Applicant actions |
| --- | --- | --- | --- | --- |
| `applied` | paper-plane | `stage-active` | Stepper step 1 of 5 current | Withdraw |
| `screening` | magnifier | `stage-active` | Step 2 current | Withdraw |
| `interview` | calendar | `stage-active` | Step 3 current; interview card with date, time, notes, outcome once recorded (A-7) | Withdraw |
| `offer` | star | `stage-offer` | Step 4 current; offer panel | Accept offer · Decline offer |
| `hired` | check | `stage-success` | All 5 steps complete | none |
| `rejected` | x | `stage-danger` | Stepper frozen at last active step; Alert "Rejected: ‹reason verbatim›" | none |
| `withdrawn` | undo | `stage-neutral` | Stepper frozen; chip "Withdrawn" | none |
| `declined` | slash | `stage-neutral` | Stepper frozen at Offer; chip "Declined" | none |

My Applications lists each row as Posting title, Organization, `StageChip`, "changed ‹relative time›" (FR-A4-1). The detail page shows the Stepper, then **History** as a timeline read from audit rows: "‹Stage from› → ‹Stage to› · by recruiter · ‹timestamp›", the reason inline (FR-A4-2). Withdraw is hidden at Offer and in terminal Stages; if the server still refuses, the alert below applies (FR-A4-4).

**Unread count (FR-A5-1).** MUI `Badge` on the bell shows the number from the unread-count query, polled every 30 s `[ASSUMPTION A-UX-1]` and refetched after any mutation. Zero hides the Badge; above 99 shows "99+". Accessible name "Notifications, 3 unread". Opening `/notifications` lists newest first; unread rows are bold with a dot icon; clicking a row marks it read and follows its link (FR-A5-2). Visitors have no bell.

**Refusals (NFR-4, NFR-8).** One `<ErrorAlert>` renders the server message verbatim; the code decides placement. The client hides actions that are invalid for the current Stage but never trusts that (NFR-1).

| Code (S9) | Where | Treatment |
| --- | --- | --- |
| `validation_failed` | any form | Helper text under each field in `details`; focus moves to the first error |
| `application_cap_reached` | Job Detail | Alert "You have 5 of 5 active applications. Withdraw one to apply." with count and cap from `details` (FR-A3-4); Apply stays enabled so the rule is the server's |
| `profile_incomplete` | Job Detail | Alert listing `missing`, button "Complete profile" to `/me/profile` (FR-A3-2) |
| `duplicate_application` | Job Detail | Apply replaced by "You applied on ‹date›" linking to the Application |
| `forbidden` | any | Full-page "You do not have access to this page" with a link home; no record fields rendered (FR-R3-3) |
| `not_found` | Job Detail, links | "This posting is not available"; expired or pending Postings look identical to missing ones to visitors (ARCH-11) |
| `invalid_transition`, `concurrent_change`, `offer_already_open`, `rule_violation` | detail pages | Alert at the top of the action panel with the message; the page refetches so the buttons match the true state |
| `account_suspended`, `unauthenticated` | global | Redirect to `/login` with a one-line reason |
| `internal` | any | "Something went wrong. Try again." with a Retry button |

**Confirmation** `[ASSUMPTION A-UX-2]`: every action that notifies someone or ends a path opens a Dialog (reject with reason field, extend offer, accept, decline, withdraw, close Posting, suspend, reject request). Reason fields enforce the minimum length inline (10 characters, FR-R4-2) and the Dialog's primary button stays disabled until valid. Approvals are one click followed by a Snackbar.

## Voice and Tone

| Do | Don't |
| --- | --- |
| "Rejected: Position filled" (reason verbatim, FR-R4-2) | "Unfortunately your candidacy was not selected" |
| "3 of 5 active applications" | "Quota exceeded" |
| "You do not have access to this page" | "403 Forbidden" |
| "Posting submitted. An administrator will review it." | "Success!" |
| Stage names exactly as the label table says | Synonyms ("In review", "Phone screen") |

## Component Patterns

| Component | Used on | Behaviour |
| --- | --- | --- |
| `StageChip` / `StatusChip` | every list and detail | Icon + label; colour by enum; never colour alone |
| `PipelineStepper` | Application detail (Applicant, Recruiter, Admin) | Five linear steps; terminal state freezes it and adds a chip |
| `HistoryTimeline` | Application, Posting, record view | Audit rows (FR-X-4) oldest first; reasons inline; role, not name, for non-admins (S5); Administrators also see the actor |
| `ReasonDialog` | reject, close, suspend | Multiline reason, min length, primary disabled until valid |
| `ErrorAlert` | everywhere | The single S9 renderer above |
| `FilterBar` | Job List, queues, Accounts | Keyword + selects; state in the URL query so a filtered list is shareable and Back works |
| `ResponsiveTable` | Recruiter and Admin lists | `Table` on ≥ 900 px; one `Card` per row below it, same fields, same actions |
| `EmptyState` | every list | One sentence and at most one action |

## State Patterns

| State | Treatment |
| --- | --- |
| Loading | `Skeleton` rows matching the layout; no spinners over content |
| Empty Job List | "No live postings match. Clear filters." |
| Empty My Applications | "You have not applied yet. Browse jobs." |
| Empty queue (Recruiter or Admin) | "Nothing waiting." |
| Pending Recruiter | `/org/status` card: "Your request for ‹Org› is waiting for review." or "Rejected: ‹reason›" (FR-R1-3) |
| Posting not Live on Recruiter side | Editor shows which fields are frozen (title, category, location, expiry) with a lock icon and helper text (FR-R2-4) |

## Interaction Primitives

Mouse and touch first; no shortcuts beyond browser defaults. Tap targets at least 44 px on the public and Applicant surfaces. Lists paginate (20 per page, S10); no infinite scroll. Dialogs stack one level. Destructive or notifying actions confirm; approvals do not.

## Accessibility Floor (NFR-9)

- Every input has a visible `<label>` (MUI `TextField label`), including filters and the reason fields; placeholders are never labels.
- Every action is a `button` or `a`, reachable by Tab in reading order; Dialogs trap focus and close on Escape; focus returns to the trigger.
- Status and Stage carry text and icon; colour is a third signal. The unread Badge has an accessible name with the number.
- Alerts use `role="alert"`; the Snackbar announces with `aria-live="polite"`.
- Page `<h1>` names the screen; the document title follows.

## Responsive & Platform

| Width | Behaviour |
| --- | --- |
| ≥ 900 px | AppBar links inline; Job Detail is two columns (details left, Apply panel right); Recruiter and Admin lists are tables |
| 600–899 px | Links in Drawer; Job Detail single column, Apply panel first |
| 375–599 px | Everything single column; tables become cards; Filter controls stack; sticky Apply button at the bottom of Job Detail |

Browsers: current Chrome, Firefox, Safari, Edge (NFR-8). No offline, no dark mode this semester.

## Key Flows

Each step names the screen and the FR it realizes. Names are the PRD's seed cast.

### UJ-1 Golden path (Sam, Recruiter at Acme Waco; Maria, Applicant; the Administrator)

1. Administrator opens `/admin/requests`, sees Sam's request with Acme's details, clicks Approve; Snackbar "Approved" (FR-M1-1, FR-M1-2).
2. Sam logs in, lands on `/org/postings`, clicks New posting, fills the editor, saves as Draft, then clicks Submit; status chip turns Pending approval (FR-R2-1, FR-R2-3).
3. Administrator opens `/admin/postings`, opens the Posting in full, clicks Approve; Sam gets a Notification (FR-M2-1, FR-M2-2).
4. Maria, not logged in, opens `/`, filters by "Waco", sees the Posting first (FR-A2-1, FR-A2-3); opens `/jobs/:id` (FR-A2-2).
5. She clicks Apply, is sent to `/register`, registers, and is returned to the Job Detail (FR-A1-1).
6. The Apply panel shows "Complete profile" because no Resume exists; she uploads a PDF on `/me/profile` and returns (FR-A3-2, FR-A1-3).
7. She adds a note and clicks Apply; the panel becomes "You applied today" and the Stage chip reads Applied (FR-A3-1).
8. Sam opens `/org/postings/:id/applications`, sees Maria in the queue (FR-R3-1); opens `/org/applications/:id`, reads the Resume (FR-R3-2); clicks Advance to Screening, then Advance to Interview (FR-R4-1).
9. Sam records the interview date and outcome Passed (FR-R5-1, FR-R5-2), then clicks Extend offer and confirms (FR-R6-1).
10. **Climax.** Maria's bell shows 1. She opens the Notification, follows it to `/me/applications/:id`, sees the Stepper at Offer and clicks Accept offer (FR-A5-1..4). The Stepper completes to Hired; Sam's Posting list shows Filled and the Job List no longer lists it (FR-R6-2). Every other active Applicant to the Posting gets a Notification "rejected: Position filled" and their detail shows the Rejected variant (FR-R6-3).

### UJ-2 Rejection (Devon, Applicant; Sam)

1. Devon applies to the same Posting from `/jobs/:id` (FR-A3-1).
2. Sam opens Devon's Application at `/org/applications/:id`, clicks Reject; the ReasonDialog refuses a 9-character reason and accepts "Role needs two years of Java" (FR-R4-2).
3. Devon's bell shows 1; `/notifications` lists "Your application to ‹title› was rejected: Role needs two years of Java" (FR-A5-3).
4. **Climax.** Devon follows the link to `/me/applications/:id`: chip Rejected, Stepper frozen at Applied, Alert with the reason verbatim, history row with the timestamp (FR-A4-2).

### UJ-3 Proof points (Priya, Recruiter at Bear Staffing; Devon; the Administrator)

1. Priya opens `/org/postings`: only Bear Staffing's Postings; pasting Acme's queue URL renders the full-page "You do not have access" with no data (FR-R3-3).
2. Any visitor's `/` shows neither the Pending Approval nor the expired Acme Posting; opening the expired one by URL gives "This posting is not available" (FR-A2-1, FR-R2-3, FR-M2-4).
3. Devon, holding 5 active Applications, clicks Apply on a sixth; Alert "You have 5 of 5 active applications" (FR-A3-4).
4. Administrator sets the cap to 6 on `/admin/settings` (FR-M4-1).
5. **Climax.** Devon clicks Apply again without reloading; it succeeds, and the hint reads "6 of 6 active applications" `[ASSUMPTION A-UX-3]`.

## Open Items for Josh

- A-UX-1..6 above.
- Whether the Recruiter queue offers inline row actions (advance, reject) or only from the detail page; the wireframe shows inline `[ASSUMPTION A-UX-7]`.
- Whether "Withdraw" needs a reason field; the PRD does not ask for one, so the Dialog has none.

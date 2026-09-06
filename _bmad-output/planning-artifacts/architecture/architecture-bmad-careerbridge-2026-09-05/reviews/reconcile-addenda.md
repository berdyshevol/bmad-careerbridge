---
title: "Reconcile: Architecture Spine vs PRD addendum and Brief addendum"
target: ../ARCHITECTURE-SPINE.md
sources:
  - prds/prd-bmad-careerbridge-2026-09-05/addendum.md
  - briefs/brief-bmad-careerbridge-2026-09-05/addendum.md
  - architecture/.memlog.md (used only to confirm what was adopted during the run)
created: 2026-09-05
verdict: "No critical finding. Four high: the GitHub-Issues traceability chain and the 'tracking' half of the Iteration 1 rationale never reached the spine; FR-X-3 notification delivery is mapped to UC-A5 (Iteration 3) instead of Iteration 1; Iteration 1 seeds only an Administrator although UC-R2 and UC-M1 need Organizations and Recruiters that UC-R1 (Iteration 2) does not yet create; the brief's one hard data constraint (membership table) has no ARCH rule."
---

# Reconcile: spine vs the two addenda

Method: every note, rule, and promise in the two addenda was traced to the ARCH rule, convention, map row, or rationale paragraph that carries it. "Landed" means the spine states it; "silent" means nothing in the spine states it; "contradicted" means the spine states something else. PRD line numbers refer to `prd.md` only where the addendum note depends on the body.

## 1. Trace table

### 1.1 PRD addendum

| # | Addendum note | Spine location | Status |
| --- | --- | --- | --- |
| P1 | Stack: JS end to end, not TypeScript, D-004, verbal approval, rationale due Iteration 1 | Rationale para 1 | Landed |
| P2 | Database: PostgreSQL "proposed, not yet ratified by the team" | ARCH-01 [ADOPTED], rationale para 3 | Landed; ratification recorded only in memlog (Oleg, 2026-09-05), not in the spine or the addendum (see L2) |
| P3 | Testing: Jest backend and frontend | ARCH-05, ARCH-16, Conventions "Tests", rationale para 2 and 4 | Landed |
| P4 | Tracking: GitHub Issues at the team repo | none | **Silent** (memlog line 13 adopted it; spine dropped it) (H1) |
| P5 | Deployment: GCP per course, Render/Railway fallback, Iteration 1 decision | ARCH-16, rationale para 5, Open Question 1 | Landed, with the order inverted (Render primary, Cloud Run alternative, Railway dropped) and approval requested; a declared decision, not a gap (L9) |
| P6 | Expiry: compute on read, optionally persist lazily, nightly job for oversight counts | ARCH-15 (stored status stays `live`; one predicate; oversight counts use it; no audit row) | Landed; lazy persist and nightly job consciously rejected. Two loose ends: the ARCH-13 guard for Expired→Filled/Closed, and FR-M4-5 history never showing Expired (M3) |
| P7 | Resume snapshot: immutable versions, Application references its version; bytes in DB or object storage | ARCH-17 | Landed (bytea chosen; S3 escape hatch in Open Question 2) |
| P8 | Notifications: table read on page load plus light poll; no push/WebSocket; email stretch | ARCH-06 (unread count as one query with refetch interval), ARCH-14, ARCH-18, Deferred (poll interval, email) | Landed; "no push/WebSocket" is implied, never stated (L4) |
| P9 | Audit trail: one transition table (entity, old, new, actor, timestamp, reason) serving Stage history, Posting history, approvals, business-rule changes | ARCH-18 `audit_events`, ARCH-13 (audit row in every state-change transaction) | Landed. Approvals of Recruiter and Organization requests are covered only implicitly because the spine never names where those two statuses live (H4) |
| P10 | Reference Data with `active` flag; Stage labels keyed by fixed enum | ARCH-18, Conventions "Ids, dates, enums" | Landed |
| P11 | Organization membership in its own table (constraint, not suggestion) | ER diagram `ORGANIZATION_MEMBER`; map row UC-R1 "membership table"; Deferred D-005 bullet | **Partially silent**: appears in a diagram and two asides, no ARCH rule with a checkable form (H4) |
| P12 | Session: server-side session with HTTP-only cookie or short token; 8-hour timeout is config | ARCH-08, Conventions "Auth and config" | Landed |
| P13 | Authorization order: role, then Organization ownership (recruiter routes), then record ownership (applicant routes); FR-R3-3 proven by a test against this layer | ARCH-10 (1)(2)(3), ARCH-11 | Landed as a three-layer refinement. Applicant record ownership has no checkable rule parallel to (3); the recruiter pending-status page conflicts with (1) (M2) |
| P14 | A-2 Resume PDF at most 5 MB | ARCH-17: 2 MB, "PRD A-2 said 5 MB; adjusted"; Open Question 2: "the PRD addendum gets a note" | **Contradicted, declared**. The note's destination is named loosely (L1) |
| P15 | A-5 / FR-A3-3 re-apply only after Withdrawn while Live | ARCH-01 partial unique index "one non-withdrawn Application per Applicant and Posting" | Landed; consistent with Rejected and Declined blocking re-apply |
| P16 | A-18 one hire per Posting; at most one open Offer per Posting | ARCH-01 partial unique index (Offer); "one hire" via Posting→Filled | Landed; the hire uniqueness is not an index (L7) |
| P17 | A-19 others auto-rejected "Position filled"; hired Applicant's other Applications unchanged | ARCH-13 cascade text "other Active Applications → Rejected" | Landed; wording can be read as the Applicant's other Applications (L5) |
| P18 | A-20 expiry stops intake only; accepted offer fills an Expired Posting | ARCH-15 "transition inputs" use the predicate | Landed; see M3 |
| P19 | A-22 cap 1 to 20, default 5, Administrator-maintained | ARCH-18 `settings` table; Conventions "default cap are environment values" | Landed; two homes for the default (L6) |
| P20 | A-25 one seeded Administrator | Map row FR-X "seed Administrator" | Landed; but Iteration 1 needs more seed than that (H3) |
| P21 | A-26 8-hour idle timeout | ARCH-08 | Landed |
| P22 | A-27 / NFR-6 2-second pages at 1,000 Postings and 10,000 Applications, 25 users | none | **Silent** (L3) |
| P23 | A-28, A-29 375 px, basic accessibility | ARCH-07 | Landed |
| P24 | A-30 suite on every push | ARCH-16 | Landed |
| P25 | A-31 offers never expire, no rescind | no rescind module in map | Consistent |
| P26 | A-1, A-3, A-4, A-7 to A-17, A-21, A-23, A-24 | not architecture-bearing beyond P10/P15 | No conflict |
| P27 | D-005 option B: FR-R1-2 moves to UC-M5; UC-M1 keeps Organization approval; sixteen use cases | Deferred "Admin model option B": modules under `business/organizations/`, "No ARCH changes expected" | Landed, understated (M4) |
| P28 | Traceability: one GitHub issue per use case with FR checklist; one per NFR needing work | none | **Silent** (H1) |
| P29 | Traceability: FR IDs verbatim in test names | ARCH-04, Conventions "Tests", rationale para 2 | Landed |
| P30 | Traceability: commits reference the issue; issue references the use case; chain shown at Iteration 3 (SC-3) | rationale para 2 says "requirement → design element → code → test is a file path" | **Silent** on issues and commits (H1) |
| P31 | Screen inventory: 5 public, 4 applicant, 7 recruiter, 6 administrator screens | client seed `client/src/ api.js, auth/, pages/, components/` | **Silent**: no page grouping, no route list; recruiter pending-status page not reconciled with ARCH-10 (M2, M6) |
| P32 | Seed cast: Sam/Acme Waco, Maria, Devon, Priya/Bear Staffing, one Administrator | Map row FR-X "seed Administrator" only | **Silent** on the rest of the cast (H3) |
| P33 | Iteration mapping: all FR-X-1 to FR-X-5 in Iteration 1 (auth, RBAC, notification delivery, audit finished before Iteration 2) | no iteration marker anywhere in the spine | **Silent** (M1) |
| P34 | Notification events created by the causing use case | ARCH-13, ARCH-14 | Landed |
| P35 | Notification events delivered by FR-X-3 so UJ-2 is demonstrable at Iteration 2 before UC-A5 | Map: `notifications/listNotifications`, `markRead` sit under UC-A5 (Iteration 3); FR-X row has only `notificationRepository` | **Contradicted** (H2) |
| P36 | Slip order: UC-A4 slips first | Map merges UC-A3 and UC-A4 into one row | Landed nowhere; the merged row hides what slips (M5) |

### 1.2 Brief addendum

| # | Addendum item | Spine location | Status |
| --- | --- | --- | --- |
| B1 | Database rationale: relational data shape; course recommends relational; Iteration 2 data model; MongoDB rejected | Rationale para 3 | Landed (all four points present, plus the three PRD-derived rules) |
| B2 | Stack rationale: one language; verbal approval; supersedes Maven/JUnit; written rationale owed | Rationale para 1 and 2 | Landed |
| B3 | Testing and tracking: Jest as JUnit equivalent; GitHub Issues | Rationale para 4 (Jest only) | **Half landed**: tracking absent (H1) |
| B4 | Deployment: GCP named; Render or Railway fallback; decision deferred to Iteration 1 | Rationale para 5, ARCH-16, Open Question 1 | Landed as a decision (see P5) |
| B5 | D-005 option A: a fifth admin use case could be an audit log | `admin/viewRecordHistory` already under UC-M4 | Consistent |
| B6 | D-005 option B: UC-M5, 5/6/5, gives the privacy rule a natural owner | Deferred bullet | Landed, understated (M4) |
| B7 | Parked multi-organization Recruiter; membership in its own table, not a column | ER diagram, asides | See P11 (H4) |
| B8 | Parked configurable pipelines | ARCH-12 fixed enum modules | Landed |
| B9 | Parked interview scheduling (record fact and outcome only) | `recordInterview`, `recordInterviewOutcome`; Interviews table | Landed |
| B10 | Email notifications and AI features as stretch | Deferred last bullet | Landed |
| B11 | Fixed cap replaced by Administrator-maintained rule, default 5 | ARCH-18 settings | Landed (see L6) |
| B12 | Team capacity: five members, mixed React/Node, one substantial use case per person per iteration after Iteration 1, fifteen is a hard floor, no merging | ARCH-04 (one module per use case, owned), rationale para 1 ("each member must own at least three use cases end to end") | Honoured in the business layer; not in the shared presentation and persistence files that Iteration 2's seven use cases converge on (M5) |
| B13 | Overrun plan: Iteration 3 holds UC-R5 and UC-M3; UC-A4 slips first | none | Silent; map rows merge the candidates (M5) |
| B14 | Demo proof point: change the cap as admin and the rule takes effect | ARCH-18 settings; Conventions "config read once from environment" | Ambiguous whether the cap is read per request or cached (L6) |
| B15 | Demo proof point: follow a requirement ID to use case, code, test | ARCH-04, rationale para 2 | Landed (the issue hop is missing, H1) |
| B16 | Demo: posting auto-closes as filled; second-organization recruiter sees nothing; cap refusal | ARCH-13, ARCH-10, ARCH-01 | Landed |

## 2. Findings

### Critical

None. Nothing in the spine makes an addendum rule unbuildable; the gaps are omissions that would be decided inconsistently by two members, which is exactly what the spine exists to prevent.

### High

**H1. The GitHub-Issues half of traceability never reached the spine, and the Iteration 1 rationale for "tracking" is missing.**
The PRD addendum's convention has three links (issue per use case with FR checklist, FR IDs in test names, commits reference the issue) and SC-3 requires "an issue" in the chain. The spine carries only the test-name link. The brief promised the Iteration 1 documentation would cover "Testing and tracking"; the spine's rationale covers Jest and says nothing about tracking. Memlog line 13 shows GitHub Issues was adopted during the run and lost in distillation.
Suggested edit, Consistency Conventions table, new row:
`| Traceability | One GitHub issue per use case (FR IDs as a checklist in the body) and one per NFR that needs work; every commit message references its issue (\`#nn\`); test names contain the FR ID verbatim. The chain FR → issue → use-case module → test is what SC-3 shows live. |`
Suggested edit, rationale para 2, replace "Traceability: each use case is one business module owned by one student, so requirement → design element → code → test is a file path (SC-3)." with "Traceability and tracking: GitHub Issues in the team repository, one issue per use case listing its FR IDs, with commits referencing the issue; each use case is one business module owned by one student, so requirement → issue → design element → code → test is a file path plus an issue number (SC-3)."

**H2. FR-X-3 notification delivery is mapped to UC-A5 (Iteration 3), contradicting "delivered by FR-X-3" in Iteration 1.**
The addendum's iteration mapping relies on UJ-2 (rejection with reason, applicant sees the notification) being demonstrable at Iteration 2 through FR-X-3. The spine's FR-X row lists only `persistence/notificationRepository`; `notifications/listNotifications` and `markRead` sit under UC-A5, which the PRD tags Iteration 3. With the map as written, nobody owns a read path for Notifications until Iteration 3, so the Iteration 2 demo of UJ-2 has no way to show the notification.
Suggested edit, Capability map: move `notifications/listNotifications` and add `notifications/unreadCount` to the FR-X-1..5 row ("delivery, FR-X-3"); leave `notifications/markRead` and the offer accept/decline modules under UC-A5, and add to the UC-A5 row "adds the Notification pages and read state on top of FR-X-3's delivery". Add to ARCH-06: "the unread-count query and list belong to FR-X-3 and exist from Iteration 1".

**H3. Iteration 1 seeds only an Administrator, but UC-R2 and UC-M1 (both Iteration 1) need Organizations, Recruiter Accounts, and pending requests that UC-R1 (Iteration 2) creates.**
PRD headings: UC-A2, UC-R2, UC-M1 are Iteration 1; UC-R1 (register Organization and Recruiter) is Iteration 2. Without a seed for the cast in the addendum's screen-inventory section (Sam/Acme Waco, Priya/Bear Staffing, Maria, Devon) plus at least one Pending Organization and Recruiter request, UC-R2 cannot create a Posting (no Approved Recruiter exists) and UC-M1 has nothing to approve. The spine's map names only "seed Administrator" (A-25) and `data/…/seeds/` in the tree. Two members would seed differently or one would build a throwaway registration form.
Suggested edit, Capability map FR-X row: replace "seed Administrator" with "`data/seeds/`: the seeded Administrator (A-25) and the PRD §2 cast, Acme Waco with Sam (Approved) and Bear Staffing with Priya (Pending, for UC-M1), Maria and Devon as Applicants; the same seed is the test fixture and the demo data". Add a line under the tree: "`seeds/` is the only source of demo accounts until UC-R1 and UC-A1 ship in Iteration 2."

**H4. The brief's one hard data constraint, membership in its own table, has no ARCH rule; nor does the spine say where Recruiter status and Organization approval status live.**
The PRD addendum calls it "constraint from the brief, not a suggestion"; memlog line 14 adopted it. In the spine it survives as an ER-diagram box, the phrase "membership table" in the UC-R1 row, and a clause in Deferred. ARCH-18 names owners for Application, Interview, Notification, audit, settings, reference data, and labels, but not for Organization, membership, Recruiter status (Pending/Approved/Rejected, which ARCH-10's `actor.recruiterStatus` and UC-M1 depend on), or Organization status (FR-R1-1 creates both "in status Pending Approval"). A member could put `organization_id` and `recruiter_status` on `accounts` without breaking any stated rule.
Suggested edit, add to ARCH-18 (or a new ARCH-19 "Organization membership is a table"): "Membership is `organization_members` (`account_id`, `organization_id`, `status` Pending/Approved/Rejected), never columns on `accounts`; for the semester `account_id` is UNIQUE, so the parked many-to-many (Q-002) is a constraint drop, not a data reinterpretation. An Organization carries its own approval status. `actor.organizationId` and `actor.recruiterStatus` are loaded from this row on each request (ARCH-08). Both statuses change only through UC-M1 modules under ARCH-13. Check: `accounts` has no `organization_id` column."

### Medium

**M1. No iteration marker anywhere in the spine, so "all FR-X in Iteration 1" is not stated.**
The addendum's rule that shared infrastructure finishes before Iteration 2 is the brief's mitigation for the heavy iteration. The spine's Deferred section assigns things to "the scaffold story" without saying which iteration that is. Suggested edit: add an "Iteration" column to the Capability map (from the PRD headings: 1 = A2, R2, M1, FR-X; 2 = A1, A3, A4, R1, R3, R4, M2; 3 = A5, R5, R6, M3, M4) and one sentence under the map: "The scaffold (ARCH-02, 05, 09, 16 pipeline), both ARCH-12 domain modules, the audit trigger, and FR-X-1..5 are Iteration 1; every Iteration 2 use case assumes them."

**M2. ARCH-10 makes Organization scope checkable but leaves applicant record ownership as an unchecked promise, and rule (1) blocks the recruiter pending-status page.**
The addendum's order is role, then Organization ownership for recruiter routes, then record ownership for applicant routes. ARCH-10 (3) gives recruiter queries a mandatory `organizationId` in the `WHERE`; applicant reads (`getMyApplication`, `withdrawApplication`, `markRead`, resume download by owner) rely only on the generic "refuses out-of-scope work itself". Also, (1) requires Approved status for Recruiter routes, but the screen inventory has a recruiter "pending-status page" and "organization profile" that a Pending Recruiter must reach. Suggested edit to (3): "every recruiter-facing repository query takes `organizationId`, and every applicant-facing query takes the applicant `accountId`, as a mandatory parameter placed in the `WHERE` clause, never filtering afterwards". Add to (1): "except the recruiter status and organization-profile routes, which any Recruiter may read".

**M3. Expired postings under ARCH-13's guard and in FR-M4-5 history.**
ARCH-15 keeps the stored status `live` and feeds the state machine an effective status; ARCH-13 guards each update with `WHERE status = <expected from>`. For Expired→Filled (A-20) and Expired→Closed, `assertTransition('expired', 'filled')` passes while the row still says `live`, so the guard must be `status = 'live' AND expires_at <= now()`, and the audit row's old value must be `expired` for FR-M4-5's history to be honest. The spine leaves both to the implementer, and two members will write it two ways. Suggested edit to ARCH-15: "Transitions out of Expired guard on the stored `live` plus the expiry predicate, and their audit row records the old value as `expired`; an Expired Posting that is never filled or closed has no audit row, which FR-M4-5 shows as the expiry date itself."

**M4. The D-005 option B note says "No ARCH changes expected", which understates the effect.**
A company admin is a new role value (ARCH-10 (1) checks role in middleware; Conventions store roles as a CHECK enum) or an `is_admin` flag on `organization_members`; `reviewRecruiterRequest` gains an Organization-scoped variant under ARCH-10 (3); UC-M5 becomes a sixth Recruiter-side owner slot. Suggested edit, replace the Deferred bullet with: "Admin model option B (D-005): adds `is_admin` on `organization_members` (no new role value), middleware accepts it for `/api/organizations/:id/members` routes, FR-R1-2's approval moves to `organizations/reviewMemberRequest` scoped by ARCH-10 (3). ARCH-10 and ARCH-18 gain one clause each; nothing else changes."

**M5. Team capacity: the map merges use cases into shared rows and the shared presentation and persistence files concentrate Iteration 2's seven use cases on two files.**
The brief says one substantial use case per person per iteration, fifteen is a hard floor, and UC-A4 slips first. The map merges UC-A3 with UC-A4, UC-R4 with R5 and R6, and UC-M1 with M2, so ownership and the slip candidate are not visible. In Iteration 2, UC-A3, UC-A4, UC-R3, and UC-R4 all add to `routes/applications.js` and `applicationRepository.js`; ARCH-04 claims merge-conflict prevention only for the business layer. Suggested edits: (a) one map row per use case; (b) add to ARCH-04: "Route files are per use-case area, `routes/<resource>/<useCase>.js`, mounted by `routes/<resource>/index.js`; repository methods are append-only and named for the use case that added them, so two owners never edit the same function." Migrations already carry the timestamp rule.

**M6. The screen inventory has no counterpart in the client seed.**
`client/src/ api.js, auth/, pages/, components/` says nothing about the four role areas or the twenty-two screens. Two members will lay out `pages/` differently. Suggested edit to the tree: `client/src/pages/{public,applicant,recruiter,admin}/` mirroring the PRD addendum's screen inventory, with the sentence "the PRD addendum's screen inventory is the page list until the UX document replaces it; a route per screen, a page component per route".

### Low

**L1. A-2 change note destination.** Open Question 2 says "the PRD addendum gets a note". Be precise: the A-2 row of the PRD addendum table (change "at most 5 MB" to "at most 2 MB (architecture ARCH-17, Neon free-tier storage; team to confirm 2026-09-07)"), PRD body FR-A1-3 (line 54 states 5 MB), and QUESTIONS.md Q-006, which is the customer-facing assumption. Suggested edit to OQ 2: name all three places.

**L2. PostgreSQL ratification.** The PRD addendum says "not yet ratified by the team"; ARCH-01 is [ADOPTED]; memlog line 17 records ratification by Oleg alone. Suggested edit to ARCH-01: append "ratified 2026-09-05 (Oleg); team confirms at the 2026-09-07 meeting", and update the PRD addendum's Database bullet after that meeting.

**L3. NFR-6 / A-27 is bound by no rule.** Two members will decide indexes and pagination independently. Suggested edit, Conventions new row: "Performance (NFR-6): every foreign key and every `status`/`stage` column is indexed in the migration that creates it; list endpoints paginate (default page size in `config.js`); Render cold start is excluded from the 2-second measure."

**L4. "No push or WebSocket" is implied, not stated.** Suggested edit to ARCH-14 rule: append "and no push or WebSocket transport; the client polls (ARCH-06)".

**L5. ARCH-13 cascade wording.** "other Active Applications → Rejected" reads as the Applicant's other Applications (A-19 says those are unchanged). Suggested edit: "other Active Applications to the same Posting → Rejected".

**L6. Two homes for the cap default.** Conventions say "the 8-hour timeout and default cap are environment values"; ARCH-18 says the cap lives in `settings`. The demo proof point "change the cap as admin and show the rule take effect" needs the live value read per request, not cached at boot. Suggested edit to Conventions: "the 8-hour timeout is an environment value; the environment supplies only the seed value of the Application Cap, which `submitApplication` reads from `settings` inside its transaction".

**L7. "One hire per Posting" (A-18) is not an index.** Posting→Filled plus the guard makes a second Hired practically impossible; a partial unique index on `applications(posting_id) WHERE stage = 'hired'` makes it a Postgres rule like the Offer index. Optional addition to ARCH-01.

**L8. Read scope of `audit_events`.** FR-A4-2 has the Applicant read their Stage history and rejection reason from audit rows; FR-M4-5 has the Administrator read any record's history. ARCH-18 states write rules only. Suggested edit: "audit rows are read through `viewRecordHistory` (Administrator, any entity) and `getMyApplication` (Applicant, own Application only); no other reader".

**L9. Deployment order inverted, for the record.** Brief and PRD addendum put GCP first and Render/Railway as fallback; the spine puts Render first with Cloud Run as the alternative and drops Railway. This is a decision the spine is entitled to make and the rationale justifies it and asks approval, so no edit to the spine; the PRD addendum's Deployment bullet should be updated once Dr. Ren answers.

## 3. Items checked and found consistent

Stack rationale (D-004, verbal approval, not TypeScript); database rationale covering all four brief points plus the three PRD-derived rules; Jest as JUnit equivalent; CI on every push (A-30); resume snapshot as immutable versions (A-6); reference data `active` flag and label table; session in Postgres with cookie and configurable 8-hour idle (A-26); fixed pipeline (ARCH-12); interview as a recorded fact and outcome; email and AI as stretch behind ARCH-13; partial unique index consistent with A-5's re-apply rule; declined-offer terminal with Posting staying Live (A-9, no module contradicts); no rescind (A-31); Render warm-up before presentations (NFR-7).

# Reconcile: Architecture Spine vs PRD

**Spine:** `ARCHITECTURE-SPINE.md` (draft, 2026-09-05)
**PRD:** `prds/prd-bmad-careerbridge-2026-09-05/prd.md` (final, 66 FR, 11 NFR) plus `addendum.md` for A-n wording
**Method:** every FR, NFR, the §3 state model, and SC-1..4 checked against ARCH-01..18, the conventions table, the capability map, Deferred, and Open Questions. Status is one of **covered** (an ARCH rule, convention, or map row binds it), **deferred** (spine says so explicitly), or **silent** (nothing in the spine addresses it). A finding is raised only where silence or wording would let two members build incompatibly or would contradict the PRD.

**Verdict:** the spine covers the golden path and the three DB-enforced rules well, but it contradicts FR-A1-3 outright (2 MB vs 5 MB), leaves FR-R4-4 exposed to a wrong reading of ARCH-15, says nothing about NFR-6, and drops a handful of quiet PRD edges (delete Posting, applied-to visibility, notification recipient, self-suspend, cap concurrency).

---

## 1. Coverage table

### §3 State model

| Item | Status | Where | Note |
| --- | --- | --- | --- |
| Account: one role, Active/Suspended | covered | ARCH-08, ARCH-10 actor, map UC-M3 | No transition module for Active/Suspended (see F-06) |
| Recruiter: Pending/Approved/Rejected | covered (weak) | ARCH-10 `recruiterStatus`, ER `ORGANIZATION_MEMBER` | Column home not named; no transition module (F-06) |
| Organization: Pending/Approved/Rejected | covered (weak) | map UC-R1/M1 | Same as above |
| Posting: Draft→Pending→Live→Filled/Expired/Closed; Pending→Rejected; Rejected→Pending; Expired→Filled | covered | ARCH-12 `postingStatus.js`, ARCH-15 | `from` for `assertTransition` must be the *effective* status (F-02) |
| Application: Applied→…→Hired; Rejected/Withdrawn/Declined | covered | ARCH-12 `applicationStage.js` | |
| Active Application definition | covered | ARCH-13 cascade text | Not written as a named predicate; cap and cascade both need it (F-08) |
| Application Cap (default 5) | covered | ARCH-18 `settings`, conventions "default cap" | Two sources named (F-07) |
| Notification, Reference Data | covered | ARCH-18 | |

### Functional requirements

| FR | Status | Where | Note |
| --- | --- | --- | --- |
| FR-A1-1 | covered | map `registerApplicant`, ARCH-08 | Unique email not in the ARCH-01 constraint list (F-16) |
| FR-A1-2 | covered | map `updateProfile`, ER `APPLICANT_PROFILE` | |
| FR-A1-3 | **contradicted** | ARCH-17 caps at 2 MB; PRD says 5 MB | F-01 |
| FR-A2-1 | covered | ARCH-15, map `listLivePostings` | "most recently approved first" needs `approved_at`; silent (F-13) |
| FR-A2-2 | partly silent | map `getPosting`, ARCH-11 | Applicant opening an applied-to Posting of any status: silent (F-04) |
| FR-A2-3 | covered | map `listLivePostings` | Case-insensitive match is story-level; index is NFR-6 (F-03) |
| FR-A3-1 | covered | ARCH-15 apply check, map `submitApplication` | |
| FR-A3-2 | covered | map `submitApplication` | "links to the profile page" needs an error code (F-15) |
| FR-A3-3 | covered | ARCH-01 partial unique index | Index wording correct; Rationale paraphrase wrong (F-05) |
| FR-A3-4 | covered (weak) | ARCH-18 settings, map | Not in any ARCH binds; concurrency and "shows count and cap" silent (F-08, F-15) |
| FR-A3-5 | covered | ARCH-17, ARCH-18 | |
| FR-A4-1 | covered (weak) | map `listMyApplications`, ARCH-18 | "time of last Stage change" vs "never stored a second time" (F-11) |
| FR-A4-2 | covered | ARCH-18 audit read, `INTERVIEW` table | |
| FR-A4-3 | covered | ARCH-12, map `withdrawApplication` | |
| FR-A4-4 | covered | ARCH-12 | |
| FR-A5-1 | covered | ARCH-06 unread query, map | |
| FR-A5-2 | covered | ARCH-18 `read_at`, `entity_type/id` | |
| FR-A5-3 | covered | ARCH-13, ARCH-14 | |
| FR-A5-4 | covered | ARCH-13 cascade, map `acceptOffer` | |
| FR-A5-5 | partly silent | map `declineOffer` | "notifies the Recruiter": which Account? (F-09) |
| FR-R1-1 | covered | map `requestRecruiter`, ER | Account+Organization+membership in one transaction not stated (low) |
| FR-R1-2 | covered | map, membership table | |
| FR-R1-3 | covered | ARCH-10 (1) | Reason read from `audit_events` implied, not stated |
| FR-R1-4 | covered | map `updateOrganization` | |
| FR-R2-1 | covered | map `createPosting`, ARCH-18 `active` flag | |
| FR-R2-2 | **silent on delete** | map has no `deletePosting` | F-10 |
| FR-R2-3 | covered | ARCH-12, map `submitPosting` | |
| FR-R2-4 | covered | map `editPosting` | Field-by-status rule is module-level; fine |
| FR-R2-5 | covered | map `listOrgPostings`, ARCH-15 readers | |
| FR-R2-6 | covered | map `closePosting` | Must refuse on an effectively Expired Posting (F-02) |
| FR-R3-1 | covered | map `listOrgApplications`, ARCH-10 | |
| FR-R3-2 | covered | map `getOrgApplication`, ARCH-17 | |
| FR-R3-3 | covered | ARCH-10, ARCH-11 | |
| FR-R3-4 | covered | ARCH-10 (3) | |
| FR-R4-1 | covered | ARCH-12, map `advanceApplication` | |
| FR-R4-2 | covered | map `rejectApplication`, ARCH-18 `reason` | |
| FR-R4-3 | covered | ARCH-12 | |
| FR-R4-4 | **silent / at risk** | not bound anywhere; ARCH-15 "transition inputs" | F-02 |
| FR-R5-1 | covered | map `recordInterview`, ER `INTERVIEW` | |
| FR-R5-2 | covered | map `recordInterviewOutcome` | |
| FR-R6-1 | covered | ARCH-01 A-18 index, map `extendOffer` | |
| FR-R6-2 | covered | ARCH-13, ARCH-15 | |
| FR-R6-3 | covered | ARCH-13 cascade | |
| FR-M1-1 | covered (weak) | map `reviewRecruiterRequest` | No list module named; map is a seed, acceptable |
| FR-M1-2 | covered | ARCH-13 | No ARCH-12 module for approval statuses (F-06) |
| FR-M1-3 | covered | ARCH-13, ARCH-18 `reason` | |
| FR-M2-1 | covered | map `reviewPosting` | |
| FR-M2-2 | covered | ARCH-12, ARCH-13 | `approved_at` (F-13); recipient (F-09); approving a Posting whose expiry already passed (F-18) |
| FR-M2-3 | covered | ARCH-12, ARCH-13 | |
| FR-M2-4 | covered | ARCH-15 | Expiry writes no audit row: explicit, acceptable |
| FR-M2-5 | covered | map `admin/closePosting` | Recipient (F-09) |
| FR-M3-1 | covered | map `listAccounts` | |
| FR-M3-2 | covered | ARCH-08 reload per request | |
| FR-M3-3 | covered | map `reactivateAccount` | |
| FR-M3-4 | covered (weak) | map `changeRole`, ARCH-08 | Side effects on profile/membership/Applications: silent (F-17) |
| FR-M3-5 | **silent** | — | F-12 |
| FR-M4-1 | covered (weak) | ARCH-18 `settings` | Env default vs table (F-07); 1..20 range placement vs NFR-11 (F-07); "equals" vs ≥ (F-19) |
| FR-M4-2 | covered | ARCH-18 `active` flag | FK-by-id so rename propagates: implied (low) |
| FR-M4-3 | covered | ARCH-18 `stage_labels` | |
| FR-M4-4 | covered | map `oversightCounts`, ARCH-15 | |
| FR-M4-5 | covered | map `viewRecordHistory`, ARCH-18 | Role change audited: implied only (F-20) |
| FR-X-1 | covered | map `login`/`logout`, ARCH-08 | |
| FR-X-2 | covered | ARCH-10 (1), envelope 403 | Anonymous gets 401 not "forbidden"; acceptable, note in envelope row (low) |
| FR-X-3 | covered | ARCH-18 recipient ownership | |
| FR-X-4 | covered | ARCH-13, ARCH-18 trigger | |
| FR-X-5 | covered | map "seed Administrator", `changeRole` | Seed credentials source under ARCH-16 env-only: silent (F-21) |

### Non-functional requirements

| NFR | Status | Where | Note |
| --- | --- | --- | --- |
| NFR-1 | covered | ARCH-10 | |
| NFR-2 | covered | ARCH-08 | |
| NFR-3 | covered | ARCH-17 (Resume), ARCH-10 (3) (profile) | ARCH-17 rule names Resume only; profile implied |
| NFR-4 | covered | ARCH-12, ARCH-13, envelope 409 | DB unique-violation to 409 mapping not stated (F-16) |
| NFR-5 | covered | ARCH-18, ARCH-16, ARCH-08 | |
| NFR-6 | **silent** | — | F-03 |
| NFR-7 | covered | ARCH-16 | |
| NFR-8 | partly covered | ARCH-07 (375 px) | Browser matrix and where the tester result is recorded: silent (F-14) |
| NFR-9 | partly covered | ARCH-07 (labels, keyboard) | "color never the only indicator": silent (F-14) |
| NFR-10 | covered | ARCH-04, ARCH-05, ARCH-16, Tests row | |
| NFR-11 | covered | ARCH-03, ARCH-04 | Tension with ARCH-01 if cap range becomes a CHECK (F-07) |

### Success criteria

| SC | Status | Where | Note |
| --- | --- | --- | --- |
| SC-1 | covered | ARCH-16 | |
| SC-2 | covered | ARCH-10 test, ARCH-15 | Demo needs an Expired Posting; FR-R2-1 forbids past expiry and FR-R2-4 forbids editing it, so only a seed can produce one (F-18) |
| SC-3 | covered | ARCH-04 | |
| SC-4 | covered | ARCH-04 ownership, ARCH-05 | |

---

## 2. Findings

### Critical

None. Nothing in the spine makes a PRD requirement unimplementable; the two contradictions below are fixable with a sentence each.

### High

**F-01 — ARCH-17 contradicts FR-A1-3 (2 MB vs 5 MB).**
The PRD is marked final and FR-A1-3 says "at most 5 MB (A-2)". ARCH-17 sets 2 MB and says the PRD addendum "gets a note". Until the PRD is amended, a test named `FR-A1-3` would assert 2 MB against an FR that says 5 MB, which breaks SC-3's requirement-to-test chain, and the addendum's A-2 row still says 5 MB.
*Suggested edit:* keep 2 MB if the team agrees, but change Open Question 2 from "the PRD addendum gets a note" to a concrete action: "FR-A1-3 and addendum row A-2 are amended to 2 MB before the Iteration 1 submission; until then ARCH-17 is the governing value and the FR-A1-3 test asserts 2 MB with a comment citing this question." Alternatively revert ARCH-17 to 5 MB and lower the file count estimate in Open Question 2 (about 80 files), which still covers the demo.

**F-02 — FR-R4-4 (Expired continues, Filled/Closed refuse) is not bound anywhere and ARCH-15 invites the wrong reading.**
ARCH-15 says "every reader (Job List, apply checks, oversight counts, transition inputs) uses `isEffectivelyLive`". If `advanceApplication` or `extendOffer` treats a false `isEffectivelyLive` as "refuse", Applications to an Expired Posting are blocked, which contradicts FR-R4-4 and A-20 ("expiry stops intake only"). Also, the Posting-status guard on an Application Stage change is a cross-entity rule that `assertTransition(from, to)` in ARCH-12 cannot express, so each of advance, extendOffer, acceptOffer would re-implement it. Related: `closePosting` (FR-R2-6, FR-M2-5) must refuse an effectively Expired Posting (§3 allows Expired to become Filled only), so for Posting transitions `from` passed to `assertTransition` must be the *effective* status while ARCH-13's `WHERE status = <expected>` guard uses the *stored* `live` plus the expiry predicate.
*Suggested edit:* add FR-R4-4 to ARCH-15's binds and append to its rule: "Intake (apply) and listing use `isEffectivelyLive`. Stage changes on an Application never consult expiry: `applicationStage.js` exports `assertPostingAllows(postingStoredStatus, toStage)`, which refuses any Stage other than `rejected` when the stored Posting status is `filled` or `closed` and allows everything on `live` whether or not expired (FR-R4-4). Posting transitions pass the effective status as `from`; the guarded UPDATE adds `AND expires_at > now()` when the expected `from` is `live` and `AND expires_at <= now()` when it is `expired`. The CHECK on `postings.status` does not include `expired`."

**F-03 — NFR-6 is silent.**
The PRD gives numbers (2 s p95 for Job List, Posting detail, FR-A4-1 and FR-R3-1 lists, at 1,000 Postings and 10,000 Applications; 25 concurrent users without errors). The spine names no index, no pagination default, no pool size, no measurement, and several ARCH choices bear directly on it: resumes as `bytea` in the same table space (ARCH-17), Stage history read from `audit_events` (ARCH-18, which FR-A4-1's "time of last Stage change" would join on every list row), a Render free instance and Neon's connection limit (ARCH-16), and keyword search over title and description (FR-A2-3). Two members will otherwise ship one list with `LIMIT 20` and another with none.
*Suggested edit:* add ARCH-19 "Lists are bounded, indexed, and measured at PRD scale": "Every list endpoint is paginated (default and maximum page size in `config.js`) and never selects `resume_files.bytes`. Migrations that create `postings`, `applications`, and `audit_events` also create indexes on `postings(status, expires_at, approved_at)`, `applications(posting_id, stage)`, `applications(applicant_account_id, stage)`, and `audit_events(entity_type, entity_id, created_at)`; keyword search uses ILIKE until measured slow. `seeds/perf.js` inserts 1,000 Postings and 10,000 Applications; a script under `server/scripts/load.js` (autocannon or k6) runs the four NFR-6 pages at 25 concurrent users and prints p95; it is run manually before Iteration 3 and its output is committed. Knex pool `max` is set from the environment to fit Neon's free-tier connection limit." Bind NFR-6, FR-A2-1, FR-A2-3, FR-A4-1, FR-R3-1.

### Medium

**F-04 — FR-A2-2 "an Applicant can also open any Posting they have applied to, whatever its status" is dropped.**
Map row UC-A2 gives `getPosting` governed by ARCH-15 and ARCH-11 only. Read literally, `getPosting` returns effectively Live Postings to visitors and refuses the rest with 403; an Applicant tracking a Filled or Closed Posting from FR-A4-1 would be refused. The visibility predicate has four legs and needs one home.
*Suggested edit:* under ARCH-11 add: "A Posting is visible to a request when it is effectively Live, or the actor is an Approved Recruiter of its Organization, or an Administrator, or an Applicant holding any Application to it (FR-A2-2). `getPosting` takes `actor` (possibly anonymous) and applies exactly this predicate; anything else is 403 for a logged-in actor and 404 for an anonymous one."

**F-05 — Rationale paraphrases the FR-A3-3 index as "one active Application per Applicant per Posting"; ARCH-01 says "one non-withdrawn".**
ARCH-01's wording is right: `UNIQUE (applicant_account_id, posting_id) WHERE stage <> 'withdrawn'` refuses re-apply after Rejected and Declined and allows it after Withdrawn (A-5). It also covers Hired, which the FR does not list but which FR-A3-1's Live check makes unreachable anyway. The Stack Rationale section, which Dr. Ren will read, says "active", and an "active" index (`WHERE stage IN (applied, screening, interview, offer)`) would allow re-apply after rejection, contradicting FR-A3-3.
*Suggested edit:* in the Rationale paragraph on PostgreSQL replace "one active Application per Applicant per Posting" with "one non-withdrawn Application per Applicant per Posting (re-apply is allowed only after withdrawal, FR-A3-3)". Optionally write the two index predicates out in ARCH-01 so nobody has to infer them.

**F-06 — ARCH-12 says "two pure business modules"; the §3 state model has four status enums.**
Account status (Active/Suspended, FR-M3-2/3), Recruiter approval and Organization approval (Pending/Approved/Rejected, FR-M1-2/3) are state changes too. NFR-4 wants every state change validated by the business layer with a readable refusal (approving an already-Approved request, reactivating an Active Account). ARCH-13's `WHERE status = expected` guard prevents the write but yields no message unless someone writes the check. Also, the column that holds the Recruiter status (`accounts` vs `organization_members`) is never named although ARCH-10's `actor.recruiterStatus` reads it.
*Suggested edit:* ARCH-12 rule: "One pure module per status enum under `business/domain/`: `postingStatus.js`, `applicationStage.js`, `accountStatus.js`, `approvalStatus.js` (shared by Organization and Recruiter membership); the last two are two-state maps but follow the same `assertTransition` contract." Add to ARCH-18 or the ER note: "Recruiter approval status lives on `organization_members.status`; Organization approval on `organizations.status`."

**F-07 — Application Cap has two homes and an NFR-11 tension.**
ARCH-18: "the Application Cap lives in a `settings` table". Conventions, Auth and config row: "the 8-hour timeout and default cap are environment values". Nothing says which wins at runtime. Separately, ARCH-01 wants PRD rules "enforced in Postgres, not only in code", and NFR-11's worked example is "a new Application Cap range touches one layer"; a `CHECK (value BETWEEN 1 AND 20)` on `settings` would make a range change touch two layers.
*Suggested edit:* conventions row: "the default cap is an environment value read once by the seed that inserts the `settings` row; at runtime the cap is read only from `settings`." ARCH-18: "The 1..20 range of FR-M4-1 is validated in `admin/updateSettings` only, with no CHECK, so a range change touches one layer (NFR-11)."

**F-08 — FR-A3-4 cap check is not concurrency-safe under the spine's own standard, and "Active Application" is not a named predicate.**
ARCH-13 exists to prevent "double advances under concurrency", but its `WHERE status = expected` guard applies to updates, not to the insert in `submitApplication`. Two simultaneous submissions from one Applicant at count = cap - 1 both pass the count and both insert. Unlikely in a demo, but the spine sets the bar. The count itself, and the FR-R6-3 cascade, both need the same definition of Active; the spine states it only in ARCH-13's prose.
*Suggested edit:* ARCH-13: "`submitApplication` locks the Applicant's profile row (`SELECT … FOR UPDATE`) inside its transaction before counting Active Applications against the cap, so the cap holds under concurrent submits (FR-A3-4)." ARCH-12: "`applicationStage.js` exports `ACTIVE_STAGES = [applied, screening, interview, offer]`; the cap count, the FR-R6-3 cascade, and FR-M4-4 counts use it." Bind FR-A3-4 and FR-M4-1 to ARCH-18.

**F-09 — "notifies the Recruiter" has no recipient rule.**
FR-A5-5, FR-M2-2, FR-M2-3, FR-M2-5 notify "the Recruiter". ARCH-18 owns a Notification by one recipient Account and the ER has Organization owning Posting with no creating Recruiter; FR-R1-2 lets several Recruiters belong to one Organization. One member will notify the Posting's creator, another all Approved Recruiters of the Organization.
*Suggested edit:* ARCH-18: "`postings.created_by_account_id` is non-null. Posting-level events notify every Approved Recruiter of the Posting's Organization at the time of the event; Application-level events (decline) do the same. One Notification row per recipient." (Or "notify the creator only", but pick one.)

**F-10 — FR-R2-2 "edit or delete a Posting" in Draft, Pending Approval, or Rejected: delete is missing.**
The UC-R2 map row has create, edit, submit, close, list. Nothing says whether delete is a hard delete, whether it is audited (FR-X-4 lists status changes, not deletions, but FR-M4-5 wants change history), or what happens to `audit_events` rows that reference the deleted id. Because a Posting in those three statuses has never been Live, it has no Applications and hard delete is safe.
*Suggested edit:* add `postings/deletePosting` to the UC-R2 row and to ARCH-18: "A Posting may be hard-deleted only in Draft, Pending Approval, or Rejected (FR-R2-2), inside a transaction that first writes an `audit_events` row (field `deleted`, old value the status). `audit_events` carries no foreign key to the entity, so history of a deleted Posting survives (FR-M4-5)."

**F-11 — FR-A4-1 "time of the last Stage change" vs ARCH-18 "Stage history … never stored a second time".**
Read strictly, the list must join `audit_events` per row to find the latest Stage timestamp. That is a hidden NFR-6 cost and an easy source of two implementations (one joins, one adds `updated_at` and calls it the Stage time, which is wrong after an interview is recorded).
*Suggested edit:* ARCH-18: "`applications.stage_changed_at` is set in the same transaction as every Stage change and is the value shown by FR-A4-1 and FR-R3-1; it is a cache of the latest `audit_events` row, not a second history."

### Low

**F-12 — FR-M3-5 (refuse self-suspend and self-role-change) is silent.**
It is a one-line rule in `suspendAccount` and `changeRole`, but nothing in the spine or map mentions it, and the map row for UC-M3 is the only place a reader would look. *Suggested edit:* ARCH-10 rule (2): "… refuses out-of-scope work itself, including an Administrator targeting their own Account (FR-M3-5)."

**F-13 — FR-A2-1 sort "most recently approved first" has no column.**
The spine defers "sort of lists beyond FR-A2-1" but never says where the FR-A2-1 sort key comes from; deriving it from `audit_events` on the public list is an NFR-6 cost. *Suggested edit:* ARCH-15 or ARCH-18: "`postings.approved_at` is set by `admin/reviewPosting` and is the FR-A2-1 sort key."

**F-14 — NFR-8 browser matrix and NFR-9 "color is never the only indicator" are silent.**
ARCH-07 covers labels, keyboard, and 375 px. *Suggested edit:* ARCH-07: "Stage and status are always rendered as the text label from `stage_labels` or the enum, with color as an optional addition (NFR-9). Vite `build.target` and a `browserslist` of the current Chrome, Firefox, Safari, and Edge (NFR-8)." Move the jest-axe or `eslint-plugin-jsx-a11y` choice into the Deferred lint item. The three-tester result is recorded in the UX document.

**F-15 — Error envelope cannot carry FR-A3-4's "current count and the cap" or FR-A3-2's profile link.**
`{ error: { code, message } }` has no structured field. *Suggested edit:* conventions row: "optional `details` object per code, e.g. `APPLICATION_CAP_REACHED` carries `{ count, cap }` (FR-A3-4); `PROFILE_INCOMPLETE` carries `{ missing: [...] }` and the client links to the profile page (FR-A3-2)."

**F-16 — DB constraint violations and unique email.**
ARCH-01 lists three DB-enforced rules; FR-A1-1's unique email is not among them, and the envelope does not say that a Postgres unique violation (23505) from the FR-A3-3 or A-18 index is translated to 409 with a readable message (NFR-4). *Suggested edit:* add "unique index on `lower(accounts.email)`" to ARCH-01 and "`persistence/db.js` maps unique violations to `RuleViolationError` (409)" to the envelope row.

**F-17 — FR-M3-4 role change side effects are undecided but not listed as open.**
PRD Open Question 3 covers suspension effects; the spine's Open Questions do not mention what `changeRole` does to `applicant_profiles`, `organization_members`, in-flight Applications, or Live Postings. *Suggested edit:* add Open Question 4 mirroring PRD OQ-3 and state the interim rule: "role-specific rows are kept, never deleted; a former Applicant's Applications stay and keep counting toward the cap."

**F-18 — Expired Posting for the SC-2 demo, and approving a Posting whose expiry has already passed.**
FR-R2-1 requires a future expiry and FR-R2-4 forbids editing it on a Live Posting, so the only way to show FR-M2-4 live is a seeded Posting with a past expiry. Separately, a Posting can sit in Pending Approval past its expiry; approving it makes it Expired on the spot. *Suggested edit:* seeds note: "`seeds/demo.js` includes one Live Posting with a past expiry for the UJ-3 proof"; `admin/reviewPosting` refuses approval when `expires_at <= now()` with a readable message.

**F-19 — FR-M4-1 lowering the cap below an Applicant's current count.**
FR-A3-4 says "already equals the Application Cap"; after the cap is lowered the count can exceed it and "equals" is false. *Suggested edit:* ARCH-18 or the FR-A3-4 test: "refuse when count is greater than or equal to the cap". Flag to the PRD as a wording fix.

**F-20 — Role changes and suspensions as audit rows.**
FR-X-4 lists "status or Stage change, approval, rejection, business-rule change"; a role change is none of these by name, yet FR-M4-5 wants Account history. ARCH-13 binds "all use cases that change status or Stage". *Suggested edit:* ARCH-13 binds: "… or an Account's role (FR-M3-4)".

**F-21 — Seed Administrator credentials under ARCH-16's environment-only rule.**
The map says "seed Administrator" but a seed file with a literal password would violate the spirit of ARCH-16 and the course's no-secrets rule. *Suggested edit:* ARCH-16: "the first Administrator is created by the seed from `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment values (FR-X-5); no credential appears in the repository."

---

## 3. Explicit checks requested

**ARCH-01 partial unique index vs FR-A3-3.** ARCH-01's "one non-withdrawn Application per Applicant and Posting" is the correct predicate: it refuses a second Application while an earlier one is Active, Rejected, or Declined and allows one after Withdrawn (and multiple Withdrawn rows may coexist). The "while the Posting is Live" clause is carried by FR-A3-1's intake check, not the index, which is right. The only defect is the Rationale section's looser "active" paraphrase (F-05).

**Application Cap semantics (FR-A3-4, FR-M4-1) vs ARCH-15/18.** ARCH-18 places the cap in `settings` and ARCH-15 makes `submitApplication` an "apply check" reader; neither binds FR-A3-4 or FR-M4-1, neither names the Active predicate, the conventions table adds an environment "default cap" without saying it is seed-only, the count is not concurrency-safe, and the envelope cannot return count and cap (F-07, F-08, F-15, F-19). "New value applies to every later submission without changing existing Applications" holds automatically because the cap is read at submit time and nothing re-evaluates existing rows.

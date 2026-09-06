# Reconciliation: PRD vs Deliverable 0 / QUESTIONS.md / Problem Statement

Date: 2026-09-05. Read-only extract; the PRD was not edited.

Inputs:
- `inputs/deliverable-0.md` (Q1-Q14 with team answers)
- `inputs/QUESTIONS.md` (Q-001..Q-014, all status "assumption")
- `inputs/group-project-problem-statement.md` (roles, responsibilities, demonstration list, "team is expected to determine" list)

PRD under review: `prd.md` + `addendum.md` (this folder).

Status legend: **covered** = FR(s) implement the team's answer as given; **deviation (confirmed)** = PRD deliberately departs from the D0 answer and says so; **partial** = intent present but a piece is missing; **absent**; **contradicted**.

## 1. Q-001..Q-014 coverage

| ID | Team answer (D0 / QUESTIONS.md) | PRD coverage | Status |
| --- | --- | --- | --- |
| Q-001 | Multi-company job board, LinkedIn-like | §1 Vision; §3 Organization; FR-R1-1 (new Organization per request); FR-A2-2 (Organization name on detail); FR-R3-3 (cross-Organization isolation) | covered |
| Q-002 | One recruiter can belong to multiple organizations: **Yes** | §3 "Recruiter — a user acting for exactly one Organization"; §6 Non-Goals "a Recruiter in more than one Organization"; addendum "Organization membership" note keeps a membership table so many-to-many stays possible later | deviation (confirmed): parked to one Recruiter per Organization. QUESTIONS.md still records "Yes." and should be updated to the parked decision |
| Q-003 | Some pages are public | FR-A2-1, FR-A2-2, FR-A2-3 (any visitor, logged in or not); FR-X-2 names exactly which pages are public (job list, job detail, registration, login); addendum screen inventory "Public" | covered |
| Q-004 | Multiple applications yes; limit of 5 active | FR-A3-4 (refuse at cap, show count and cap); §3 Application Cap "Administrator-maintained, default 5"; FR-M4-1 (Admin sets cap 1-20, A-22); Open Question 2 flags the default for customer confirmation | deviation (confirmed): fixed 5 became admin-maintained cap with default 5 |
| Q-005 | Withdraw yes, edit no | FR-A4-3 (withdraw in Applied/Screening/Interview); FR-A4-4 (refused at Offer or terminal, A-8: decline instead); FR-A3-5 (cannot be edited after submission) | covered; A-8 narrows "withdraw" at Offer to "decline" (FR-A5-4), net effect same for the Applicant |
| Q-006 | One resume | §3 "at most one Resume (PDF)"; FR-A1-3 (upload replaces previous); FR-A3-5 (snapshot at submission, A-6); §6 non-goal multiple resumes/cover letters | covered |
| Q-007 | Applicant sees all stages | FR-A4-1 (current Stage per Application); FR-A4-2 (full Stage history with timestamps, rejection reason, interview date/outcome); FR-A5-2 (Notification on every Stage change) | covered |
| Q-008 | Fixed pipeline | §3 Stage model Applied → Screening → Interview → Offer → Hired (+ Rejected/Withdrawn/Declined); FR-R4-1, FR-R4-3 (no backward/skipped moves); FR-M4-3 (labels only, "without changing the number or order of Stages"); §6 non-goal configurable pipelines | covered |
| Q-009 | Approval step yes; postings expire yes | FR-R2-3 (submit → Pending Approval, hidden until approved); FR-M2-1, FR-M2-2, FR-M2-3 (Admin approve/reject); FR-R2-1 (expiry date required, future); FR-M2-4 (auto Expired, leaves list, refuses new Applications, A-20); FR-R2-5 (resubmit after rejection) | covered |
| Q-010 | Automatic rejection notification yes; reasons recorded and shared yes | FR-R4-2 (mandatory reason >= 10 chars, shown verbatim, A-14); FR-A5-2 (Notification including reason); FR-A4-2 (reason visible on Application); FR-R6-3 (auto-reject "Position filled" with Notification); FR-X-4 (recorded in audit) | covered |
| Q-011 | Enough to record that an interview was scheduled | FR-R5-1 (record scheduled: date, time, notes); FR-R5-2 (record outcome, gates nothing, A-16/A-17); §6 non-goal scheduling/calendar coordination | covered |
| Q-012 | Offer accepted/declined through the system yes; posting auto-closes when filled | FR-R6-1 (extend offer); FR-A5-3 (accept → Hired); FR-A5-4 (decline → Declined, Posting stays Live, A-9); FR-R6-2 (Posting → Filled automatically, A-18); FR-R6-3 (others auto-rejected, A-19) | covered |
| Q-013 | Applicants self-register; recruiter/organization accounts need Administrator approval; admin level open | FR-A1-1 (self-register, no approval); FR-R1-1, FR-R1-2 (requests created Pending Approval); FR-R1-3 (pending/rejected Recruiter sees status page only); FR-M1-1, FR-M1-2, FR-M1-3 (Admin queue, approve, reject with reason); FR-X-5 (no Admin self-registration); Open Question 1 + addendum "Admin model options" keep the admin-level question (D-005) open | covered |
| Q-014 | Recruiters see only applications to their own organization's jobs; cannot see an applicant's applications elsewhere | FR-R3-3 (other Organization's Posting/Application refused, never listed); FR-R3-4 (cannot see other Applications nor their count); NFR-1 (server-side authorization); NFR-3 (profile/Resume readable only by Applicant, Recruiters of applied-to Organizations, Administrators); FR-X-3 (Notifications visible to recipient only) | covered |

No Q is absent or contradicted. Two deliberate deviations (Q-002, Q-004) are confirmed as intentional and documented in the PRD.

## 2. Problem-statement coverage

### 2a. Role responsibilities

| Role | Responsibility | PRD coverage | Status |
| --- | --- | --- | --- |
| Applicant | Maintaining an applicant profile | FR-A1-1, FR-A1-2, FR-A1-3 | covered |
| Applicant | Exploring available opportunities | FR-A2-1, FR-A2-2, FR-A2-3 | covered |
| Applicant | Preparing and submitting applications | FR-A3-1 through FR-A3-5 | covered |
| Applicant | Providing resume or related application materials | FR-A1-3 (Resume PDF), FR-A3-1 (optional note), FR-A3-5 (snapshot) | covered (materials deliberately limited to one Resume + note, per Q-006) |
| Applicant | Tracking recruiting activities and application progress | FR-A4-1, FR-A4-2, FR-A5-1, FR-A5-2 | covered |
| Applicant | Responding to actions that require applicant input | FR-A5-3 (accept offer), FR-A5-4 (decline offer), FR-A4-3 (withdraw), FR-A3-2 (fix profile before applying) | covered; the offer is the only recruiter-initiated action needing Applicant input (interview confirmation excluded by Q-011) |
| Recruiter/HR | Managing employment opportunities | FR-R2-1 through FR-R2-5; FR-R1-4 (org profile) | covered |
| Recruiter/HR | Reviewing applicants and application materials | FR-R3-1, FR-R3-2 | covered |
| Recruiter/HR | Managing the progress of candidates through the recruiting process | FR-R4-1, FR-R4-2, FR-R4-3, FR-R4-4, FR-R6-1 | covered |
| Recruiter/HR | Coordinating recruiting activities such as interviews | FR-R5-1, FR-R5-2 | covered at the "record only" level chosen in Q-011 |
| Recruiter/HR | Recording recruiting decisions | FR-R4-2 (reason), FR-R5-2 (outcome), FR-R6-1 (offer), FR-X-4 (audit of every change) | covered |
| Recruiter/HR | Communicating appropriate outcomes to applicants | FR-A5-2 (Notification per Stage change with reason/offer/interview date), FR-R4-2 (reason verbatim), FR-R6-3 ("Position filled") | covered via system Notifications; no free-form recruiter-to-applicant message (§6 non-goal messaging) |
| Administrator | Managing user accounts and access | FR-M1-1, FR-M1-2, FR-M1-3, FR-M3-1, FR-M3-2, FR-M3-3, FR-M3-5, FR-X-5 | covered |
| Administrator | Managing roles and permissions | FR-M3-4 (role change), FR-X-2 (role-gated operations), FR-X-5 | partial: roles are managed; permissions are fixed per role and the PRD never states that explicitly (see Gap G-6) |
| Administrator | Maintaining system configuration or reference information | FR-M4-1 (Application Cap), FR-M4-2 (categories, locations), FR-M4-3 (Stage labels) | covered |
| Administrator | Supporting appropriate administrative oversight of the system | FR-M4-4 (counts), FR-M1-1 / FR-M2-1 (queues), FR-X-4 (immutable audit record) | partial: audit is recorded (FR-X-4) but no FR lets an Administrator view it, and an Administrator has no FR to inspect or take down a Live Posting or view Applications outside counts (Gaps G-1, G-2) |

### 2b. "The completed system should include sufficient functionality to demonstrate"

| Item | PRD coverage | Status |
| --- | --- | --- |
| Multiple interacting user roles | §2 roles table; UJ-1 (Recruiter → Administrator → Applicant → Recruiter → Applicant); FR-M2-2/3 (Admin → Recruiter), FR-A5-4 (Applicant → Recruiter) | covered |
| Role-based access control | FR-X-2, FR-X-5, FR-R3-3, FR-R3-4, FR-M3-4, NFR-1, NFR-3 | covered |
| Business logic beyond basic CRUD | FR-A3-3 (re-apply rule), FR-A3-4 (cap), FR-R4-3 (pipeline validation), FR-R4-4, FR-R6-2/FR-R6-3 (auto-fill cascade), FR-M2-4 (auto-expiry), FR-M4-1 (rule change applies going forward), NFR-4 | covered |
| Persistent data management | NFR-5 (survives restart, no orphan records), FR-X-4 (audit), FR-A3-5 (Resume snapshot) | covered |
| A coherent recruiting workflow | §3 Posting and Application state models; UJ-1/UJ-2; UC-R2 → UC-M2 → UC-A3 → UC-R4 → UC-R5 → UC-R6 → UC-A5 | covered |
| Appropriate software architecture | NFR-11 (layered), addendum technical decisions and mechanism notes | covered (detail deferred to architecture, as expected) |
| Automated testing | NFR-10, SC-3, addendum traceability convention (test names contain FR ID, CI on push) | covered |
| Deployment as a web application | NFR-7 (public URL at each presentation), addendum Deployment (GCP, Render/Railway fallback) | covered |

### 2c. "Each team is expected to determine"

| Item | PRD coverage | Status |
| --- | --- | --- |
| Detailed functional requirements | §4, 60 FRs across 15 use cases + cross-cutting | covered |
| Nonfunctional requirements | §5 NFR-1..NFR-11 | covered |
| Business rules | Cap (FR-A3-4/FR-M4-1), re-apply (FR-A3-3), pipeline (FR-R4-3), one hire per Posting (FR-R6-2/3), expiry (FR-M2-4), live-edit rule (FR-R2-4), reason minimum (FR-R4-2), self-demotion refused (FR-M3-5) | covered |
| Use cases | 15 use cases named with size and iteration; use-case documents are downstream | covered (at PRD level) |
| Application workflow | §2 journeys, §3 state models | covered |
| Data entities and relationships | §3 glossary names entities and statuses; addendum defers the relational model to Iteration 2; no relationship cardinalities beyond prose | partial, deferred by design |
| Authorization rules | FR-X-2 (per-FR role naming), NFR-1, NFR-3, FR-R3-3/4, FR-X-3; addendum authorization order (role → Organization → record) | partial: no consolidated matrix; several role-object combinations unstated (Gap G-5) |
| User interface behavior | NFR-8, NFR-9, addendum screen inventory; behaviour deferred to UX | partial, deferred by design |
| Appropriate exceptions and failure conditions | Refusals: FR-A3-2/3/4, FR-A4-4, FR-R2-4, FR-R4-3/4, FR-M3-2/5, FR-X-1 generic login failure, NFR-4 | partial: lifecycle collisions and account-level failures not specified (Gaps G-3, G-4, G-7, G-8) |

## 3. Gaps

| ID | Severity | Gap | Suggested fix |
| --- | --- | --- | --- |
| G-1 | medium | FR-X-4 records an immutable audit trail but no FR lets anyone (in particular the Administrator) view it; "administrative oversight" is only counts (FR-M4-4) plus queues. The traceability demo (SC-3, addendum audit note) implies it will be shown. | Add FR-M4-5: "An Administrator can view the audit record of any account, Posting, or Application, filtered by entity and date." |
| G-2 | medium | Administrator cannot act on a Live Posting (inspect, take down) nor see Applications beyond counts; the only Posting oversight is the pre-approval queue (FR-M2-1..3). A bad Posting that slipped through approval has no admin remedy. | Add FR-M2-5: "An Administrator can view any Posting and close a Live Posting with a mandatory reason, which notifies the Recruiter"; or explicitly list this as a non-goal. |
| G-3 | medium | Expiry vs offer collision: FR-R4-4 refuses any Stage change on a non-Live Posting except rejection, but FR-A5-3 (accept → Hired) is a Stage change and FR-R6-2 moves the Posting to Filled, which §3 only allows from Live. Whether an Applicant may accept an offer after the Posting expired (A-20 says "existing Applications continue") is undefined. Same question for FR-A5-4 "leaves the Posting Live" when it is already Expired. | Decide and state: either (a) FR-R4-4 applies to Recruiter moves only and Offer → Hired/Declined stays allowed on an Expired Posting, with Expired → Filled added to the state model; or (b) expiry auto-declines open offers. Add the transition to §3. |
| G-4 | medium | Account suspension side effects unspecified: what happens to a suspended Recruiter's Live Postings and in-flight Applications (do they stay Live with nobody able to advance them?), to a suspended Applicant's Active Applications (still count toward the cap? still visible to Recruiters?), and whether the Organization can be left with zero active Recruiters. Only Open Question 3 (deletion/retention) touches this. | Add one FR under UC-M3 stating the effect of suspension on owned Postings/Applications (e.g. Postings remain Live; Applications remain but Recruiter actions are refused until reactivation), or add it to Open Questions explicitly. |
| G-5 | medium | No consolidated authorization matrix. FR-X-2 gates by the role each FR names, but several combinations are unstated: can an Administrator open an Application or Resume (NFR-3 says readable by Administrators, no FR shows where); can an Applicant see other Applicants' existence on a Posting (implied no, never stated); can a Pending Recruiter browse jobs (FR-R1-3 says status page only, but FR-A2-1 says any visitor). | Add a short role × object matrix (Applicant, Recruiter, Administrator, visitor × Posting, Application, Profile/Resume, Organization, Notification, Reference Data, Audit) to the addendum; resolve the FR-R1-3 vs FR-A2-1 wording. |
| G-6 | low | "Managing roles and permissions" is met only by role reassignment (FR-M3-4); the PRD never states that permissions are fixed per role and not editable. | One sentence in §3 or §6: "Permissions are fixed per role; there is no permission editing this semester." |
| G-7 | low | Organization-level failure conditions absent: a Rejected Organization cannot re-request (only Postings have resubmit, FR-R2-5); duplicate Organization names are not refused; FR-R1-2 says Recruiter requests target an "Approved" Organization but does not say what happens to a second Recruiter request while the first Recruiter+Organization request is still pending. | Add to FR-R1-1: unique Organization name; add to FR-M1-3 or a new FR-R1-5: a rejected requester may submit a corrected request; state that FR-R1-2 lists only Approved Organizations. |
| G-8 | low | Common failure conditions not stated as refusals: Resume upload that is not PDF or exceeds 5 MB (FR-A1-3 states the limit, not the refusal/message), registration with an email already in use (FR-A1-1 implies uniqueness, no refusal sentence), no password reset / forgot-password path (FR-X-1 only covers login/logout). | Add explicit refusal sentences to FR-A1-1 and FR-A1-3 (consistent with NFR-4 "human-readable message"); add password reset as an FR-X-6 or list it as a non-goal in §6. |
| G-9 | low | Recruiter is not notified when a new Application arrives; FR-A5-1 gives every logged-in user a Notification inbox, but the only Recruiter-directed Notifications are FR-M2-2/3 (approval) and FR-A5-4 (decline). Not required by the problem statement, but UJ-1 "reviews applicants in one queue" would benefit. | Optional: extend FR-A3-5 or FR-A5-2 with "and the Posting's Recruiter is notified", or note it as deliberately omitted. |
| G-10 | low | Internal inconsistency: addendum "Session handling" says "The 24-hour idle timeout (A-26)" while NFR-2 and the A-26 table row say 8 hours. | Correct the addendum to 8 hours. |
| G-11 | low | Input drift: QUESTIONS.md still records Q-002 as "Yes" and Q-004 as "limit of 5" although the PRD parked Q-002 and generalized Q-004. The PRD's Open Question 2 references Q-004 but nothing references Q-002. | Update QUESTIONS.md Q-002 (parked to one Organization per Recruiter, A-? or §6) and Q-004 (admin-maintained cap, default 5, A-22) when the 31 assumptions are transferred; add Q-002 to PRD §8 Open Questions or §6 with a pointer to the parked decision. |
| G-12 | low | Data entities and relationships are named only in prose (§3); no cardinalities (Organization 1..* Posting, Applicant 1..0..1 Resume, Application 1..* StageTransition, Notification recipient). Deferred to Iteration 2 by the addendum, which is acceptable, but the PRD does not say which document will own the entity model. | Add one line to §0 or the addendum naming the Iteration 2 data-model deliverable as the owner of entity relationships. |

## 4. Summary

- Q-001..Q-014: 12 covered, 2 deliberate confirmed deviations (Q-002 parked, Q-004 generalized), 0 absent, 0 contradicted.
- Problem statement: all 8 demonstration items covered; 16 of 18 responsibility bullets fully covered, 2 Administrator bullets partial (permissions wording; oversight lacks audit view and Live Posting remedy).
- "Expected to determine": FRs, NFRs, business rules, use cases, workflow covered; authorization rules and exceptions/failure conditions partial (G-3, G-4, G-5, G-7, G-8); data model and UI behaviour deferred by design.

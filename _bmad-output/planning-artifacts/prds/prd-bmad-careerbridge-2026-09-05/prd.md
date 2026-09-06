---
title: "PRD: CareerBridge"
status: draft
created: 2026-09-05
updated: 2026-09-05
---

# PRD: CareerBridge

**Team CareerBridge · CSI 5324 Software Engineering, Baylor, Fall 2026 · Customer: Dr. Ren · Iteration 1 deliverable (draft)**

## 0. Document Purpose

This PRD turns the finalized product brief (`briefs/brief-bmad-careerbridge-2026-09-05/brief.md`) into testable requirements for the Iteration 1 submission and for the team's downstream work (use-case analysis, wireframes, architecture, GitHub Issues). Functional requirements are grouped by the fifteen use cases UC-A1 to UC-M4 and carry stable IDs of the form `FR-<use case>-<n>`; non-functional requirements carry `NFR-<n>`. Each FR is written to be checked by one automated test. Every inference not backed by the brief or Deliverable 0 is tagged inline as `[ASSUMPTION A-n]` and listed in §9 for confirmation. Technical choices live in `addendum.md`, not here.

## 1. Vision

CareerBridge is a multi-company job board for early-career applicants and small employers that have no applicant tracking system. A recruiter posts an opening, an administrator approves it, the public browses it, an applicant applies with one profile and one resume, and the recruiter moves the application through one fixed, fully visible pipeline. Every decision is recorded with a reason and communicated in-app. Both sides see the whole pipeline in one place.

The semester has two outcomes of equal weight. The product outcome is the ten-minute golden path plus a rejection path demonstrated at Iteration 3. The engineering outcome is a traceable process in which every requirement below can be followed live from its ID to a use case, to code, and to the test that covers it.

## 2. Users and Journeys

| Role | Who | What success looks like |
| --- | --- | --- |
| **Applicant** | Student or early-career job seeker | Finds jobs without logging in, applies in minutes, always knows the Stage and the outcome |
| **Recruiter** | Person hiring for one small Organization | Posts once, reviews applicants in one queue, records every decision without losing anyone |
| **Administrator** | Platform operator | Controls who may recruit, what goes live, and the business rules; nothing reaches the public unreviewed |

Journeys are taken verbatim from the brief's demo script and are referenced by FRs below.

- **UJ-1. Golden path: Acme Waco hires Maria.** Sam, the only recruiter at Acme Waco, creates a Posting with an expiry date and submits it (Pending Approval). The Administrator approves it (Live). Maria, a senior at Baylor, finds it in the public job list without logging in, registers as an Applicant, completes her profile, uploads one Resume, and applies. Sam sees the Application in Acme's queue only, advances it Applied → Screening → Interview, records that an interview took place and its outcome, and extends an offer. Maria receives an in-app Notification and accepts. The Posting closes itself as Filled.
- **UJ-2. Rejection with a reason.** Devon applies to the same Posting. Sam rejects the Application with a recorded reason. Devon receives an in-app Notification and can read the reason on the Application page.
- **UJ-3. Proof points shown live.** A recruiter from a second Organization logs in and cannot see Acme's applicants. An Applicant attempts one more Active Application than the Application Cap allows and is refused. The Administrator changes the cap and the new rule takes effect on the next submission.

## 3. Glossary and State Model

Downstream documents use these terms exactly.

- **Organization** — an employer registered on the platform. Status: Pending Approval, Approved, Rejected. Has one or more Recruiters.
- **Recruiter** — a user acting for exactly one Organization. Status: Pending Approval, Approved, Rejected, Suspended.
- **Applicant** — a self-registered user seeking jobs. Owns one profile and at most one Resume.
- **Administrator** — a platform-level user who approves Organizations, Recruiters, and Postings, manages accounts, and maintains Reference Data and the Application Cap.
- **Posting** — a job opening owned by one Organization. Status: Draft → Pending Approval → Live → Filled | Expired | Closed; Pending Approval may also become Rejected.
- **Application** — one Applicant's submission to one Posting. Stage: Applied → Screening → Interview → Offer → Hired; any active Stage may become Rejected or Withdrawn; Offer may become Declined.
- **Active Application** — an Application in Stage Applied, Screening, Interview, or Offer. Hired, Rejected, Withdrawn, and Declined are terminal.
- **Application Cap** — the maximum number of Active Applications one Applicant may hold; a platform business rule maintained by the Administrator, default 5.
- **Resume** — the single PDF file attached to an Applicant's profile.
- **Notification** — an in-app message addressed to one user, created by a system event.
- **Reference Data** — Administrator-maintained lists: job categories, locations, and the display labels of the pipeline Stages.

## 4. Functional Requirements by Use Case

Size and iteration follow the brief. Every action below is refused, with a human-readable message, for any user whose role the sentence does not name (see FR-X-2).

### UC-A1 Register and maintain applicant profile (M, Iteration 2)

- **FR-A1-1** A visitor can self-register as an Applicant with an email that no other account uses and a password, and is logged in on completion without any approval step.
- **FR-A1-2** An Applicant can view and edit their profile: full name, phone, location, headline, education, and a free-text summary. `[ASSUMPTION A-1: this field set]`
- **FR-A1-3** An Applicant can upload exactly one Resume as a PDF of at most 5 MB, and uploading again replaces the previous file. `[ASSUMPTION A-2: PDF only, 5 MB limit]`

### UC-A2 Browse and search open postings (M, Iteration 1)

- **FR-A2-1** Any visitor, logged in or not, can view the job list, which contains only Postings in status Live, newest approval first. Realizes UJ-1.
- **FR-A2-2** Any visitor can open the detail page of a Live Posting and see its title, Organization name, category, location, employment type, description, requirements, and expiry date.
- **FR-A2-3** Any visitor can filter the job list by keyword (matched against title and description), category, and location, alone or combined. `[ASSUMPTION A-3: these three filters, no salary or date filters]`

### UC-A3 Apply to a posting (M, Iteration 2)

- **FR-A3-1** A logged-in Applicant with a complete profile and an uploaded Resume can submit an Application to a Live Posting with an optional note of at most 1,000 characters. Realizes UJ-1. `[ASSUMPTION A-4: optional note instead of a cover letter]`
- **FR-A3-2** The system refuses an Application from an Applicant with no Resume or an incomplete profile and links to the profile page.
- **FR-A3-3** The system refuses a second Application from the same Applicant to the same Posting, including after that Applicant withdrew or was rejected. `[ASSUMPTION A-5: no re-application ever]`
- **FR-A3-4** The system refuses an Application when the Applicant's Active Applications already equal the Application Cap, and shows the current count and the cap. Realizes UJ-3.
- **FR-A3-5** A submitted Application starts in Stage Applied, keeps the Resume exactly as it was at submission, and cannot be edited by the Applicant afterwards. `[ASSUMPTION A-6: resume snapshot at submission, so a later profile upload does not change what the Recruiter sees]`

### UC-A4 Track application status; withdraw (S, Iteration 2)

- **FR-A4-1** An Applicant can list all of their Applications with Posting title, Organization, current Stage, and time of the last Stage change.
- **FR-A4-2** An Applicant can open one Application and see its full Stage history with timestamps, the rejection reason if rejected, and the interview date and outcome if recorded. `[ASSUMPTION A-7: interview outcome is visible to the Applicant]`
- **FR-A4-3** An Applicant can withdraw an Application in Stage Applied, Screening, or Interview, which moves it to Withdrawn and stops it counting toward the Application Cap.
- **FR-A4-4** The system refuses withdrawal of an Application in Stage Offer or in any terminal Stage. `[ASSUMPTION A-8: at Offer the Applicant declines instead of withdrawing]`

### UC-A5 Receive notifications; accept or decline an offer (M, Iteration 3)

- **FR-A5-1** A logged-in user sees an unread-Notification count on every page and can open their Notifications newest first, mark each as read, and follow each to the Application or Posting it concerns.
- **FR-A5-2** An Applicant receives a Notification on every Stage change of their Application, including the rejection reason when rejected, the offer when extended, and the interview date when one is recorded. Realizes UJ-2.
- **FR-A5-3** An Applicant can accept an offer on an Application in Stage Offer, which moves it to Hired. Realizes UJ-1.
- **FR-A5-4** An Applicant can decline an offer, which moves the Application to Declined, leaves the Posting Live, and notifies the Recruiter. `[ASSUMPTION A-9: Declined is terminal and does not close the Posting]`

### UC-R1 Register organization and recruiter; maintain org profile (M, Iteration 2)

- **FR-R1-1** A visitor can request a Recruiter account together with a new Organization (name, description, website, location), and both are created in status Pending Approval.
- **FR-R1-2** A visitor can request a Recruiter account for an existing Approved Organization by selecting it, and the request is created in status Pending Approval. `[ASSUMPTION A-10: second recruiters join through the same admin queue; under admin model option B this moves to a company admin]`
- **FR-R1-3** A Recruiter whose account is Pending Approval or Rejected can log in but sees only a status page with the decision and reason, and no recruiter functions.
- **FR-R1-4** An Approved Recruiter can edit their Organization's description, website, and location but not its name. `[ASSUMPTION A-11: name changes go through the Administrator]`

### UC-R2 Create, edit, and submit a posting; set expiry (M, Iteration 1)

- **FR-R2-1** An Approved Recruiter can create a Posting in status Draft with title, description, requirements, category, location, employment type, and an expiry date that must be in the future. Realizes UJ-1. `[ASSUMPTION A-12: this field set; category and location chosen from Reference Data]`
- **FR-R2-2** A Recruiter can edit or delete a Posting of their own Organization while it is in status Draft or Pending Approval.
- **FR-R2-3** A Recruiter can submit a Draft Posting, which moves it to Pending Approval, and it stays hidden from the public until approved.
- **FR-R2-4** A Recruiter cannot edit a Live Posting but can close it manually, which moves it to Closed and removes it from the job list. `[ASSUMPTION A-13: Live Postings are immutable; a change means close and re-post]`
- **FR-R2-5** A Recruiter can list all of their Organization's Postings with status and, for a Rejected Posting, the Administrator's reason, and can edit and resubmit a Rejected Posting, which returns it to Pending Approval.

### UC-R3 Review applications for own organization only (M, Iteration 2)

- **FR-R3-1** A Recruiter can list the Applications to each Posting of their own Organization, filtered by Stage, showing Applicant name, current Stage, and submission time. Realizes UJ-1.
- **FR-R3-2** A Recruiter can open one Application and see the Applicant's profile, the Resume as submitted, the note, and the Stage history.
- **FR-R3-3** A request by a Recruiter for a Posting or Application of another Organization is refused as forbidden, and such items never appear in any list the Recruiter can see. Realizes UJ-3.
- **FR-R3-4** A Recruiter cannot see an Applicant's Applications to other Organizations, nor how many exist.

### UC-R4 Advance or reject through the fixed pipeline; record reason (L, Iteration 2)

- **FR-R4-1** A Recruiter can advance an Application of their Organization from Applied to Screening and from Screening to Interview. Realizes UJ-1.
- **FR-R4-2** A Recruiter can reject an Application in any active Stage and must enter a reason of at least 10 characters, which is shown verbatim to the Applicant. Realizes UJ-2. `[ASSUMPTION A-14: minimum length and verbatim sharing]`
- **FR-R4-3** The system refuses a backward move, a skipped Stage, and any change to an Application in a terminal Stage.
- **FR-R4-4** The system refuses a new Stage change to an Application whose Posting is no longer Live, except rejection. `[ASSUMPTION A-15: an expired or closed Posting can still be finished by rejecting, not by advancing]`

### UC-R5 Record that an interview was scheduled and its outcome (S, Iteration 3)

- **FR-R5-1** A Recruiter can record, for an Application in Stage Interview, that an interview was scheduled, with date, time, and optional notes. Realizes UJ-1.
- **FR-R5-2** A Recruiter can record the interview outcome as Passed, Failed, or No-show with optional notes. `[ASSUMPTION A-16: three outcome values]`
- **FR-R5-3** The system refuses to extend an offer on an Application until an interview outcome is recorded. `[ASSUMPTION A-17: interview record is a precondition of an offer]`

### UC-R6 Extend an offer; posting auto-closes when filled (M, Iteration 3)

- **FR-R6-1** A Recruiter can extend an offer on an Application in Stage Interview, which moves it to Offer and notifies the Applicant. Realizes UJ-1.
- **FR-R6-2** When an Applicant accepts an offer, the Posting moves to Filled automatically and leaves the job list. Realizes UJ-1. `[ASSUMPTION A-18: one hire per Posting]`
- **FR-R6-3** When a Posting becomes Filled, every other Active Application to it moves to Rejected with the reason "Position filled" and each Applicant is notified, while the hired Applicant's other Applications are unchanged. `[ASSUMPTION A-19]`

### UC-M1 Approve or reject organization and recruiter requests (M, Iteration 1)

- **FR-M1-1** An Administrator can see a queue of Pending Approval Organization and Recruiter requests with the submitted details and request time. Realizes UJ-1.
- **FR-M1-2** An Administrator can approve a request, after which the Recruiter has full recruiter access and a new Organization becomes Approved.
- **FR-M1-3** An Administrator can reject a request with a mandatory reason, which the requester sees on their status page.

### UC-M2 Approve or reject postings; handle expiry (M, Iteration 2)

- **FR-M2-1** An Administrator can see a queue of Pending Approval Postings and open each in full.
- **FR-M2-2** An Administrator can approve a Posting, which moves it to Live, makes it public immediately, and notifies the Recruiter. Realizes UJ-1.
- **FR-M2-3** An Administrator can reject a Posting with a mandatory reason, which moves it to Rejected and notifies the Recruiter with the reason.
- **FR-M2-4** A Live Posting whose expiry date has passed becomes Expired without anyone acting, leaves the job list, and refuses new Applications, while its existing Applications keep their Stage. `[ASSUMPTION A-20: expiry stops intake only; the Recruiter finishes existing candidates]`

### UC-M3 Manage user accounts and roles (M, Iteration 3)

- **FR-M3-1** An Administrator can list and search all accounts by name, email, role, Organization, and status.
- **FR-M3-2** An Administrator can suspend an account with a reason, after which that user cannot log in and any existing session is refused on its next request.
- **FR-M3-3** An Administrator can reactivate a suspended account.
- **FR-M3-4** An Administrator can change an account's role among Applicant, Recruiter (with its Organization), and Administrator. `[ASSUMPTION A-21: "reassign" means role or Organization change]`
- **FR-M3-5** The system refuses an Administrator's attempt to suspend or demote their own account.

### UC-M4 Maintain business rules, reference data, and an oversight view (M, Iteration 3)

- **FR-M4-1** An Administrator can set the Application Cap to any whole number from 1 to 50, and the new value applies to every later submission without changing existing Applications. Realizes UJ-3. `[ASSUMPTION A-22: range 1 to 50]`
- **FR-M4-2** An Administrator can add, rename, and retire job categories and locations, and a retired value stays on existing Postings but cannot be chosen for new ones. `[ASSUMPTION A-23: retire rather than delete]`
- **FR-M4-3** An Administrator can edit the display label of each pipeline Stage without changing the number or order of Stages.
- **FR-M4-4** An Administrator can view an oversight page showing counts of accounts by role and status, Postings by status, Applications by Stage, and the length of each approval queue. `[ASSUMPTION A-24: oversight is counts, not per-record drill-down]`

### Cross-cutting (shared infrastructure, not an owned use case)

- **FR-X-1** Any user can log in with email and password and log out, and a failed login reports one generic failure message.
- **FR-X-2** Every page and operation other than the job list, job detail, registration, and login requires a logged-in user with the role named in the relevant FR, and the system refuses everyone else as forbidden.
- **FR-X-3** Every Notification is delivered in-app only and is visible only to its recipient.
- **FR-X-4** Every status or Stage change, approval, rejection, and business-rule change records the acting user, the timestamp, and the previous and new values, and that record cannot be edited or deleted.
- **FR-X-5** Administrator accounts are created by system setup or by an existing Administrator (FR-M3-4), never by self-registration. `[ASSUMPTION A-25: one seeded Administrator]`

## 5. Non-Functional Requirements

- **NFR-1 Server-side authorization.** Every request is authorized on the server independently of the user interface, so a hand-crafted request for another Organization's data is refused even if the interface never offers it.
- **NFR-2 Credential safety.** Passwords are stored only in a non-reversible form, and a session ends after 24 hours of inactivity. `[ASSUMPTION A-26: 24-hour idle timeout]`
- **NFR-3 Applicant privacy.** An Applicant's profile and Resume are readable only by that Applicant, by Recruiters of Organizations the Applicant applied to, and by Administrators.
- **NFR-4 Integrity of transitions.** Every state change is validated by the business layer, and an invalid change is refused with a human-readable message and leaves data unchanged.
- **NFR-5 Persistence.** All data survives an application restart, and no Application, Posting, or Notification can exist without its owner.
- **NFR-6 Performance.** The job list, job detail, and application list pages respond within 2 seconds with 1,000 Postings and 10,000 Applications stored, and the system serves 25 concurrent users without errors. `[ASSUMPTION A-27: demo-scale numbers]`
- **NFR-7 Availability.** The system is deployed at a public URL and reachable at each iteration presentation; no uptime target applies beyond that.
- **NFR-8 Usability and compatibility.** A first-time user completes each UJ-1 task without training, on the current versions of Chrome, Firefox, Safari, and Edge, at viewport widths down to 375 px. `[ASSUMPTION A-28: mobile-width layout is required, native apps are not]`
- **NFR-9 Accessibility.** Every form field has a visible label, every action is reachable by keyboard, and colour is never the only indicator of a status or Stage. `[ASSUMPTION A-29: no formal WCAG audit this semester]`
- **NFR-10 Testability and traceability.** Every FR is covered by at least one automated test whose name contains the FR ID, and the full suite runs automatically on every push to the shared repository. `[ASSUMPTION A-30: continuous integration on push]`
- **NFR-11 Maintainability.** The system has separate presentation, business logic, persistence, and data layers, so a business-rule change such as a new Application Cap range touches one layer.

## 6. Non-Goals

Not built this semester, per the brief: interview scheduling or calendar coordination; multiple resumes or cover letters; configurable pipelines; a Recruiter in more than one Organization; email or any off-platform notification; AI features of any kind unless all fifteen use cases pass their tests first; payments, salary data, or messaging between users; offer expiry or negotiation. `[ASSUMPTION A-31: offers stay open until accepted, declined, or the Posting closes]`

## 7. Success Criteria

- **SC-1** At the Iteration 3 demonstration, UJ-1 completes in one session of about ten minutes and UJ-2 in about two, on the deployed system. Validates FR-A2-1 through FR-R6-3.
- **SC-2** The three UJ-3 proof points succeed live. Validates FR-R3-3, FR-A3-4, FR-M4-1.
- **SC-3** Every FR ID in this document resolves to a use case, an issue, code, and a passing test. Validates NFR-10.
- **SC-4** Each team member owns at least three use cases from at least two roles, visible in Git history.
- **Counter-metric SC-C1.** The number of use cases and FRs must not grow to look thorough; anything added after Iteration 1 must replace something or be justified against the demo. Counterbalances SC-1 and SC-3.

## 8. Open Questions

1. Admin model: single platform Administrator (option A) or platform plus company admin (option B, D-005). Affects FR-R1-2 and UC-M1. To settle with Dr. Ren in Iteration 1.
2. Default Application Cap of 5 still needs the customer's confirmation (Q-004).
3. Data retention when an account is deleted or suspended: what happens to its Applications, decisions, and audit records.
4. Whether a Recruiter may rescind an offer that the Applicant has not answered, and how long an offer stays open (see A-31).
5. Whether a Posting may have more than one opening (see A-18).
6. Whether interview coordination should be visible to the Applicant at all, or is a recruiter-only record (see A-7).

## 9. Assumptions Index

| ID | Where | Assumption |
| --- | --- | --- |
| A-1 | FR-A1-2 | Applicant profile fields: name, phone, location, headline, education, summary |
| A-2 | FR-A1-3 | Resume is PDF only, at most 5 MB |
| A-3 | FR-A2-3 | Filters are keyword, category, location only |
| A-4 | FR-A3-1 | Optional 1,000-character note replaces a cover letter |
| A-5 | FR-A3-3 | No re-application to the same Posting after withdrawal or rejection |
| A-6 | FR-A3-5 | Resume is snapshotted at submission |
| A-7 | FR-A4-2 | Interview date and outcome are visible to the Applicant |
| A-8 | FR-A4-4 | At Stage Offer the Applicant declines rather than withdraws |
| A-9 | FR-A5-4 | Declined is terminal and leaves the Posting Live |
| A-10 | FR-R1-2 | Additional Recruiters join an existing Organization through the Administrator queue |
| A-11 | FR-R1-4 | Organization name changes require the Administrator |
| A-12 | FR-R2-1 | Posting fields; category and location come from Reference Data |
| A-13 | FR-R2-4 | Live Postings are immutable; a change means close and re-post |
| A-14 | FR-R4-2 | Rejection reason has a 10-character minimum and is shown verbatim |
| A-15 | FR-R4-4 | Applications to a non-Live Posting can only be rejected, not advanced |
| A-16 | FR-R5-2 | Interview outcomes are Passed, Failed, No-show |
| A-17 | FR-R5-3 | A recorded interview outcome is a precondition of an offer |
| A-18 | FR-R6-2 | One hire per Posting |
| A-19 | FR-R6-3 | Other Active Applications are auto-rejected as "Position filled"; the hired Applicant's other Applications are unchanged |
| A-20 | FR-M2-4 | Expiry stops intake only; existing Applications continue |
| A-21 | FR-M3-4 | "Reassign" means changing role or Organization |
| A-22 | FR-M4-1 | Application Cap range is 1 to 50 |
| A-23 | FR-M4-2 | Reference Data is retired, never deleted |
| A-24 | FR-M4-4 | Oversight view is counts only |
| A-25 | FR-X-5 | One Administrator is seeded at setup |
| A-26 | NFR-2 | 24-hour idle session timeout |
| A-27 | NFR-6 | 2-second pages at 1,000 Postings and 10,000 Applications; 25 concurrent users |
| A-28 | NFR-8 | Layout works at 375 px width; no native apps |
| A-29 | NFR-9 | Basic accessibility, no formal WCAG audit |
| A-30 | NFR-10 | Test suite runs automatically on every push |
| A-31 | §6 | Offers do not expire and cannot be rescinded this semester |

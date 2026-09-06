---
title: "PRD: CareerBridge"
status: final
created: 2026-09-05
updated: 2026-09-05
---

# PRD: CareerBridge

**Team CareerBridge · CSI 5324 Software Engineering, Baylor, Fall 2026 · Customer: Dr. Ren · Iteration 1 deliverable**

## 0. Document Purpose

This PRD turns the finalized product brief (`briefs/brief-bmad-careerbridge-2026-09-05/brief.md`) into testable requirements for Iteration 1 and for use-case analysis, wireframes, architecture, and GitHub Issues. Functional requirements are grouped by the fifteen use cases UC-A1 to UC-M4 with stable IDs `FR-<use case>-<n>`; non-functional requirements carry `NFR-<n>`; each is checkable by at least one automated test. Rules taken from Deliverable 0 are marked `(Q-nnn)`. The thirty-one rules the team chose on 2026-09-05 without customer input are marked `(A-n)`, summarized where marked, and tabled with their FR locations in `addendum.md` for transfer to the team's QUESTIONS.md; reversing A-6, A-13, A-18 with A-19, A-20, or A-31 would change more than one FR. Both sets await customer confirmation, and Dr. Ren may correct any of them. Technical choices live in `addendum.md`.

## 1. Vision

Early-career applicants apply through twenty portals and never learn where they stand; small employers with no applicant tracking system lose candidates in a shared inbox. CareerBridge is a multi-company job board for both (Q-001): a recruiter posts, an administrator approves, the public browses, an applicant applies with one profile and one resume, and the recruiter moves the application through one fixed pipeline that both sides see in full. The niche and the semester outcomes are in the brief.

## 2. Users and Journeys

| Role | Who | Success looks like |
| --- | --- | --- |
| **Applicant** | Student or early-career job seeker | Finds jobs without logging in, applies in minutes, always knows the Stage and outcome |
| **Recruiter** | Person hiring for one small Organization | Posts once, reviews applicants in one queue, records every decision |
| **Administrator** | Platform operator | Controls who may recruit, what goes live, and the business rules |

| Journey | Path (from the brief's demo script) |
| --- | --- |
| **UJ-1 Golden path** | The Administrator approves Sam's request for Acme Waco and then Sam's Posting; Maria finds it without logging in, registers, uploads a Resume, applies; Sam advances her to Interview, records the interview, extends an offer; Maria is notified and accepts; the Posting becomes Filled |
| **UJ-2 Rejection** | Devon applies to the same Posting; Sam rejects with a reason; Devon is notified and reads it |
| **UJ-3 Proof points** | Priya (Recruiter, Bear Staffing) cannot see Acme's applicants; Pending Approval and Expired Postings are absent from the Job List; Devon is refused at the Application Cap; the Administrator changes the cap and the next submission obeys it |

## 3. Glossary and State Model

Downstream documents use these terms exactly.

- **Account** — one login (email, password) with exactly one role: Applicant, Recruiter, or Administrator. Status Active or Suspended; a Recruiter Account is additionally Pending Approval, Approved, or Rejected.
- **Organization** — an employer; status Pending Approval, Approved, or Rejected. **Recruiter** — an Account acting for exactly one Organization. **Applicant** — a self-registered Account with one profile and at most one **Resume** (PDF, Q-006). **Administrator** — the platform operator.
- **Posting** — one opening owned by one Organization. Status: Draft → Pending Approval → Live → Filled | Expired | Closed; Pending Approval may become Rejected; Expired may become Filled. **Job List** — the public list of Live Postings.
- **Application** — one Applicant's submission to one Posting. Stage (fixed, Q-008): Applied → Screening → Interview → Offer → Hired; Applied, Screening, and Interview may become Rejected or Withdrawn; Offer may become Declined. **Active Application** — Stage Applied, Screening, Interview, or Offer; the others are terminal.
- **Application Cap** — maximum Active Applications per Applicant; an Administrator-maintained rule, default 5 (Q-004).
- **Notification** — an in-app message to one Account, created by a system event.
- **Reference Data** — Administrator-maintained job categories, locations, and Stage display labels.

## 4. Functional Requirements by Use Case

Headings give size (S/M/L) and first iteration, from the brief. Every action is refused for any Account whose role the FR does not name (FR-X-2); in an FR, "Recruiter" means an Approved Recruiter unless the sentence says otherwise.

### UC-A1 Register and maintain applicant profile (M, Iteration 2)

- **FR-A1-1** A visitor can self-register as an Applicant with an email no other Account uses and a password of at least 8 characters, and is logged in on completion without any approval step (Q-013). Realizes UJ-1.
- **FR-A1-2** An Applicant can view and edit their profile: full name, phone, location, headline, education, and a free-text summary (A-1).
- **FR-A1-3** An Applicant can upload exactly one Resume as a PDF of at most 5 MB, and uploading again replaces the previous file (A-2, Q-006). Realizes UJ-1.

### UC-A2 Browse and search open postings (M, Iteration 1)

- **FR-A2-1** Any visitor, logged in or not, can view the Job List, which contains only Live Postings, most recently approved first (Q-003). Realizes UJ-1, UJ-3.
- **FR-A2-2** Any visitor can open the detail page of a Live Posting and see its title, Organization name, category, location, employment type, description, requirements, and expiry date; an Applicant can also open any Posting they have applied to, whatever its status.
- **FR-A2-3** Any visitor can filter the Job List by keyword (case-insensitive match against title and description), category, and location, alone or combined (A-3).

### UC-A3 Apply to a posting (M, Iteration 2)

- **FR-A3-1** A logged-in Applicant with a full name and an uploaded Resume can submit, with an optional note of at most 1,000 characters, an Application to a Live Posting, which creates the Application in Stage Applied (A-4). Realizes UJ-1.
- **FR-A3-2** The system refuses an Application from an Applicant with no Resume or no full name and links to the profile page.
- **FR-A3-3** The system refuses a second Application from the same Applicant to the same Posting while an earlier one is Active, Rejected, or Declined, but allows a new one after a Withdrawn Application while the Posting is Live (A-5).
- **FR-A3-4** The system refuses an Application when the Applicant's count of Active Applications already equals the Application Cap, and shows the current count and the cap (Q-004). Realizes UJ-3.
- **FR-A3-5** A submitted Application keeps the Resume exactly as it was at submission, and the Applicant cannot edit the Application afterward (A-6, Q-005).

### UC-A4 Track application Stage; withdraw (S, Iteration 2)

- **FR-A4-1** An Applicant can list all of their Applications with Posting title, Organization, current Stage, and time of the last Stage change.
- **FR-A4-2** An Applicant can open one Application and see its full Stage history with timestamps, the rejection reason if rejected, and the interview date and outcome if recorded (A-7, Q-007). Realizes UJ-2.
- **FR-A4-3** An Applicant can withdraw an Application in Stage Applied, Screening, or Interview, which moves it to Withdrawn and stops it counting toward the Application Cap (Q-005).
- **FR-A4-4** The system refuses withdrawal of an Application in Stage Offer or in any terminal Stage (A-8).

### UC-A5 Receive notifications; accept or decline an offer (M, Iteration 3)

- **FR-A5-1** A logged-in Account sees its unread-Notification count on every page and can open its Notifications newest first.
- **FR-A5-2** An Account can mark a Notification as read and follow it to the Application or Posting it concerns.
- **FR-A5-3** An Applicant receives a Notification when a Recruiter advances their Application, rejects it (with the reason), or extends an offer on it, when an interview is recorded, and when the Application is rejected as "Position filled" (Q-010). Realizes UJ-1, UJ-2.
- **FR-A5-4** An Applicant can accept an offer on an Application in Stage Offer, which moves it to Hired (Q-012). Realizes UJ-1.
- **FR-A5-5** An Applicant can decline an offer, which moves the Application to Declined, leaves the Posting Live, and notifies the Recruiter (A-9).

### UC-R1 Register organization and recruiter; maintain org profile (M, Iteration 2)

- **FR-R1-1** A visitor can request a Recruiter Account together with a new Organization (name, description, website, location), and both are created in status Pending Approval (Q-013).
- **FR-R1-2** A visitor can request a Recruiter Account for an existing Approved Organization by selecting it, and the request is created in status Pending Approval (A-10).
- **FR-R1-3** A Recruiter whose Account is Pending Approval or Rejected can log in but sees only a status page (showing the decision and its reason once made) and the public pages.
- **FR-R1-4** An Approved Recruiter can edit their Organization's description, website, and location but not its name (A-11).

### UC-R2 Create, edit, and submit a posting; set expiry (M, Iteration 1)

- **FR-R2-1** An Approved Recruiter can create a Posting in status Draft with title, description, requirements, category and location from Reference Data, employment type (Full-time, Part-time, Internship, Contract), and an expiry date that must be in the future (A-12). Realizes UJ-1.
- **FR-R2-2** A Recruiter can edit or delete a Posting of their own Organization while it is in status Draft, Pending Approval, or Rejected.
- **FR-R2-3** A Recruiter can submit a Draft or Rejected Posting, which moves it to Pending Approval and keeps it hidden from the public until approved (Q-009). Realizes UJ-1, UJ-3.
- **FR-R2-4** A Recruiter can edit the description and requirements of a Live Posting without re-approval and is refused any change to its title, category, location, or expiry date (A-13).
- **FR-R2-5** A Recruiter can list all of their Organization's Postings with status and, for a Rejected Posting, the Administrator's reason.
- **FR-R2-6** A Recruiter can close a Live Posting manually, which moves it to Closed and removes it from the Job List.

### UC-R3 Review applications for own organization only (M, Iteration 2)

- **FR-R3-1** A Recruiter can list the Applications to each Posting of their own Organization, optionally filtered by Stage, showing Applicant name, current Stage, and submission time. Realizes UJ-1.
- **FR-R3-2** A Recruiter can open one Application and see the Applicant's profile, the Resume as submitted, the note, and the Stage history.
- **FR-R3-3** A request by a Recruiter for a Posting or Application of another Organization is refused as forbidden, and such items never appear in any list the Recruiter can see (Q-014). Realizes UJ-3.
- **FR-R3-4** A Recruiter cannot see an Applicant's Applications to other Organizations, nor how many exist (Q-014).

### UC-R4 Advance or reject through the fixed pipeline; record reason (L, Iteration 2)

- **FR-R4-1** A Recruiter can advance an Application of their Organization from Applied to Screening and from Screening to Interview. Realizes UJ-1.
- **FR-R4-2** A Recruiter can reject an Application in Stage Applied, Screening, or Interview and must enter a reason of at least 10 characters; the rejection creates the Applicant's Notification (FR-A5-3), which shows the reason verbatim (A-14, Q-010). Realizes UJ-2.
- **FR-R4-3** The system refuses a backward move, a skipped Stage, and any change to an Application in a terminal Stage.
- **FR-R4-4** The system refuses any Stage change other than rejection on an Application whose Posting is Filled or Closed; Applications to an Expired Posting continue normally (A-15, A-20).

### UC-R5 Record that an interview was scheduled and its outcome (S, Iteration 3)

- **FR-R5-1** A Recruiter can record, for an Application in Stage Interview, that an interview was scheduled, with date, time, and optional notes (Q-011). Realizes UJ-1.
- **FR-R5-2** A Recruiter can record the outcome of a recorded interview as Passed, Failed, or No-show with optional notes; the outcome is information for the Recruiter and Applicant and gates nothing (A-16, A-17).

### UC-R6 Extend an offer; posting auto-closes when filled (M, Iteration 3)

- **FR-R6-1** A Recruiter can extend an offer on an Application in Stage Interview, with or without a recorded interview; the offer moves it to Offer and notifies the Applicant, and at most one Application per Posting may be in Stage Offer at a time (A-17, A-18). Realizes UJ-1.
- **FR-R6-2** When an Applicant accepts an offer, the Posting moves from Live or Expired to Filled automatically and leaves the Job List (A-18, Q-012). Realizes UJ-1.
- **FR-R6-3** When a Posting becomes Filled, every other Active Application to it moves to Rejected with the reason "Position filled" and each Applicant is notified, while the hired Applicant's other Applications are unchanged (A-19).

### UC-M1 Approve or reject organization and recruiter requests (M, Iteration 1)

- **FR-M1-1** An Administrator can see a queue of Pending Approval Organization and Recruiter requests with the submitted details and request time.
- **FR-M1-2** An Administrator can approve a request, after which the Recruiter Account is Approved and, if the request included a new Organization, that Organization becomes Approved (Q-013). Realizes UJ-1.
- **FR-M1-3** An Administrator can reject a request with a mandatory reason, which the requester sees on their status page.

### UC-M2 Approve or reject postings; handle expiry (M, Iteration 2)

- **FR-M2-1** An Administrator can see a queue of Pending Approval Postings and open each in full.
- **FR-M2-2** An Administrator can approve a Posting, which moves it to Live, makes it public immediately, and notifies the Recruiter (Q-009). Realizes UJ-1.
- **FR-M2-3** An Administrator can reject a Posting with a mandatory reason, which moves it to Rejected and notifies the Recruiter with the reason.
- **FR-M2-4** A Live Posting whose expiry date has passed becomes Expired without anyone acting, leaves the Job List, and refuses new Applications, while its existing Applications keep their Stage (A-20, Q-009). Realizes UJ-3.
- **FR-M2-5** An Administrator can close any Live Posting with a mandatory reason, which moves it to Closed and notifies the Recruiter.

### UC-M3 Manage user accounts and roles (M, Iteration 3)

- **FR-M3-1** An Administrator can list and search all Accounts by name, email, role, Organization, and status.
- **FR-M3-2** An Administrator can suspend an Account with a reason, after which that Account cannot log in and any existing session is refused on its next request.
- **FR-M3-3** An Administrator can reactivate a Suspended Account.
- **FR-M3-4** An Administrator can change an Account's role among Applicant, Recruiter (with its Organization), and Administrator (A-21).
- **FR-M3-5** The system refuses an Administrator's attempt to suspend their own Account or change its role.

### UC-M4 Maintain business rules, reference data, and an oversight view (M, Iteration 3)

- **FR-M4-1** An Administrator can set the Application Cap to any whole number from 1 to 20, and the new value applies to every later submission without changing existing Applications (A-22). Realizes UJ-3.
- **FR-M4-2** An Administrator can add, rename, and retire job categories and locations, and a retired value stays on existing Postings but cannot be chosen for new ones (A-23).
- **FR-M4-3** An Administrator can edit the display label of each pipeline Stage without changing the number or order of Stages.
- **FR-M4-4** An Administrator can view an oversight page showing counts of Accounts by role and status, Postings by status, Applications by Stage, and the length of each approval queue (A-24).
- **FR-M4-5** An Administrator can open any Posting, Application, or Account read-only, with its change history (FR-X-4).

### Cross-cutting (shared infrastructure, Iteration 1, not an owned use case)

- **FR-X-1** Any Account can log in with email and password and log out, and a failed login reports one generic failure message.
- **FR-X-2** Every page and operation other than the Job List, Posting detail, Applicant registration, the Recruiter request form, and login requires a logged-in Account with the role named in the relevant FR, and the system refuses everyone else as forbidden.
- **FR-X-3** Every Notification is delivered in-app only and is visible only to its recipient.
- **FR-X-4** Every status or Stage change, approval, rejection, and business-rule change records the acting Account, the timestamp, and the previous and new values, and that record cannot be edited or deleted.
- **FR-X-5** Administrator Accounts are created by system setup or by an existing Administrator (FR-M3-4), never by self-registration (A-25).

## 5. Non-Functional Requirements

- **NFR-1 Server-side authorization.** Every request is authorized on the server independently of the user interface, so a hand-crafted request for another Organization's data is refused even if the interface never offers it.
- **NFR-2 Credential safety.** Passwords are stored only in a non-reversible form, and a session ends after 8 hours of inactivity (A-26).
- **NFR-3 Applicant privacy.** An Applicant's profile and Resume are readable only by that Applicant, by Recruiters of Organizations the Applicant applied to, and by Administrators.
- **NFR-4 Integrity of transitions.** Every state change is validated by the business layer, and an invalid change is refused with a human-readable message and leaves data unchanged.
- **NFR-5 Persistence.** All data survives an application restart, and no Application, Posting, or Notification can exist without its owner.
- **NFR-6 Performance.** The Job List, Posting detail, and Application list pages (FR-A4-1, FR-R3-1) respond within 2 seconds at the 95th percentile, measured at the server, with 1,000 Postings and 10,000 Applications stored, and the system serves 25 concurrent users without errors (A-27).
- **NFR-7 Availability.** The system is deployed at a public URL and reachable at each iteration presentation; no uptime target applies beyond that.
- **NFR-8 Usability and compatibility.** Before Iteration 3, three first-time testers each complete Maria's UJ-1 tasks unaided in under five minutes; the system works on the current versions of Chrome, Firefox, Safari, and Edge, at viewport widths down to 375 px (A-28).
- **NFR-9 Accessibility.** Every form field has a visible label, every action is reachable by keyboard, and color is never the only indicator of a status or Stage (A-29).
- **NFR-10 Testability and traceability.** Every FR is covered by at least one automated test whose name contains the FR ID, and the full suite runs automatically on every push to the shared repository (A-30).
- **NFR-11 Maintainability.** The system has separate presentation, business logic, persistence, and data layers, so a business-rule change such as a new Application Cap range touches one layer.

## 6. Non-Goals

Not built this semester, per the brief: interview scheduling or calendar coordination (Q-011); multiple resumes or cover letters; configurable pipelines; a Recruiter in more than one Organization (Q-002, parked); password reset and Account deletion; direct editing of Postings or Organizations by the Administrator; payments, salary data, or messaging between users; offer expiry, rescinding, or negotiation (A-31). Email notification and AI features are stretch goals only after all fifteen use cases pass their tests.

## 7. Success Criteria

- **SC-1** At the Iteration 3 demonstration, UJ-1 completes in about ten minutes and UJ-2 in about two, on the deployed system. Validates every FR tagged UJ-1 or UJ-2.
- **SC-2** The UJ-3 proof points succeed live. Validates FR-R3-3, FR-R2-3, FR-M2-4, FR-A3-4, FR-M4-1.
- **SC-3** Every FR ID resolves to a use case, a design element, an issue, code, and a passing test, shown live at the demonstration and kept current through Iteration 3. Validates NFR-10.
- **SC-4** Each member owns at least three use cases from two or more roles, visible in Git history.
- **Counter-metric SC-C1.** Use cases and FRs must not be added merely to look thorough; anything added after Iteration 1 replaces something or is justified against the demo. Counterbalances SC-1 and SC-3.

## 8. Open Questions

1. Admin model: single platform Administrator (option A, as written) or platform plus company admin (option B, D-005; FR effect in the addendum). Settle with Dr. Ren in Iteration 1.
2. Default Application Cap of 5 (Q-004): early-career applicants apply to fifteen or twenty Postings; confirm 5 or raise it.
3. Effects of suspension and deletion on Live Postings, in-flight Applications, the cap count, an Organization left with no Approved Recruiter, and retention of audit records.
4. Whether A-7 (interview outcome visible to the Applicant), A-18 (one opening per Posting), and A-31 (offers neither rescinded nor expiring) hold as written; ask these first.

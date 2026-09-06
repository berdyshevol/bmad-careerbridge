---
title: "PRD Addendum: CareerBridge"
status: final
created: 2026-09-05
updated: 2026-09-05
---

# Addendum: CareerBridge PRD

Technical choices, mechanism notes, and depth that belongs to architecture, UX, or planning rather than the PRD body. Decisions carried from the brief addendum are restated only where the PRD relies on them.

## Technical decisions carried from the brief (Iteration 1 rationale still owed)

- **Stack.** JavaScript end to end: Node.js backend, React frontend, deliberately not TypeScript (D-004). Approved verbally by Dr. Ren in early September 2026; written rationale for departing from Maven and JUnit is due in Iteration 1.
- **Database.** PostgreSQL proposed, not yet ratified by the team. The PRD's state model (Posting status, Application Stage, audit of transitions) is relational by nature and feeds the Iteration 2 data-model deliverable.
- **Testing and tracking.** Jest on backend and frontend; GitHub Issues at github.com/berdyshevol/careerbridge-csi5324.
- **Deployment.** Google Cloud Platform per the course, Render or Railway free tier as fallback. Iteration 1 decision. NFR-7 is written to be satisfiable by any of them.

## Mechanism notes raised while drafting (architecture decides)

- **Expiry (FR-M2-4).** Two options: a scheduled job that flips Live Postings past their expiry date, or computing "effective status" on read and persisting the flip lazily. Computing on read is simpler to test and needs no scheduler; a nightly job would additionally keep the stored status honest for the oversight counts (FR-M4-4).
- **Resume snapshot (FR-A3-5, A-6).** Either store a copy of the file per Application, or make Resume uploads immutable versions and have each Application reference the version it was submitted with. The second is cheaper in storage and keeps one upload path. File bytes can live in object storage or in the database; at demo scale either works.
- **Notifications (FR-A5-1, FR-X-3).** A notifications table read on page load and on a light poll is enough; no push or WebSocket transport this semester. Email stays a stretch goal.
- **Audit trail (FR-X-4).** One transition table (entity, old value, new value, actor, timestamp, reason) serves Application Stage history, Posting status history, approvals, and business-rule changes, and gives the traceability demo something concrete to show.
- **Reference Data and Stage labels (FR-M4-2, FR-M4-3).** Categories and locations as small tables with an `active` flag (retire, never delete). Stage labels as a label table keyed by the fixed Stage enum; the enum itself never changes.
- **Organization membership (FR-R1-1, FR-R1-2). Constraint from the brief, not a suggestion:** keep membership in its own table rather than a column on the user, so the parked many-to-many (a Recruiter in several Organizations, Q-002) stays possible later without a migration that reinterprets existing rows.
- **Session handling (NFR-2).** Server-side session with an HTTP-only cookie or a short-lived token; either satisfies the NFR. The 8-hour idle timeout (A-26) is a configuration value.
- **Authorization (NFR-1, FR-X-2).** One server-side check per route: role first, then Organization ownership for recruiter routes, then record ownership for applicant routes. The privacy proof point (FR-R3-3) is a test against this layer, not against the UI.

## Assumptions awaiting customer confirmation (full table for QUESTIONS.md)

Team-confirmed by Oleg on 2026-09-05 after the fast-path draft; three were overturned or softened in that review (A-5, A-13, A-17) and three adjusted (A-4, A-22, A-26). Propose to Dr. Ren alongside Q-001 to Q-014.

| ID | Where | Rule |
| --- | --- | --- |
| A-1 | FR-A1-2 | Profile fields: name, phone, location, headline, education, summary |
| A-2 | FR-A1-3 | Resume is PDF only, at most 5 MB |
| A-3 | FR-A2-3 | Filters: keyword, category, location only |
| A-4 | FR-A3-1 | Optional 1,000-character note, no cover letter; "complete profile" means full name plus Resume |
| A-5 | FR-A3-3 | Re-apply allowed after withdrawal while the Posting is Live; never after rejection or a declined offer |
| A-6 | FR-A3-5 | Resume snapshotted at submission |
| A-7 | FR-A4-2 | Interview date and outcome visible to the Applicant |
| A-8 | FR-A4-4 | At Offer the Applicant declines, not withdraws |
| A-9 | FR-A5-5 | Declined is terminal; Posting stays Live |
| A-10 | FR-R1-2 | Extra Recruiters join through the Administrator queue (option A) |
| A-11 | FR-R1-4 | Organization name changes need the Administrator |
| A-12 | FR-R2-1 | Posting fields; category and location from Reference Data; employment type is Full-time, Part-time, Internship, or Contract |
| A-13 | FR-R2-4 | Live Posting: description and requirements editable without re-approval; title, category, location, expiry frozen |
| A-14 | FR-R4-2 | Rejection reason 10 characters minimum, shown verbatim; rejection only in Applied, Screening, Interview (Offer would be a rescind, A-31) |
| A-15 | FR-R4-4 | Applications to a Filled or Closed Posting can only be rejected, not advanced |
| A-16 | FR-R5-2 | Interview outcomes: Passed, Failed, No-show |
| A-17 | FR-R5-2, FR-R6-1 | Interview outcome is a record, not a precondition of an offer (Q-011) |
| A-18 | FR-R6-1, FR-R6-2 | One hire per Posting; at most one open offer per Posting at a time |
| A-19 | FR-R6-3 | Others auto-rejected as "Position filled"; hired Applicant's other Applications unchanged (Q-012) |
| A-20 | FR-R4-4, FR-M2-4 | Expiry stops intake only; existing Applications continue, and an accepted offer fills an Expired Posting |
| A-21 | FR-M3-4 | "Reassign" means role or Organization change |
| A-22 | FR-M4-1 | Application Cap range 1 to 20, default 5 |
| A-23 | FR-M4-2 | Reference Data is retired, never deleted |
| A-24 | FR-M4-4 | Oversight view is counts only |
| A-25 | FR-X-5 | One Administrator seeded at setup |
| A-26 | NFR-2 | 8-hour idle session timeout |
| A-27 | NFR-6 | 2-second pages at 1,000 Postings and 10,000 Applications; 25 concurrent users |
| A-28 | NFR-8 | Works at 375 px width; no native apps |
| A-29 | NFR-9 | Basic accessibility, no formal WCAG audit |
| A-30 | NFR-10 | Test suite runs on every push via GitHub Actions |
| A-31 | §6 | Offers never expire and cannot be rescinded this semester; customer question |

## Admin model options and their effect on the FRs (D-005, open)

- **Option A, single platform Administrator.** PRD as written. UC-M1 handles both Organization and Recruiter requests (requests under FR-R1-2 go through the same queue).
- **Option B, platform plus company admin.** FR-R1-2 moves to a new UC-M5 "Company admin manages their Organization's Recruiters"; UC-M1 keeps Organization approval only. Adds one use case (sixteen total: five Applicant, six Recruiter, five Administrator). No other FR changes.

## Traceability convention (proposed for the team)

- One GitHub issue per use case, with the FR IDs as a checklist in the body; one issue per NFR that needs work.
- Test names contain the FR ID verbatim, for example `FR-A3-4 refuses application at cap`, so a grep from any FR ID lands on its tests (NFR-10).
- Commits reference the issue; the issue references the use case; the use case lists its FRs. That is the chain shown live at the Iteration 3 demo (SC-3).

## Screen inventory (input for Iteration 1 wireframes)

- **Public:** job list with filters; job detail; login; applicant registration; recruiter and organization request form.
- **Applicant:** profile and resume; my applications; application detail with Stage history; notifications.
- **Recruiter:** pending-status page; organization profile; my postings; posting editor; applications for a posting; application detail with advance, reject, interview, and offer actions; notifications.
- **Administrator:** account and organization approval queue; posting approval queue; accounts list with suspend, reactivate, role change; business rules and reference data; oversight counts; read-only record view with change history and close-posting action.

Seed cast for wireframes and test data, from PRD §2: Sam (Recruiter, Acme Waco), Maria and Devon (Applicants), Priya (Recruiter, Bear Staffing), one seeded Administrator.

## Iteration mapping

FRs inherit the iteration shown in their use-case heading in the PRD. All of FR-X-1 to FR-X-5 land in Iteration 1 because the brief's mitigation for the heavy Iteration 2 is that shared infrastructure (authentication, role-based access, notification delivery, audit) is finished before Iteration 2 starts. Notification events are created by the use case that causes them (for example FR-R4-2 in Iteration 2) and delivered by FR-X-3, so UJ-2 is demonstrable at Iteration 2 before UC-A5 adds the Notification pages. The named risk and the slip order (UC-A4 slips first) are in the brief addendum.

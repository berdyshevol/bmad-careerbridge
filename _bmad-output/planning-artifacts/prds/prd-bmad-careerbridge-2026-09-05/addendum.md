---
title: "PRD Addendum: CareerBridge"
status: draft
created: 2026-09-05
updated: 2026-09-05
---

# Addendum: CareerBridge PRD

Technical choices, mechanism notes, and depth that belongs to architecture, UX, or planning rather than the PRD body. Decisions carried from the brief addendum are restated only where the PRD relies on them.

## Technical decisions carried from the brief (Iteration 1 rationale still owed)

- **Stack.** JavaScript end to end: Node.js backend, React frontend, deliberately not TypeScript (D-004). Approved verbally by Dr. Ren in early September 2026; written rationale for departing from Maven and JUnit is due in Iteration 1.
- **Database.** PostgreSQL proposed, not yet ratified by the team. The PRD's state model (Posting status, Application Stage, audit of transitions) is relational by nature and is the Iteration 2 data-model deliverable.
- **Testing and tracking.** Jest on backend and frontend; GitHub Issues at github.com/berdyshevol/careerbridge-csi5324.
- **Deployment.** Google Cloud Platform per the course, Render or Railway free tier as fallback. Iteration 1 decision. NFR-7 is written to be satisfiable by any of them.

## Mechanism notes raised while drafting (architecture decides)

- **Expiry (FR-M2-4).** Two options: a scheduled job that flips Live Postings past their expiry date, or computing "effective status" on read and persisting the flip lazily. Computing on read is simpler to test and needs no scheduler; a nightly job keeps the stored status honest for the oversight counts (FR-M4-4).
- **Resume snapshot (FR-A3-5, A-6).** Either store a copy of the file per Application, or make Resume uploads immutable versions and have each Application reference the version it was submitted with. The second is cheaper in storage and keeps one upload path. File bytes can live in object storage or in the database; at demo scale either works.
- **Notifications (FR-A5-1, FR-X-3).** A notifications table read on page load and on a light poll is enough; no push or websocket transport this semester. Email stays a stretch goal.
- **Audit trail (FR-X-4).** One transition table (entity, old value, new value, actor, timestamp, reason) serves Application Stage history, Posting status history, approvals, and business-rule changes, and gives the traceability demo something concrete to show.
- **Reference Data and Stage labels (FR-M4-2, FR-M4-3).** Categories and locations as small tables with an `active` flag (retire, never delete). Stage labels as a label table keyed by the fixed Stage enum; the enum itself never changes.
- **Organization membership (FR-R1-1, FR-R1-2).** Keep membership in its own table rather than a column on the user, so the parked many-to-many (a Recruiter in several Organizations) stays possible later without a migration of meaning.
- **Session handling (NFR-2).** Server-side session with an HTTP-only cookie or a short-lived token; either satisfies the NFR. The 24-hour idle timeout (A-26) is a configuration value.
- **Authorization (NFR-1, FR-X-2).** One server-side check per route: role first, then Organization ownership for recruiter routes, then record ownership for applicant routes. The privacy proof point (FR-R3-3) is a test against this layer, not against the UI.

## Admin model options and their effect on the FRs (D-005, open)

- **Option A, single platform Administrator.** PRD as written. UC-M1 handles both Organization and Recruiter requests (FR-R1-2 joins go through the same queue).
- **Option B, platform plus company admin.** FR-R1-2 moves to a new UC-M5 "Company admin manages their Organization's Recruiters"; UC-M1 keeps Organization approval only. Adds one use case (sixteen total, 5 / 6 / 5). No other FR changes.

## Traceability convention (proposed for the team)

- One GitHub issue per use case, with the FR IDs as a checklist in the body; one issue per NFR that needs work.
- Test names contain the FR ID verbatim, for example `FR-A3-4 refuses application at cap`, so a grep from any FR ID lands on its tests (NFR-10).
- Commits reference the issue; the issue references the use case; the use case lists its FRs. That is the chain shown live at the Iteration 3 demo (SC-3).

## Screen inventory (input for Iteration 1 wireframes)

- **Public:** job list with filters; job detail; login; applicant registration; recruiter and organization request form.
- **Applicant:** profile and resume; my applications; application detail with Stage history; notifications.
- **Recruiter:** pending-status page; organization profile; my postings; posting editor; applications for a posting; application detail with advance, reject, interview, and offer actions; notifications.
- **Administrator:** account and organization approval queue; posting approval queue; accounts list with suspend, reactivate, role change; business rules and reference data; oversight counts.

## Iteration mapping

FRs inherit the iteration of their use case (brief §Scope): Iteration 1 covers UC-A2, UC-R2, UC-M1 plus FR-X-1, FR-X-2, and FR-X-5; Iteration 2 covers UC-A1, UC-A3, UC-A4, UC-R1, UC-R3, UC-R4, UC-M2 plus FR-X-3 and FR-X-4; Iteration 3 covers UC-A5, UC-R5, UC-R6, UC-M3, UC-M4. The named risk (Iteration 2 heavy) and the slip order (UC-A4 first) are in the brief addendum.

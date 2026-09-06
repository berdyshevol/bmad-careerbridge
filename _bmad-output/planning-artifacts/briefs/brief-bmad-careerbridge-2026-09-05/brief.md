---
title: "Product Brief: CareerBridge"
status: final
created: 2026-09-05
updated: 2026-09-05
---

# Product Brief: CareerBridge

**Team CareerBridge · CSI 5324 Software Engineering, Baylor, Fall 2026 · Customer: Dr. Ren**

## Summary

CareerBridge is a web-based recruiting and application management system built as a semester-long team project. It is a multi-company job board: organizations post openings, applicants browse and apply across organizations, and an administrator keeps the platform trustworthy. Three roles interact through one fixed, visible hiring pipeline.

The project has two outcomes of equal weight. The **product outcome** is a coherent recruiting workflow that a small employer and an early-career applicant would recognize as solving their problem. The **engineering outcome** is a disciplined, traceable software process across three iterations, in which every team member owns at least three use cases end to end. This brief is scoped to be built, tested, deployed, and defended.

## The Problem

Two groups are underserved by the large platforms that serve big companies well.

- **Early-career applicants** (our classmates) apply to twenty places through twenty different portals. Nothing tells them where any application stands, whether it was seen, or why it was rejected. They cope with spreadsheets and hope.
- **Small employers** (a local Waco business, a campus department, a startup) have no applicant tracking system at all. Applications land in a shared inbox, get lost, and candidates never hear back. They cope with email threads and memory.

Neither group needs a full commercial applicant tracking system. They need one place where both sides can see the whole pipeline.

## The Solution

A single job board where a small employer's recruiter posts an opening, an administrator approves it, the public can browse it, an applicant applies with one profile and one resume, and the recruiter moves that application through a fixed pipeline (applied → screening → interview → offer → hired or rejected) that the applicant can watch in full. Decisions are recorded with reasons and communicated in-app. When an offer is accepted, the posting closes itself.

Business rules that keep it honest: recruiter and organization accounts need administrator approval; postings need approval and have an expiry date; an applicant may withdraw but not edit a submitted application; an applicant may hold at most N active applications, where N is a platform business rule maintained by the administrator (default 5); a recruiter sees only applications to their own organization's jobs. Only the job list and job detail pages are public; everything else is behind login.

## Who This Serves

| Role | Who they are | What success looks like for them |
| --- | --- | --- |
| **Applicant** | Student or early-career job seeker | Finds jobs without logging in, applies in minutes, always knows the stage and the outcome |
| **Recruiter / HR** | Person hiring for one small organization | Posts once, reviews applicants in one queue, records every decision without losing anyone |
| **Administrator** | Platform operator | Controls who may recruit, what goes live, and the business rules; nothing reaches the public unreviewed |

The customer for the semester is Dr. Ren, who plays all three roles at the demonstrations.

## Product Outcome

At the Iteration 3 demonstration the team shows one golden path in about ten minutes, then a short second path.

**Golden path.** A recruiter of "Acme Waco" creates a posting; it waits for approval; the admin approves and it goes live; a visitor browses jobs without logging in, registers as an applicant, uploads a resume, and applies; the recruiter reviews the application, advances it through screening and interview, records that an interview happened, extends an offer; the applicant accepts in the system; the posting closes automatically because it is filled.

**Second path.** Another applicant is rejected with a recorded reason and receives an in-app notification.

**Proof points that show domain understanding:**

1. A recruiter from a second organization cannot see Acme's applicants.
2. The approval gates, the posting expiry, and the active-application cap are enforced, not decorative.
3. Any requirement can be followed live from its ID to a use case, to the code, and to the test that covers it.

## Engineering Outcome

These are graded criteria and are first-class goals of the project.

- **Coverage.** At least fifteen substantial use cases, three or more per member, each owned by one person through analysis, design, implementation, and unit testing.
- **Cadence.** Three checkpoints. Iteration 1 (week 6): requirements, analysis models, wireframes, repository, issue tracker, initial prototype. Iteration 2 (week 10): architecture, detailed design, database design, substantial prototype, systematic automated tests. Iteration 3 (week 15 or 16): complete, deployed, documented, demonstrated.
- **Review cadence.** Weekly team meeting on Mondays at 8:00 pm, reviewing progress against the issue tracker.
- **Evidence.** Individual contribution is graded: it is visible in Git history and confirmed by peer evaluation at the end of each iteration.
- **Traceability.** Requirement → use case → design → code → test, kept current as the implementation evolves; final documentation matches the delivered system.
- **Quality.** Automated tests with Jest on both backend and frontend; GitHub Issues for tracking; a multi-layered architecture with clear presentation, business logic, persistence, and data layers.
- **Stack rationale.** JavaScript end to end (Node.js backend, React frontend, deliberately not TypeScript), approved verbally by Dr. Ren; the written rationale for departing from the course default of Maven and JUnit is due in Iteration 1.

## Scope

**In scope for the semester:** every behavior and business rule described in The Solution, plus a relational data model, automated tests, and web deployment.

**Explicitly out of scope:** interview scheduling and calendar coordination (only the fact and outcome are recorded); multiple resumes or cover letters per application; configurable pipelines; a recruiter belonging to more than one organization; email notifications; any AI feature (resume parsing, matching, feedback) unless the core scope is complete and the team chooses one as a stretch goal. Anything cut is cut to protect the fifteen use cases and the demo.

### First-cut use-case split and iteration plan

Fifteen use cases, roughly even across roles. Sizes are a rough estimate; the iteration column shows where each is first implemented. Cross-cutting infrastructure (authentication, role-based access, notification delivery) is shared work, not an owned use case.

| ID | Role | Use case | Size | Iter |
| --- | --- | --- | --- | --- |
| UC-A1 | Applicant | Register and maintain applicant profile, including single resume upload | M | 2 |
| UC-A2 | Applicant | Browse and search open postings (public and logged in) | M | 1 |
| UC-A3 | Applicant | Apply to a posting (enforces one resume, no duplicate applications, active-application cap) | M | 2 |
| UC-A4 | Applicant | Track application status through every stage; withdraw | S | 2 |
| UC-A5 | Applicant | Receive in-app notifications; accept or decline an offer | M | 3 |
| UC-R1 | Recruiter | Register an organization and recruiter account (pending approval); maintain org profile | M | 2 |
| UC-R2 | Recruiter | Create, edit, and submit a posting for approval; set expiry | M | 1 |
| UC-R3 | Recruiter | Review applications and materials for own organization only | M | 2 |
| UC-R4 | Recruiter | Advance or reject a candidate through the fixed pipeline; record rejection reason (triggers notification) | L | 2 |
| UC-R5 | Recruiter | Record that an interview was scheduled and its outcome | S | 3 |
| UC-R6 | Recruiter | Extend an offer; posting auto-closes when filled | M | 3 |
| UC-M1 | Admin | Approve or reject organization and recruiter account requests | M | 1 |
| UC-M2 | Admin | Approve or reject postings before they go live; handle expiry | M | 2 |
| UC-M3 | Admin | Manage user accounts and roles (suspend, reactivate, reassign) | M | 3 |
| UC-M4 | Admin | Maintain platform business rules and reference data (active-application cap, job categories, locations, stage labels) and an oversight view | M | 3 |

Count by role: applicant 5, recruiter 6, admin 4. The admin share is lighter because the admin model is still open (D-005); under the two-level option a company-admin use case brings the split to 5 / 6 / 5, sixteen use cases with one of slack (both options are laid out in the addendum). Suggested ownership rule: each member owns three use cases from at least two different roles, and every member has at least one use case on the golden path, so nobody is a bystander at the demo.

**Iteration plan and named risk.** Iteration 1 delivers the skeleton (authentication, role-based access, database schema with PostgreSQL proposed, deployment pipeline, wireframes) plus the three Iteration 1 use cases, which exercise the full stack end to end for the first time. **Risk: Iteration 2 is heavy.** Seven use cases against a capacity of roughly one substantial use case per person per iteration. Mitigation: the shared infrastructure is finished before Iteration 2 begins, and the two smallest items (UC-R5, UC-M3) are already placed in Iteration 3, which leaves it room to absorb an Iteration 2 overrun without touching the golden path.

## Open Questions

- Admin model: single platform admin, or platform plus company admin (D-005). To settle with Dr. Ren in Iteration 1.
- The default active-application cap of 5 still needs the customer's confirmation.
- Database not yet ratified by the team; PostgreSQL is proposed (see addendum).
- Deployment target: Google Cloud Platform or a free-tier host. Iteration 1 decision.
- Data retention when an account is deleted.

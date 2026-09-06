---
title: "Product Brief Addendum: CareerBridge"
status: draft
created: 2026-09-05
updated: 2026-09-05
---

# Addendum: CareerBridge

Depth that belongs downstream (PRD, architecture, design) or earned a place but does not fit the two-page brief.

## Technical decisions and rationale (for Iteration 1 documentation)

**Database: PostgreSQL proposed.** The data is relational (organizations, recruiters with possible membership in several organizations, postings, applications, pipeline stage transitions, decisions with reasons). The course recommends a relational database and Iteration 2 requires a database design that can be shown as a proper data model. MongoDB was considered on the "JavaScript everywhere" argument and rejected: the argument buys nothing for this data shape and would weaken the Iteration 2 deliverable.

**Stack: JavaScript end to end.** Node.js backend, React frontend, deliberately JavaScript rather than TypeScript so the team works in one language. Dr. Ren approved the Node.js backend verbally at a lecture in early September 2026, superseding the course's Maven and JUnit expectation. The written technical rationale is still owed in Iteration 1.

**Testing: Jest** on both backend and frontend as the JUnit-equivalent framework.

**Tracking: GitHub Issues**, repository at github.com/berdyshevol/careerbridge-csi5324.

**Deployment options.** Google Cloud Platform is the course's named environment. Render or Railway free tiers are the fallback if GCP setup or cost becomes a problem. Decision deferred to Iteration 1.

## Team capacity (planning input)

- Five members; all know JavaScript. React and Node experience is mixed: two members have built small full-stack applications, and Oleg works as a freelance developer.
- Nobody has worked inside a real recruiting process. Domain knowledge comes from the problem statement and from LinkedIn Jobs, Indeed, and Snagajob as references.
- Realistic velocity: about one substantial use case per person per iteration after Iteration 1. With fifteen use cases and three iterations this leaves no slack, which is why the brief's use-case table tags each use case with a size and a first-implementation iteration. If velocity is lower, the S-sized use cases (UC-A4, UC-R5) can absorb the shortfall without breaking the golden path.

## Demo script (Iteration 3, first cut)

Golden path, about ten minutes, one browser session per role:

1. Recruiter (Acme Waco) creates a posting with an expiry date and submits it. Status: pending approval.
2. Admin sees it in the approval queue and approves. Status: live.
3. Anonymous visitor browses and finds the posting without logging in.
4. Visitor registers as an applicant, completes the profile, uploads one resume, applies.
5. Recruiter sees the new application in the Acme queue only.
6. Recruiter advances it: applied → screening → interview. Records that an interview took place and its outcome.
7. Recruiter extends an offer. Applicant receives an in-app notification and accepts.
8. Posting auto-closes as filled.

Second path, two minutes: a second applicant to the same posting is rejected with a reason and sees the notification and the reason.

Proof-point checks to show live: log in as a recruiter from a second organization and show the Acme applicants are invisible; attempt a sixth active application and show the cap; open a requirement ID and follow it to use case, code, and test.

## Rejected and parked

- **Single-organization internal HR tool** (rejected, D-001): a multi-company board demonstrates role-based access and privacy rules more convincingly.
- **Configurable pipelines per job** (parked): fixed pipeline keeps the state machine testable and the use cases even.
- **Interview scheduling with time proposals** (parked): recording the fact and outcome is enough for the semester.
- **Email notifications** (stretch): in-app only until the core scope is complete.
- **AI features** (stretch): resume extraction or job matching only after all fifteen use cases pass their tests; if attempted, the course requires reliability, validation, privacy, and human oversight to be addressed.

## Working assumptions submitted to the customer

Fourteen questions were submitted in Deliverable 0 with the team's proposed answers, explicitly framed as assumptions for Dr. Ren to confirm or correct (D-006). They are tracked in the team's QUESTIONS.md. The PRD should treat each as a business rule with status "assumption" until confirmed.

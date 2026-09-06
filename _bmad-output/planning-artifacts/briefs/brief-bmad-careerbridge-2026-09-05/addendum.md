---
title: "Product Brief Addendum: CareerBridge"
status: final
created: 2026-09-05
updated: 2026-09-05
---

# Addendum: CareerBridge

Depth that belongs downstream (PRD, architecture, design) or earned a place but does not fit the two-page brief.

## Technical decisions and rationale (for Iteration 1 documentation)

**Database: PostgreSQL proposed.** The data is relational (organizations, recruiters, postings, applications, pipeline stage transitions, decisions with reasons). The course recommends a relational database and Iteration 2 requires a database design that can be shown as a proper data model. MongoDB was considered on the "JavaScript everywhere" argument and rejected: the argument buys nothing for this data shape and would weaken the Iteration 2 deliverable.

**Stack: JavaScript end to end.** Node.js backend, React frontend, deliberately JavaScript rather than TypeScript so the team works in one language. Dr. Ren approved the Node.js backend verbally at a lecture in early September 2026, superseding the course's Maven and JUnit expectation. The written technical rationale is still owed in Iteration 1.

**Testing and tracking.** Jest on both backend and frontend as the JUnit equivalent; GitHub Issues in the repository at github.com/berdyshevol/careerbridge-csi5324.

**Deployment options.** Google Cloud Platform is the course's named environment. Render or Railway free tiers are the fallback if GCP setup or cost becomes a problem. Decision deferred to Iteration 1.

## Admin model options (D-005, open)

- **Option A, single platform admin.** UC-M1 to UC-M4 as listed in the brief. Admin stays at four use cases; a fifth admin use case could be an audit log of approvals and decisions.
- **Option B, platform admin plus company admin.** Add UC-M5 "Company admin manages their organization's recruiters and hiring managers", making the split 5 / 6 / 5 (sixteen use cases, one above the floor). This also gives the per-organization privacy rule a natural owner.

## Rejected and parked

- **Single-organization internal HR tool** (rejected, D-001): a multi-company board demonstrates role-based access and privacy rules more convincingly.
- **Fixed active-application cap** (replaced): the original hard-coded limit of 5 contradicted the twenty-portals applicant story. It is now a platform business rule maintained by the administrator with a default of 5, which keeps the Deliverable 0 answer valid as the default.
- **Recruiter belonging to more than one organization** (parked, was Q-002): nobody plans to demo it and it turns organization membership into a many-to-many relation that complicates the privacy rule. For the semester, membership is one recruiter → one organization. The data model should not make the many-to-many impossible later (for example, keep organization membership in its own table rather than as a column on the user).
- **Configurable pipelines per job** (parked): fixed pipeline keeps the state machine testable and the use cases even.
- **Interview scheduling with time proposals** (parked): recording the fact and outcome is enough for the semester.
- **Email notifications** (stretch): in-app only until the core scope is complete.
- **AI features** (stretch): resume extraction or job matching only after all fifteen use cases pass their tests; if attempted, the course requires reliability, validation, privacy, and human oversight to be addressed.

## Questions and assumptions with the customer

Fourteen questions were submitted in Deliverable 0 with the team's proposed answers, explicitly framed as assumptions for Dr. Ren to confirm or correct (D-006). They are tracked in the team's QUESTIONS.md. The PRD should treat each as a business rule with status "assumption" until confirmed. Two have moved since submission, Q-002 and Q-004; see Rejected and parked.

Course-administration questions still to ask, kept out of the brief:

- Where does the course AI-use policy live? The Overview's "here" link is missing on Canvas.
- Will Dr. Ren remain the customer for the whole semester?

## Team capacity (planning input)

- Five members; all know JavaScript. React and Node experience is mixed: two members have built small full-stack applications, and Oleg works as a freelance developer.
- Nobody has worked inside a real recruiting process. Domain knowledge comes from the problem statement and from LinkedIn Jobs, Indeed, and Snagajob as references.
- Realistic velocity: about one substantial use case per person per iteration after Iteration 1. Fifteen use cases is a hard floor (three per member), so merging is not an option; the brief's 3 / 7 / 5 iteration plan absorbs the pressure instead.
- Overrun plan: Iteration 3 holds the two smallest items (UC-R5, UC-M3) so it has room to absorb an Iteration 2 overrun. Which Iteration 2 item slips first is the team's call; UC-A4 (S) is the natural candidate because it is not on the golden path's recruiter side.

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

Proof-point checks to show live: log in as a recruiter from a second organization and show the Acme applicants are invisible; attempt one more active application than the cap allows and show the refusal; change the cap as admin and show the rule take effect; open a requirement ID and follow it to use case, code, and test.

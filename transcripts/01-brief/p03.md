I read the brief and the addendum. Structure is right, and dropping "What Makes This Different" and "Vision" was the correct call for this customer. Now your three pushbacks.

**1. Five-active-applications cap — you are right, I'll take the reframe.** Make it "an applicant may hold at most N active applications, where N is a platform business rule maintained by the administrator (default 5)". That fixes the contradiction with the twenty-portals story, gives UC-M4 a concrete reason to exist, and keeps our Deliverable 0 answer valid as the default. In Open Questions, keep one line: the team still needs the customer to confirm the default.

**2. Capacity — you are right that there is no slack, but I will not merge use cases.** Fifteen is a hard floor (3 per member × 5), so merging only moves the problem. What I will change is the iteration plan, to be honest about Iteration 1: Iteration 1 delivers the skeleton (authentication, role-based access, PostgreSQL schema, deployment pipeline, wireframes) plus **three** small-to-medium use cases that exercise the full stack once: UC-A2 browse postings, UC-R2 create posting, UC-M1 approve accounts. Everything else moves: Iteration 2 gets seven (A1, A3, A4, R1, R3, R4, M2), Iteration 3 gets five (A5, R5, R6, M3, M4). Yes, Iteration 2 is heavy. Please write that down as a named risk in the brief with the mitigation we actually have: the shared infrastructure is done by then, and R5 and M3 are the two smallest items, so they are the first to slip into Iteration 3 without breaking the golden path.

**3. Recruiter in multiple organizations (Q-002) — agreed, park it.** Nobody plans to demo it. Move it to the addendum as a parked idea with the note that membership stays one recruiter → one organization for the semester, and that the data model should not make the many-to-many impossible later. Remove the "join a second org" clause from UC-R1.

**Confirmations.** Pipeline stages: applied → screening → interview → offer → hired or rejected, fixed — yes. Public pages: job list and job detail only, everything else behind login — yes.

**Length.** Keep the use-case table in the brief; the team needs to see it on the same page as the scope. Two pages is acceptable. If you want to save space, move the Option A / Option B detail under the table to the addendum and leave one sentence in the brief.

One small addition: under Engineering Outcome, please name the review cadence — weekly team meeting Monday 8 pm, and a peer evaluation at the end of each iteration — because Dr. Ren evaluates individual contribution and we want the brief to show we planned for it.

Then please finalize: memlog audit, polish, and tell me the final paths. No external handoffs — local files only. After that, tell me what BMAD suggests as the next step so I can decide whether to go to the PRD.

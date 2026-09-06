The first full draft is on disk, plus an addendum. Read the brief first, then the questions below.

- `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/brief.md` (about 1,550 words including the table; roughly two pages, the use-case table is what pushes it there)
- `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/addendum.md` (PostgreSQL rationale, deployment options, team capacity, the ten-minute demo script, rejected and parked ideas)

**Structure as you asked.** Summary, The Problem, The Solution, Who This Serves, Product Outcome, Engineering Outcome, Scope with the use-case split, Open Questions. I dropped the template's "What Makes This Different" and "Vision" sections because neither earns its place for this customer.

**The use-case split I'm proposing:** applicant 5, recruiter 6, admin 4. Each row has a rough size and the iteration where it is first implemented, so the team can check the math against your capacity estimate. Admin is lighter on purpose: under Option A (single platform admin) it stays at four, with an audit log as an optional fifth. Under Option B (platform admin plus company admin) a "company admin manages own recruiters" use case moves out of the recruiter registration story and the split becomes 5 / 5 / 5. I also added a suggested ownership rule: three use cases from at least two roles each, and everyone owns something on the golden path.

Now three places where I want to push back before you take this to the team.

1. **The five-active-applications cap contradicts your own story.** Your applicant applies to twenty places. Your rule stops them at five. Dr. Ren may not notice, but a careful reader will. I left Q-004 as submitted and put it in Open Questions. My recommendation: reframe it as a configurable reference value the admin sets, which also strengthens UC-M4. Your call.

2. **Your capacity math has no slack.** One substantial use case per person per iteration after Iteration 1 gives ten. You need fifteen. The table absorbs this by putting five use cases in Iteration 1 and two small ones later, but that assumes Iteration 1 produces working code, not just wireframes. Is that realistic for a team that is still choosing its database? If not, tell me which use cases you would merge.

3. **"Recruiter belongs to multiple organizations" (Q-002) is quietly expensive.** It turns organization membership into a many-to-many relation, complicates the privacy rule, and only matters if you demo it. I folded it into UC-R1 as a small clause. If nobody plans to show it, consider parking it in the addendum instead of carrying it in scope.

Also confirm two things I inferred: the fixed pipeline stages are applied → screening → interview → offer → hired or rejected, and "public pages" means the job list and job detail only, with everything else behind login.

Tell me what to change, and whether the brief's length is acceptable or you want the use-case table moved to the addendum to get it comfortably under two pages.
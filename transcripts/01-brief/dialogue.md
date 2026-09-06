

## Turn 01 — Oleg

/bmad-product-brief

Hi. I want to create a product brief for our team project. Please use the coaching path — I have time and I want a brief we are proud of, not a fast draft.

Context: I am a graduate student at Baylor (CSI 5324 Software Engineering). Our team of 5 is called CareerBridge. We must build a web-based recruiting / job application system over one semester (3 iterations). The instructor, Dr. Ren, plays the customer.

Source material is already in the `inputs/` folder — please read it first and ask me only what is missing:
- `inputs/group-project-problem-statement.md` — the instructor's problem domain (applicant / recruiter / administrator)
- `inputs/group-project-overview.md` — course expectations (iterations, grading, tech expectations)
- `inputs/deliverable-0.md` — our team formation document: team name, roles, and our 14 clarification questions with our assumed answers
- `inputs/DECISIONS.md` — team decision log (D-001 … D-008)
- `inputs/QUESTIONS.md` — customer questions with status
- `inputs/TEAM.md` — who is who

Brain dump from me: we decided to make it a multi-company job board, LinkedIn-like, not one company's internal HR tool. Many organizations post jobs, applicants browse and apply across companies. Three roles: applicant, recruiter/HR, administrator. The admin model is still open (one platform admin vs. platform admin + company admin). Stack is JavaScript end to end (Node.js backend, React frontend), approved by the instructor. The stakes: this is a graded semester project, 60 % of the course grade, and every team member must own at least 3 use cases end to end. The brief will feed a PRD next. Please do not run web research subagents — this is a course project, not a market launch; keep it lean.


## Turn 01 — Agent

Hi Oleg. Workspace is live and I've read all six inputs. The brief lives at:

`_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/brief.md` (status: draft, memlog seeded)

We can stop and resume any time. At any point you can also call `bmad-party-mode` for multi-agent perspectives or `bmad-advanced-elicitation` for a deeper pass on a section. No web research, as you asked.

**What I have on the table already**, so I won't ask about it:

- **Form factor:** web app, multi-layered, Node.js + React, JS not TS, approved by Dr. Ren. Deployed by Iteration 3.
- **Domain shape:** multi-company job board. Applicants self-register, recruiter and org accounts need admin approval. Fixed pipeline, posting approval and expiry, withdraw-not-edit, one resume, 5 active applications cap, all stages visible, auto-rejection notices with reasons, interviews recorded not coordinated, offers accepted or declined in-system, auto-close when filled, strict per-org privacy.
- **Stakes:** 60 % of the grade, 15 use cases minimum across 5 people, commit history and peer evals graded, three checkpoints at weeks 6, 10, 15-16. Dr. Ren is the customer. The brief feeds a PRD.
- **Open:** admin model (D-005), plus the five backlog questions in QUESTIONS.md.

That calibrates how I'll push: not investor rigor, but every scope choice needs to be defensible to a customer who will grade the justification.

Here is where I want to make you sweat first, because everything downstream depends on it.

**1. "LinkedIn-like" is a shape, not a reason.** The problem statement gives you a domain, not a pain. A brief you're proud of needs to answer: whose life is bad today, and how? Be concrete. Is it the applicant juggling ten company portals with no single view of status? The small employer with no applicant tracking system beyond a shared inbox? A university career center? Pick the person you can picture. If the honest answer is "nobody, it's a demonstration," say so and we'll frame the brief around the engineering story instead. But I suspect you have a stronger answer, and a narrow niche would make your 15-use-case scoping much easier to justify.

**2. What does the Iteration 3 demo look like when it goes well?** Picture the 20 minutes in front of Dr. Ren. What is the one end-to-end flow you'd show, and what makes them say "this team understood the domain"? That answer becomes your success criteria and your scope boundary.

**3. What did I not find in the inputs that you already know?** Three gaps I noticed: the database choice, where you'll deploy, and whether notifications are email or in-app only. Also, does anyone on the team have real experience with a recruiting process, or with Node and React, that shapes what you can realistically build? And anything else on your mind that didn't make it into the files.

Take these in any order. Long answers are welcome.

<!-- turn 01 · 2026-09-05 19:49 · 62s · agent turns 11 · in 98 + cache 122693 / out 4050 tok · $0.92439325 -->


## Turn 02 — Oleg

Good questions. Answers in order, and one pushback at the end.

**1. Whose life is bad today.** Honest answer first: the *real* customer is Dr. Ren, and the project is a graded demonstration. But I don't want a brief that says "nobody". The person I can picture is a **student / early-career applicant** — our classmates — who applies to 20 places through 20 different portals and never knows where anything stands. On the other side: **small employers** (a local Waco business, a campus department, a startup) who have no applicant tracking system at all — applications land in a shared inbox and get lost. LinkedIn serves big companies well; these two groups are underserved. So: "LinkedIn-like" is the shape, "one place where small employers and early-career applicants can see the whole pipeline" is the reason. That niche also gives us a defensible reason to keep the scope small.

**2. Iteration 3 demo.** One golden path, ~10 minutes: a recruiter of "Acme Waco" creates a posting → it waits for admin approval → admin approves, posting goes live → a visitor browses jobs without logging in → registers as applicant, uploads one resume, applies → recruiter sees the application, moves it through the fixed pipeline (applied → screening → interview → offer), records that an interview happened → sends an offer → applicant accepts in the system → posting auto-closes because it is filled. Then a short second path: another applicant is rejected with a reason and gets a notification. What makes Dr. Ren say "they understood the domain": (a) a recruiter from a second company cannot see Acme's applicants — privacy between organizations; (b) approval gates and the 5-active-applications cap actually enforced; (c) we can point from a requirement ID to the use case, the code, and the test. Traceability is graded.

**3. Gaps.**
- Database: not decided by the team yet. I will propose **PostgreSQL** — relational data (organizations, jobs, applications, pipeline stages) and the course recommends a relational DB. If you were going to suggest MongoDB "because JavaScript everywhere", I'd push back: the data is relational and we need to show a proper data model in Iteration 2.
- Deployment: the course names Google Cloud Platform; a free tier like Render or Railway is the fallback. Decision for Iteration 1, not for the brief.
- Notifications: **in-app only** for the semester. Email is a stretch goal, listed as out of scope unless time allows.
- Testing: the course says JUnit-equivalent → **Jest** for Node/React, plus GitHub Issues for tracking. Commit history per person is graded.
- Experience: nobody on the team has worked inside a recruiting process. All five know JavaScript; React and Node experience is mixed (two of us have built small full-stack apps, I work as a freelance developer). So realistic capacity is roughly one substantial use case per person per iteration after Iteration 1.

**Pushback.** Please don't over-index on "market pain". For this brief the engineering goals are first-class success criteria, not background: 15+ use cases (3 per member, each owned end to end), three iteration checkpoints (weeks 6, 10, 15/16), traceability requirement → design → code → test, automated tests, deployment. A brief that reads like a startup pitch would be *wrong* for this customer. Can you draft the brief with two explicit sections — "Product outcome" and "Engineering outcome" — and keep the whole thing under two pages?

Also, one thing I'd like from you rather than from me: propose a first cut of how the ~15 use cases split across the three roles (applicant / recruiter / admin), so the team can see whether the scope is even. Keep the admin model open (D-005) — just note both options.


## Turn 02 — Agent

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

<!-- turn 02 · 2026-09-05 19:51 · 138s · agent turns 6 · in 98 + cache 167247 / out 10308 tok · $1.52259175 -->

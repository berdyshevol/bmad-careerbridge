

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


## Turn 03 — Oleg

I read the brief and the addendum. Structure is right, and dropping "What Makes This Different" and "Vision" was the correct call for this customer. Now your three pushbacks.

**1. Five-active-applications cap — you are right, I'll take the reframe.** Make it "an applicant may hold at most N active applications, where N is a platform business rule maintained by the administrator (default 5)". That fixes the contradiction with the twenty-portals story, gives UC-M4 a concrete reason to exist, and keeps our Deliverable 0 answer valid as the default. In Open Questions, keep one line: the team still needs the customer to confirm the default.

**2. Capacity — you are right that there is no slack, but I will not merge use cases.** Fifteen is a hard floor (3 per member × 5), so merging only moves the problem. What I will change is the iteration plan, to be honest about Iteration 1: Iteration 1 delivers the skeleton (authentication, role-based access, PostgreSQL schema, deployment pipeline, wireframes) plus **three** small-to-medium use cases that exercise the full stack once: UC-A2 browse postings, UC-R2 create posting, UC-M1 approve accounts. Everything else moves: Iteration 2 gets seven (A1, A3, A4, R1, R3, R4, M2), Iteration 3 gets five (A5, R5, R6, M3, M4). Yes, Iteration 2 is heavy. Please write that down as a named risk in the brief with the mitigation we actually have: the shared infrastructure is done by then, and R5 and M3 are the two smallest items, so they are the first to slip into Iteration 3 without breaking the golden path.

**3. Recruiter in multiple organizations (Q-002) — agreed, park it.** Nobody plans to demo it. Move it to the addendum as a parked idea with the note that membership stays one recruiter → one organization for the semester, and that the data model should not make the many-to-many impossible later. Remove the "join a second org" clause from UC-R1.

**Confirmations.** Pipeline stages: applied → screening → interview → offer → hired or rejected, fixed — yes. Public pages: job list and job detail only, everything else behind login — yes.

**Length.** Keep the use-case table in the brief; the team needs to see it on the same page as the scope. Two pages is acceptable. If you want to save space, move the Option A / Option B detail under the table to the addendum and leave one sentence in the brief.

One small addition: under Engineering Outcome, please name the review cadence — weekly team meeting Monday 8 pm, and a peer evaluation at the end of each iteration — because Dr. Ren evaluates individual contribution and we want the brief to show we planned for it.

Then please finalize: memlog audit, polish, and tell me the final paths. No external handoffs — local files only. After that, tell me what BMAD suggests as the next step so I can decide whether to go to the PRD.


## Turn 03 — Agent

The brief is finalized. Local files only, as requested.

**Final paths**

- `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/brief.md` (status final, about 1,600 words, two pages with the table)
- `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/addendum.md` (tech rationale, admin options, rejected and parked, customer questions, capacity, demo script)
- `.memlog.md` in the same folder, 31 entries

**Memlog accounting.** Every decision landed in the brief (niche, golden path, two-outcome structure, configurable cap, 3/7/5 iteration plan, named risk, review cadence, confirmed pipeline and public pages). The PostgreSQL rationale, deployment options, capacity, parked Q-002, and the two course-admin questions landed in the addendum. Process noise set aside: the inputs-read event, the finalize event, and the review-run event.

**Two things I changed that you should confirm.**

1. Your mitigation named UC-R5 and UC-M3 as the items that slip into Iteration 3, but your own plan already puts them there. I rewrote it as "the two smallest items are already placed in Iteration 3, leaving room to absorb an Iteration 2 overrun", and the addendum names UC-A4 as the natural first slip candidate. Logged as an assumption.
2. Option B (company admin) gives 5 / 6 / 5, which is sixteen use cases, not 5 / 5 / 5. I corrected both files and framed the extra one as slack above the floor.

**Review outcome.** The structure and prose lenses produced 33 findings across both files. I applied the comprehension fixes: duplicated scope list, duplicated peer-evaluation statement, per-iteration ID lists that repeated the table, a few ambiguous phrasings. I declined the Microsoft-style items that would change your voice (Title Case headings, spelled-out numbers, "log in" versus "sign in"), and I kept the traceability proof point in Product Outcome because you named it as something shown live at the demo.

**What BMAD suggests next.** You are in the planning phase with the brief complete. Everything below should run in a fresh context window.

- Optional first: `bmad-advanced-elicitation` (pre-mortem or red team) on the brief's Scope section before the team meeting, or `bmad-party-mode` to have the PM, architect, and UX personas argue the admin model. Both are cheap and can sharpen what you take to Dr. Ren.
- Next required: **[PRD] Create PRD**, `bmad-prd`. It reads the brief and addendum and turns the fifteen use cases into requirements with IDs, which is exactly what your traceability chain and the Iteration 1 deliverable need. Point it at the brief folder.
- After the PRD: **[CU] Create UX**, `bmad-ux`, optional but strongly recommended since wireframes are an Iteration 1 deliverable. Then `bmad-architecture` (required, and it produces the written stack rationale you owe in Iteration 1), then `bmad-create-epics-and-stories`.

`bmad-spec` exists as a lighter alternative to the PRD, but for a graded requirements deliverable the PRD is the right call. When you are ready, start a fresh session and run `/bmad-prd` with the brief path as the argument.

<!-- turn 03 · 2026-09-05 19:54 · 514s · agent turns 20 · in 262 + cache 847664 / out 24578 tok · $5.743790000000001 -->

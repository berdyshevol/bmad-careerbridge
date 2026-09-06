# Reconcile: Architecture Spine vs. course requirements and the author's spine rules

Reviewed: `ARCHITECTURE-SPINE.md` (draft, 2026-09-05) against `inputs/group-project-overview.md`, `inputs/group-project-problem-statement.md`, `inputs/DECISIONS.md`, and Oleg's five rules for the document. Spine not edited.

**Verdict.** Course fit is good: every technical expectation in the overview and every "must demonstrate" item in the problem statement has a home, and the rationale section says what Dr. Ren needs to hear. The document fails two of the author's own rules: it is roughly 5 pages against "under two pages" (rule 3), and about a third of its words are rationale, seed, or duplicates rather than would-conflict decisions (rule 1). Three genuine would-conflict decisions are missing (git/merge policy with auto-deploy on `main`, client test tooling Jest-vs-Vitest, the business-layer error vocabulary).

Tiers: **Critical** = violates a stated rule of the document or would cause a wrong build next week; **High** = a real conflict two members would create, or a course expectation with no home; **Medium** = fit or clarity gap worth one edit; **Low** = optional.

---

## Part A — Course fit

### A.1 Coverage of the overview's technical expectations

| Expectation (overview) | Where it lives in the spine | Status |
| --- | --- | --- |
| Web application | Paradigm, ARCH-09, ARCH-16 | Covered |
| Multi-layered: presentation / business / persistence / data management | Folder tree, ARCH-03, ARCH-04; rationale ¶2 | Covered (see A-6 on the `data` layer wording) |
| Maven-based, JUnit; alternatives with documented rationale in Iteration 1 | Rationale section ¶1, ¶2, ¶4 | Covered (see A-1, A-2 to sharpen) |
| Relational DB (PostgreSQL/MySQL) | ARCH-01, rationale ¶3 | Covered; PostgreSQL is the course's own recommendation |
| GCP "or another approved deployment environment" | ARCH-16, rationale ¶5 (explicit request), Open Q 1 | Covered; approval still pending |
| Git from the beginning, commit history graded | ARCH-05 (one repo); rationale ¶1 | Partially: no branch/merge/PR policy (B-M1) |
| Issue tracking (GitHub Issues fixed by Oleg) | Only the intro sentence "stories, issues, and tests cite them" | Gap: not stated as a rule (A-4 / B-M1) |
| Automated testing | ARCH-02, ARCH-04, Conventions "Tests", rationale ¶2, ¶4 | Partially: tooling beyond Jest not named (B-M2) |
| Traceability requirements → design → implementation → testing | ARCH-04 (FR IDs in test names, one module per use case), Capability map, rationale ¶2 | Covered for requirements → code → test; "design" link missing (A-3) |
| UML modeling; architecture and detailed design (Iteration 2) | Not mentioned; spine uses Mermaid flowcharts and an ER diagram | Gap (A-3) |
| Everyone owns ≥3 use cases through analysis, design, implementation, testing | ARCH-04 (module owned by use-case owner); map has 15 use cases + FR-X for 5 members | Covered; ownership itself is a PM/sprint decision, not architecture (A-7) |
| Code documentation | Not mentioned | Minor gap (A-8) |
| Deployment | ARCH-16 | Covered |
| Team website (end of semester) | Not mentioned; not architecture | Fine to omit |

### A.2 Coverage of the problem statement's "must demonstrate" list

| Problem-statement item | Home in the spine |
| --- | --- |
| Multiple interacting user roles | Three roles throughout; ARCH-10 actor shape |
| Role-based access control | ARCH-08 (session reloads Account each request), ARCH-10 (role in middleware, scope in business, org in the query), ARCH-11 (403) |
| Business logic beyond CRUD | ARCH-12 (state machines), ARCH-13 (guarded transactions, cascade), ARCH-15 (derived expiry), ARCH-17 (resume snapshot) |
| Persistent data management | ARCH-01, ARCH-02, ARCH-18, ER seed |
| Coherent recruiting workflow | Fixed by PRD §3; ARCH-12 encodes it |
| Appropriate software architecture | Paradigm + ARCH-03/04 |
| Automated testing | Conventions "Tests" |
| Deployment as a web application | ARCH-16 |
| Authorization rules | ARCH-10 |
| Appropriate exceptions and failure conditions | Conventions "Error envelope", ARCH-12 `InvalidTransitionError`, ARCH-11. **Thin**: the business layer's error vocabulary is not defined, so "rule violations 409" has no named class (B-M3). |

### A.3 Findings for Part A

**A-1 [Medium] Rationale frames Jest as a departure that the course text does not require justifying.**
The overview says "JUnit or an equivalent automated testing framework". Only two things actually need an exception: the build tool (Maven → npm workspaces) and the language/backend (Java + Spring → Node + Express). Presenting Jest as already within the letter of the course strengthens the request.
*Suggested edit (rationale ¶4):* "Jest is the 'equivalent automated testing framework' the course text already allows: one runner for backend and frontend, first-class in Node, and run by GitHub Actions without extra tooling. The two departures that need approval are the build tool and the backend language, below."

**A-2 [Medium] Add a one-glance mapping table "course default → our choice → status".**
Dr. Ren will scan for what changed and what did not. Five things are kept (React, PostgreSQL, GitHub, CI, layered architecture), three changed (Java/Spring → Node/Express, Maven → npm, GCP → Render+Neon pending approval), one equivalent (JUnit → Jest). The prose has all of it; a table makes it auditable in ten seconds and costs no page budget in the body (the rationale is exempt).
*Suggested edit:* insert before ¶1: `| Course default | CareerBridge | Status |` with rows: Java + Spring Boot → Node 22 + Express 5 (verbal approval, D-004; written here); Maven → npm workspaces (`package.json` = pom, `npm ci` = install, `npm test` = test, `npm run build` = package, lockfile = reproducible build); JUnit → Jest (course-allowed equivalent); React → React (kept); PostgreSQL → PostgreSQL (kept); GitHub → GitHub + Actions + Issues (kept); GCP → Render + Neon (**approval requested**; Cloud Run + Cloud SQL fallback).

**A-3 [Medium] UML/modeling has no home, and the "design" link in traceability is asserted but not defined.**
The overview lists "UML modeling" and Iteration 2 requires "system architecture and detailed design"; documentation must "evolve as the implementation evolves". The spine's diagrams are Mermaid, not UML, and nothing says which UML models exist, where they live, or how they cite FR/ARCH IDs. Five people will pick five tools (Lucidchart, draw.io, PlantUML, Mermaid, StarUML) and the diagrams will rot in someone's Google Drive. Format and location is a would-conflict decision even if the content is the Design role's (Josh).
*Suggested edit (Conventions row):* "Models: UML as text in the repo (`docs/models/`, PlantUML or Mermaid, one format, chosen by Design in the scaffold story); one sequence diagram per use case, owned by the use-case owner, titled with the UC ID and citing the ARCH IDs it obeys; class diagram per layer maintained by Design." Add to rationale ¶2 one clause: "design: UML models in the repo cite the same IDs, so requirement → model → module → test is one grep."

**A-4 [Medium] Issue tracking is a fixed decision (rule 5) but appears nowhere as a rule.**
Course requires an issue tracker and "sufficient records to demonstrate individual contributions". The spine's only mention is the word "issues" in the intro. Fold into the git-policy row proposed in B-M1.

**A-5 [Low] Verbal approval needs a date and a written confirmation request.**
D-004 says "early Sep 2026" and "rationale still to be documented". The rationale says "approved verbally in early September 2026". Dr. Ren may not remember which team.
*Suggested edit (rationale ¶1):* "…approved verbally by Dr. Ren at the lecture of <date> (D-004); this section is the written rationale the course requires in Iteration 1, and we ask for written confirmation with the Iteration 1 feedback."

**A-6 [Low] Say in the rationale what each of the four layers is concretely, so the `data` folder does not read as "just migrations".**
The course phrase is "data management". ARCH-01 already puts rules (constraints, partial unique indexes, audit trigger) in Postgres; ARCH-04 says "never skipping" layers. Dr. Ren may ask "what is your data-management layer at runtime?"
*Suggested edit (rationale ¶2):* "…four layers as folders: presentation (Express routers, validation, error mapping), business (one module per use case, state machines), persistence (Knex repositories, transactions), data management (the PostgreSQL schema itself: migrations, constraints, partial unique indexes, audit trigger — rules the database enforces regardless of the code path)."

**A-7 [Low] "Everyone owns three use cases" is satisfied structurally; consider an Owner column in the capability map only if the map stays in the document.**
The map has exactly 15 use cases for 5 members. Owner assignment belongs to sprint planning / TEAM.md, not the spine. If the map moves to a companion file (C-4), add the column there.

**A-8 [Low] Code documentation expectation.**
Nothing in the spine. One clause suffices and doubles as traceability: "each use-case module starts with a JSDoc block naming its UC and the FR IDs it satisfies" (Conventions "Naming" row, +12 words). Lint config is already deferred to the scaffold story.

**A-9 [Low] Rationale references internal IDs (ARCH-nn, FR-, NFR-, A-18, SC-3) that stand alone only if the spine and PRD are submitted alongside.**
Fine if the whole spine is in the Iteration 1 deliverable; if only the section is lifted, add one line: "IDs refer to the CareerBridge PRD and Architecture Spine, submitted with this iteration."

**What the rationale says well and should keep:** the three PRD rules derived to Postgres (transaction, partial unique indexes, insert-only audit trigger) — this is exactly the "technical rationale" the course asks for; the explicit Render/Neon approval request with a no-code-change fallback; the "why not TypeScript" paragraph; the accepted trade-offs list.

---

## Part B — Conflict-only test

Test applied to each entry: *if two members decided this independently next week, would their code be incompatible?* Entries that pass are binding; entries that fail are rationale (belongs in `.memlog.md`, where the memlog already holds it verbatim), seed (belongs in code or the ER diagram), duplicate, or restated PRD requirement.

### B.1 ARCH-01..18

| ID | Would-conflict? | Verdict | Non-binding content to cut |
| --- | --- | --- | --- |
| ARCH-01 Postgres only | Yes (engine choice) | **Keep** | The enumerated enforcement list duplicates ARCH-13/ARCH-18 and rationale ¶3. Keep "PRD rules that a constraint or trigger can enforce are enforced in Postgres, not only in code" and drop the examples (−25 w). |
| ARCH-02 One Postgres, three places | Yes (SQLite for tests, shared Neon for tests) | **Keep** | "Prevents" line → memlog. Neon-branch fallback sentence is fine (it sanctions a real deviation). |
| ARCH-03 Express 5 + Knex, only persistence imports | Yes | **Keep** | Nothing. See B-M5 for the session-store exception it needs. |
| ARCH-04 Layer-first, one module per use case | Yes, the core decision | **Keep** | Nothing; this is the best-written entry. Note: `data/` has no importable module, so "never skipping" effectively governs presentation → business → persistence (B-M5). |
| ARCH-05 One repo, npm workspaces | Yes (two repos) | **Keep, shrink** | Already visible in the folder tree; one line: "One repo; `server/` and `client/` are npm workspaces; root `npm test` runs both and CI runs exactly that." (−10 w) |
| ARCH-06 Frontend stack + one API wrapper | Yes | **Keep** | "Prevents" → memlog. |
| ARCH-07 Component library chosen by UX doc | **No** — it is a deferral, already listed under Deferred; its "rule" restates NFR-8/NFR-9 | **Cut to a Deferred line** | "Component library: UX document decides; must give accessible form controls and work at 375 px; MUI until then." (−30 w) |
| ARCH-08 Server-side session, cookie | Yes (JWT in localStorage) | **Keep** | "Decided against JWT: …" is rationale → memlog (−25 w). |
| ARCH-09 Single origin | Yes | **Merge into ARCH-16** | It is the same fact as ARCH-16's "one image running Express and serving the built client"; add "API under `/api`; Vite proxies `/api` in dev" there (−20 w). |
| ARCH-10 Role / scope / organization in query | Yes, core | **Keep** | "The FR-R3-3 demo proof is a test against (2) and (3)" → memlog (−12 w). |
| ARCH-11 403 + UUID | Yes, but both halves already live elsewhere: UUID in Conventions "Ids"; 403 is PRD FR-R3-3 restated | **Merge into Conventions** | Add "out-of-scope record → 403 (FR-R3-3), not 404" to the error-envelope row; delete the entry (−25 w). |
| ARCH-12 Pure state-machine modules | Yes | **Keep** | Nothing. |
| ARCH-13 One guarded transaction | Yes, core | **Keep** | Nothing; the cascade example is binding (it fixes the module boundary). |
| ARCH-14 No event bus | Yes, but it is a corollary of ARCH-13 | **Merge into ARCH-13** | One sentence + the grep check: "No in-process emitter or bus for domain events; Notifications are written by the use-case module inside the same transaction. Check: `grep -rn "EventEmitter\|\.emit(" server/src` is empty." (−30 w) |
| ARCH-15 Expired derived on read | Yes (scheduler vs. derived) | **Keep** | Nothing. |
| ARCH-16 One image, env vars, Render + Neon, CI | Yes | **Keep, trim** | The CI sentence duplicates ARCH-02/ARCH-05; keep "GitHub Actions on every push; Render auto-deploys `main` on green" (−15 w). "Warmed before every presentation" is ops, not architecture → Open Questions or memlog (−6 w). |
| ARCH-17 Resumes as immutable `bytea` | Yes (disk / S3 / bytea; snapshot per application) | **Keep** | "(PRD A-2 said 5 MB; adjusted…)" → Open Q 2 already says it (−12 w). |
| ARCH-18 Data ownership | Yes for four sentences; **no** for the rest (schema seed) | **Split: keep 4 rules, move the rest to the ER note** | Keep: (a) Application created only by the apply use case, mutated only through ARCH-12 transitions, two non-null parents; (b) Stage history and rejection reason are read from `audit_events`, never stored twice; (c) Notification written only inside a use-case transaction, never deleted, only `read_at` mutable by the recipient; (d) `audit_events` is insert-only by trigger; cascade rows record the triggering actor. Move to "Reference tables not drawn": the audit column list, `settings`, `categories`/`locations` active flag, `stage_labels`, `interviews` table, `entity_type`/`entity_id` (−80 w). |

### B.2 Consistency Conventions

| Row | Would-conflict? | Verdict |
| --- | --- | --- |
| Naming | Yes | Keep. |
| Ids, dates, enums | Yes | Keep (absorbs ARCH-11's UUID). |
| Error envelope | Yes | Keep; add the business error classes (B-M3) and the 403 rule from ARCH-11. |
| Auth and config | Partly: `actor` shape duplicates ARCH-10; `config.js` single read is binding | Keep the config half; drop the `actor` clause (−10 w). |
| Tests | Yes, but incomplete | Keep; add tooling and fixture strategy (B-M2, B-M4); drop "FR IDs verbatim" (already in ARCH-04). |

### B.3 Other sections against rule 1

- **Design Paradigm Mermaid flowchart** — duplicates the folder tree, which is the binding artifact (paths). Cut the flowchart, keep the tree (−¼ page).
- **Stack table** — versions *are* would-conflict (Express 4 vs 5, Router 6 vs 7), but a table with "confirm at scaffold time" is seed for `package.json`. Compress to one sentence (−60 w, no table).
- **Structural Seed: environment flowchart** — pictures ARCH-02/09/16; nothing new. Cut (−¼ page).
- **Structural Seed: ER diagram** — relationships are would-conflict and this is the Iteration 2 data-model seed. Keep if the budget allows; otherwise move to companion `data-model.md` and cite it from ARCH-18.
- **Capability → Architecture Map** — self-declared seed ("the code owns them once written"). It is also the only requirement → module → ARCH table, which Dr. Ren wants. Move to companion `capability-map.md`, listed in frontmatter `companions`, referenced in one line from ARCH-04 (−184 w).
- **Deferred** items 4–6 (poll interval, admin option B, email/AI) are memlog/roadmap, not decisions someone needs next week. Keep 1–3 (−70 w).
- **Open Question 3** (Postgres major) duplicates ARCH-02 "same major version everywhere". Cut (−20 w).
- **"Binds:" lines** — useful for citation; keep but inline as a trailing parenthetical on the title line.
- **"Prevents:" lines** — pure rationale in every entry; memlog already holds each one. Cut all 18 (−220 w).

### B.4 Missing would-conflict decisions

**B-M1 [High] Git branching, merge, and review policy — with `main` auto-deploying to production.**
ARCH-16 says Render auto-deploys `main` on green and CI runs on every push. Nothing says whether members push to `main` directly or via PR, whether review is required, what branches are named, or how merges happen. Consequences: (1) a direct push to `main` is a production deploy from an unreviewed laptop; (2) squash-merge vs. merge-commit changes whose name is on the commits, and *commit history is graded per member*; (3) GitHub Issues (fixed by rule 5) is unnamed. Two members will do this two ways on day one.
*Suggested edit (new Conventions row or ARCH-19 "Repository workflow"):* "GitHub Issues is the tracker; one issue per story, titled with its UC/FR ID. Branch `<issue#>-<slug>` from `main`; PR into `main` with CI green and one reviewer who is not the author; merge commits (not squash) so each member's commits survive for grading; `main` is branch-protected; nobody pushes to `main` directly. Deploy = merge."

**B-M2 [High] Client test tooling: Jest is fixed, but Vite's default is Vitest.**
Jest is non-negotiable (rule 5), yet the Stack table lists only "Jest 30.x" and the Tests row covers only `business/`, repositories, and routes. Whoever scaffolds `client/` with Vite will get Vitest by default; whoever writes route tests will pick supertest or raw `fetch`; whoever tests components will pick React Testing Library or Enzyme. Three independent tooling choices, all conflicting with each other or with rule 5.
*Suggested edit (Tests row):* "Jest everywhere, including `client/` (not Vitest); client: Jest + jsdom + React Testing Library, `*.test.jsx` beside the component; server routes: supertest against the Express app with the disposable database; `business/` unit tests mock repositories with `jest.mock`." Add `jsdom`, `@testing-library/react`, `supertest` to the stack line.

**B-M3 [High] Business-layer error vocabulary.**
The error-envelope row maps "validation 400, unauthenticated 401, forbidden 403, not found 404, `InvalidTransitionError` and rule violations 409" but names only one class. Every use-case owner will invent their own (`throw new Error('cap reached')`, `NotAllowedError`, `{status: 409}`), and `presentation/errors.js` cannot map what it cannot recognise. This is also the problem statement's "appropriate exceptions and failure conditions" — its home is currently one table cell.
*Suggested edit (Error envelope row):* "Business throws only classes from `business/errors.js`: `ValidationError` (400), `ForbiddenError` (403, includes out-of-scope records per FR-R3-3), `NotFoundError` (404), `RuleViolationError` (409; `InvalidTransitionError` extends it), each with a stable `code`. Business never sets HTTP status. Anything else is 500 with a generic message and a server-side log."

**B-M4 [Medium] Test data strategy against the disposable database.**
"Tests run only against a disposable database" (ARCH-02) does not say how a test gets its rows: shared seed, per-file truncate, transaction-rollback per test, factories. Mixed strategies produce order-dependent, flaky suites within weeks, and "the graded suite must stay fast" was Oleg's deciding reason for ARCH-02.
*Suggested edit (Tests row):* "Each server test file migrates once, truncates all tables `beforeEach`, and creates its rows through factory helpers in `server/test/factories.js`; the dev seed is never a test fixture; tests run serially against the database (`--runInBand`) until proven otherwise."

**B-M5 [Medium] Where the session store gets its database connection.**
ARCH-08 stores sessions in Postgres via `connect-pg-simple`, which needs a `pg` pool or connection string and is configured in presentation (`app.js`). ARCH-03 says `db.js` appears only under `persistence/`; ARCH-04 says presentation never skips business. The scaffolder must break one of the two rules or invent a second pool. Decide the exception now.
*Suggested edit (ARCH-08):* "The session store is the one presentation → persistence import: `persistence/db.js` exports the `pg` pool it shares with Knex, and `app.js` passes it to `connect-pg-simple`." Also note in ARCH-04 that `data/` has no importable module, so the dependency rule is presentation → business → persistence.

**B-M6 [Medium] Success envelope and list shape for API responses.**
The error envelope is fixed; the success shape is not. One owner returns a bare array, another `{ data, total }`, a third `{ items, page }`; TanStack Query consumers and every list page then differ. Page size is rightly deferred to stories, but the envelope is cross-cutting.
*Suggested edit (new Conventions row "Responses"):* "Single resource: the object; list: `{ "items": [...], "total": n }`; mutations return the updated resource; 204 only for logout."

**B-M7 [Medium] Use-case module signature and how repositories reach it.**
ARCH-10 fixes `actor` as the first argument; nothing fixes the rest. Options members will pick independently: `(actor, input)` with repositories `require`d directly, or `(actor, input, deps)` with injected repositories, or `(req)`. The choice determines how unit tests mock persistence (B-M2) and how `withTransaction` handles are passed (ARCH-13).
*Suggested edit (ARCH-04 or Naming row):* "Signature `module.exports = async function verbNoun(actor, input)`; repositories are `require`d directly and mocked in unit tests with `jest.mock`; a transaction handle is passed as a trailing argument to repository calls, never to another use case."

**B-M8 [Low] Seed Administrator credentials.**
"Seed Administrator" appears in the map; its password source is unstated. One line: "from `ADMIN_EMAIL`/`ADMIN_PASSWORD` environment variables; the seed refuses to run without them" (fits the config row).

---

## Part C — Length

**Measured.** Whole file 2,991 words. Rationale section 598; frontmatter 66. Body excluding both: **2,327 words**, of which about 200 are inside the four code/diagram blocks (paradigm flowchart, folder tree, environment flowchart, ER diagram).

**Estimate at 500 words/page, diagrams ¼ page each:** 2,130 prose words ≈ 4.3 pages + 4 diagrams × ¼ = 1.0 page → **≈ 5.3 pages**. The Invariants section alone (1,377 words) is 2.75 pages. **Does not meet "under two pages"; it is about 2.6× over.**

**Target.** Under two pages ≈ ≤ 900 prose words + one diagram (folder tree), or ≤ 750 words + two diagrams.

### C.1 Cuts in priority order (least binding content lost first)

| # | Cut | Saves | Loses |
| --- | --- | --- | --- |
| C-1 | Delete all 18 "Prevents:" lines (memlog holds each verbatim) | ~220 w | Nothing binding |
| C-2 | Delete the Design Paradigm Mermaid flowchart; keep the folder tree | ¼ page + 40 w | Nothing (tree carries the paths) |
| C-3 | Delete the Structural Seed environment flowchart | ¼ page + 45 w | Nothing (ARCH-02/16 say it) |
| C-4 | Move the Capability → Architecture Map to companion `capability-map.md`; one pointer line in ARCH-04; list in frontmatter `companions` | ~175 w | Nothing binding (self-declared seed); Dr. Ren's traceability table survives in the companion |
| C-5 | Compress the Stack table to one sentence: "Node 22 LTS, Express 5, Knex 3 + pg 8, PostgreSQL 17 (match Neon), React 19 + Vite 6, React Router 7 (library mode), TanStack Query 5, MUI 7, Jest 30, bcrypt, express-session + connect-pg-simple; pinned in `package.json` at scaffold." | ~55 w + table | Nothing |
| C-6 | ARCH-18: keep the four ownership rules, move schema detail to the ER note (B.1) | ~80 w | Nothing binding |
| C-7 | Strip in-rule rationale: ARCH-08 JWT sentence, ARCH-01 example list, ARCH-10 demo-proof clause, ARCH-16 CI duplicate + warming, ARCH-17 A-2 parenthetical | ~95 w | Nothing (memlog / Open Q 2 hold them) |
| C-8 | Deferred: keep items 1–3, drop 4–6; drop Open Q 3 | ~90 w | Roadmap notes only |
| C-9 | Merge ARCH-14 → ARCH-13, ARCH-09 → ARCH-16, ARCH-11 → Conventions; ARCH-07 → Deferred line | ~105 w | Nothing binding; four fewer headings |
| C-10 | Drop the `actor` clause from the config row; drop "FR IDs verbatim" from the Tests row (both in ARCH-04) | ~20 w | Nothing |

Cumulative after C-1..C-10: ≈ 2,130 − 925 ≈ **1,200 words + 2 diagrams (tree, ER) ≈ 2.9 pages**. Adding the missing decisions from B.4 (B-M1..M7 ≈ +180 w) brings it to ≈ 3.2 pages.

### C.2 What it takes to actually get under two pages

The remaining 14 entries average ~60 words each in the current "title / Binds / Prevents / Rule" layout. Two further steps are needed, and they are format changes rather than content losses:

| # | Step | Result |
| --- | --- | --- |
| C-11 | Move the ER diagram to companion `data-model.md` (it is the Iteration 2 database-design seed anyway); ARCH-18 cites it | −¼ page |
| C-12 | Render each ARCH as **one paragraph of ≤ 40 words**: bold `ARCH-nn — title (binds: …)` followed by the Rule only; no bullet scaffolding. Example: "**ARCH-15 — Expired is derived on read** (FR-M2-4, FR-A2-1, FR-A3-1, FR-M4-4). Stored status stays `live`; `postingRepository.isEffectivelyLive` (live and expiry after now) is the only definition of Live and every reader uses it; expiry writes no audit row." (36 w) | 14 × 40 = 560 w for Invariants |

Projected final: intro 30 + paradigm sentence 25 + folder tree (¼ page) + Invariants 560 + Conventions ~300 (including the B-M rows) + stack sentence 55 + Deferred/Open Q 60 ≈ **1,030 words + ¼ page ≈ 2.3 pages**; with the Conventions rows kept terse (~220 w) ≈ **950 words ≈ 2.1 pages**. Getting strictly under two pages then depends on the page metric (dense markdown at 550–600 words/page renders under two; at 500 it lands at "about two"). If Oleg wants a hard guarantee, the last lever is a table for the Invariants (`ID | Rule | Binds`), which drops another ~100 words of headings.

### C.3 On ID stability while cutting

Rule 2 says IDs are stable. The document is a draft created today and no story cites it yet, so renumbering once (before the Monday 2026-09-07 meeting) is acceptable; after that, retire numbers (leave gaps, e.g. "ARCH-11 retired → Conventions") rather than renumber. Either way, the capability map and the `Governed by` column must be updated in the same edit.

---

## Consolidated findings by tier

| Tier | ID | Finding | Edit |
| --- | --- | --- | --- |
| Critical | C | Body ≈ 5.3 pages vs. "under two pages" (rule 3) | Apply C-1..C-12 in order; C-1..C-10 lose no binding content |
| High | B-M1 | No branch/merge/review policy while `main` auto-deploys; GitHub Issues unnamed; merge strategy affects graded commit history | Add "Repository workflow" row/ARCH-19 |
| High | B-M2 | Client test tooling unnamed; Vite defaults to Vitest against fixed Jest; route/component test libs unpicked | Extend Tests row; add to stack sentence |
| High | B-M3 | Business error vocabulary undefined; "exceptions and failure conditions" has only a table cell | Name four error classes in `business/errors.js` |
| Medium | A-1 | Jest framed as a departure the course text already permits | Reframe rationale ¶4 |
| Medium | A-2 | No course-default → choice → status table for Dr. Ren | Add table to the rationale |
| Medium | A-3 | UML/modeling format and location undecided; design link in traceability undefined | Add "Models" row; one clause in rationale ¶2 |
| Medium | A-4 | Issue tracking not stated as a rule | Covered by B-M1 |
| Medium | B-M4 | Test fixture strategy unstated | Extend Tests row |
| Medium | B-M5 | Session store needs a pool: ARCH-03/04 vs ARCH-08 contradiction for the scaffolder | Name the one presentation → persistence import |
| Medium | B-M6 | Success/list response envelope unfixed | Add "Responses" row |
| Medium | B-M7 | Use-case module signature and repository access unfixed | One sentence in ARCH-04 |
| Medium | B.1 | ARCH-07 is a deferral; ARCH-09/11/14 are duplicates or corollaries; ARCH-18 is ⅔ schema seed | Cut/merge per B.1 |
| Low | A-5 | Verbal approval undated; no written-confirmation request | Add date + request |
| Low | A-6 | Data-management layer not spelled out for Dr. Ren | One clause in rationale ¶2 |
| Low | A-7 | Owner column only if the map stays | Put in companion |
| Low | A-8 | Code documentation expectation unaddressed | JSDoc clause in Naming row |
| Low | A-9 | Rationale depends on internal IDs | One-line note if lifted alone |
| Low | B-M8 | Seed Administrator credentials source | Env vars in config row |

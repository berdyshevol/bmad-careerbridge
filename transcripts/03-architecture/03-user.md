You convinced me on the database placement. The test-speed argument is the one that matters — if the Jest suite is slow, people stop running it, and that suite is graded. **Record ARCH-02 as you wrote it:** local Docker Compose is the developer and CI database, Neon hosts production, same major version pinned, `DATABASE_URL` is the only difference, personal Neon branch is the fallback for a laptop that cannot run Docker.

Decision 2:
- **(a) Express 5 + Knex — agreed.** Your reason for rejecting Prisma is the one I will repeat to the team: it makes the persistence boundary invisible, and the boundary is graded. Record the rule "only files under `persistence/` import knex" as a checkable rule in the spine, not as prose.
- **(b) One repository, npm workspaces — agreed.** The team repo already exists (`careerbridge-csi5324`); the `server/` + `client/` layout goes into it in Iteration 1.
- The **one module per use case** idea in the business layer is the best thing in this document so far. It solves merge conflicts and gives every FR a file to trace to. Please make it explicit that the use-case module's test file is the place where FR IDs appear in test names (NFR-10).

Decision 3:
- **(c) Vite + React Router + TanStack Query + one `api.js` wrapper, no state library — agreed**, including the prohibition. Write the rule as "components never call fetch; no global state library" so it is greppable.
- **(d) Component library — pushback.** This is a UX decision and it belongs to our Design Engineer, not to the spine. Record only the *constraint* the library must satisfy: accessible form controls out of the box (labels, keyboard — NFR-9) and usable at 375 px (NFR-8). Name MUI as the default if the UX document does not choose otherwise, so nobody starts hand-rolling CSS in week one. `bmad-ux` runs right after this, so the decision will not stay open long.

I trust the pattern now. To save time, give me **decisions 4 to 7 in one message** — auth and role-based authorization with per-organization privacy; where the two state machines live and how transitions are enforced (NFR-4); deployment target; data ownership for Applications, Notifications, and audit records. Same style: argument, lean, and the questions you need me to answer. After my reply, finalize the spine with the stack rationale section for Dr. Ren.

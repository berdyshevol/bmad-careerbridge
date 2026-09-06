The spec is ready and there are no open questions. One gate to report: the spec is over the 1600-token scope target.

**Spec:** `_bmad-output/implementation-artifacts/spec-1-2-stored-enums-and-the-two-state-machines.md`

**Size gate.** The spec is about 1,850 tokens against a 1,600 target. Most of the weight is the transition matrix table, which is the deliverable itself. The story is one goal, so I recommend **Keep full spec** rather than splitting. Tell me if you would rather I trim the matrix to a pointer at the epics ACs.

**Plan summary**

- **Module system:** CommonJS. The architecture's lint greps and the "server CommonJS with supertest" decision assume it.
- **Minimum Story 1.1:** only `server/package.json` with Jest as a devDependency and `npm test` running from inside `server/`. Lockfile committed. No root workspace file, no CI, Docker, lint, or client.
- **New modules** under `server/src/business/`:
  - `errors.js` with all twelve S9 classes, each carrying `name` and the envelope `code`, no HTTP status.
  - `domain/enums.js` with the nine frozen S1 sets, including `POSTING_STATUS_EFFECTIVE` (stored plus `expired`).
  - `domain/postingStatus.js` exporting the frozen transition map, `assertTransition`, and `assertPostingAllows`.
  - `domain/applicationStage.js` exporting the frozen map and `assertTransition`.
- **Transition maps** taken verbatim from the story ACs and PRD §3. Posting: 7 allowed edges out of 49 cells. Application: 11 allowed edges out of 64 cells. `expired` is a valid source only, never a target.
- **Tests:** one named `test` per matrix cell, generated from a literal allowed-edge table so nothing is skipped. Every name carries `NFR-4` plus the FR the edge evidences (FR-R2-3, FR-M2-2, FR-M2-3, FR-R2-6, FR-M2-5, FR-R6-2 for postings; FR-R4-1, FR-R4-2, FR-R4-3, FR-A4-3, FR-A4-4, FR-R6-1, FR-A5-4, FR-A5-5 for applications; FR-R4-4 for the 56 `assertPostingAllows` cells). Messages are asserted to name both states.
- **Judgment calls I made:** unknown status strings also throw `InvalidTransitionError` naming the value. FR-R4-2 tags the `→ rejected` edges even though the story's list omits it.

---

Before approving, you can open the spec file in an editor or ask me questions and tell me what to change. You can also use `bmad-advanced-elicitation` or `bmad-party-mode`, ideally in another session to avoid context bloat.

---

Your choice:

- **Approve and continue** — approve the spec and proceed to implementation in this session.
- **Approve and stop** — approve the spec, leave it `ready-for-dev`, and stop so a fresh `bmad-build` session can resume at implementation.
- **Review spec** — review the spec with a subagent and discuss findings before approving.

(Approving also counts as **Keep full spec** for the size gate unless you say otherwise.)
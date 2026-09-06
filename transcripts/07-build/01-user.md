/bmad-build Story 1.2 from _bmad-output/planning-artifacts/epics.md — "Stored enums and the two state machines"

Build exactly this one story, in this sandbox repository. Context you must read first: the story text in `epics.md` (Epic 1, Story 1.2), the architecture rules it cites (`ARCH-12 State machines are pure business modules`, `ARCH-04`, `ARCH-14`) in `_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/ARCHITECTURE-SPINE.md` and `SHAPES.md`, the PRD state model (`prd.md` §3) and the FRs the story realizes.

Scope rules for this session:
- Story 1.1 (repo skeleton) has not been built. Create the **minimum** of it that Story 1.2 needs to run: `server/package.json` (plain JavaScript, ESM or CommonJS — your call, note it), Jest configured, `npm test` working. Nothing else from 1.1 — no CI, no Docker, no client.
- Deliver the two pure modules under `server/src/business/` exactly as ARCH-12 describes (allowed-transition maps + `assertTransition(from, to)` throwing a human-readable `InvalidTransitionError`), the stored/effective enum exports the story lists, and **exhaustive unit tests of every allowed and forbidden edge** with the FR IDs in the test names (NFR-10 convention from the story).
- Show me the plan and wait for my approval before writing code. After approval: implement, run the tests, review, fix, and commit locally with a message that cites the story and FR IDs.
- No web research, no external handoffs. Do not push.

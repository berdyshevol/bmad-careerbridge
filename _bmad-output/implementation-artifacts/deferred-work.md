# Deferred work

- source_spec: `spec-1-2-stored-enums-and-the-two-state-machines.md`
  summary: Enforce the ARCH-12 import boundary (`business/domain/*.js` may require only `./enums` and `../errors`) automatically, as a lint rule or CI grep next to the ARCH-03/06/14 greps in Story 1.1.
  evidence: Today the boundary is verified only by the manual grep in the spec's Verification section; adding `require('../../persistence/db')` to `postingStatus.js` would leave `npm test` green. The architecture spine already routes boundary greps to the scaffold story's lint/CI step.
  status: done — Story 1.1's `scripts/check-boundaries.js` rule 4 (ARCH-12) closes this; `npm run lint` now fails on the exact `postingStatus.js` probe above.
- source_spec: `spec-1-1-one-repository-two-workspaces-and-a-green-ci.md`
  summary: Add fixture-based Jest tests for `scripts/check-boundaries.js`'s four rules (ARCH-03/06/12/14), each asserting a temp violation is detected and exit code is non-zero.
  evidence: Today the only proof the four rules actually fire is the one-off manual probes captured in this story's Implementation Notes, run once and reverted. If a future edit to a regex, the ARCH-12 allowlist, or the `hits.length > 0` gate silently breaks detection, `npm run lint` would keep printing `boundaries OK` and CI would stay green even with a real ARCH-03/06/12/14 violation in the tree.

# Deferred work

- source_spec: `spec-1-2-stored-enums-and-the-two-state-machines.md`
  summary: Enforce the ARCH-12 import boundary (`business/domain/*.js` may require only `./enums` and `../errors`) automatically, as a lint rule or CI grep next to the ARCH-03/06/14 greps in Story 1.1.
  evidence: Today the boundary is verified only by the manual grep in the spec's Verification section; adding `require('../../persistence/db')` to `postingStatus.js` would leave `npm test` green. The architecture spine already routes boundary greps to the scaffold story's lint/CI step.

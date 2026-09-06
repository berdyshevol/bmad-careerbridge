---
title: 'Story 1.2: Stored enums and the two state machines'
type: 'feature'
created: '2026-09-05'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Every use case in Epics 2–16 changes a Posting status or an Application stage. Without one shared, pure rulebook each branch would encode its own transitions and NFR-4 ("every state change validated in the business layer, refused with a human-readable message") would have no single piece of evidence.

**Approach:** Create `server/src/business/domain/{enums,postingStatus,applicationStage}.js` and `server/src/business/errors.js` as pure CommonJS modules with no I/O, plus exhaustive Jest tests naming every cell of both transition matrices with their FR IDs. Bootstrap only the minimum of Story 1.1 needed to run them: `server/package.json` with Jest.

**Decisions:**
- Module system: **CommonJS** (architecture's `require('knex')` lint greps and "server CommonJS with supertest" assume it).
- Only `server/package.json` is created; `npm test` runs from `server/`. No root workspace file, CI, Docker, lint, or client.
- Posting map is keyed over `POSTING_STATUS_EFFECTIVE` (7 values, `expired` included as a source, never as a target). Application map over `APPLICATION_STAGE` (8 values).
- Unknown status/stage strings passed to either assertion throw `InvalidTransitionError` too, with a message naming the unknown value.
- Test names carry the FR IDs the edge evidences (see matrix) and `NFR-4` on every state-machine test.

## Boundaries & Constraints

**Always:** Enum sets are `Object.freeze`d arrays with the exact S1 strings. `postingStatus.js` and `applicationStage.js` import nothing but `./enums` and `../errors`. Error messages name both states in words (e.g. "A live posting cannot become draft"). `InvalidTransitionError` extends `RuleViolationError`; every S9 class carries `name` and the S9 `code`, never an HTTP status.

**Never:** No database, Knex, Express, EventEmitter, or `process.env`. No transition logic outside these two modules. No TypeScript. No `canTransition` helpers beyond what ARCH-12 names. Do not build the rest of Story 1.1.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Posting allowed (7 edges) | `draft→pending_approval` (FR-R2-3), `rejected→pending_approval` (FR-R2-3), `pending_approval→live` (FR-M2-2), `pending_approval→rejected` (FR-M2-3), `live→filled` (FR-R6-2), `live→closed` (FR-R2-6, FR-M2-5), `expired→filled` (FR-R6-2) | returns undefined | N/A |
| Posting forbidden (42 cells) | every other cell of the 7×7 matrix incl. same-to-same, any `to=expired`, anything out of `filled`/`closed` | throws | `InvalidTransitionError`, message names both statuses |
| Application allowed (11 edges) | `applied→screening`, `screening→interview` (FR-R4-1); `interview→offer` (FR-R6-1); `applied/screening/interview→rejected` (FR-R4-2); `applied/screening/interview→withdrawn` (FR-A4-3); `offer→hired` (FR-A5-4); `offer→declined` (FR-A5-5) | returns undefined | N/A |
| Application forbidden (53 cells) | rest of 8×8 incl. skip `applied→interview`, backward `interview→screening`, terminal sources (FR-R4-3); `offer→withdrawn` and terminal `→withdrawn` (FR-A4-4); `offer→rejected` | throws | `InvalidTransitionError` |
| `assertPostingAllows` (56 cells, FR-R4-4) | `filled`/`closed` × any stage but `rejected` → throws; `filled`/`closed` × `rejected` passes; `expired` and every other status × all 8 stages pass | passes / throws | `InvalidTransitionError`, message names the posting status and the stage |
| Unknown value | `assertTransition('bogus','live')` or unknown `to` | throws | `InvalidTransitionError` naming the unknown value |

</frozen-after-approval>

## Code Map

Repository has no application code yet (only `_bmad*`, `inputs/`, `transcripts/`, `README.md`, `.gitignore` with `node_modules/`). Everything below is new. Node v24, npm 11 available.

- `_bmad-output/planning-artifacts/architecture/.../SHAPES.md` §S1 lines 12–25 -- exact enum strings; §S9 line 116 -- the error class list and codes.
- `_bmad-output/planning-artifacts/architecture/.../ARCHITECTURE-SPINE.md` ARCH-12 line 70 -- module contract; ARCH-04 -- `business/domain/` is shared pure logic.
- `_bmad-output/planning-artifacts/epics.md` lines 413–442 -- story text and ACs (authoritative for the transition maps).

## Tasks & Acceptance

**Execution:**
- [ ] `server/package.json` -- `name careerbridge-server`, `private`, `"type"` omitted (CommonJS), `scripts.test = "jest"`, `jest.testEnvironment = "node"`, devDependency `jest` (latest via `npm install`); commit `server/package-lock.json` -- minimum of Story 1.1 so tests run.
- [ ] `server/src/business/errors.js` -- S9 classes: `ValidationError`, `UnauthenticatedError`, `AccountSuspendedError`, `ForbiddenError`, `NotFoundError`, `RuleViolationError` and subclasses `InvalidTransitionError`, `ConcurrentChangeError`, `DuplicateApplicationError`, `OfferAlreadyOpenError`, `ApplicationCapReachedError`, `ProfileIncompleteError`; each sets `name`, `code`, optional `details` -- created here per the story.
- [ ] `server/src/business/domain/enums.js` -- frozen exports `POSTING_STATUS`, `POSTING_STATUS_EFFECTIVE`, `APPLICATION_STAGE`, `ACTIVE_STAGES`, `ACCOUNT_STATUS`, `ACCOUNT_ROLE`, `MEMBERSHIP_STATUS`, `INTERVIEW_OUTCOME`, `EMPLOYMENT_TYPE` -- S1 vocabulary.
- [ ] `server/src/business/domain/postingStatus.js` -- `POSTING_TRANSITIONS` (frozen map from → frozen array), `assertTransition`, `assertPostingAllows` -- ARCH-12.
- [ ] `server/src/business/domain/applicationStage.js` -- `APPLICATION_TRANSITIONS`, `assertTransition` -- ARCH-12.
- [ ] `server/src/business/domain/enums.test.js` -- exact membership, order-insensitive equality, frozen, `ACTIVE_STAGES ⊂ APPLICATION_STAGE`, effective = stored + `expired`.
- [ ] `server/src/business/domain/postingStatus.test.js` -- generate one `test` per 7×7 cell from a literal allowed-edge table with FR tags, plus 56 `assertPostingAllows` cells and unknown-value cases; assert message contains both state words and `instanceof RuleViolationError`.
- [ ] `server/src/business/domain/applicationStage.test.js` -- same pattern over 8×8.

**Acceptance Criteria:**
- Given `cd server && npm test`, when run on a fresh `npm ci`, then all suites pass with 0 failures and the matrices are visibly exhaustive in the Jest output (49 + 56 posting cells, 64 application cells).
- Given `grep -rn "require(" server/src/business/domain/*.js`, when inspected, then only `./enums` and `../errors` appear.
- Given the epics AC lists, when compared with the tests, then every named allowed and forbidden pair has a test whose name contains that pair and an FR or NFR ID.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `cd server && npm ci && npm test` -- expected: exit 0, three suites green.
- `grep -rnE "require\(" server/src/business/domain/ | grep -vE "\./enums|\.\./errors|\.\/postingStatus|\.\/applicationStage|jest" ` -- expected: empty (test files may require the modules under test).

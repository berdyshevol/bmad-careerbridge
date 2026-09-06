---
title: 'Story 1.2: Stored enums and the two state machines'
type: 'feature'
created: '2026-09-05'
status: 'done'
route: 'dispatch'
baseline_commit: '8929ccdf0afac747e74966c8e6c70585bdc105bc'
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
- (Human, at approval) Record the CommonJS rationale in one line, in a `"comment"` field of `server/package.json` or a short `server/README.md`, so Story 1.1 does not reopen it.
- (Human, at approval) Each state-machine module gets one dedicated unknown-value test with `NFR-4` in its name.

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
- [x] `server/package.json` -- `name careerbridge-server`, `private`, `"type"` omitted (CommonJS), `scripts.test = "jest"`, `jest.testEnvironment = "node"`, devDependency `jest` (latest via `npm install`); commit `server/package-lock.json` -- minimum of Story 1.1 so tests run.
- [x] `server/README.md` -- three to five lines: how to run the tests, and the one-line CommonJS rationale -- so Story 1.1 does not reopen the module-system choice.
- [x] `server/src/business/errors.js` -- S9 classes: `ValidationError`, `UnauthenticatedError`, `AccountSuspendedError`, `ForbiddenError`, `NotFoundError`, `RuleViolationError` and subclasses `InvalidTransitionError`, `ConcurrentChangeError`, `DuplicateApplicationError`, `OfferAlreadyOpenError`, `ApplicationCapReachedError`, `ProfileIncompleteError`; each sets `name`, `code`, optional `details` -- created here per the story.
- [x] `server/src/business/domain/enums.js` -- frozen exports `POSTING_STATUS`, `POSTING_STATUS_EFFECTIVE`, `APPLICATION_STAGE`, `ACTIVE_STAGES`, `ACCOUNT_STATUS`, `ACCOUNT_ROLE`, `MEMBERSHIP_STATUS`, `INTERVIEW_OUTCOME`, `EMPLOYMENT_TYPE` -- S1 vocabulary.
- [x] `server/src/business/domain/postingStatus.js` -- `POSTING_TRANSITIONS` (frozen map from → frozen array), `assertTransition`, `assertPostingAllows` -- ARCH-12.
- [x] `server/src/business/domain/applicationStage.js` -- `APPLICATION_TRANSITIONS`, `assertTransition` -- ARCH-12.
- [x] `server/src/business/domain/enums.test.js` -- exact membership, order-insensitive equality, frozen, `ACTIVE_STAGES ⊂ APPLICATION_STAGE`, effective = stored + `expired`.
- [x] `server/src/business/domain/postingStatus.test.js` -- generate one `test` per 7×7 cell from a literal allowed-edge table with FR tags, plus 56 `assertPostingAllows` cells and unknown-value cases; assert message contains both state words and `instanceof RuleViolationError`.
- [x] `server/src/business/domain/applicationStage.test.js` -- same pattern over 8×8.

**Acceptance Criteria:**
- Given `cd server && npm test`, when run on a fresh `npm ci`, then all suites pass with 0 failures and the matrices are visibly exhaustive in the Jest output (49 + 56 posting cells, 64 application cells).
- Given `grep -rn "require(" server/src/business/domain/*.js`, when inspected, then only `./enums` and `../errors` appear.
- Given the epics AC lists, when compared with the tests, then every named allowed and forbidden pair has a test whose name contains that pair and an FR or NFR ID.

## Implementation Notes

- 2026-09-05: Implemented by subagent from this spec; Jest 30.5.1 on Node 24. Files: `server/package.json`, `server/package-lock.json`, `server/README.md`, `server/src/business/errors.js` (+ `errors.test.js`, added after review), `server/src/business/domain/{enums,postingStatus,applicationStage}.js` and their three test files.
- Messages render enum values with underscores replaced by spaces ("A pending approval posting cannot become draft"); unknown values are quoted raw. Each module keeps its own tiny `spoken()` helper rather than exporting one from `enums.js`, to keep the import surface at exactly `./enums` and `../errors`.
- `BusinessError` is exported as the common base so Story 1.4's `presentation/errors.js` can map one class. Every S9 class has a default message; subclasses of `RuleViolationError` set `this.code` after `super`, so no public constructor accepts a code.
- Final run after review patches: 4 suites, 268 tests, 0 failures. Posting: 7 allowed + 42 forbidden transition cells, 56 `assertPostingAllows` cells (14 refuse, 42 pass), 4 unknown-value tests. Application: 11 allowed + 53 forbidden cells, 3 unknown-value tests. Enums 21, errors 62.
- Deferred: automated enforcement of the domain import boundary (see `deferred-work.md`).

## Spec Change Log

## Review Triage Log

Pass 1 (review_loop_iteration 0). Layers: blind-hunter (BH), edge-case-hunter (ECH), verification-gap (VG).

| # | Finding | Verdict | Evidence / route |
|---|---------|---------|------------------|
| BH1+VG1 | `errors.js` ships 13 classes, only `InvalidTransitionError` is tested; a wrong `code` or broken chain ships green | medium | VG demonstrated: renaming `concurrent_change` keeps `npm test` green. Story 1.4 dispatches on these codes. → **patch** (add `errors.test.js`) |
| BH2 | `RuleViolationError(message, details, code)` lets any caller mint a non-S9 code | low | Real: public positional `code`. Fix is a direct restructure (subclasses set `this.code`), no added surface. → **patch** |
| BH3 | `offer → rejected` forbidden with no note on how FR-R6-3's cascade stays consistent (S3 one-open-offer index) | low | Real documentation gap for Epic 13/14 authors; fix is one comment. → **patch** |
| BH4 | Messages print raw tokens (`pending_approval`) although the AC says "names both statuses in words" | medium | Verified: `assertTransition('pending_approval','draft')` yields "A pending_approval posting…". User-facing via `<ErrorAlert>`. → **patch** (replace `_` with space in messages; tests assert the spoken form) |
| BH5a | CommonJS rationale duplicated; `package.json` `description` holds a 200-char sentence | low | Real, trivial deletion. → **patch** (shorten description; README is the single source) |
| BH5b | Add `engines` and `--runInBand` | false (out of scope) | Story 1.1 items; the intent says "nothing else from 1.1". Rejected. |
| BH6 | `assertKnownStage` and `expectInvalidTransition` duplicated across two files | low | Real but five lines each; the fix adds a new export to `enums.js` (public surface). Rejected per low-and-complexity rule. |
| BH7 | README omits the import-boundary grep | low | Real, one line. → **patch** |
| BH8 | Spec `in-review` vs sprint-status `in-progress` | false | Sprint sync to `review` happens in the present step by design; not a code finding. Rejected. |
| ECH1+ECH2 | Symbol or null-prototype argument makes the template literal throw `TypeError` | low | True in JS, but inputs come from DB strings or JSON, which cannot carry either. Fix adds a type branch. Rejected. |
| ECH3 | Five classes have no default message | low | By design: cap/profile/validation/transition messages carry case-specific text the FRs require. Rejected. |
| ECH4 | `null`/`''` message bypasses the default | low | Caller error; fix adds `\|\|` guards. Rejected. |
| ECH5 | `details: null` stored when null passed | low | Consistent with JS conventions; negligible. Rejected. |
| VG2 | Forbidden-cell message checks are order-insensitive; swapped from/to passes | medium | VG demonstrated with a swapped template. → **patch** (one exact-message assertion per template) |
| VG3 | Unknown-value tests use only `bogus`; a `value in MAP` refactor would throw `TypeError` on `constructor` | low | Real, three assertions. → **patch** |
| VG4 | Import boundary checked only by manual grep, not by `npm test` | medium | Real; the spine routes boundary greps to Story 1.1's lint/CI step. → **defer** |
| VG-other | Epics AC example says "cannot go back to draft"; code says "cannot become" | false | The AC phrase is an example; the frozen spec fixes "cannot become" and both states are named. Rejected. |

## Verification

**Commands:**
- `cd server && npm ci && npm test` -- expected: exit 0, three suites green.
- `grep -rnE "require\(" server/src/business/domain/ | grep -vE "\./enums|\.\./errors|\.\/postingStatus|\.\/applicationStage|jest" ` -- expected: empty (test files may require the modules under test).

# Review: Story 1.2 — Stored enums and the two state machines

## Verdict

**APPROVE WITH FIXES**

Correctness, purity, error vocabulary, and matrix exhaustiveness are all solid and the suite is green (268/268). One traceability mislabel and a handful of small polish items remain.

## Must fix

1. **`server/src/business/domain/applicationStage.test.js:48-50`** — the forbidden cell `offer → rejected` is tagged `FR-R4-2` in the generated test name (`forbidden()` returns `['FR-R4-2', 'rejection is not allowed from offer; ...']`). FR-R4-2 (PRD §4 line 111) is "A Recruiter can reject an Application in Stage Applied, Screening, or Interview" — it *authorizes* the allowed `applied/screening/interview → rejected` edges, which the same file's `ALLOWED` table already tags `FR-R4-2` (lines 14-16). Reusing that ID on the **forbidden** `offer → rejected` cell makes `grep -rn "FR-R4-2"` show the FR contradicting itself (one hit says allowed, the other forbidden) instead of tracing to one requirement. The module's own comment (`applicationStage.js:10-13`) correctly explains this cell via FR-R6-3/S3, not FR-R4-2. Change the tag to `FR-R4-3` (the generic "any other pair throws" ID already used for the rest of the forbidden cells) or to `NFR-4` only, and keep the explanatory text.

## Should fix

2. **`server/package.json:5`** — `"description": "CareerBridge server (Express 5, Knex, PostgreSQL)"` names three dependencies that are not in `package.json` yet (only `jest` is a devDependency at this point in the build). BH5a's fix correctly removed the duplicated CommonJS rationale, but the replacement text now reads as if Express/Knex/pg are already wired up, which is misleading to anyone running `npm ls` against this story's checkout. Either drop the parenthetical or mark it "(planned)".
3. **`server/src/business/errors.js:7,96-110`** — `BusinessError` is exported directly (needed so Story 1.4 can do one `instanceof` check), but its constructor is `(code, message, details)` with `code` still a raw positional string, so `new BusinessError('whatever_code', 'msg')` mints an out-of-vocabulary code from outside the module — the same shape of hole BH2 patched on `RuleViolationError`, just one level up. Low risk today (nothing in this story calls it that way) but worth a one-line comment or a guard (e.g. only invoked with the class's own `new.target.name`-derived code) so a future caller doesn't rediscover BH2.

## Nits

4. `server/README.md:5` — "so Story 1.1 keeps it as is" is slightly awkward phrasing; consider "so Story 1.1 does not reopen the module-system choice" (matches the spec's own wording).
5. `postingStatus.js` and `applicationStage.js` each define their own private `spoken()` helper (identical bodies) — already reviewed and rejected in the spec's triage log (BH6) because sharing it would add a third export to `enums.js`; flagging only so a future reviewer doesn't re-litigate it.
6. `package.json` has no `license` field; harmless for a course project but `npm ls`/`npm audit` will warn.
7. `postingStatus.js:26-28`'s `article()` helper (a/an selection for messages) has no dedicated unit test — it's only exercised indirectly through the "exact message templates" tests (`live`→"A", `expired`→"An", `pending_approval`→"A"). Sufficient coverage exists, but a direct test would make intent explicit if the enum set grows a vowel-leading value later (none currently do besides "expired").

## Test suite result

```
Test Suites: 4 passed, 4 total
Tests:       268 passed, 268 total
Time:        ~0.4s
```
Breakdown (verified by running each file in isolation): `enums.test.js` 21, `postingStatus.test.js` 115 (49 `assertTransition` cells + 56 `assertPostingAllows` cells + 4 exact-message-template tests + 4 unknown-value tests + 2 map-structure tests), `applicationStage.test.js` 70 (64 `assertTransition` cells + 2 map-structure + 1 message-template + 3 unknown-value), `errors.test.js` 62. Sums to 268, matching the spec's Implementation Notes. Import-boundary grep (`grep -rnE "require\(" server/src/business/domain/*.js | grep -vE "\./enums|\.\./errors|\./postingStatus|\./applicationStage"`) returns empty, confirming ARCH-12 purity holds.

## Traceability check

Only rows with problems shown; all other edges (7 posting-allowed, 11 application-allowed, and the generic forbidden cells) trace cleanly to a literal table entry and a test name carrying the right FR/NFR ID.

| Edge | FR in test name | Correct FR? | Test name (file:line) |
|---|---|---|---|
| `offer → rejected` (forbidden) | `FR-R4-2` | **No** — FR-R4-2 governs the *allowed* applied/screening/interview→rejected edges, not this forbidden one; should be `FR-R4-3` (generic refusal) or cite FR-R6-3/S3 as the module comment does | `applicationStage.test.js:96` (generated from `forbidden()` at line 48-50) |

## Summary

- Suite is green: 4 suites, 268 tests, 0 failures; counts reconcile exactly with the spec's own tally.
- Transition maps for both Posting (7 allowed / 42 forbidden edges over the 7×7 effective-status matrix) and Application (11 allowed / 53 forbidden over 8×8) match PRD §3 and the spec's matrices exactly, including `expired` as source-only and terminal-state immutability.
- `assertPostingAllows` correctly implements FR-R4-4/ARCH-15 (`NOT IN ('filled','closed')`, never "is Live"), and unknown-value handling (including prototype-pollution-shaped inputs like `constructor`/`__proto__`) is tested in both modules.
- ARCH-12 purity holds: `grep` confirms `postingStatus.js`/`applicationStage.js` import only `./enums` and `../errors`; both maps and their arrays are frozen; no I/O.
- One real traceability defect: the forbidden `offer → rejected` test is mislabeled `FR-R4-2` instead of `FR-R4-3` (see Must Fix #1) — a one-line change.
- The deferred import-boundary-lint item is correctly scoped to Story 1.1 per `deferred-work.md`, consistent with ARCH-12/ARCHITECTURE-SPINE routing.

## Review closure

1. **Must fix — traceability mislabel.** Fixed. `applicationStage.test.js:48-49`: the forbidden `offer → rejected` cell's `forbidden()` tag changed from `FR-R4-2` to `FR-R4-3` (the generic "any other pair throws" ID already used for the rest of the forbidden cells in this file), keeping the explanatory text (FR-R6-3/S3 rationale) unchanged. `grep -rn "FR-R4-2"` now only shows the two allowed-edge sites (`ALLOWED` table and the corresponding generated-test names), no longer contradicting itself.
2. **Should fix — `package.json` description.** Fixed. `server/package.json:5` now reads `"CareerBridge server business layer (stored enums, the posting and application state machines, and the S9 error vocabulary)"` — describes only what exists in this story's checkout; no more implying Express/Knex/pg are wired up.
3. **Should fix — `BusinessError` positional `code`.** Fixed. `server/src/business/errors.js`: `BusinessError`'s constructor no longer takes `code` as a parameter (now `(message, details)` only); every direct and indirect subclass sets `this.code = '<literal>'` after calling `super()`, the same pattern `InvalidTransitionError` and its `RuleViolationError` siblings already used. `new BusinessError(...)` from outside the module can no longer mint an arbitrary out-of-vocabulary code. Verified no call site in `src/` constructed `BusinessError` directly before the change (`grep -rn "new BusinessError" src/` was empty), and `errors.test.js` (which only instantiates the twelve concrete subclasses) still passes unchanged.
4. **Nit — README wording.** Fixed. `server/README.md:5`: "so Story 1.1 keeps it as is" → "so Story 1.1 does not reopen the module-system choice."
5. **Nit — duplicated `spoken()` helper.** Skipped, as the review itself flags this as already litigated and rejected in the spec's triage log (BH6); not re-litigated here.
6. **Nit — missing `license` field.** Fixed. Added `"license": "UNLICENSED"` to `server/package.json` (private course project, not published).
7. **Nit — `article()` unit test.** Skipped. `article()` in `postingStatus.js` is a private, unexported helper; adding a direct unit test would require adding it to `module.exports`, widening this pure business module's intentionally minimal public surface (ARCH-12) for test-only reasons. The review already concludes existing indirect coverage (the exact-message-template tests exercising `live`→"A", `expired`→"An", `pending_approval`→"A") is sufficient, so no test was added.

**Verification after fixes:**
```
Test Suites: 4 passed, 4 total
Tests:       268 passed, 268 total
Time:        0.308 s
```
ARCH-12 import-boundary grep (`grep -rnE "require\(" server/src/business/domain/*.js | grep -vE "\./enums|\.\./errors|\./postingStatus|\./applicationStage"`) — empty, purity holds.

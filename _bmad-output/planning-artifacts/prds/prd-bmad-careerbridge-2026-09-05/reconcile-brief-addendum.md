---
title: "Reconciliation: PRD vs Brief Addendum"
input: briefs/brief-bmad-careerbridge-2026-09-05/addendum.md
prd: prds/prd-bmad-careerbridge-2026-09-05/prd.md + addendum.md
created: 2026-09-05
---

# Reconciliation: brief addendum → PRD

Source = brief addendum (final). Target = PRD body (`prd.md`) and PRD addendum (`addendum.md`). Read-only extract; PRD not edited.

## Covered

Items from the brief addendum that the PRD or PRD addendum carries faithfully.

- **Stack (Node.js, React, JavaScript not TypeScript, verbal approval, rationale owed in Iteration 1)** → PRD addendum §Technical decisions, "Stack".
- **Jest as JUnit equivalent; GitHub Issues at careerbridge-csi5324** → PRD addendum §Technical decisions, "Testing and tracking".
- **Deployment: GCP, Render/Railway fallback, decision deferred to Iteration 1** → PRD addendum "Deployment"; NFR-7 written to be satisfiable by any.
- **Admin model option A / option B (D-005), 5/6/5 split, UC-M5** → PRD §8 Open Question 1; PRD addendum §Admin model options (with FR effect: FR-R1-2 moves to UC-M5).
- **Single-organization HR tool rejected (D-001)** → PRD §1 Vision "multi-company job board"; NFR-3 and FR-R3-3/R3-4 embody the multi-org privacy rule.
- **Fixed cap replaced by admin-maintained rule, default 5** → §3 Glossary "Application Cap"; FR-M4-1 (A-22); §8 Open Question 2 (Q-004).
- **Recruiter in more than one organization parked; one recruiter → one organization** → §3 Glossary "Recruiter — a user acting for exactly one Organization"; §6 Non-Goals "a Recruiter in more than one Organization".
- **Configurable pipelines parked; fixed pipeline** → §6 Non-Goals; FR-R4-3 refuses skipped/backward moves; FR-M4-3 changes labels only, "without changing the number or order of Stages" (stage labels are in the brief's UC-M4 row, so this is not a re-entry).
- **Interview scheduling with time proposals parked; record fact and outcome** → §6 Non-Goals "interview scheduling or calendar coordination"; UC-R5 FR-R5-1/R5-2 record only.
- **AI features stretch, after all fifteen use cases pass** → §6 Non-Goals keeps the "unless all fifteen use cases pass their tests first" condition.
- **Team velocity, 15-use-case floor, 3/7/5 plan** → SC-4 (three use cases per member); PRD addendum §Iteration mapping matches 3 / 7 / 5 exactly (I1: A2, R2, M1; I2: A1, A3, A4, R1, R3, R4, M2; I3: A5, R5, R6, M3, M4).
- **Slip candidate UC-A4 (S)** → PRD addendum §Iteration mapping points back to the brief addendum; UC-A4 sized S in PRD.
- **Course-administration questions (AI-policy link, Dr. Ren as customer all semester)** → intentionally absent from the PRD, as the brief addendum says "kept out of the brief". No gap.
- **Demo script steps 1–8 and the second path** → all map to FRs (table below). UJ-1 / UJ-2 in §2 restate the script.

| Demo step (brief addendum) | PRD FR(s) |
| --- | --- |
| 1. Recruiter creates posting with expiry, submits → pending approval | FR-R2-1, FR-R2-3 |
| 2. Admin sees approval queue, approves → live | FR-M2-1, FR-M2-2 |
| 3. Anonymous visitor browses and finds posting without login | FR-A2-1, FR-A2-2, FR-A2-3, FR-X-2 |
| 4. Visitor registers as applicant, completes profile, uploads one resume, applies | FR-A1-1, FR-A1-2, FR-A1-3, FR-A3-1, FR-A3-2 |
| 5. Recruiter sees the application in the Acme queue only | FR-R3-1, FR-R3-3 |
| 6. Advance applied → screening → interview; record interview and outcome | FR-R4-1, FR-R5-1, FR-R5-2 |
| 7. Extend offer; applicant gets in-app notification and accepts | FR-R6-1, FR-A5-1, FR-A5-2, FR-A5-3, FR-X-3 |
| 8. Posting auto-closes as filled | FR-R6-2 (FR-R6-3 side effect) |
| Second path: second applicant rejected with reason, sees notification and reason | FR-R4-2, FR-A5-2, FR-A4-2 |
| Proof point: second-org recruiter cannot see Acme applicants | FR-R3-3, NFR-1 |
| Proof point: one more application than the cap is refused | FR-A3-4 |
| Proof point: admin changes cap, rule takes effect | FR-M4-1 |
| Proof point: requirement ID → use case → code → test | SC-3, NFR-10, PRD addendum §Traceability (see Gap G-2: missing from UJ-3/SC-2) |

## Gaps

### G-1 — Fourteen Deliverable 0 questions not carried as tagged assumptions (severity: medium)

- **Source:** "The PRD should treat each as a business rule with status 'assumption' until confirmed. Two have moved since submission, Q-002 and Q-004."
- **PRD location:** §9 mentions "Q-001 to Q-014" only in passing ("as with Q-001 to Q-014"). Only Q-004 (§8 OQ-2), Q-011 (A-17), Q-012 (A-19) and Q-002 (§6, unnamed) are individually located. Q-001, Q-003, Q-005–Q-010, Q-013, Q-014: **absent** — no FR is tagged with them and there is no Q-n locator like the A-n locator in §9.
- **Why it matters:** the brief addendum's explicit instruction to the PRD is not executed; the FRs that encode the customer's unconfirmed answers cannot be found or reverted if Dr. Ren corrects one.
- **Suggested fix:** add a `(Q-n)` tag beside each FR that encodes a Deliverable 0 answer and a Q-locator line in §9 (or fold Q-001..Q-014 into the PRD addendum assumptions table with a "Where" column). Explicitly mark Q-002 as "moved to §6 Non-Goals" and Q-004 as "moved to Open Question 2".

### G-2 — Fourth proof point (traceability walk) missing from UJ-3 and SC-2 (severity: medium)

- **Source:** "Proof-point checks to show live: … open a requirement ID and follow it to use case, code, and test."
- **PRD location:** §2 UJ-3 lists only three proof points (privacy, cap refusal, cap change). SC-2 says "The three UJ-3 proof points succeed live." SC-3 ("Every FR ID resolves to a use case, an issue, code, and a passing test") states the property but not that it is **shown live at the demo**. Only the PRD addendum §Traceability says "That is the chain shown live at the Iteration 3 demo (SC-3)".
- **Suggested fix:** add the traceability walk as the fourth proof point in UJ-3 and change SC-2 to "the four UJ-3 proof points succeed live", or add "demonstrated live at Iteration 3" to SC-3.

### G-3 — "Data model must not preclude many-to-many later" is only a mechanism note that architecture may override (severity: medium)

- **Source:** "The data model should not make the many-to-many impossible later (for example, keep organization membership in its own table rather than as a column on the user)."
- **PRD location:** PRD body: **absent** (§6 Non-Goals states the parking but not the reservation; NFR-11 Maintainability does not mention it). PRD addendum §Mechanism notes "Organization membership" restates it, but that section is headed "raised while drafting (architecture decides)", which turns a brief-level constraint into an optional suggestion.
- **Suggested fix:** state it once in the PRD body in product language, e.g. append to §6: "…a Recruiter in more than one Organization (parked, not rejected: the system must be able to add this later without reinterpreting existing membership data)", or add an NFR-12 Extensibility. Keep the "own table" example in the addendum.

### G-4 — Overrun plan assumes UC-M3 is small; PRD makes UC-M3 the largest admin use case (severity: medium)

- **Source:** "Iteration 3 holds the two smallest items (UC-R5, UC-M3) so it has room to absorb an Iteration 2 overrun."
- **PRD location:** UC-M3 carries five FRs (FR-M3-1 … FR-M3-5, including list-and-search by five attributes, suspend with session invalidation, reactivate, role and Organization reassignment, self-demotion guard) — more than UC-M4 (4), UC-M1 (3) or UC-R5 (2). The brief body already sizes UC-M3 as M, so the brief addendum's "smallest" is loose, but the PRD widens the gap and the PRD addendum §Iteration mapping still points to the brief addendum's slack plan without noting it.
- **Suggested fix:** either trim UC-M3 to the demo-required minimum (suspend/reactivate/reassign; drop or mark FR-M3-1 search fields and FR-M3-5 as optional) or amend the slack note in the PRD addendum to name the true smallest Iteration 3 items (UC-R5 and UC-R6/UC-A5) and re-state which Iteration 3 item absorbs an overrun.

### G-5 — Email notifications hardened from "stretch" to "not built this semester" (severity: low)

- **Source:** "Email notifications (stretch): in-app only until the core scope is complete."
- **PRD location:** §6 Non-Goals "Not built this semester, per the brief: … email or any off-platform notification". PRD addendum §Mechanism notes "Notifications" says "Email stays a stretch goal", so the PRD contradicts itself and the body contradicts the brief. AI features, by contrast, keep their conditional ("unless all fifteen use cases pass their tests first").
- **Suggested fix:** move email out of the unconditional list in §6 and give it the same conditional wording as AI, or drop "stretch" from the PRD addendum.

### G-6 — AI-feature guardrails dropped (severity: low)

- **Source:** "if attempted, the course requires reliability, validation, privacy, and human oversight to be addressed."
- **PRD location:** §6 keeps the "after all fifteen use cases pass" gate but the four course-required topics are **absent**.
- **Suggested fix:** append "and, if attempted, addresses reliability, validation, privacy, and human oversight as the course requires" to the AI clause in §6.

### G-7 — Option-A audit-log fifth admin use case not surfaced (severity: low)

- **Source:** "Admin stays at four use cases; a fifth admin use case could be an audit log of approvals and decisions."
- **PRD location:** §8 OQ-1 and PRD addendum §Admin model options present option A as "PRD as written". FR-X-4 records the audit trail, but nothing lets the Administrator view it (FR-M4-4 is counts only, A-24). The audit-log option is **absent**.
- **Suggested fix:** add one sentence to the option A entry in the PRD addendum: "optional UC-M5 audit-log view over FR-X-4 records if a fifth admin use case is wanted."

### G-8 — MongoDB rejection rationale dropped from the technical record (severity: low)

- **Source:** "MongoDB was considered on the 'JavaScript everywhere' argument and rejected: the argument buys nothing for this data shape and would weaken the Iteration 2 deliverable."
- **PRD location:** PRD addendum "Database" says "PostgreSQL proposed, not yet ratified by the team" — the rejected alternative and its reason are **absent**, and "not yet ratified" is a new qualifier not in the brief addendum. The written rationale is owed in Iteration 1, so the rejection reason is planning input.
- **Suggested fix:** carry the one-line MongoDB rejection into the PRD addendum "Database" entry.

### G-9 — Demo step 6 wording vs UC-R5 (severity: low)

- **Source:** demo step 6: "Records that an interview **took place** and its outcome."
- **PRD location:** UC-R5 / FR-R5-1 "record … that an interview **was scheduled**, with date, time, and optional notes" (matches the brief body's UC-R5 title, not the demo script). Not a functional gap, but "date, time" edges toward the parked scheduling item.
- **Suggested fix:** none required; optionally align the demo step wording in UJ-1 ("records the interview") which already avoids the split.

## Contradictions

- **C-1 (brief addendum vs PRD body) Email notifications.** Brief: stretch goal. PRD §6: not built this semester. See G-5.
- **C-2 (PRD-internal, surfaced while checking A-26) Session timeout.** NFR-2 and the A-26 table row say "8 hours"; PRD addendum §Mechanism notes "Session handling" says "The 24-hour idle timeout (A-26) is a configuration value." One of the two must change (the A-26 table row says it was "adjusted", so 8 h is presumably current and the 24 h is stale).
- **C-3 (brief addendum vs PRD tagging) "Realizes UJ-1" on FR-M1-1.** The demo script starts with an already-approved recruiter; Organization/Recruiter approval (UC-M1) is not a demo step. FR-M1-1 is tagged "Realizes UJ-1" while the actual demo approval step is FR-M2-2. SC-1 "Validates FR-A2-1 through FR-R6-3" likewise sweeps in UC-R1, which the script does not exercise. Retag FR-M1-1 (drop the UJ-1 tag or tag it as demo setup) and narrow SC-1's FR list to the table above.
- **C-4 (brief addendum vs PRD) Overrun slack.** Brief addendum calls UC-M3 one of the "two smallest items"; PRD gives it the most FRs of any admin use case. See G-4.

## Technical leakage into PRD body

Rule from §0: "Technical choices live in `addendum.md`." Items in `prd.md` that name a technology or prescribe a mechanism, most to least serious:

| Location | Text | Assessment |
| --- | --- | --- |
| NFR-11 | "separate presentation, business logic, persistence, and data layers, so a business-rule change … touches one layer" | Prescribes a layered architecture (four named layers). This is an architecture decision, not a product requirement. Reword to the observable property ("a change to one business rule is a change in one place, verified by …") or move the layer list to the PRD addendum / architecture doc. |
| NFR-10 | "the full suite runs automatically on every push to the shared repository" | Implies Git + CI; the A-30 table names GitHub Actions in the addendum (correctly). Body wording is borderline acceptable; "on every push" is a Git mechanism. |
| SC-4 | "visible in Git history" | Names Git. Low; could say "in the repository's change history". |
| NFR-8 | "current versions of Chrome, Firefox, Safari, and Edge … 375 px" | Names products, but as a compatibility target; acceptable in an NFR. |
| FR-A1-3, §3 Glossary | "PDF", "at most 5 MB" | File format and size are business rules (A-2), acceptable. |
| FR-M3-2 | "any existing session is refused on its next request" | Describes session mechanics; acceptable as observable behaviour, but leans on the session model chosen in the addendum. |
| NFR-2 | "stored only in a non-reversible form"; "session ends after 8 hours of inactivity" | Abstract enough; no product named. Acceptable. |
| §9 | "QUESTIONS.md" | Names a team file; harmless. |

No database, framework, hosting provider, or transport is named in `prd.md`. The expiry rule (FR-M2-4 "without anyone acting") and notifications (FR-X-3 "in-app only") are correctly mechanism-free, with the options deferred to the PRD addendum.

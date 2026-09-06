Hi Oleg. The PRD draft is written and waiting for your pushback. At any point you can invoke `bmad-party-mode` for multi-agent perspectives or `bmad-advanced-elicitation` to dig into one section.

**Workspace**

- `_bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05/prd.md` (status draft)
- `addendum.md` in the same folder holds the technical material
- `.memlog.md` has nine entries covering intake, the state model, and the assumption batch

**What the PRD contains.** The requirements section runs about three pages. FRs are grouped under the fifteen use cases with IDs like FR-A3-4, plus five cross-cutting FR-X items for the shared infrastructure the brief said nobody owns. Eleven NFRs sit in their own section. The glossary fixes the Posting and Application state machines, since most FRs are transitions on them. Three user journeys are lifted straight from the brief's demo script so the FRs can cite them. Nothing tech-specific is in the body.

**Assumptions.** Thirty-one inferences are tagged inline as `[ASSUMPTION A-n]` and indexed in section 9, so you can push back by number. The ones that change more than one FR if you overturn them:

- **A-6** the Resume is snapshotted at submission, so a later upload does not change what the Recruiter sees
- **A-13** a Live Posting cannot be edited, only closed and re-posted
- **A-17** an interview outcome must be recorded before an offer can be extended
- **A-18 and A-19** one hire per Posting; when it fills, the other active Applications are auto-rejected as "Position filled"
- **A-20** expiry stops new Applications only; existing candidates continue through the pipeline
- **A-31** offers never expire and cannot be rescinded this semester

The two batched questions for your next turn:

1. **Pipeline edge rules.** Do the six assumptions above hold, and may an Applicant re-apply to a Posting after withdrawing (A-5 says no)?
2. **Admin model and numbers.** Should I write the PRD for option A as it stands, or add UC-M5 for a company admin now (the addendum shows the FR changes either way)? And are the NFR figures acceptable as placeholders for the meeting: 2-second pages at demo scale, 25 concurrent users, 24-hour idle timeout, 375 px minimum width?

After your answers I will apply the corrections and run Finalize: memlog audit, input reconciliation against the brief and Deliverable 0, the reviewer pass, open-item triage, and the structure and prose polish, with no external handoffs.
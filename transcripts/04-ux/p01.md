/bmad-ux _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05

Create the UX documents for CareerBridge from the finalized PRD in that folder (`prd.md` has the user journeys UJ-1..3 and the screen inventory is in `addendum.md`; the architecture spine is in `_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/` and fixes React + React Router + TanStack Query, single origin, MUI as the default component library unless UX chooses otherwise; brief in `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/`).

Take the **fast path**: draft both documents in one go and tag every inference `[ASSUMPTION]`. I will review, not co-author. Our Design Engineer (Josh) owns UX in the team; this is a first cut for him to react to, so keep it short and concrete.

What I need out of it, because the Iteration 1 deliverable includes wireframes:
- `EXPERIENCE.md`: information architecture (the screen list per role), the navigation model, and the three user flows from the PRD (golden path UJ-1, rejection UJ-2, the privacy/cap proof points UJ-3) as step lists — each step naming the screen and the FR it realizes. Behaviour rules that the FRs imply: what the applicant sees at each Stage (FR-A4-1/2), how the unread-notification count appears (FR-A5-1), how refusals (cap reached, forbidden, invalid transition) are shown (NFR-4, NFR-8).
- `DESIGN.md`: minimal — component library decision (MUI or argue otherwise), typography/colour tokens only as far as needed for consistency across five developers, layout at 375 px and desktop, and the accessibility rules NFR-9 requires (labels, keyboard, colour never the only indicator).
- Wireframes as **ASCII/text sketches** for the five most important screens (Job List public, Job Detail + Apply, Applicant "My Applications", Recruiter application queue with pipeline actions, Admin approval queue). No image generation.

No web research, no external handoffs, local files only. Two to three pages per document at most.

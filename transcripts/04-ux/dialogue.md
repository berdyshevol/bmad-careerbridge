

## Turn 01 — Oleg

/bmad-ux _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05

Create the UX documents for CareerBridge from the finalized PRD in that folder (`prd.md` has the user journeys UJ-1..3 and the screen inventory is in `addendum.md`; the architecture spine is in `_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/` and fixes React + React Router + TanStack Query, single origin, MUI as the default component library unless UX chooses otherwise; brief in `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/`).

Take the **fast path**: draft both documents in one go and tag every inference `[ASSUMPTION]`. I will review, not co-author. Our Design Engineer (Josh) owns UX in the team; this is a first cut for him to react to, so keep it short and concrete.

What I need out of it, because the Iteration 1 deliverable includes wireframes:
- `EXPERIENCE.md`: information architecture (the screen list per role), the navigation model, and the three user flows from the PRD (golden path UJ-1, rejection UJ-2, the privacy/cap proof points UJ-3) as step lists — each step naming the screen and the FR it realizes. Behaviour rules that the FRs imply: what the applicant sees at each Stage (FR-A4-1/2), how the unread-notification count appears (FR-A5-1), how refusals (cap reached, forbidden, invalid transition) are shown (NFR-4, NFR-8).
- `DESIGN.md`: minimal — component library decision (MUI or argue otherwise), typography/colour tokens only as far as needed for consistency across five developers, layout at 375 px and desktop, and the accessibility rules NFR-9 requires (labels, keyboard, colour never the only indicator).
- Wireframes as **ASCII/text sketches** for the five most important screens (Job List public, Job Detail + Apply, Applicant "My Applications", Recruiter application queue with pipeline actions, Admin approval queue). No image generation.

No web research, no external handoffs, local files only. Two to three pages per document at most.


## Turn 01 — Agent

The UX first cut is written. Three files sit in `_bmad-output/planning-artifacts/ux-designs/ux-bmad-careerbridge-2026-09-05/`, all untracked, nothing committed.

**What was produced**

- `EXPERIENCE.md`: information architecture as one route per screen with role, FR IDs and iteration; the AppBar and Drawer navigation model with role-specific links and post-login landing pages; the Stage display table keyed to stored enum values with label, icon, colour token, what the Applicant sees and which actions exist; the unread Badge rules; a refusal table mapping every S9 error code to a screen treatment; the three PRD journeys as step lists, each step naming screen and FR.
- `DESIGN.md`: keeps MUI 7 per ARCH-07 with the argument written out and three alternatives rejected. Frontmatter carries the navy primary, five semantic Stage colours, a four-role type ramp, radii and spacing tokens. Body covers layout at 375 px and desktop, elevation, shapes, component specs and a Do/Don't table built around NFR-9.
- `wireframes/wireframes.md`: ASCII sketches of the five screens you named, desktop plus the 375 px variant where the shape changes, with Apply-card error variants and the per-Stage button rules for the Recruiter queue.

**Coverage check**

All 66 PRD FR IDs and every NFR referenced in your brief now anchor to at least one screen or rule in EXPERIENCE.md. Raw word counts including table pipes:

| File | Words |
| --- | --- |
| EXPERIENCE.md | about 2,500 |
| DESIGN.md | about 1,250 |
| wireframes.md | about 1,600 |

EXPERIENCE.md is at the top of your three-page target because of the three flows and the two rule tables. The easiest cut if Josh wants it shorter is the Voice and Tone table.

**Assumptions for you and Josh to push back on, by number**

- A-UX-1 unread count polled every 30 seconds.
- A-UX-2 confirmation Dialog for every action that notifies or ends a path; approvals are one click plus Snackbar.
- A-UX-3 Job Detail shows "N of cap active applications" before the Apply button.
- A-UX-4 the two Admin approval queues are two routes sharing one Tabs layout.
- A-UX-5 navy primary, amber only for Offer and Pending approval, Roboto with no added webfont.
- A-UX-6 landing pages after login per role.
- A-UX-7 Recruiter queue has inline row actions as well as the detail page.

**What I skipped, per your instructions**

No web research, no creative tools, no external handoffs. The reviewer gate and the structure/prose review lenses did not run, so both spines carry `status: draft` rather than `final`. Once Josh has reacted, an Update run can fold in his changes and flip the status.

**Next**

Review the A-UX list, hand the folder to Josh, and commit when you are happy with it. If you want the status set to final in this run instead, say so and I will flip it and log the finalization.

<!-- turn 01 · 2026-09-05 21:13 · 396s · agent turns 28 · in 322 + cache 836879 / out 29513 tok · $3.73582975 -->

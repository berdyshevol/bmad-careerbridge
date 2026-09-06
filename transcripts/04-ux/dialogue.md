

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


## Turn 02 — Oleg

Thanks — this is a good first cut for Josh. Two pushbacks and one confirmation, then leave it as **draft**; Josh owns UX and will run the Update with his changes.

- **A-UX-1 — 30-second polling is too aggressive** for a free-tier host that sleeps: five users × 2 requests/min for a badge nobody watches. Make it **60 seconds, plus an immediate refetch after any mutation** the current user performs (TanStack Query invalidation already does that per ARCH-06). Note the value as a single constant so the team can tune it.
- **A-UX-2 — a confirmation Dialog for *every* notifying action is too much friction** for the Recruiter queue, where advancing candidates is the main job. Confirm only the **irreversible** ones: reject, extend offer, accept/decline offer, withdraw, admin close/suspend. Advancing a Stage (Applied → Screening → Interview) is one click plus Snackbar with no undo — the state machine refuses backward moves anyway, so the Recruiter must be careful, and the wireframe should say so.
- **A-UX-3 (cap counter on Job Detail) — confirmed**, keep it; it is one of the UJ-3 proof points.

Apply those two changes to EXPERIENCE.md and the Recruiter queue wireframe, log them in the memlog, keep `status: draft`, and tell me the final paths. No reviewer gate, no polish pass — Josh will decide what to keep.


## Turn 02 — Agent

Both pushbacks are applied, the confirmation is recorded, and all three files stay at `status: draft`.

**What changed**

- **A-UX-1, polling.** The unread-count rule in EXPERIENCE.md now says 60 seconds, held in one constant named `UNREAD_POLL_MS` in the client config file, with an immediate refetch after any mutation by the current user through TanStack Query invalidation. The "decided against 30 s because the free host sleeps" line is in the text for Josh.
- **A-UX-2, confirmations.** The confirmation rule now lists only irreversible actions: reject, extend offer, accept or decline offer, withdraw, administrator close, suspend, reject request. Advancing a Stage and approving are one click plus Snackbar with no undo, with the FR-R4-3 forward-only rule cited. The Interaction Primitives line and the Open Items list were updated to match.
- **Recruiter queue wireframe.** Added a caption under the Stage filter reading "Advancing cannot be undone; the pipeline only moves forward", and a rule block stating that Advance is one click with a Snackbar while Record interview and Record outcome open a Dialog only because they take fields.
- **A-UX-3.** Marked confirmed in the refusal table, the UJ-3 climax step, and the Open Items list.

**Memlog** has two `override` entries with your reasons, one `decision` for A-UX-3, and an `event` noting that Josh runs Update mode next. Still open for Josh: A-UX-4 (Tabs for the two Admin queues), A-UX-5 (palette and Roboto), A-UX-6 (landing pages), A-UX-7 (inline queue actions).

**Final paths**, all under `_bmad-output/planning-artifacts/ux-designs/ux-bmad-careerbridge-2026-09-05/`:

- `EXPERIENCE.md`
- `DESIGN.md`
- `wireframes/wireframes.md`
- `.memlog.md` (decision log Josh's Update run will reload)

Nothing is committed; the folder shows as untracked in git.

<!-- turn 02 · 2026-09-05 21:20 · 61s · agent turns 10 · in 34 + cache 127773 / out 4734 tok · $2.46946325 -->

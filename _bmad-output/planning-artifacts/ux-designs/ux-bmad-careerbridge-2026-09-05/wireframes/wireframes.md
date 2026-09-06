---
title: "CareerBridge — Wireframes (text sketches, Iteration 1 input)"
status: draft
created: 2026-09-05
updated: 2026-09-05
---

# Wireframes

Text sketches of the five most important screens for Josh to redraw. `EXPERIENCE.md` and `DESIGN.md` win on conflict. Desktop is ≥ 900 px; the 375 px variant is shown where the layout changes shape. Every element cites the FR it serves. Seed cast per PRD §2.

## 1. Job List (public) — `/` — FR-A2-1, FR-A2-3

Desktop:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ CareerBridge     Jobs                              Log in   Register   For recruiters │  AppBar
├────────────────────────────────────────────────────────────────────────────┤
│ h1  Open positions                                                          │
│ ┌ Keyword ───────────────┐ ┌ Category ──────▾┐ ┌ Location ─────▾┐ [Search] [Clear] │  FilterBar (FR-A2-3)
│ │ e.g. software intern   │ │ All             │ │ All            │                    │  state in URL query
│ └────────────────────────┘ └─────────────────┘ └────────────────┘                    │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Junior Software Developer                        [◎ Full-time]           │ │  Card, most recently
│ │ Acme Waco · Software · Waco, TX                                          │ │  approved first (FR-A2-1)
│ │ Approved 2 days ago · Expires Oct 15, 2026                               │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Marketing Intern                                  [◎ Internship]         │ │
│ │ Bear Staffing · Marketing · Remote                                       │ │
│ │ Approved 5 days ago · Expires Nov 1, 2026                                │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Showing 1–20 of 43                                     ‹ 1  2  3 ›           │  Pagination (S10)
└────────────────────────────────────────────────────────────────────────────┘
Empty: "No live postings match. [Clear filters]"
```

375 px:

```
┌───────────────────────────────┐
│ ≡  CareerBridge               │  Drawer button (labelled "Menu")
├───────────────────────────────┤
│ h1 Open positions             │
│ ┌ Keyword ──────────────────┐ │
│ └───────────────────────────┘ │
│ ┌ Category ───────────────▾┐  │  filters stack full-width
│ ┌ Location ───────────────▾┐  │
│ [        Search        ]      │
│ ┌───────────────────────────┐ │
│ │ Junior Software Developer │ │
│ │ Acme Waco                 │ │
│ │ Software · Waco, TX       │ │
│ │ [◎ Full-time]             │ │
│ │ Expires Oct 15, 2026      │ │
│ └───────────────────────────┘ │
│ ┌───────────────────────────┐ │
│ │ Marketing Intern …        │ │
│        ‹ 1  2  3 ›            │
└───────────────────────────────┘
```

## 2. Job Detail + Apply — `/jobs/:id` — FR-A2-2, FR-A3-1..5

Desktop, logged in as Maria (Applicant), 8/4 columns:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ CareerBridge   Jobs   My Applications   Profile                 🔔(2)  (M)▾ │  Badge = unread (FR-A5-1)
├────────────────────────────────────────────────────────────────────────────┤
│ ‹ Back to jobs                                                              │
│ h1 Junior Software Developer                    │ ┌──────────────────────┐ │
│ Acme Waco · Software · Waco, TX · [◎ Full-time] │ │ Apply                │ │  Apply card (FR-A3-1)
│ Expires Oct 15, 2026                            │ │ 3 of 5 active         │ │  hint [A-UX-3], FR-A3-4
│                                                 │ │ applications          │ │
│ h2 Description                                  │ │ Resume: maria.pdf ✓   │ │  from profile (FR-A3-2)
│ Lorem ipsum … (FR-A2-2)                         │ │ ┌ Note (optional) ──┐ │ │  ≤ 1,000 chars, counter
│                                                 │ │ │                    │ │ │
│ h2 Requirements                                 │ │ │           0 / 1000 │ │ │
│ • …                                             │ │ └────────────────────┘ │ │
│ • …                                             │ │ [      Apply       ]  │ │  contained primary
│                                                 │ └──────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

Apply card variants (same slot, one at a time; server decides, client renders S9 code):

```
Visitor:            [ Log in to apply ]  "New here? Register"          → /login?next=/jobs/:id
profile_incomplete: ⚠ Add a resume and your full name to apply.        FR-A3-2
                    [ Complete profile ]                                → /me/profile
application_cap_   ⚠ You have 5 of 5 active applications.             FR-A3-4 (count, cap from details)
  reached:            Withdraw one to apply.        [ My Applications ]
duplicate_          ℹ You applied on Sep 3.  Stage: [✈ Applied]        FR-A3-3
  application:        [ View application ]
Posting not live:   404 page "This posting is not available"           ARCH-11, FR-M2-4
```

375 px: single column, Apply card first, then description; the `[ Apply ]` button is sticky at the bottom of the viewport.

## 3. My Applications — `/me/applications` — FR-A4-1 (detail: FR-A4-2..4, FR-A5-4/5)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ CareerBridge   Jobs   My Applications   Profile                 🔔(1)  (M)▾ │
├────────────────────────────────────────────────────────────────────────────┤
│ h1 My applications                          Active 3 of 5  · [Browse jobs] │  cap context
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Junior Software Developer            [★ Offer]        changed 2 h ago  › │ │  StageChip icon+label
│ │ Acme Waco                                                                │ │  (FR-A4-1)
│ ├──────────────────────────────────────────────────────────────────────────┤ │
│ │ Data Analyst Intern                  [🔍 Screening]   changed 3 d ago  › │ │
│ │ Bear Staffing                                                            │ │
│ ├──────────────────────────────────────────────────────────────────────────┤ │
│ │ QA Engineer                          [✕ Rejected]     changed 6 d ago  › │ │
│ │ Bear Staffing                                                            │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ Empty: "You have not applied yet. [Browse jobs]"                            │
└────────────────────────────────────────────────────────────────────────────┘
```

Detail `/me/applications/:id` (reached by ›), Offer stage:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ‹ My applications                                                           │
│ h1 Junior Software Developer · Acme Waco                                    │
│                                                                              │
│  (✓)────────(✓)────────(✓)────────(●)────────( )                             │  PipelineStepper
│ Applied   Screening  Interview   Offer     Hired                            │  labels from stage_labels
│                                                                              │
│ ┌ Offer ───────────────────────────────────────────────────────────────────┐ │  offer panel (FR-A5-4/5)
│ │ Acme Waco extended an offer on Sep 5.                                    │ │
│ │ [ Accept offer ]   [ Decline offer ]  (outlined error)                   │ │  each opens confirm Dialog
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ ┌ Interview ───────────────────────────────────────────────────────────────┐ │  when recorded (A-7)
│ │ Sep 2, 2026 10:00 · Outcome: Passed · "Strong on React"                  │ │  FR-R5-1/2 read side
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ h2 History                                                                   │  HistoryTimeline (FR-A4-2)
│ ● Sep 5 14:02  Interview → Offer          by recruiter                       │  from audit_events
│ ● Sep 2 09:10  Screening → Interview      by recruiter                       │
│ ● Aug 30 16:45 Applied → Screening        by recruiter                       │
│ ● Aug 28 11:20 Submitted (Applied)        by applicant                       │
│ h2 Your submission                                                            │
│ Resume as submitted: maria-2026-08.pdf [Download]  · Note: "…"  (FR-A3-5)    │
└────────────────────────────────────────────────────────────────────────────┘
Rejected variant: Stepper frozen at last active step, chip [✕ Rejected],
  Alert(error) "Rejected: Role needs two years of Java" (reason verbatim, FR-R4-2), no actions.
Applied/Screening/Interview variant: [ Withdraw ] (outlined error) instead of the offer panel (FR-A4-3);
  hidden at Offer and in terminal Stages (FR-A4-4).
```

## 4. Recruiter application queue — `/org/postings/:id/applications` — FR-R3-1 (actions FR-R4, R5, R6)

Desktop, Sam at Acme Waco:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ CareerBridge   Jobs   Postings   Organization                   🔔    (S)▾ │
├────────────────────────────────────────────────────────────────────────────┤
│ ‹ Postings                                                                  │
│ h1 Junior Software Developer   [● Live]   Expires Oct 15   [Edit] [Close…]  │  FR-R2-4, FR-R2-6
│                                                                              │
│ Stage: [All ▾]   4 applications                                              │  filter (FR-R3-1)
│ Advancing cannot be undone; the pipeline only moves forward.                 │  caption (FR-R4-3)
│ ┌──────────────┬───────────────┬──────────────┬───────────────────────────┐ │
│ │ Applicant    │ Stage         │ Submitted    │ Actions        [A-UX-7]   │ │  ResponsiveTable
│ ├──────────────┼───────────────┼──────────────┼───────────────────────────┤ │
│ │ Maria Lopez  │ [📅 Interview]│ Aug 28       │ [Record interview] [Offer]│ │  FR-R5-1, FR-R6-1
│ │              │               │              │ [Reject]                  │ │  FR-R4-2
│ │ Devon Reyes  │ [✈ Applied]   │ Sep 1        │ [Advance → Screening]     │ │  FR-R4-1
│ │              │               │              │ [Reject]                  │ │
│ │ Ana Kim      │ [🔍 Screening]│ Sep 2        │ [Advance → Interview]     │ │
│ │              │               │              │ [Reject]                  │ │
│ │ Lee Park     │ [✕ Rejected]  │ Aug 29       │ —                         │ │  terminal: no actions
│ └──────────────┴───────────────┴──────────────┴───────────────────────────┘ │  (FR-R4-3)
│ Row click → /org/applications/:id (profile, resume as submitted, note,      │  FR-R3-2
│ history, same action buttons).                                              │
└────────────────────────────────────────────────────────────────────────────┘
Rules the buttons follow (client hides; server refuses regardless, NFR-1/NFR-4):
  applied    → Advance → Screening · Reject
  screening  → Advance → Interview · Reject
  interview  → Record interview · Record outcome (if recorded) · Extend offer · Reject
  offer      → "Offer extended, awaiting applicant" (no buttons; FR-R4-2 excludes rejecting at Offer)
  terminal   → —
  Posting filled/closed → only Reject remains (FR-R4-4); banner "This posting is filled."
Advance → … is ONE click, no Dialog: Snackbar "Devon Reyes moved to Screening" with no undo. Helper text under
  the table header: "Advancing cannot be undone; the pipeline only moves forward." (FR-R4-3; A-UX-2 settled)
Reject opens ReasonDialog: multiline "Reason (shown to the applicant)", min 10 chars, [Reject] disabled until valid.
Extend offer Dialog: "Extend an offer to Maria Lopez? Only one offer can be open per posting." [Cancel] [Extend offer]
Record interview / Record outcome: inline form in a Dialog because they take fields, not as a confirmation.
Refused transition (invalid_transition / concurrent_change / offer_already_open): Alert(error) above the table
  with the server message verbatim, table refetches.
Privacy: this page never lists another Organization's Postings; a foreign URL renders the forbidden page (FR-R3-3).
```

375 px: each row becomes a Card (name, StageChip, submitted date, actions as full-width outlined buttons).

## 5. Admin approval queue — `/admin/requests` (tab 2: `/admin/postings`) — FR-M1-1..3, FR-M2-1..3

```
┌────────────────────────────────────────────────────────────────────────────┐
│ CareerBridge  Requests  Postings  Accounts  Settings  Oversight   🔔  (A)▾ │
├────────────────────────────────────────────────────────────────────────────┤
│ h1 Approvals                                                                 │
│ ┌ Recruiter requests (2) ┐┌ Postings (1) ┐                                  │  Tabs = two routes [A-UX-4]
│ ├────────────────────────┴┴──────────────┴─────────────────────────────────┤ │
│ │ ┌──────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Sam Okafor · sam@acme.example                     requested Sep 1    │ │ │  FR-M1-1
│ │ │ New organization: Acme Waco · acme.example · Waco, TX                 │ │ │
│ │ │ "Regional manufacturer hiring junior developers…"                    │ │ │
│ │ │                                    [ Reject… ]   [ Approve ]         │ │ │  FR-M1-2 one click
│ │ └──────────────────────────────────────────────────────────────────────┘ │ │  + Snackbar "Approved"
│ │ ┌──────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Priya Nair · priya@bear.example                   requested Sep 3    │ │ │
│ │ │ New organization: Bear Staffing · bear.example · Dallas, TX           │ │ │
│ │ │                                    [ Reject… ]   [ Approve ]         │ │ │
│ │ └──────────────────────────────────────────────────────────────────────┘ │ │
│ │ Empty: "Nothing waiting."                                                │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
Reject… opens ReasonDialog "Reason (shown to the requester)" → status page for the recruiter (FR-M1-3, FR-R1-3).
Postings tab: same card shape with title, Organization, category, location, expiry, [Open in full] link
  (FR-M2-1), [Reject…] with reason (FR-M2-3), [Approve] → Live immediately + Notification to recruiter (FR-M2-2).
Existing Approved organization request (FR-R1-2): card reads "Join existing organization: Acme Waco".
```

375 px: identical cards, one per row, buttons full-width in the order Approve then Reject.

## Screens not sketched

Login, Register, Recruiter request form, Profile, Posting editor, Notifications, Recruiter status page, Accounts, Settings, Oversight, Record view: all are single-column MUI forms or tables following `DESIGN.md` layout rules and the `ResponsiveTable` pattern. Josh decides which of these need a drawing for the Iteration 1 deliverable.

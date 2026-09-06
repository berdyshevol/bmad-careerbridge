---
name: CareerBridge
description: Multi-company job board for CSI 5324. MUI 7 with a small brand delta; this file specifies only what MUI defaults do not decide.
status: draft
created: 2026-09-05
updated: 2026-09-05
colors:
  # Brand delta over the MUI default light palette. Everything unlisted
  # (grey scale, text, divider, background.paper, error, warning, info,
  # success) inherits MUI defaults.
  primary: '#1F4E79'          # navy; MUI palette.primary.main
  primary-contrast: '#FFFFFF'
  secondary: '#5E6B7A'        # slate; secondary actions, muted chips
  # Stage and status semantics. Colour is always paired with icon + label.
  stage-active: '#1F4E79'     # applied, screening, interview; live posting
  stage-offer: '#B26A00'      # offer; pending approval (amber, WCAG AA on white)
  stage-success: '#2E7D32'    # hired; approved
  stage-danger: '#C62828'     # rejected; suspended; closed by admin
  stage-neutral: '#5E6B7A'    # withdrawn, declined, draft, expired, closed
  surface-page: '#F5F7FA'     # page background behind cards and tables
typography:
  # Roboto via MUI defaults; no webfont added.  [ASSUMPTION A-UX-5]
  h1:
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.25'
  h2:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body:
    fontSize: 16px
    lineHeight: '1.5'
  caption:
    fontSize: 13px
    lineHeight: '1.4'
rounded:
  sm: 4px
  md: 8px
  full: 9999px
spacing:
  # MUI 8 px scale; theme.spacing(n) = 8n px.
  page-margin-mobile: 16px
  page-margin-desktop: 24px
  content-max: 1200px
  reading-max: 720px
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-contrast}'
    radius: '{rounded.sm}'
  stage-chip:
    radius: '{rounded.full}'
    height: 24px
    variant: outlined
  card:
    radius: '{rounded.md}'
    elevation: 1
  app-bar:
    background: '{colors.primary}'
    foreground: '{colors.primary-contrast}'
---

# CareerBridge — Design Spine

First cut for Josh. Fast path; inferences are tagged `[ASSUMPTION A-UX-n]` and numbered in `EXPERIENCE.md`. Behaviour, states and flows live there; this file owns how it looks.

## Brand & Style

CareerBridge is a tool, not a brand campaign: a small employer and a student both need to read a Stage at a glance and trust that what they see is the whole pipeline. The visual posture is **plain, dense enough for tables, calm in colour**. One navy carries the brand; semantic colours are reserved for Stage and status and always travel with an icon and a label.

**Component library: MUI 7, kept as ARCH-07's default.** Reasons: (1) every form control ships with a visible label, keyboard handling and focus rings, which is most of NFR-9 for free; (2) `Grid`, `Drawer`, `Table` and `Stack` cover the 375 px rule (NFR-8) without custom CSS; (3) `Chip`, `Stepper`, `Badge`, `Tabs`, `Dialog`, `Snackbar`, `Skeleton` map one-to-one onto the component patterns in `EXPERIENCE.md`; (4) five developers with mixed React experience need one documented vocabulary, and MUI's docs are the shared reference. Rejected: shadcn/Tailwind (copy-paste ownership of components puts accessibility work on the team), Chakra or Mantine (smaller docs, no gain over MUI here), hand-rolled CSS (fails ARCH-07 outright). Only MUI core and `@mui/icons-material`; no DataGrid, no MUI X.

## Colors

- **Primary navy `{colors.primary}`** is the AppBar, primary buttons, links, active tab and the current Stepper step. It doubles as `{colors.stage-active}` so an in-flight Application reads as "the product is working on it".
- **Offer amber `{colors.stage-offer}`** appears only on the Offer stage and on Pending approval statuses: the two places a human is being waited on. Never decorative.
- **Success green `{colors.stage-success}`** for Hired and Approved; **danger red `{colors.stage-danger}`** for Rejected, Suspended and administrator-closed; **neutral slate `{colors.stage-neutral}`** for Withdrawn, Declined, Draft, Expired, Closed by recruiter.
- **Page surface `{colors.surface-page}`** sits behind white cards and tables so tables read as objects rather than floating rows.
- All pairs above meet WCAG AA against white at 16 px; MUI's default `error`, `warning`, `info`, `success` are used for Alerts and Snackbars as shipped.

Colour is never the only indicator (NFR-9): every chip has an icon and text; every Alert has a severity icon.

## Typography

Roboto through MUI defaults; no webfont is added because the free host sleeps and a font request on wake is a visible cost `[ASSUMPTION A-UX-5]`. Roles: `h1` is the page title (one per page, 28 px); `h2` heads sections and Dialogs (20 px); `body` is 16 px everywhere, including table cells, so 375 px stays readable; `caption` (13 px) carries timestamps and helper text. No text below 13 px. Reasons and Notification bodies render as `body`, never `caption`: they are content, not metadata.

## Layout & Spacing

MUI's 8 px scale. Page margin `{spacing.page-margin-mobile}` under 600 px, `{spacing.page-margin-desktop}` above. Content is capped at `{spacing.content-max}` for tables and queues and at `{spacing.reading-max}` for Job Detail, forms and the Application detail so descriptions do not run to 1200 px lines.

| Breakpoint (MUI) | Layout |
| --- | --- |
| `xs` 375–599 px | Single column; Drawer navigation; tables render as one Card per row; the Apply button is sticky at the bottom of Job Detail; filters stack full-width |
| `sm`/`md` 600–899 px | Single column; Drawer navigation; filters in one row |
| `md`+ ≥ 900 px | AppBar links inline; Job Detail two columns (8/4: content left, Apply card right); tables; Admin queues get an inline detail panel on `lg` |

Vertical rhythm: 24 px between sections, 16 px between fields, 8 px between a label and its control. Tables use MUI `size="small"` on Recruiter and Admin screens and default density on Applicant screens.

## Elevation & Depth

Flat. Cards and tables at elevation 1 on `{colors.surface-page}`; AppBar at elevation 0 with a bottom divider; Dialogs at MUI's default. No other shadows, no gradients.

## Shapes

`{rounded.sm}` (4 px) for buttons, inputs and Alerts; `{rounded.md}` (8 px) for Cards and Dialogs; `{rounded.full}` only for Chips and the Badge. Square corners say "form", round corners say "state".

## Components

MUI components used as shipped: `Button`, `TextField`, `Select`, `Table`, `Tabs`, `Dialog`, `Snackbar`, `Alert`, `Skeleton`, `Drawer`, `AppBar`, `Badge`, `Stepper`, `Pagination`. Brand-level specs:

- **Button (contained, primary)** `{components.button-primary}`; one per screen region. Secondary actions are `outlined`; destructive or terminal actions (Reject, Decline, Withdraw, Suspend, Close) are `outlined color="error"`, never filled red, so the primary path stays visually primary.
- **StageChip** `{components.stage-chip}`: outlined `Chip` with icon, label from `stage_labels`, border and text in the stage colour. Same component for Posting status and Account status with their own icon set.
- **AppBar** `{components.app-bar}`: navy, white text, 56 px on mobile, 64 px on desktop. Bell `IconButton` with `Badge color="error"`; avatar `Menu`.
- **Card** `{components.card}`: white on page surface, 16 px padding; on `xs` a Card replaces a table row and repeats the row's fields as label–value pairs with the actions at the bottom.
- **Alert**: severity by S9 code: `error` for forbidden, invalid transition, internal; `warning` for cap reached, profile incomplete; `info` for "You applied"; `success` after approvals.
- **Stepper**: horizontal on `md`+, vertical on `xs`; completed steps show a check, the current step is filled navy, future steps are grey outline; a terminal Stage adds a StageChip beside the Stepper.

## Do's and Don'ts

| Do | Don't |
| --- | --- |
| Use MUI defaults unless this file names a delta | Restyle MUI components with custom CSS classes |
| Pair every colour with an icon and a label | Signal a Stage by colour alone (NFR-9) |
| Visible `label` on every `TextField` and `Select` | Placeholder-only inputs |
| Keep body text at 16 px on every screen | Shrink table text to fit 375 px; stack to cards instead |
| One `h1` per page naming the screen | Hero banners, marketing copy, decorative images |
| Amber only for Offer and Pending approval | Amber for warnings or highlights |
| `outlined color="error"` for terminal actions | Filled red buttons |

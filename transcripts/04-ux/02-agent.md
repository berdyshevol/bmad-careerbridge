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
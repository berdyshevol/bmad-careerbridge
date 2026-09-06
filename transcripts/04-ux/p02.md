Thanks — this is a good first cut for Josh. Two pushbacks and one confirmation, then leave it as **draft**; Josh owns UX and will run the Update with his changes.

- **A-UX-1 — 30-second polling is too aggressive** for a free-tier host that sleeps: five users × 2 requests/min for a badge nobody watches. Make it **60 seconds, plus an immediate refetch after any mutation** the current user performs (TanStack Query invalidation already does that per ARCH-06). Note the value as a single constant so the team can tune it.
- **A-UX-2 — a confirmation Dialog for *every* notifying action is too much friction** for the Recruiter queue, where advancing candidates is the main job. Confirm only the **irreversible** ones: reject, extend offer, accept/decline offer, withdraw, admin close/suspend. Advancing a Stage (Applied → Screening → Interview) is one click plus Snackbar with no undo — the state machine refuses backward moves anyway, so the Recruiter must be careful, and the wireframe should say so.
- **A-UX-3 (cap counter on Job Detail) — confirmed**, keep it; it is one of the UJ-3 proof points.

Apply those two changes to EXPERIENCE.md and the Recruiter queue wireframe, log them in the memlog, keep `status: draft`, and tell me the final paths. No reviewer gate, no polish pass — Josh will decide what to keep.

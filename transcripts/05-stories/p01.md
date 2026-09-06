/bmad-create-epics-and-stories

Break the CareerBridge PRD into epics and stories. Inputs, all finalized unless noted:
- PRD: `_bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05/` (66 FRs grouped by 15 use cases UC-A1…UC-M4, 11 NFRs, iteration mapping in the addendum)
- Architecture spine: `_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/ARCHITECTURE-SPINE.md` (ARCH-01…22; "one business module per use case" is ARCH-04)
- UX (draft, owned by our Design Engineer): `_bmad-output/planning-artifacts/ux-designs/ux-bmad-careerbridge-2026-09-05/`
- Brief: `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/`

Constraints from the course and the team:
- **One epic per use case** (15 epics) plus **one "Iteration 1 skeleton" epic** for the shared infrastructure the spine defines (repo layout, Docker Compose Postgres, migrations, auth/session, role middleware, CI, Render deploy). Each use case is owned end to end by one student, so epics must not share business modules.
- Stories small enough for one `bmad-build` session (~500 lines including tests). Every story lists the FR IDs it realizes and the ARCH rules it must obey, and names the test file where those FR IDs appear (NFR-10).
- Iteration plan from the brief: Iteration 1 (week 6) = skeleton + UC-A2, UC-R2, UC-M1; Iteration 2 (week 10) = A1, A3, A4, R1, R3, R4, M2; Iteration 3 = A5, R5, R6, M3, M4.
- Owners: leave an `owner:` field empty on every epic — the team assigns at Monday's meeting.

Work headless-style: do not ask me questions, make reasonable choices and mark them `[ASSUMPTION]`. No web research, no external handoffs, local files only. When done, report the epic list with story counts per epic and the total.

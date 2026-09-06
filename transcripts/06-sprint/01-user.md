/bmad-sprint-planning

Run the implementation-readiness gate for CareerBridge and, if it passes or passes with concerns, generate the sprint status file.

Planning documents to inventory: brief (`_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/`), PRD (`_bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05/`), architecture spine + SHAPES + CAPABILITY-MAP (`_bmad-output/planning-artifacts/architecture/architecture-bmad-careerbridge-2026-09-05/`), UX (draft, `_bmad-output/planning-artifacts/ux-designs/ux-bmad-careerbridge-2026-09-05/`), and the epics file `_bmad-output/planning-artifacts/epics.md` (16 epics, 67 stories).

Question the gate must answer for each story: could a developer implement it without inventing a decision that no document records? Report the verdict as **PASS / CONCERNS / FAIL** with the specific gaps, then write `sprint-status.yaml`. Work headless-style — do not ask me questions; mark choices `[ASSUMPTION]`. No web research, no external handoffs, local files only. Finish with: the verdict, the top 5 concerns in one line each, the path of the status file, and the first story you would recommend building.

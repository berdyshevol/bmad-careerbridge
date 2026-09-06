/bmad-architecture _bmad-output/planning-artifacts/prds/prd-bmad-careerbridge-2026-09-05

Create the architecture "spine" for CareerBridge from the finalized PRD in that folder (`prd.md`, `addendum.md`, `.memlog.md`; the brief is in `_bmad-output/planning-artifacts/briefs/brief-bmad-careerbridge-2026-09-05/`, team inputs in `inputs/`).

Please use **coaching mode** — I want to weigh the real trade-offs with you, not receive a draft. Ask me one decision at a time; I will answer and sometimes disagree.

What is already fixed by the team and must not be reopened:
- JavaScript end to end: Node.js backend, React frontend, deliberately **not TypeScript** (D-004). Dr. Ren approved the departure from the course default (Maven + JUnit) verbally; the **written rationale is due in Iteration 1** and must be a section of this document.
- Web application with a multi-layered architecture: presentation, business logic, persistence, data. The course grades layer separation and traceability (requirement ID → design → code → test).
- Tests with Jest; GitHub Actions on every push (NFR-10); GitHub Issues for tracking.

What is open and where I want your help:
- Database: the team leans PostgreSQL but has not ratified it. Argue it with me.
- Backend framework and project layout (Express vs Fastify vs NestJS-without-TS), and how the four layers map to folders so five students can work in parallel without merge conflicts.
- Frontend: React with which router / data-fetching approach, and whether we need any state library at all for this size.
- Authentication and role-based authorization (three roles, strict per-organization privacy — NFR-1, NFR-3).
- Where the state machines for Posting and Application live (PRD §3) and how the business layer enforces transitions (NFR-4).
- Deployment target: Google Cloud Platform (course default) vs a free tier such as Render or Railway for students.
- Data ownership: who owns Applications, Notifications, the audit records (FR-X-4).

Rules for the spine: record **only decisions that would conflict if two team members decided independently**, each with a stable ID (e.g. ARCH-01) so stories can cite it. No web research; no external handoffs; local files only. Keep it under two pages plus the rationale section.

---
title: "Reconciliation: PRD vs Product Brief"
input: briefs/brief-bmad-careerbridge-2026-09-05/brief.md
prd: prds/prd-bmad-careerbridge-2026-09-05/prd.md + addendum.md
created: 2026-09-05
---

# Reconciliation: PRD against the Product Brief

Read-only extract. The PRD was not edited. "PRD" below means prd.md; "addendum" means addendum.md.

## Covered

Brief statements that the PRD + addendum carry faithfully (brief section → PRD location):

- Summary / Vision: multi-company job board, three roles, one fixed visible pipeline → PRD §1, §3.
- Problem: applicant never knows stage or why rejected; employer loses candidates → FR-A4-1, FR-A4-2, FR-A5-2, FR-R4-2.
- Solution sequence (post → approve → public browse → one profile/one resume → apply → fixed pipeline visible to applicant → accept → posting closes itself) → UJ-1, FR-R2-x, FR-M2-2, FR-A2-x, FR-A1-3, FR-A3-x, FR-R4-1, FR-A5-3, FR-R6-2.
- Business rules: recruiter/org approval → FR-R1-1..3, FR-M1-x; posting approval + expiry date → FR-R2-1, FR-R2-3, FR-M2-x; withdraw but not edit → FR-A3-5, FR-A4-3; cap N maintained by admin, default 5 → §3 glossary, FR-A3-4, FR-M4-1; recruiter sees only own org → FR-R3-3, FR-R3-4, NFR-1; public = job list + detail only → FR-A2-1, FR-A2-2, FR-X-2.
- Who This Serves table → PRD §2 (see Gaps for two dropped phrases).
- Golden path and second path → UJ-1, UJ-2, SC-1.
- Proof point 1 (second-org recruiter isolation) → UJ-3, FR-R3-3, SC-2. Proof point 3 (live traceability) → SC-3, NFR-10, addendum "Traceability convention".
- Engineering outcome: ≥15 use cases, 3+ per member, two roles → SC-4; Jest, GitHub Issues → addendum; layered architecture → NFR-11; stack rationale (JS, not TS, Maven/JUnit rationale due Iteration 1) → addendum; PostgreSQL proposed, not ratified → addendum.
- Scope in: behaviors, relational data model, automated tests, web deployment → FRs, addendum DB note, NFR-10, NFR-7.
- Scope out: interview scheduling/calendar, multiple resumes/cover letters, configurable pipelines, multi-org recruiter, email, AI-unless-core-complete → PRD §6.
- All fifteen use cases UC-A1..UC-M4 with sizes and iterations → PRD §4 headings; cross-cutting infra not an owned use case → FR-X-1..5.
- Count 5/6/4 and D-005 option B (16 use cases, 5/6/5) → addendum "Admin model options".
- Open questions: admin model, cap default, DB, deployment target, data retention → PRD §8, addendum.
- Counter-scope rule ("anything cut is cut to protect the fifteen use cases and the demo") → SC-C1 (paraphrased, acceptable).

Process-only items from the brief's Engineering Outcome that the PRD does not carry and reasonably should not (no action): Monday 8:00 pm weekly meeting; peer evaluation each iteration; the per-iteration deliverable lists (analysis models, detailed design, etc.). Addendum defers the Iteration 2 risk and slip order to the brief addendum, which is acceptable as a cross-reference.

## Gaps

### G-1 Proof point 2 lost its expiry and approval-gate halves — medium

- Brief: "The approval gates, the posting expiry, and the active-application cap are enforced, not decorative."
- PRD: UJ-3 lists org isolation, cap refusal, and cap change only. SC-2 "Validates FR-R3-3, FR-A3-4, FR-M4-1". Expiry (FR-M2-4) and the approval gates (FR-R1-3, FR-R2-3) are specified as FRs but are not part of any demo proof point or success criterion.
- Fix: add to UJ-3 "a Posting past its expiry date is absent from the job list and refuses an Application" and "a Pending Approval Posting is not public / a Pending Recruiter cannot create a Posting"; extend SC-2 to validate FR-M2-4, FR-R2-3, FR-R1-3.

### G-2 UC-R4 "triggers notification" has no FR in UC-R4, and notification creation sits in Iteration 3 — medium

- Brief UC-R4 (Iteration 2): "record rejection reason (triggers notification)". Brief second path: applicant "is rejected with a recorded reason and receives an in-app notification". Brief: "notification delivery" is cross-cutting infrastructure, "finished before Iteration 2 begins".
- PRD: FR-R4-2 records the reason but does not say it notifies the Applicant (FR-R6-1, FR-M2-2, FR-M2-3, FR-A5-4 all say "notifies" inline). The only rule that creates a rejection notification is FR-A5-2 under UC-A5, Iteration 3. Addendum "Iteration mapping" puts FR-X-3 (in-app delivery) in Iteration 2, so UJ-2 cannot be demonstrated end to end until Iteration 3 even though its recruiter half is Iteration 2.
- Fix: append "and notifies the Applicant with the reason" to FR-R4-2 (Realizes UJ-2); either state that notification creation is part of FR-X-3 (cross-cutting, Iteration 2 or earlier) or note explicitly that UJ-2's notification half is Iteration 3.

### G-3 Traceability chain drops "design" and "kept current" — medium

- Brief: "Requirement → use case → design → code → test, kept current as the implementation evolves; final documentation matches the delivered system."
- PRD SC-3: "Every FR ID resolves to a use case, an issue, code, and a passing test." Addendum convention: commit → issue → use case → FRs. "Design" (architecture / detailed design artifacts) is absent from the chain, and the currency condition (documentation matches the delivered system at Iteration 3) is absent.
- Fix: add "design element" to SC-3 and to the addendum convention (e.g., each use case names its design section/component), and add a sentence that SC-3 is checked against the Iteration 3 deliverables, not a snapshot.

### G-4 Shared-infrastructure-before-Iteration-2 mitigation not honored by the iteration mapping — medium

- Brief: "Mitigation: the shared infrastructure is finished before Iteration 2 begins" (infrastructure = "authentication, role-based access, notification delivery"; skeleton also includes "database schema ... deployment pipeline").
- Addendum "Iteration mapping": FR-X-3 (notifications) and FR-X-4 (audit) are placed in Iteration 2; addendum "Database" note calls the relational model "the Iteration 2 data-model deliverable" while the brief's Iteration 1 skeleton includes the "database schema".
- Fix: move FR-X-3 (and FR-X-4, which every Stage-change FR in Iteration 2 depends on) to Iteration 1 or label them "Iteration 1 skeleton", and reconcile the schema statement (schema in Iteration 1, refined DB design document in Iteration 2).

### G-5 "Every member has at least one use case on the golden path" dropped — low

- Brief: "every member has at least one use case on the golden path, so nobody is a bystander at the demo."
- PRD SC-4: "Each member owns at least three use cases from two or more roles, visible in Git history." The golden-path clause is absent.
- Fix: add "and at least one use case that realizes UJ-1" to SC-4.

### G-6 Applicant cannot tell "whether it was seen" — low

- Brief problem statement: "Nothing tells them where any application stands, whether it was seen, or why it was rejected."
- PRD: stage and rejection reason are covered (FR-A4-1, FR-A4-2); an Application still in Applied gives the Applicant no signal that a Recruiter has opened it. Nothing in FR-R3-2 or FR-A4-x records a "viewed" event.
- Fix: either accept that "seen" = advanced to Screening (say so in FR-A4-2), or add a minimal "first viewed by Recruiter" timestamp shown to the Applicant.

### G-7 "Decisions are recorded with reasons" narrowed to rejections; audit record has no reason field — low

- Brief: "Decisions are recorded with reasons and communicated in-app."
- PRD: reasons are mandatory only for rejections and suspensions (FR-R4-2, FR-M1-3, FR-M2-3, FR-M3-2). FR-X-4 audit records "acting user, the timestamp, and the previous and new values" but not the reason, whereas the addendum's transition table includes a "reason" column. Account approval (FR-M1-2) is not communicated by Notification, only via the status page.
- Fix: add "and the reason when one was given" to FR-X-4; optionally add "notifies the requester" to FR-M1-2.

### G-8 UC-M2 "handle expiry" has no Administrator action — low

- Brief UC-M2 (Admin): "Approve or reject postings before they go live; handle expiry."
- PRD FR-M2-4 makes expiry fully automatic; FR-R2-4 freezes the expiry date of a Live Posting; no FR lets an Administrator (or Recruiter) extend, re-open, or review an expired Posting. "Handle expiry" is reduced to a system rule with no human handling.
- Fix: state that intentionally (add to A-20), or add one FR such as "An Administrator can see Expired Postings and extend the expiry date of a Live Posting on Recruiter request".

### G-9 "Dr. Ren plays all three roles at the demonstrations" not reflected — low

- Brief: "The customer for the semester is Dr. Ren, who plays all three roles at the demonstrations."
- PRD: absent. FR-X-5 seeds one Administrator; no requirement for demo-ready Recruiter/Applicant accounts, seed data (Acme Waco), or fast role switching, which the ten-minute UJ-1 implies.
- Fix: add a sentence to SC-1 or NFR-7 ("the deployed system carries seeded demo data: one Administrator, the Acme Waco Organization, and test accounts for each role") or an FR-X-6.

### G-10 Recruiter success phrases weakened — low

- Brief: Recruiter "reviews applicants in one queue, records every decision without losing anyone"; Admin "nothing reaches the public unreviewed".
- PRD §2 keeps "in one queue" but FR-R3-1 lists Applications "to each Posting" (per-posting lists, no cross-posting queue). "Without losing anyone" and "nothing reaches the public unreviewed" are dropped from §2 (the latter is also contradicted, see C-1).
- Fix: add an org-wide Applications view to FR-R3-1 ("across all Postings of the Organization, filtered by Posting and Stage"), and restore the two phrases in §2 so downstream UX inherits the intent.

### G-11 Ownership "through analysis, design, implementation, and unit testing" reduced to Git history — low

- Brief: "each owned by one person through analysis, design, implementation, and unit testing."
- PRD SC-4 measures ownership only as "visible in Git history"; analysis and design ownership (use-case text, wireframes, design sections) is not a criterion.
- Fix: extend SC-4: "the use-case description, design section, code, and tests of each owned use case are authored by the owner".

## Contradictions

### C-1 FR-R2-4 lets edited content reach the public unreviewed — high

- Brief: Administrator success = "nothing reaches the public unreviewed"; business rule "postings need approval"; proof point "the approval gates ... are enforced, not decorative".
- PRD FR-R2-4 (A-13): "A Recruiter can edit the description and requirements of a Live Posting without re-approval". A Recruiter can therefore publish arbitrary new description text with no Administrator review, which is exactly the hole the brief's admin role exists to close.
- Fix: either require re-approval (edit moves the Posting back to Pending Approval, or the edit is held as a pending revision while the old text stays Live), or narrow the brief phrase with Dr. Ren and record the exception in A-13 explicitly as a departure from the brief.

### C-2 Withdrawal restricted at Offer — low

- Brief: "an applicant may withdraw but not edit a submitted application" (no stage restriction).
- PRD FR-A4-4 (A-8): withdrawal refused in Stage Offer; the Applicant must decline instead (FR-A5-4). Net effect for the Applicant is equivalent, but the term and the resulting terminal Stage differ (Declined vs Withdrawn), and UC-A4 "withdraw" no longer applies to every active Stage.
- Fix: keep as is but note in A-8 that it deliberately narrows the brief; or allow withdrawal at Offer as a synonym for decline.

### C-3 Email promoted from "out of scope" to "stretch goal" — low

- Brief: "Explicitly out of scope: ... email notifications"; the only stretch allowed is "any AI feature ... if the core scope is complete and the team chooses one".
- Addendum "Notifications": "Email stays a stretch goal." PRD §6 correctly lists email as a non-goal, so the addendum is inconsistent with both the brief and the PRD body.
- Fix: change the addendum sentence to "Email is out of scope (brief §Scope)".

### C-4 Cross-cutting infrastructure scheduled inside Iteration 2 — medium (same root as G-4)

- Brief: shared infrastructure "finished before Iteration 2 begins".
- Addendum "Iteration mapping": FR-X-3, FR-X-4 in Iteration 2.
- Fix: as G-4.

### C-5 Public surface wider than "only the job list and job detail" — negligible

- Brief: "Only the job list and job detail pages are public; everything else is behind login."
- PRD FR-X-2 also exempts registration and login; addendum screen inventory lists the recruiter/organization request form as public. Necessary for the brief's own flows (a visitor registers), so not a real conflict; worth one clause in FR-X-2 ("and the pages needed to obtain a login") to keep the brief's rule literally true.

### Aside (internal to the PRD, not a brief conflict)

- Addendum "Session handling" says "The 24-hour idle timeout (A-26)" while NFR-2 and the A-26 table row say 8 hours. One of them is stale.

Approve and continue. Token gate: **keep** the full spec — the ACs are interlocking, as you say.

All five corrections accepted, and thank you for #1 — a fresh clone going red at import is exactly the bug a reviewer would have missed. Two notes, no plan change:
1. When you delete `server/package-lock.json`, make sure the root lock still pins the same Jest major so the 268 Story 1.2 tests keep passing unchanged.
2. Prove each of the four boundary rules with a throwaway file (as the plan's DoD says), then delete the throwaway before committing — I want to see the four failing lint outputs in your summary.

Implement, run `npm run lint`, `npm test` at the root (health test against the compose Postgres — start it with `docker compose up -d` and wait for readiness), review, fix, and make the four local commits from the plan, citing Story 1.1 and NFR IDs. Set `1-1-...: done` in sprint-status.yaml in the last commit. Do not push. Finish with: `npm test` tail, `npm run lint` result, `git log --oneline -6`, `docker compose ps`, and any deviations.

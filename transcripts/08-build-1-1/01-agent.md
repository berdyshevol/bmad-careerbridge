Spec written. Presenting it with the one gate that applies.

`_bmad-output/implementation-artifacts/spec-1-1-one-repository-two-workspaces-and-a-green-ci.md`

## What the spec says

**Scope kept from `plan-1-1.md`** — all 27 files, 4 commits: (A) workspaces root, Docker Postgres 17, ESLint 9 flat + Prettier, `scripts/check-boundaries.js` with four rules; (B) `server/config.js` + pino, knexfile over an empty migrations dir, `persistence/db.js`, `business/system/checkHealth.js`, `presentation/app.js`, health tests; (C) hand-written Vite + React 19 client with the `/api` proxy and Jest/RTL; (D) `.github/workflows/ci.yml` on the S14 step list. zod in both workspaces. No deploy, no push.

**Nothing in the plan conflicts with the spine or the ACs.** I found five corrections, all in service of them:

1. **The plan's fresh-clone path is red, not skipped — a real bug.** `health.test.js` → `app.js` → `config.js`, which throws `MissingConfigError` when `DATABASE_URL`/`SESSION_SECRET` are unset. On a clone with no `.env` the server suite dies *at import*, so the plan's `describeDb` skip never runs and the story's first AC (`npm ci && npm test` exits 0) fails. Fix: `server/test/globalSetup.js` sets test-only defaults for both, when unset, before probing. It lives under `server/test/`, not `server/src/`, so S11's "config.js is the only reader" holds. Side effect you wanted: with Docker up, the NFR-7 database test actually **runs** on a fresh clone instead of skipping.
2. **Ignore lists must cover `_bmad/`, `_bmad-output/`, `inputs/`, `transcripts/`, `.claude/`** — otherwise root `prettier --check .` and `eslint .` walk the BMAD installation and fail on files that aren't ours. Plan item 8 listed only a subset.
3. **Delete `server/package-lock.json`** (162 KB, exists today). ARCH-05 means one lock at the root.
4. **Write the client by hand, don't run `npm create vite`** — plan items 19–25 fully specify the eight files; scaffolding then deleting its eslint config, README, .gitignore, demo CSS and logos (plan R8) is churn. R4 and R5 kept verbatim.
5. **Retire the manual ARCH-12 grep** in `server/README.md` for `npm run lint:boundaries` — exactly what `deferred-work.md` asked Story 1.1 to do.

Kept as-is: Postgres 17 (spine OQ-3 still open, two lines to change), flat config over `.eslintrc`, `checkHealth.js` for the NFR-11 flow, a Node script over shell greps, and `globalSetup` throwing when `CI=true` and the probe fails.

No Open Questions — everything unclear was settled from the spine, SHAPES, the epic text, or the repo.

## Token-count gate

The spec is **~3,900 tokens**, over the 1,600 guideline. The risk is context rot during implementation. Three ways to go:

- **Keep full spec** *(my recommendation)* — the ACs are interlocking: root `npm test` can't be green without both workspaces, and CI can't run without all of it. Splitting would leave a spec whose own acceptance criteria fail. The length is mostly the I/O matrix and Verification, which are checklists consumed at the end, not carried through every edit; file-level detail is delegated to `plan-1-1.md` rather than duplicated.
- **Trim** — cut Verification and the I/O matrix down to pointers at `plan-1-1.md` §4–5. Gets to ~2,600 tokens; loses the self-contained check list.
- **Split** — defer the client workspace (commit C) to a follow-up entry in `deferred-work.md`. Honest cost: the first AC and the Vite-proxy AC both fail until the follow-up lands, so Story 1.1 could not be marked done.

---

Before approving, you can open the spec file in an editor or ask me questions and tell me what to change. You can also use `bmad-advanced-elicitation` or `bmad-party-mode`, ideally in another session to avoid context bloat.

---

How do you want to proceed?

- **Approve and continue** — proceed to implementation in this session (implement, lint, both suites against the compose Postgres, review, fix, 4 local commits, no push).
- **Approve and stop** — leave it `ready-for-dev` for a fresh `bmad-build` session.
- **Review spec** — I run a reviewer over it first and we discuss findings.

Also tell me your call on the token gate (**keep** / **trim** / **split**) if it isn't "keep".
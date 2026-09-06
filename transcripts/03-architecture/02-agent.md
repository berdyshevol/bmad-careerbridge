ARCH-01 recorded with your three requirement-derived reasons earmarked for the rationale section.

**On Neon: not the worst of both worlds, but I would flip the default.** SQLite-dev/Postgres-prod was bad because the dialect differed. Neon and Docker are the same engine, so the only real question is where each developer's *test* database lives. Two things push me to local-first:

- **The Jest suite is the graded artifact (NFR-10) and it runs after every change.** Integration tests against a remote database with autosuspend pay a wake-up of a few seconds plus a network round trip per query. Locally the same suite runs in well under a second per test. Over a semester that is the difference between people running tests and people skipping them.
- **CI must be a service container regardless.** GitHub Actions should not hold a Neon secret that every pull request can read, and CI needs a throwaway schema per run. So Docker configuration exists in the repo either way.

Where Neon genuinely wins is production, and as the escape hatch for a teammate whose laptop cannot run Docker. So the decision I would record:

**ARCH-02 · One Postgres, three places.** Local Docker Compose is the default developer database and the CI database (service container). Neon hosts the deployed database. Same Postgres major version pinned in all three. The only thing that differs between environments is `DATABASE_URL`, and tests run only against a disposable database. A personal Neon branch is the sanctioned fallback for a developer who cannot run Docker.

If you still prefer Neon as the dev default, say so and I will flip it, with the cold-start caveat noted. Otherwise I record it as above.

---

**Decision 2: backend framework and layout.**

*Framework.* Performance is irrelevant at 25 users, so this is about structure and about what five students can learn from existing material.

- **NestJS without TypeScript.** Nest's value is enforced structure through decorators and dependency injection. In plain JavaScript that needs a Babel decorator setup and every tutorial is TypeScript. You would be paying Nest's ceremony while forgoing its payoff, and it quietly reverses D-004. Reject.
- **Fastify.** Faster and has JSON-schema validation built in, which is real value. Cost: far less teaching material, and its plugin encapsulation model surprises beginners.
- **Express 5.** Everybody has seen it, and version 5 finally propagates rejected promises from async handlers, so one error handler catches everything. It imposes no structure, which is fine because the spine imposes it.

Lean: Express 5. Verify the exact version when scaffolding.

*Query layer.* This is the persistence layer's identity, so it conflicts hard if left open.

- **Prisma.** Best developer experience. But the persistence layer collapses into `prisma.application.findMany` calls that students will make from services, which blurs the graded boundary, and partial unique indexes need hand-written SQL in its migrations anyway.
- **Raw `pg`.** Maximum clarity, but five people writing string SQL diverge on parameter style and error handling.
- **Knex plus `pg`.** Migrations in JavaScript, partial indexes supported, SQL still visible, and repositories are explicit functions. The rule "only files under persistence import knex" is one grep.

Lean: Knex.

*Layout.* The course wants to *see* four layers, and you want five people not colliding. Layer-first folders satisfy the grader. The collision problem is inside the business layer: the Application entity is touched by seven use cases owned by different people, so one `applicationService.js` would be a permanent merge conflict. The fix is granularity, not folder shape:

```text
server/src/
  presentation/   # express app, routers by resource, request validation, error→HTTP mapping
  business/       # one file per use case (e.g. applications/withdraw.js), domain errors
  persistence/    # one repository per entity, transactions; only place that imports knex
  data/           # migrations (timestamp-named), seeds, schema docs
client/src/
```

Business layer: one module per use case, named by the use case. That file is owned by the use-case owner, it is the "design element" a FR traces to, and its test file carries the FR IDs. Repositories are per entity and shared, so they hold no business rules, only queries and transactions. Routers are thin one-liners per endpoint, so conflicts there are trivial. Migrations are timestamp-named and never renumbered.

Dependency direction is one rule: presentation → business → persistence → data, never the reverse and never skipping. Business code never sees `req` or `res`.

Two things I want your call on: **(a)** Express and Knex, or do you want Fastify's built-in validation badly enough to take the smaller ecosystem? **(b)** one repo with `server/` and `client/` and root npm workspaces so CI runs one `npm test`, or two repositories? I lean one repo, since commit history and traceability are graded in one place.

---

**Decision 3: frontend.**

*Router.* Next.js is a server framework and would put presentation logic on the server, muddying the layer story. TanStack Router is excellent but TypeScript-first. React Router in plain library mode is the boring, documented choice. Lean: Vite + React + React Router.

*Data fetching.* This is the biggest divergence risk on the frontend. If five people write `useEffect` plus `fetch`, you get five loading states, five error conventions, and stale lists after every mutation. TanStack Query fixes all three: mutations invalidate queries, so advancing an Application refreshes the queue, and the unread-Notification count on every page (FR-A5-1) is one query with a refetch interval, which is the "light poll" the addendum already assumed. Pair it with a single `api.js` wrapper that owns base URL, cookies, and turning the server's error envelope into a thrown error. Lean: TanStack Query plus one wrapper, and a rule that components never call `fetch` directly.

*State library.* No. Server state lives in TanStack Query, the logged-in Account lives in one `useAuth` context, form state stays local. I would write the rule as a prohibition, because someone will otherwise add Redux in week eight.

*Component library.* The one you did not list, but it conflicts on day one and NFR-9 (labels, keyboard) and NFR-8 (375 px) depend on it. Hand-rolled CSS across five people fails both. Lean: MUI, because its form controls ship labels and keyboard handling. Tailwind is the alternative if the Design Engineer wants control, at the cost of building accessibility by hand.

Your call on: **(c)** TanStack Query plus wrapper, no state library, as stated? **(d)** MUI, Tailwind, or leave the component library to the UX document?
# CareerBridge server

Run the tests: `cd server && npm ci && npm test` (Jest via `jest.config.js`, `testEnvironment: node`, `--runInBand`).

Module system is **CommonJS** (no `"type": "module"`): the architecture's `require('knex')` boundary greps (ARCH-03) and the Jest + supertest setup (ARCH-22) assume it, so Story 1.1 does not reopen the module-system choice.

Pure business rules live in `src/business/domain/` (enums and the two state machines, ARCH-12); they import only `./enums` and `../errors` and do no I/O.

Import-boundary check: `npm run lint:boundaries` (run from the repository root). See the root `README.md` for the full run instructions (workspaces, Docker Postgres, lint, and the four boundary rules).

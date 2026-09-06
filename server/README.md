# CareerBridge server

Run the tests: `cd server && npm ci && npm test` (Jest, zero-config, `testEnvironment: node`).

Module system is **CommonJS** (no `"type": "module"`): the architecture's `require('knex')` boundary greps (ARCH-03) and the Jest + supertest setup (ARCH-22) assume it, so Story 1.1 keeps it as is.

Pure business rules live in `src/business/domain/` (enums and the two state machines, ARCH-12); they import only `./enums` and `../errors` and do no I/O.

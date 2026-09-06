'use strict';

const request = require('supertest');

const hasDb = process.env.DB_AVAILABLE === 'true';
const describeDb = hasDb ? describe : describe.skip;
if (!hasDb) {
  console.warn(
    'SKIP NFR-7 database tests: no reachable Postgres. Run `npm run db:up` and set DATABASE_URL in .env.'
  );
}

describeDb('health route (database)', () => {
  const { db } = require('../../persistence/db');
  const app = require('../app');

  afterAll(() => db.destroy());

  test('NFR-7 GET /api/health returns 200 after SELECT 1', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('health route (mocked failure)', () => {
  test('NFR-7 GET /api/health reports the database error when the pool is down', async () => {
    jest.resetModules();
    jest.mock('../../persistence/db', () => ({
      db: { destroy: jest.fn() },
      pool: {},
      ping: jest.fn().mockRejectedValue(new Error('connection refused')),
    }));

    const app = require('../app');
    const res = await request(app).get('/api/health');
    expect(res.status).not.toBe(200);

    jest.resetModules();
    jest.dontMock('../../persistence/db');
  });
});

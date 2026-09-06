// The only file that touches import.meta.env (S11, ARCH-22). Mocked in tests
// via client/jest.config.js's moduleNameMapper, so Jest never parses
// import.meta syntax.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export const UNREAD_POLL_MS = 60000;

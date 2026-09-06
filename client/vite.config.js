import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// babelrc/configFile disabled so babel.config.js (Jest-only, per R5) never
// reaches the browser build.
export default defineConfig({
  plugins: [react({ babel: { babelrc: false, configFile: false } })],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: false,
      },
    },
  },
});

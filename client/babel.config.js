'use strict';

// Jest only (see vite.config.js: babelrc/configFile disabled there so this
// file never reaches the Vite browser build — plan-1-1.md R5).
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};

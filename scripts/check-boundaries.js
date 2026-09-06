'use strict';

// Boundary lint (ARCH-03, ARCH-06, ARCH-12, ARCH-14). A Node script rather than
// shell greps or an ESLint plugin so macOS, Linux, and Windows teammates get
// the same result (plan-1-1.md R3). Run via `npm run lint:boundaries`.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  'coverage',
  '_bmad',
  '_bmad-output',
  'inputs',
  'transcripts',
  '.claude',
]);

const ARCH12_ALLOWLIST = ['./enums', '../errors', './postingStatus', './applicationStage'];

function walk(dir, files) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files; // unreadable directory (permissions, race) — skip, don't crash lint
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function toRelative(absPath) {
  return path.relative(ROOT, absPath).split(path.sep).join('/');
}

function isUnderServerSrc(rel) {
  return rel.startsWith('server/src/');
}

function isUnderServerPersistence(rel) {
  return rel.startsWith('server/src/persistence/');
}

function isUnderClientSrc(rel) {
  return rel.startsWith('client/src/');
}

function isTestFile(rel) {
  return /\.test\.jsx?$/.test(rel);
}

function isBusinessDomainFile(rel) {
  return /^server\/src\/business\/domain\/[^/]+\.js$/.test(rel);
}

function checkLine(rel, lineNumber, line, regex, code, message, hits) {
  if (regex.test(line)) {
    hits.push(`${rel}:${lineNumber}: ${code} ${message}`);
  }
}

function main() {
  const files = walk(ROOT, []);
  const hits = [];

  for (const absPath of files) {
    const rel = toRelative(absPath);
    let content;
    try {
      content = fs.readFileSync(absPath, 'utf8');
    } catch {
      continue; // unreadable (binary, permissions, etc.) — not source we lint
    }
    const lines = content.split('\n');

    // ARCH-03: require('knex') only under server/src/persistence/
    if (isUnderServerSrc(rel) && !isUnderServerPersistence(rel)) {
      lines.forEach((line, i) => {
        checkLine(
          rel,
          i + 1,
          line,
          /require\(\s*['"]knex['"]\s*\)/,
          'ARCH-03',
          "require('knex') is only allowed under server/src/persistence/",
          hits
        );
      });
    }

    // ARCH-06: no fetch( in client/src outside api.js and test files
    if (isUnderClientSrc(rel) && rel !== 'client/src/api.js' && !isTestFile(rel)) {
      lines.forEach((line, i) => {
        checkLine(
          rel,
          i + 1,
          line,
          /\bfetch\s*\(/,
          'ARCH-06',
          'fetch( is only allowed in client/src/api.js',
          hits
        );
      });
    }

    // ARCH-14: no EventEmitter / .emit( anywhere under server/src
    if (isUnderServerSrc(rel)) {
      lines.forEach((line, i) => {
        checkLine(
          rel,
          i + 1,
          line,
          /EventEmitter|\.emit\s*\(/,
          'ARCH-14',
          'no event bus: EventEmitter / .emit( is not allowed under server/src',
          hits
        );
      });
    }

    // ARCH-12: server/src/business/domain/*.js may only require the allowlist
    if (isBusinessDomainFile(rel) && !isTestFile(rel)) {
      lines.forEach((line, i) => {
        const re = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
        let match;
        while ((match = re.exec(line)) !== null) {
          const target = match[1].replace(/\.js$/, '');
          if (!ARCH12_ALLOWLIST.includes(target)) {
            hits.push(
              `${rel}:${i + 1}: ARCH-12 business/domain modules may only require ${ARCH12_ALLOWLIST.join(', ')} (found '${target}')`
            );
          }
        }
      });
    }
  }

  if (hits.length > 0) {
    for (const hit of hits) {
      console.error(hit);
    }
    process.exit(1);
  }

  console.log('boundaries OK (4 rules)');
  process.exit(0);
}

main();

/* CI entry point for the data checks.
 *
 * Loads data/checks.js — the same module validate.html uses in the browser —
 * and runs the data-level tier against whatever is in data/. Exits non-zero on
 * any error so bad data cannot reach the server unnoticed.
 *
 * The render tier is not run here: it needs a live graph. validate.html covers
 * that, in a browser.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { checkData } = require('../../data/checks.js');

const read = name => JSON.parse(readFileSync(new URL(`../../data/${name}`, import.meta.url), 'utf8'));

const terms = read('terms.json');
const curriculum = read('curriculum.json');
const classes = read(terms.current);

const findings = checkData(curriculum, classes);
const errors = findings.filter(f => f.level === 'error');
const warns = findings.filter(f => f.level === 'warn');

const line = f => `  [${f.level}] ${f.message}  (${f.code})`;

console.log(`${Object.keys(curriculum.courses).length} courses in the curriculum`);
console.log(`${Object.keys(classes.classes).length} running in ${classes.label}`);
console.log('');

if (warns.length) {
  console.log(`${warns.length} warning${warns.length === 1 ? '' : 's'}:`);
  warns.forEach(f => console.log(line(f)));
  console.log('');
}

if (errors.length) {
  console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}:`);
  errors.forEach(f => console.log(line(f)));
  process.exit(1);
}

console.log('All data checks passed.');

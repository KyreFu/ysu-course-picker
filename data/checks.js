/* Integrity checks for the course data.
 *
 * Pure functions: no DOM, no fetch, no file I/O. They take parsed objects and
 * return findings, so the same code runs in validate.html and in CI.
 *
 * Two tiers:
 *   checkData(curriculum, classes)  - is the data self-consistent?
 *   checkRender(curriculum, classes, view) - does the app draw what the data says?
 *
 * A finding is { level, code, message }. level is 'error' (data is wrong),
 * 'warn' (data is incomplete but usable), or 'info'.
 */

const DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa'];
const MODES = ['in-person', 'online', 'hybrid'];
const GRID_START = 480;   // 8:00a, the top of the week grid
const GRID_END = 1260;    // 9:00p, the bottom

function parseTime(t) {
  if (typeof t !== 'string') return null;
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?([ap])$/);
  if (!m) return null;
  let h = +m[1] % 12;
  if (m[3] === 'p') h += 12;
  return h * 60 + (m[2] ? +m[2] : 0);
}

function checkData(curriculum, classes) {
  const out = [];
  const err = (code, message) => out.push({ level: 'error', code, message });
  const warn = (code, message) => out.push({ level: 'warn', code, message });

  const courses = (curriculum && curriculum.courses) || {};
  const tracks = (curriculum && curriculum.tracks) || {};
  const reqs = (curriculum && curriculum.requirements) || {};
  const goals = (curriculum && curriculum.goals) || [];
  const offered = (classes && classes.classes) || {};

  if (curriculum.schemaVersion !== 1) err('schema', `curriculum.json declares schemaVersion ${curriculum.schemaVersion}, expected 1`);
  if (classes.schemaVersion !== 1) err('schema', `${classes.term || 'class file'} declares schemaVersion ${classes.schemaVersion}, expected 1`);

  // --- curriculum ---------------------------------------------------------
  const known = id => Object.prototype.hasOwnProperty.call(courses, id);

  Object.entries(courses).forEach(([id, c]) => {
    if (!c.title || !String(c.title).trim()) err('title', `${id} has no title`);
    if (!Number.isInteger(c.units) || c.units <= 0) err('units', `${id} has units ${JSON.stringify(c.units)}, expected a positive integer`);
    if (!tracks[c.track]) err('track', `${id} is on track "${c.track}", which is not declared`);

    (c.pre || []).forEach(p => { if (!known(p)) err('dangling', `${id} requires ${p}, which is not in the curriculum`); });
    (c.co || []).forEach(p => { if (!known(p)) err('dangling', `${id} lists corequisite ${p}, which is not in the curriculum`); });
    (c.anyOf || []).forEach((g, i) => {
      if (!Array.isArray(g) || g.length < 2) err('anyOf', `${id} anyOf group ${i + 1} needs at least two options`);
      (g || []).forEach(p => { if (!known(p)) err('dangling', `${id} anyOf names ${p}, which is not in the curriculum`); });
    });
    (c.flags || []).forEach(f => { if (!reqs[f]) err('flag', `${id} requires "${f}", which is not a declared requirement`); });

    if ((c.pre || []).includes(id) || (c.co || []).includes(id)) err('self', `${id} requires itself`);
  });

  // cycles: a course that can never be taken
  const state = {};
  const stack = [];
  function visit(id) {
    if (state[id] === 'done') return;
    if (state[id] === 'open') {
      const at = stack.indexOf(id);
      err('cycle', `prerequisite cycle: ${stack.slice(at).concat(id).join(' -> ')}`);
      return;
    }
    state[id] = 'open';
    stack.push(id);
    ((courses[id] || {}).pre || []).forEach(p => { if (known(p)) visit(p); });
    stack.pop();
    state[id] = 'done';
  }
  Object.keys(courses).forEach(visit);

  // requirements and goals
  Object.entries(reqs).forEach(([k, r]) => {
    if (r.kind === 'units') {
      if (!Number.isInteger(r.units) || r.units <= 0) err('requirement', `requirement "${k}" needs a positive units figure`);
      (r.countsToward || []).forEach(p => { if (!known(p)) err('dangling', `requirement "${k}" counts ${p}, which is not in the curriculum`); });
      if (!(r.countsToward || []).length) err('requirement', `requirement "${k}" counts no courses`);
    }
  });
  goals.forEach(g => {
    if (g.id !== 'ALL' && !known(g.id)) err('goal', `goal "${g.id}" targets a course that is not in the curriculum`);
    if (!g.name) err('goal', `goal "${g.id}" has no name`);
  });
  if (!goals.some(g => g.id === 'ALL')) warn('goal', 'no "ALL" goal, so there is no way to see the whole programme');

  // --- open classes -------------------------------------------------------
  let missingInstructor = 0, missingMode = 0;

  Object.entries(offered).forEach(([id, sections]) => {
    if (!known(id)) { err('unknown-class', `${id} runs this term but is not in the curriculum`); return; }
    if (!Array.isArray(sections) || !sections.length) { err('sections', `${id} has no sections`); return; }

    const seen = new Set();
    sections.forEach(s => {
      const where = `${id} section ${s.section}`;
      if (s.section === undefined || s.section === null || s.section === '') err('sections', `${id} has a section with no id`);
      if (seen.has(s.section)) err('sections', `${id} has two sections numbered ${s.section}`);
      seen.add(s.section);

      if (!Object.prototype.hasOwnProperty.call(s, 'meetings')) err('meetings', `${where} has no "meetings" key - use [] for an arranged time`);
      if (!Object.prototype.hasOwnProperty.call(s, 'instructor')) err('instructor', `${where} has no "instructor" key - use null for TBA`);
      if (!Object.prototype.hasOwnProperty.call(s, 'mode')) err('mode', `${where} has no "mode" key`);

      if (s.instructor === null) missingInstructor++;
      if (s.mode === null) missingMode++;
      else if (!MODES.includes(s.mode)) err('mode', `${where} has mode "${s.mode}", expected one of ${MODES.join(', ')}`);

      (s.meetings || []).forEach((mt, i) => {
        const at = `${where} meeting ${i + 1}`;
        if (!DAYS.includes(mt.day)) err('meetings', `${at} has day "${mt.day}", expected one of ${DAYS.join(', ')}`);
        const a = parseTime(mt.start), b = parseTime(mt.end);
        if (a === null) err('meetings', `${at} has an unreadable start time "${mt.start}"`);
        if (b === null) err('meetings', `${at} has an unreadable end time "${mt.end}"`);
        if (a !== null && b !== null) {
          if (b <= a) err('meetings', `${at} ends at or before it starts (${mt.start}-${mt.end})`);
          if (a < GRID_START || b > GRID_END) warn('meetings', `${at} (${mt.start}-${mt.end}) falls outside the 8a-9p week grid and will be clipped`);
        }
      });
    });
  });

  Object.keys(courses).forEach(id => {
    if (!Object.prototype.hasOwnProperty.call(offered, id)) {
      out.push({ level: 'info', code: 'not-offered', message: `${id} is in the curriculum but does not run this term` });
    }
  });

  if (missingInstructor) warn('instructor', `${missingInstructor} section(s) have no instructor recorded - transcribe from page 1 of the schedule`);
  if (missingMode) warn('mode', `${missingMode} section(s) have no delivery mode recorded - transcribe from page 1 of the schedule`);

  return out;
}

/* Render checks. `view` is supplied by whoever is driving the app:
 *   { nodes:[id], edges:[{source,target}], reachable(id) -> [ids],
 *     relations(id) -> [ids], ready(id) -> bool, readyExpected(id) -> bool }
 */
function checkRender(curriculum, classes, view) {
  const out = [];
  const err = (code, message) => out.push({ level: 'error', code, message });
  const offered = Object.keys((classes && classes.classes) || {});

  const nodes = new Set(view.nodes);
  offered.forEach(id => { if (!nodes.has(id)) err('node', `${id} runs this term but has no node`); });
  view.nodes.forEach(id => {
    if (!(curriculum.courses || {})[id]) err('node', `a node exists for ${id}, which is not in the curriculum`);
  });

  // Every relation must be expressed directly (its own edge) or transitively
  // (a path through other nodes and edges).
  view.nodes.forEach(id => {
    const reachable = new Set(view.reachable(id));
    view.relations(id).forEach(p => {
      if (!reachable.has(p)) err('unreachable', `${id} requires ${p}, but no path on the graph leads from ${p} to ${id}`);
    });
  });

  // No edge may exist without a relation behind it.
  view.edges.forEach(e => {
    const c = (curriculum.courses || {})[e.target] || {};
    const backed = (c.pre || []).includes(e.source)
      || (c.co || []).includes(e.source)
      || (c.anyOf || []).some(g => g.includes(e.source));
    if (!backed) err('orphan-edge', `an edge is drawn from ${e.source} to ${e.target} with no relation behind it`);
  });

  // Readiness must follow the data, not the drawing. Only meaningful when the
  // caller can supply the running app's own answer alongside an independent
  // recomputation - the standalone validator has no app to ask, so it omits
  // these and the check is skipped rather than faked.
  if (typeof view.ready === 'function' && typeof view.readyExpected === 'function') {
    view.nodes.forEach(id => {
      if (view.ready(id) !== view.readyExpected(id)) {
        err('readiness', `${id} is reported ${view.ready(id) ? 'ready' : 'blocked'} but the data says ${view.readyExpected(id) ? 'ready' : 'blocked'}`);
      }
    });
  }

  return out;
}

const CHECKS = { checkData, checkRender, parseTime, DAYS, MODES };
if (typeof module !== 'undefined' && module.exports) module.exports = CHECKS;
if (typeof window !== 'undefined') window.CHECKS = CHECKS;

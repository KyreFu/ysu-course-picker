# Yo San prerequisite explorer

An interactive map of the Fall 2026 MAcCHM / DAcCHM course prerequisites, built to answer three questions a printed schedule can't:

- What can I actually register for right now?
- Which courses unblock the most of what's left?
- How far am I from each benchmark exam?

Single HTML file, no install, no account. Open it in a browser.

## Getting started

Download `ysu-fall-2026-prereq-explorer.html` and double-click it. It opens in your default browser.

**Keep it in one place.** Progress is saved per file location, so moving the file after you've entered data makes it look like the data vanished. Pick a folder — Documents, not Downloads — and leave it there. See [Saving your progress](#saving-your-progress).

**It needs internet on first load.** The graph library (Cytoscape.js) loads from a CDN. Offline, you'll get an empty canvas.

## Using it

### Mark what you've finished

Click a course, then **Mark completed** in the right panel. Everything else recalculates from there.

Two things aren't courses and get their own checkboxes on the left: the 150 hours of clinical theater and observation, and CPR / first aid / CNT certification. Both are required for CL600. The 4 units of qi cultivation compute themselves from whichever QC and tai chi courses you've marked off.

### Pick a goal

Four options in the top left. Each filters the graph down to just what that goal requires and shows a progress bar.

| Goal | Prerequisite courses |
|---|---|
| Whole program | everything on the Fall 2026 schedule |
| First Comprehensive (EX100) | 14 |
| Pre-clinical exams (EX210 / EX220) | 22 |
| Graduation Exam (EX300) | 37 |

The goal changes the advice, not just the view. From a standing start, WM151 outranks CM111 for the First Comprehensive but ties with it for the Graduation Exam — different exams weight the tracks differently.

### Read the ready list

**Ready to take now** shows every course whose prerequisites you've satisfied, ranked by leverage. The number on each row is how many *remaining* courses toward your selected goal depend on it, counted transitively. Colour intensity tracks that number, scaled against the highest value currently showing.

A `0` means nothing else is waiting on it — take it whenever it fits. A high number means it's holding up a lot.

### Build a plan

Click `+` on any ready course to add it to **My plan**. The detail panel also has an **Add to plan** button, which is how you add something you're taking with an override or alongside its prerequisite.

The plan checks for time conflicts and shows a week grid of the result. Conflict detection is section-aware: CM112 and AC301 both meet Monday at 9, but AC301 has a noon section, so that's not a conflict and the grid shows you the combination that works. Add HM320 — also Monday 9a, one section only — and it flags the unavoidable pair by name.

Courses with arranged times (internships, observation, herb labs, exams) sit in the list but not the grid, and never count as conflicts.

An amber ▲ next to a planned course means its prerequisites aren't marked complete. Not a block — concurrent enrolment is often legitimate here — just worth a second look.

### Trace a chain

Click any node. The graph dims to that course's lineage: prerequisites behind it in green, what it unlocks ahead in amber. The view zooms in far enough to stay readable, so long chains run off-screen — drag to follow, or click empty space to zoom back out.

The right panel lists **Needs** and **Unlocks** with ✓ / ○ against each. Both are clickable, which is usually a faster way to walk a long chain than tracing it visually.

## Saving your progress

Two layers, because the automatic one isn't sufficient on its own.

**Automatic.** Everything saves to browser storage on every change. The left panel shows a green dot and the time of the last save. If your browser blocks storage — private browsing, some sandboxed previews — the dot turns amber and says so.

Browser storage is tied to the file's location and to that one browser. It doesn't follow you to another device, another browser, or a moved file.

**Backup file.** **Back up to file** downloads a small JSON file. **Restore from file** reads it back. This is what survives moving the file, switching devices, or reinstalling a browser.

Back up at the end of each registration period. The automatic layer handles day to day; the file is the only copy that's actually yours.

Restore validates what it reads. Files from another tool or a newer version are rejected with a reason. Course codes that no longer exist are skipped and named, so a backup from an older term restores partially rather than failing outright.

## What the graph means

**Solid arrow** — hard prerequisite.
**Dashed arrow** — corequisite, which the schedule allows concurrently. Doesn't block readiness.
**Filled node** — marked complete.
**Ringed node** — every prerequisite satisfied; ready to take.

Colours are tracks: TCM theory, herbal medicine, acupuncture, biomedicine, clinical, Taoist studies and qi cultivation, benchmark exams, doctoral.

## Where the data comes from

Fall 2026 Course Schedule, version 2, dated 24 July 2026, published at yosan.edu. Course numbers, titles, units, meeting times and instructor come from page 1; the lettered prerequisite key from page 2.

The registration form is a separate document and contains no course listings.

## Known limits

**It's one term's snapshot.** Courses not offered in Fall 2026 have no node, even where they appear in a prerequisite list. CM100 Chinese Medical Terminology is a prerequisite for CM201 and isn't graphed. WM360 Western Pharmacology is an accepted alternative to WM361 for the Graduation Exam and isn't graphed.

**Sections are collapsed.** AC301-1 and AC301-2 are one node. The conflict solver considers both meeting times, but the graph and the ready list show a single AC301.

**EX210 and EX220 are merged** into one node. Same prerequisites, taken the same term, 2 units combined.

**"At least one CL310 or CL400"** is modelled properly — WM340 and WM420 unlock with either. Same for WM431, which accepts internship Level 2 or Level 3.

**CL600 draws a simplified edge set.** The schedule names eleven courses individually; most are already implied through the Pre-Clinical Exam requirement, so only the additional ones are drawn. The readiness check still tests all of them.

**Prerequisites can only be waived by approved Override Petition.** This tool is a planning aid. Before you register, check the catalog and talk to an academic counselor.

## Maintaining it for a future term

Everything lives in the `<script>` block near the bottom.

- `C` — the course table. Each row is `[code, title, units, track, prerequisites, corequisites, anyOfGroups, flags]`. The last two are optional.
- `MEET` — meeting times as readable strings, e.g. `'Tu 5p-8p'`. Two sections are separated by `|`. Omit a course entirely to treat its time as arranged.
- `GOALS` — the four goal buttons. Add one by pointing it at any course code; its requirement closure is derived automatically.
- `TRACKS` — track names and colours.

Adding a course means one row in `C` and optionally one line in `MEET`. Everything else — layout, rankings, readiness, conflict detection, progress maths — derives from those.

Bump `SCHEMA` if you change the shape of saved data, so old backups are rejected with a clear message rather than restoring wrong.

## Built with

[Cytoscape.js](https://js.cytoscape.org/) with the dagre layout extension, loaded from CDN. No build step, no framework, no dependencies to install.

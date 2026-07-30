# Yo San prerequisite explorer

An interactive map of the Fall 2026 MAcCHM / DAcCHM course prerequisites, built to answer three questions a printed schedule can't:

- What can I actually register for right now?
- Which courses unblock the most of what's left?
- How far am I from each benchmark exam?

No install, no account, no build step. Open the link in a browser.

## Getting started

Visit the address it's published at. That's all — there's nothing to download.

**It can't be run by double-clicking a downloaded copy.** The page reads its data from the `data/` folder next to it, and browsers block a `file://` page from reading local files. Opening a downloaded `index.html` shows a short "course data didn't load" page instead of the app. It has to be served over http.

**It needs internet on first load.** The graph library (Cytoscape.js) loads from a CDN. Offline, you'll get an empty canvas.

### If you used a downloaded copy before

Progress is stored per web address, so it does not follow you from a local file to the hosted version. Nothing is lost, but it is stranded until you move it across, once:

1. Open your old local copy and click **Back up to file**.
2. Open the hosted version and click **Restore from file**.

After that the hosted copy is the one that matters.

## Deploying it

Upload `index.html`, `validate.html` and the `data/` folder to any web server. There is no build step and nothing to compile.

To publish a new term, replace the class file in `data/` and point `data/terms.json` at it. Nothing else changes, and no one has to download anything again. Run `validate.html` first — see [Checking the data](#checking-the-data).

## Using it

### Mark what you've finished

Three equivalent ways:

- **✓** on any row in **Ready to take now**.
- **Alt-click** a node in the graph — Option on a Mac.
- Click a course, then **Mark completed** in the right panel.

Everything else recalculates from there. Completed courses collect in **Already done**, the first list in the left panel, with a running count and total units. **↺** on any row puts one back — which is also how you un-mark something you finished long ago, without hunting for its node in the graph.

Two things aren't courses and get their own checkboxes on the left: the 150 hours of clinical theater and observation, and CPR / first aid / CNT certification. Both are required for CL600. The 4 units of qi cultivation compute themselves from whichever QC and tai chi courses you've marked off.

### Pick a goal

Four options in the top left. Each filters the graph down to just what that goal requires, lists those courses in the right panel, and shows a progress bar.

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

Each row carries two buttons: **✓** marks the course done, **+** adds it to your plan and becomes **−** to take it back out. Marking a course done drops it off this list and usually pushes new rows on, since finishing something is what unlocks the next thing.

### Build a plan

Click `+` on any ready course to add it to **My plan**. The detail panel also has an **Add to plan** button, which is how you add something you're taking with an override or alongside its prerequisite.

The plan checks for time conflicts and shows a week grid of the result. Conflict detection is section-aware: CM112 and AC301 both meet Monday at 9, but AC301 has a noon section, so that's not a conflict and the grid shows you the combination that works. Add HM320 — also Monday 9a, one section only — and it flags the unavoidable pair by name.

Courses with arranged times (internships, observation, herb labs, exams) sit in the list but not the grid, and never count as conflicts.

Blocks in the grid are clickable — click one for that course's detail in the right panel, the same as clicking its node or its row in the course list. Useful when a conflict is flagged and you want to see what each side of it actually needs.

An amber ▲ next to a planned course means its prerequisites aren't marked complete. Not a block — concurrent enrolment is often legitimate here — just worth a second look.

### Trace a chain

Click any node. The graph dims to that course's lineage: prerequisites behind it in green, what it unlocks ahead in amber. The view zooms in far enough to stay readable, so long chains run off-screen — drag to follow, or click empty space to zoom back out.

The right panel lists **Needs** and **Unlocks** with ✓ / ○ against each. Both are clickable, which is usually a faster way to walk a long chain than tracing it visually.

### Browse or search the course list

The right panel has two layers. By default it lists every course the selected goal requires, sorted by code, with a status mark against each: green ✓ done, green ○ ready to take, grey ○ still blocked. Change the goal and the list changes with it. Click any row for that course's detail — the same panel you get by clicking its node — and **← All courses** goes back.

Searching filters that list. Type a partial code, a word from a title, or a track name and you get everything close to it; when only one course matches, it opens that course's detail directly instead of making you click a list of one.

Search is scoped to the selected goal, because a course outside the goal has no node on the graph to select. If something you expect is missing, switch to **Whole program**.

### On a phone

The three panes stack — left panel, graph, right panel — and the page scrolls. Selecting a course scrolls its detail into view for you, since the right panel is below the graph at that width. The graph is still the awkward part on a small screen; the course list is usually the faster way around.

## Saving your progress

Two layers, because the automatic one isn't sufficient on its own.

**Automatic.** Everything saves to browser storage on every change. The left panel shows a green dot and the time of the last save. If your browser blocks storage — private browsing, some sandboxed previews — the dot turns amber and says so.

Browser storage is tied to the web address and to that one browser. It doesn't follow you to another device or another browser — and it doesn't carry over from a downloaded copy you may have used before, since that's a different address.

**Backup file.** **Back up to file** downloads a small JSON file. **Restore from file** reads it back. This is what survives switching devices, changing address, or reinstalling a browser.

Back up at the end of each registration period. The automatic layer handles day to day; the file is the only copy that's actually yours.

Restore validates what it reads. Files from another tool or a newer version are rejected with a reason. Course codes that no longer exist are skipped and named, so a backup from an older term restores partially rather than failing outright.

## What the graph means

**Solid arrow** — hard prerequisite.
**Dashed arrow** — corequisite, which the schedule allows concurrently. Doesn't block readiness.
**Filled node** — marked complete.
**Ringed node** — every prerequisite satisfied; ready to take.

Alt-click any node — Option on a Mac — to mark it complete or put it back without leaving the graph. A plain click still selects it and traces its chain.

Colours are tracks: TCM theory, herbal medicine, acupuncture, biomedicine, clinical, Taoist studies and qi cultivation, benchmark exams, doctoral.

### Direct and transitive requirements

Every requirement a course has is on the graph, but not every one gets its own arrow. A requirement is **direct** when nothing else that course needs already needs it, and it's drawn. Otherwise it's **transitive** — you reach it by following the arrows through the courses in between — and drawing it again would only repeat what the path already says.

CL600 requires twelve things. Eight of them are already required by the Pre-Clinical Exam, which CL600 also requires, so they arrive through it and only four arrows are drawn. Across the whole graph this removes 38 of 170 prerequisite arrows without losing a single relationship.

Nothing is hidden by this. **Needs** in the detail panel lists every requirement, direct or not, and readiness is computed from the full list — so a course never becomes takeable because an arrow wasn't drawn. Corequisites and "one of" groups are never reduced: neither guarantees a specific course was completed, so neither can stand in for one.

## Where the data comes from

Fall 2026 Course Schedule, version 2, dated 24 July 2026, published at yosan.edu. Course numbers, titles, units, meeting times and instructor come from page 1; the lettered prerequisite key from page 2. The citation travels with the data, in the `source` block of the class file.

The registration form is a separate document and contains no course listings.

## Known limits

**WM360 Western Pharmacology isn't modelled.** The schedule's key for the Graduation Exam reads "WM360 Western or WM361 Integrative Pharmacology", but WM360 appears nowhere in the university's own curriculum listing, so only WM361 is graphed. A student who took WM360 will be told they're blocked. Worth settling against the catalog.

**Five sections have no instructor.** The two herb labs, which say only "reserve times after registration", and the three benchmark exams. The schedule lists none for them; every other section has one.

**A course still can't be planned section by section.** Sections are listed individually in the detail panel with their own times, and the conflict solver considers each. But the ready list and the graph still show one AC301, and adding it to your plan adds the course, not a chosen section.

**EX210 and EX220 are merged** into one node. Same prerequisites, taken the same term, 2 units combined.

**"At least one CL310 or CL400"** is modelled properly — WM340 and WM420 unlock with either. Same for WM431, which accepts internship Level 2 or Level 3.

**Only direct requirements are drawn.** See [Direct and transitive requirements](#direct-and-transitive-requirements) below. CL600 is the clearest case: the schedule names eleven courses plus the Pre-Clinical Exam, but eight of those eleven are already required by the exam itself, so CL600 shows four arrows instead of twelve. The readiness check still tests all of them.

**Prerequisites can only be waived by approved Override Petition.** This tool is a planning aid. Before you register, check the catalog and talk to an academic counselor.

## Maintaining it for a future term

The data is split by how often it changes, and `index.html` holds no course facts of its own.

**`data/curriculum.json`** — what the programme requires. Changes when the curriculum changes, not every term. One entry per course:

```json
"CM201": { "title": "TCM Diagnosis I", "units": 3, "track": "cm", "pre": ["CM111", "CM112"] }
```

`pre` is hard prerequisites, `co` is corequisites the schedule allows concurrently, `anyOf` is groups where any one member counts (`"anyOf": [["CL310", "CL400"]]`), and `flags` names non-course requirements. Omit any of them when empty. Also holds `tracks` (ids and names — the colours are presentation and live in `index.html`), `goals`, and `requirements`.

**`data/classes-<term>.json`** — the open classes: what actually runs, and when. This is the file you rewrite each term, and it says nothing about prerequisites. One entry per section, because instructor and delivery mode belong to a section rather than a course:

```json
"AC301": [
  { "section": "1", "meetings": [{ "day": "M", "start": "9a", "end": "12p" }],
    "instructor": "…", "mode": "in-person" },
  { "section": "2", "meetings": [{ "day": "M", "start": "12p", "end": "3p" }],
    "instructor": "…", "mode": "hybrid" }
]
```

`"meetings": []` means an arranged time — the key is required, so you decide rather than forget. A section can list more than one meeting, for a class that runs twice a week. `mode` is `in-person`, `online` or `hybrid`, and is descriptive: scheduling follows whether there are meetings, so an asynchronous class simply has none.

**`data/terms.json`** — points at the current class file. Switching term is this one line, never a code change.

A course in the curriculum with no entry in the class file is understood as not offered this term: it stays on the graph so chains through it stay readable, but it can't be planned and won't appear in the ready list.

Bump `SCHEMA` in `index.html` only if you change the shape of *saved progress*, so old backups are rejected clearly. That's separate from `schemaVersion` in the data files, which guards the data format — bumping one must not invalidate the other.

## Checking the data

Open **`validate.html`** after editing anything in `data/`. It reads the same files the explorer reads and reports what it finds, in plain language.

It checks that every course named in a prerequisite, corequisite, any-of group, goal or qi list actually exists; that there are no prerequisite cycles; that units are positive whole numbers and every track resolves; that every section has a unique id, a readable meeting time that ends after it starts, and a recognised mode; and that every class in the term file exists in the curriculum.

It then checks the drawing against the data: that every course running this term has a node, that every relationship is expressed either as its own arrow or as a path through other courses, and that no arrow exists without a relationship behind it.

Errors mean the data is wrong. Warnings mean it's incomplete but usable — that's how the outstanding instructor and mode fields are reported.

The same checks run in CI on every push that touches `data/`, so bad data can't reach the server unnoticed. Both paths use `data/checks.js`, so they can't drift apart.

## Built with

[Cytoscape.js](https://js.cytoscape.org/) with the dagre layout extension, loaded from CDN. No build step, no framework, no dependencies to install. The data is JSON, fetched at load by a module script — which is why the page has to be served over http rather than opened from disk.

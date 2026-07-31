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

| Goal | Requires | Units |
|---|---|---|
| Whole program | 84 entries — 77 courses and 7 series | 197 |
| First Comprehensive (EX100) | 14 | 38 |
| Pre-clinical exams (EX210 / EX220) | 23 | 62 |
| Graduation Exam (EX300) | 38 | 116 |

A series counts as one entry carrying all its units, so CL600 is one line worth 10 rather than five lines worth 2. That is where the Graduation Exam's figure comes from: the three internship levels alone are 26 of its 116 units.

The goal changes the advice, not just the view. From a standing start, WM151 outranks CM111 for the First Comprehensive but ties with it for the Graduation Exam — different exams weight the tracks differently.

**One caveat on the Graduation Exam figure.** WM431 accepts *either* internship Level 2 or Level 3, but the count includes both, so 8 of those 116 units are for a course you won't necessarily take. The tool has always counted "one of" options this way; the series work just made the overcount bigger and more visible.

### Read the ready list

**Ready to take now** shows every course whose prerequisites you've satisfied, ranked by leverage. The number on each row is how many *remaining* courses toward your selected goal depend on it, counted transitively. Colour intensity tracks that number, scaled against the highest value currently showing.

A `0` means nothing else is waiting on it — take it whenever it fits. A high number means it's holding up a lot.

Each row carries two buttons: **✓** marks the course done, **+** adds it to your plan and becomes **−** to take it back out. Marking a course done drops it off this list and usually pushes new rows on, since finishing something is what unlocks the next thing.

**Courses that don't run this term are still listed**, because not being offered now says nothing about whether you've already taken it. Their **+** is greyed out — you can't plan them for this term — but **✓** works normally. This is how you record something like CM100, which isn't on the Fall 2026 schedule but is a prerequisite for CM201: tick it off and CM201 opens up.

A **series** — a course taken several times, like the five-part CL600 internship — shows a **›** instead. Open it to see the parts and pick one; see [Series](#series).

### Build a plan

Click `+` on any ready course to add it to **My plan**. The detail panel also has an **Add to plan** button, which is how you add something you're taking with an override or alongside its prerequisite.

The plan checks for time conflicts and shows a week grid of the result. Conflict detection is section-aware: CM112 and AC301 both meet Monday at 9, but AC301 has a noon section, so that's not a conflict and the grid shows you the combination that works. Add HM320 — also Monday 9a, one section only — and it flags the unavoidable pair by name.

### Choosing a section

Where a course has more than one opening, the plan row carries a dropdown listing them by time and instructor — *M 3p-6p · Deng* or *Th 9a-12p · Garcia*. You can also pick straight from the course detail, where each section shows its own **+**.

Until you choose, the row says **Any section** and the solver keeps finding a combination that fits. Once you choose, that section is fixed and everything else works around it. This matters: if you pin AC301 to its Monday 9a section while CM112 is planned, the tool reports the conflict rather than quietly moving you to the noon section. Picking the section you're actually enrolled in is what makes the grid true.

Clicking the section you already hold releases the choice without dropping the course.

Courses with arranged times (internships, observation, herb labs, exams) sit in the list but not the grid, and never count as conflicts.

Blocks in the grid are clickable — click one for that course's detail in the right panel, the same as clicking its node or its row in the course list. Useful when a conflict is flagged and you want to see what each side of it actually needs.

An amber ▲ next to a planned course means its prerequisites aren't marked complete. Not a block — concurrent enrolment is often legitimate here — just worth a second look.

### Trace a chain

Click any node. The graph dims to that course's lineage: prerequisites behind it in green, what it unlocks ahead in amber. The view zooms in far enough to stay readable, so long chains run off-screen — drag to follow, or click empty space to zoom back out.

The right panel lists **Needs** and **Unlocks** with ✓ / ○ against each. Both are clickable, which is usually a faster way to walk a long chain than tracing it visually.

### Series

Some courses are taken more than once, each enrolment a separate course with its own units, its own meeting time and its own instructor. CL600 Practice Internship Level 1 is five of them; the programme requires all five. The others are CL310 (two), CL400 (three), CL700 and CL800 (four each), and the two qi sequences.

On the graph a series is **one node**, labelled with its shape — `5 × 2 units` — rather than five nodes cluttering the clinical corner. Its parts have no nodes of their own.

Open it for the parts. Each lists its own sections, instructor and mode, and carries its own **✓** and **+**, so you tick off and plan the specific one you're taking. The series itself has neither button: it can't be finished in a single click.

**Anything requiring a series waits for every part.** CL700 does not open after one CL600 — it opens after the fifth. **Already done** reflects that with a running count, `CL600 · 3 of 5`, and **↺** there clears the whole series at once.

Which courses form a series is written into the data, not guessed from the course code — see [Maintaining it for a future term](#maintaining-it-for-a-future-term).

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

## What the tool tells you about its own data

The right panel ends with **About this data**, headed by the exact document the figures come from — *Fall 2026 Course Schedule, v2, 2026-07-24*. Under it is every modelling decision and every known disagreement between sources, in plain language: which entries are merged, where the sources contradict each other, and what isn't modelled at all.

These notes live in the data, not in the page. `curriculum.json` carries a `notes` array for things true of the programme, and each class file carries one for things true of that term. Whoever updates the data owns what the tool admits to.

The point is that a student who notices something odd can tell whether it's a bug or a known limit without asking anyone. Resolving the underlying discrepancies is the registrar's business, not this tool's — so the tool states them rather than guessing.

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

**Series** are declared in a `series` block, never inferred from the shape of a course code:

```json
"series": {
  "CL600": { "title": "Practice Internship Lv 1", "track": "cl", "required": 5,
             "members": ["CL600A", "CL600B", "CL600C", "CL600D", "CL600E"],
             "pre": ["EX210", "CL100", "…"], "flags": ["hours", "certs", "qi"] }
}
```

Members are ordinary courses carrying `"series": "CL600"`. Prerequisites live on the series and are inherited, and everything else references the series id, never a member.

It has to be declared because no rule over course codes works. CL600A–E carry a trailing letter; the qi sequences don't — they run QC130/QC131 and QC150/QC151/QC152. And a `-1` / `-2` in a term schedule means *another opening of one course*, not a series: AC201-1 and AC201-2 are one course you take once. When transcribing, the curriculum letter and the schedule suffix line up — `A` is `-1`, `B` is `-2` — so the schedule's `CL600-3` is written `CL600C`.

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

### What the page does not assume about the data

The data is expected to change a great deal — courses renamed, tracks added, times moved — so the page derives what it can rather than hard-coding it.

- **Text is never treated as markup.** A title, instructor or note containing `&`, `<` or a quote appears exactly as typed. Before this, a course called `Diagnosis <adv>` silently lost the `<adv>` into the DOM.
- **Requirement wording comes from the data.** Rename the 150-hour requirement in `curriculum.json` and the checkbox, the detail panel and the qi note all follow.
- **Unknown tracks still get a colour.** `index.html` holds a palette for the eight current tracks; a track it doesn't recognise gets a colour derived from its key, so a new one is distinguishable rather than another grey.
- **The week grid fits the timetable.** Its window is the earliest start and latest end actually scheduled, never narrower than 8a–9p — an early-morning or late-evening class widens the grid instead of being clipped.
- **A section may meet several times a week**, and a course may have any number of sections.

What stays hard-coded, deliberately: the colours for the eight known tracks, and the standing advice about Override Petitions.

## Checking the data

Open **`validate.html`** after editing anything in `data/`. It reads the same files the explorer reads and reports what it finds, in plain language.

It checks that every course named in a prerequisite, corequisite, any-of group, goal or qi list actually exists; that there are no prerequisite cycles; that units are positive whole numbers and every track resolves; that every section has a unique id, a readable meeting time that ends after it starts, and a recognised mode; and that every class in the term file exists in the curriculum.

It then checks the drawing against the data: that every course running this term has a node, that every relationship is expressed either as its own arrow or as a path through other courses, and that no arrow exists without a relationship behind it.

Errors mean the data is wrong. Warnings mean it's incomplete but usable — that's how the outstanding instructor and mode fields are reported.

The same checks run in CI on every push that touches `data/`, so bad data can't reach the server unnoticed. Both paths use `data/checks.js`, so they can't drift apart.

## Built with

[Cytoscape.js](https://js.cytoscape.org/) with the dagre layout extension, loaded from CDN. No build step, no framework, no dependencies to install. The data is JSON, fetched at load by a module script — which is why the page has to be served over http rather than opened from disk.

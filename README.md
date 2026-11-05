# Savanna static pages

Three Savanna learner pages, frozen from the **local dev app** into plain HTML + CSS so they can be
opened offline and used as a reference for front-end and accessibility work.

Open `index.html` (or any file in `pages/`) directly with `file://` — double-clicking works, no
server needed.

## What is here

| Page | Learner / course | What it shows |
|------|------------------|----------------|
| `pages/homepage-v1-paced.html` | Björn Sibanda — **WR 100: Fundamentals of Effective Communication**, cohort F26-SEM-16W (31 Aug – 20 Dec 2026), week 10 of 15 | Courses dropdown (3 courses), week strip with **every week preloaded**, "continue where you left off", immediate deliverables, period progress, overall score (59.56%, "slightly behind"), upcoming events |
| `pages/homepage-v1-self-paced.html` | Amara Nwosu — **VA-1: VA Foundations & Professional Identity** | Course-progression gauge (16% against the 70% graduation threshold), 1 of 3 modules complete, **working module switcher**, **preloaded programme modal**, pacing boost (11 days left), upcoming events |
| `pages/concept-with-navigation.html` | Amara Nwosu — concept *"The Future of the VA Industry"* | Curriculum navigation panel (read / current / unread states) beside a full authored concept: callouts, numbered card grid, two-column comparison, icon lists, "Mark as complete". The "Need a Fast Track?" block and the Padlet reflection block are removed on request. |

Both homepages are the **current** learner dashboard: a v1 curriculum with
`enable_homepage_v2` + `enable_curriculum_navigation`, which is what every live v1 cohort uses
(`_student_home_paced_v2` / `_student_home_self_paced_v2`). The older `_student_home_paced` /
`_student_home_self_paced` partials are not captured here.

All three are rendered under the **ALX** interface theme, locale `en`, at a 1440px viewport.

## Layout

```
savanna_static_pages/
├── index.html                 landing page linking the three captures
├── pages/*.html               the frozen pages (relative links into ../assets)
├── assets/
│   ├── css/                   the application's own stylesheets, unminified — application_alx.css
│   │                          (sprockets, themed), app.css (esbuild), Google Fonts, Typekit —
│   │                          plus static-page.css, the only one written for these pages
│   ├── fonts/                 76 font files, all referenced by the stylesheets above
│   ├── img/                   51 images: logos, icons, concept artwork, substituted embeds
│   └── js/                    popper.js + bootstrap.bundle.js (the exact files the live app
│                              serves through sprockets) + static-page.js
└── _tooling/                  scripts that produced all of the above (not part of the site)
```

Everything is shared: the three pages point at the same `assets/` tree, nothing is duplicated and
nothing is minified or gzipped. Captures are additive, so each run ends by dropping assets no
published page references any more — otherwise the Rive stills from retired week panels would
pile up run after run.

## What still works

These are live in the frozen pages, driven by `assets/js/static-page.js` against content that was
pre-rendered during the capture and parked in `<template>` elements (so nothing is duplicated in
the accessibility tree and no id appears twice):

| Control | Page | Behaviour |
|---|---|---|
| **Hamburger** | all | Collapses the sidebar to its 70px icon rail and back, remembered in `localStorage` under `sidebar-collapsed`. It moves the same three things the app does: `body.sidebar-collapsed`, `expanded` on `#sidebar`, and the labels (React wrote `display` inline on each, so `assets/css/static-page.css` overrides them from the body class). |
| **Week strip** | paced homepage | Every week of the course was rendered server-side at capture time; clicking one swaps the panel below it and moves the `active` state. The chevrons and the scroll-into-view of the selected week are reimplemented from the component's own sidecar JS. |
| **Score details modal** | paced homepage | Server-rendered per week, so it opens on its own — including the one that arrives with a week you switch to. |
| **My activities** | self-paced homepage | Each module's activity list was rendered at capture time; clicking a module swaps the panel beside it, as `HomepageSelfPacedActivities.tsx` does. |
| **Programme modal** | self-paced homepage | "Program details" normally fetches `/dashboards/program_structure.json` on first open — the capture opens it once so the fetched tree is baked in. Its course and module accordions expand and collapse: React renders only the body of an *open* section, so the capture opens each one to materialise its content, pairs every toggle with the element it controls (`data-static-collapse-toggle` / `data-static-collapse-body`) and closes again the ones the app had closed. |
| **Courses dropdown** | all | Server-rendered markup, so Bootstrap's dropdown opens it with no help: three courses across a programme group and "Other courses". |
| **Curriculum bar** | all | The bar fixed under the header pads the content by its own height and slides away on scroll down, as `CurrentCurriculumScrollBehavior.tsx` does. |
| Dropdowns, modals, accordions, collapse, tooltips | all | Bootstrap's own bundle. |

Everything else is inert.

**Removed from every page**, because both need a server: the language toggle and the global
search (`#search-button` / `#search-modal`).

## What is real and what is not

**Real** — the markup is the live DOM after the application rendered it: server-side ERB and
ViewComponents, plus every React component (score gauge, module list, pacing boost, navigation
panel) in its mounted state, and real learner data from the local dev database.

**Changed on the way out:**

- **No application JavaScript.** `app.js` / `sprockets.js` are dropped. Two small scripts ship
  instead: `assets/js/bootstrap.bundle.js` (5.3.3, unminified), which keeps Bootstrap's own
  widgets alive — dropdowns, modals, accordions, collapse — and `assets/js/static-page.js`, which
  reimplements the handful of app behaviours listed under **What still works** below.
- **All links are dead.** Every `<a href>` is rewritten to `#`, and every `<form action>` with it,
  so nothing navigates away from the frozen page. The controls that do work are driven by data
  attributes, not by their href.
- **`data-react-props` removed.** `data-react-class` is kept on each mount point so it is still
  obvious which block React owned; the JSON payload beside it is not useful in a dead page.
- **`<canvas>` and remote `<iframe>` are stills.** They cannot be serialised, so each one was
  photographed and replaced by an `<img data-static-substitute="canvas|iframe">` of the same box.
  Grep that attribute to find them (the Rive banners on the paced homepage, in every week).
- **Staff chrome removed.** The captures are driven through staff impersonation, so the red
  "You are currently impersonating…" banner and `#viewing_as` are stripped — a learner never sees
  them. CSRF/ActionCable/analytics meta tags and GTM scripts are stripped too.

**Known differences from the live app:**

- The self-paced greeting reads *"Resume your learning → Module 1 Recap Quiz"* even though that
  quiz is passed. That is the app's own behaviour: the cohort allows unlimited retakes, so the
  quiz never counts as `completed` for the "first incomplete activity" walk.
- Anything that needed a server round trip and was not preloaded is inert: submitting the quiz,
  marking a concept complete, searching, switching course or language.
- On the concept page the Padlet *widget* is gone, but the author's own sentence above it ("share
  your reflection in the padlet below") is left alone — that is course content, not chrome. Say
  the word and the capture can strip the callout around it too.
- **Narrow viewports:** the markup was captured at 1440px. The hamburger works, so the sidebar
  collapses as it does live, but any other responsive state React recomputes on mount is frozen
  at desktop. If a mobile-accurate capture is wanted, a `PAGES` entry in `capture.mjs` takes its
  own `viewport`.

**Real defects these pages reproduce.** `static-page.js` deliberately adds no ARIA and no keyboard
handling the application does not already have, so an audit of these pages is an audit of the app:

- At 390px the concept page overflows horizontally by 90px. `verify.mjs --mobile` reports it, and
  the live app does exactly the same — it is not a capture artefact.
- The hamburger is a `<div>` with a click handler and no `role`, `tabindex` or accessible name,
  exactly as `SidebarToggle.tsx` renders it: operable with a mouse, invisible to the keyboard and
  to a screen reader.
- The programme modal's course and module toggles carry `aria-expanded` but no
  `aria-controls`, so the relationship between a toggle and its panel is not exposed.
- The module buttons in "My activities" are plain `<button>`s with no `aria-pressed` and no tab
  semantics, as `HomepageSelfPacedActivities.tsx` renders them.

## Regenerating

Requires the dev app on `localhost:4000`, Docker up for `dip`, and the Playwright install in
`../playwright`.

```bash
cd _tooling
node capture.mjs          # re-renders the pages and rewrites assets/ and pages/  (~6 min:
                          # every week of the paced course is a separate server render)
node capture.mjs <slug>…  # re-render only those pages; the rest of the tree is left alone
node capture.mjs --prune-only   # just drop assets no published page references any more
node verify.mjs --mobile  # loads each page from file:// — must report no external request,
                          # no failed request and no JS error, at 1440px and 390px
node interactions.mjs     # drives every control listed under "What still works"; must be all-pass
```

To change which pages are captured, edit the `PAGES` array at the top of `capture.mjs`: each
entry takes a slug, a learner id, a path, an optional `viewport`, and the flags
`preloadTracks` / `preloadSections` / `preloadProgramModal` / `strip`.

## Dev database state behind these captures

`_tooling/prepare_demo_data.rb` and the capture run wrote the following into the **local dev**
database, so the pages show a learner mid-course rather than empty cards:

- `interface_theme = 'ALX'` on users 5684 and 5610.
- User 5610 renamed from the seed placeholder to *Amara Nwosu*.
- Two extra enrolments for each learner (BC 746 *Validated*, BC 747 *In progress*), without which
  the header renders a plain course label instead of a courses dropdown — the app only offers the
  dropdown when there is somewhere to switch to. Each page's URL pins `context_curriculum_id` so
  the extra enrolments cannot change which course the capture lands on.
- Six upcoming events (ids 663–668) across batches 416 and 404, with RSVPs synced through
  `EventService#synchronize_rsvps` (learners only see events they are invited to).
- `Setting` `checker_fast_track_enabled = true`, so the end-of-module checker runs locally
  instead of posting to the external checker over SQS.
- Learner progress for user 5610, produced by driving the real UI and the real services:
  17 concepts marked complete, the Module 1 Recap Quiz taken through the quiz UI (8/10, 80%),
  the End of Module 1 Check submitted and auto-reviewed to 100%, project access recorded via
  `ProjectAccessTrackingService`.
- `EvaluationQuizService.create_evaluation_quiz_corrections` was run on BEQI 1255 and 1256 to
  backfill the quiz corrections that were missing for learners who enrolled after release
  (7 → 20 rows on each).

`_tooling/revert_demo_data.rb` undoes all of it except the quiz-correction backfill, which is
left in place deliberately — it is what the app itself does on release, and other seeded learners
legitimately own those rows. The runner executes inside the container, which only mounts the repo,
so copy the script in first:

```bash
cp _tooling/revert_demo_data.rb <repo>/tmp/claude/
cd <repo> && dip rails runner tmp/claude/revert_demo_data.rb
```

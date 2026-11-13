# ALX assistant verification record

Updated: 2026-11-13. Owner: Adonay. Scope: the assistant, three new demo pages and the modified areas of the original captures. This is a record of evidence, not a WCAG conformance claim.

## Environment and evidence

- Desktop browser screenshots show Firefox on Linux; precise browser version is not recorded.
- API uses mock LLM and console human help for the reported checks. Gemini/Telegram code exists; real-service verification is not recorded here.
- Static site: `http://localhost:5000`; API: `http://localhost:3000`; this machine's PostgreSQL: `127.0.0.1:5435` (shared default 5433).
- Runtime versions observed across sessions include Node 22.23.4 and user output Node 20.20.2. Record the final rehearsal version below.
- Evidence below is the developer's chat report after supplied commands/checklists. No axe exports, NVDA transcripts, TalkBack recordings or full zoom measurements have been supplied.
- API tests and parity/build checks were reported clean during the relevant cards. Re-run the final checkout before release; historical counts are not a current-suite guarantee.

## Journey matrix

| ID  | Journey                      | Functional evidence                                                                 | Structured keyboard                         | Screen reader                 | Mobile/400%                                           | Owner  |
| --- | ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------- | ----------------------------------------------------- | ------ |
| J1  | Page Q&A, sections and focus | Reported pass: mock page context and section buttons                                | Targeted checks reported; full pass pending | Pending                       | Responsive spot-check reported; measured pass pending | Adonay |
| J2  | Sign-up through assistant    | Reported pass after demo pages; password stays in form/auth request                 | Full pass pending                           | Pending                       | Pending                                               | Adonay |
| J3  | Confirmed enrolment          | Reported pass: Cancel/Escape, dummy session, Yes and dashboard                      | Targeted checks reported; full pass pending | Pending                       | Pending                                               | Adonay |
| J4  | Switch English/Amharic       | Reported pass: translated UI/errors; fallback preserves UI choice                   | Full pass pending                           | Pending; voice/font dependent | Font/device review pending                            | Adonay |
| J5  | Human help                   | Reported pass: request, claim, two-way messages, close; API replay/poll tests       | Full pass pending                           | Pending                       | Reconnect/mobile pass pending                         | Adonay |
| J6  | Forms without assistant      | Reported pass: errors, registration, enrolment, dashboard, duplicate/unknown course | Full pass pending                           | Pending                       | Responsive check reported; measured pass pending      | Adonay |

Do not replace Pending with Pass without recording browser, device, steps and findings below.

## Accessibility Gate (provisional organiser checklist)

Confirm this checklist against the organisers' official gate before judging.

| Item                                                                 | Status                                      | Evidence / next check                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Zero serious/critical axe findings on seven pages, panel closed/open | Pending                                     | Run all 14 page/panel combinations; attach reports                                                 |
| Keyboard-only main journey; focus visible                            | Partial                                     | Targeted launcher, confirmation, skip link, dropdown and hamburger checks reported; complete J1–J6 |
| Every control has an accessible name                                 | Pending                                     | Inspect accessibility tree and axe findings                                                        |
| NVDA main journey                                                    | Pending                                     | Record Windows/browser/NVDA version and spoken output                                              |
| TalkBack mobile/WebView journey                                      | Pending                                     | Chrome Android is planned fallback; record whether a real WebView was tested                       |
| Captions and transcript for added video                              | Not applicable to new deliverable           | No new video added; host media has not been audited                                                |
| Page/parts declare language                                          | Implemented; audit pending                  | Verify message and fallback course language in accessibility tree                                  |
| Extendable time limits; no login puzzles                             | Implementation reviewed; user audit pending | No user-facing countdown/puzzle; help idle closure does not time out page forms                    |
| Reflow at 400% / 320 CSS px                                          | Pending                                     | Spot checks reported; complete measured test on seven pages                                        |
| README/API describe keyboard and ARIA                                | Written; review pending                     | Both READMEs updated; API accessibility contract in backend README                                 |

## Pages to audit

For each: keyboard, 200% text, 400% zoom/320 CSS px, axe closed/open, and errors where applicable.

| Page                                 | Closed axe | Open axe | Reflow  | Notes                                               |
| ------------------------------------ | ---------- | -------- | ------- | --------------------------------------------------- |
| `index.html`                         | Pending    | Pending  | Pending | Launcher, skip link                                 |
| `pages/homepage-v1-paced.html`       | Pending    | Pending  | Pending | Week switch and score modal                         |
| `pages/homepage-v1-self-paced.html`  | Pending    | Pending  | Pending | Modules and programme modal                         |
| `pages/concept-with-navigation.html` | Pending    | Pending  | Pending | Curriculum and concept content                      |
| `pages/signup.html`                  | Pending    | Pending  | Pending | Error summary, password reveal/paste, success focus |
| `pages/enroll.html`                  | Pending    | Pending  | Pending | Logged-out, unknown/duplicate course, success       |
| `pages/dashboard-demo.html`          | Pending    | Pending  | Pending | Logged-out, empty and enrolled states               |

## Defects

No formal audit findings have been recorded yet. This does not mean no defects exist. Add one row per finding; critical/serious issues block release until fixed or the scope is explicitly resolved.

| ID  | Journey/page | Steps to reproduce | WCAG | Severity | Owner | Status / fix / retest |
| --- | ------------ | ------------------ | ---- | -------- | ----- | --------------------- |

Known limits to evaluate: inert legacy sidebar links, skipped legacy heading levels, Firefox font warnings, missing original favicon assets, Alt+H/browser menu clashes, draft Amharic, and widget size above the provisional 50 KB target. Dependency audit findings were recorded during setup; their final disposition is not established here.

## Run records

### Implementation checks reported by developer (2026-11-13)

- Widget: syntax/build/unit checks; keyboard open/close, language/simple controls, session restore, short/mobile layout.
- Page extraction: bounds, hidden/private exclusion and stable outline IDs.
- Chat/actions: mock scenarios, safe actions, confirmations, password boundary, course cards.
- Help: core/API tests and live development-server script returned `PASS: claim, two-way messages, SSE and close`; widget flow also reported pass.
- Seven pages: automatic widget load; new form/dashboard journey reported working.
- Legacy patches: skip links, hamburger/dropdown Enter/Space and existing week/module/modal interactions reported pass.

### Formal audit run template

- Date/time and tester:
- Commit hashes (static and API):
- Browser/version, OS, Node version:
- Screen reader/version/device and voice:
- Journey/page and exact steps:
- Expected and observed focus/speech/output:
- Zoom, CSS viewport dimensions and orientation:
- axe/Lighthouse report location and serious/critical counts:
- Defect IDs and retest evidence:
- Result: Pending / Pass / Fail

## Demo readiness (B6.1)

- Final build/tests/parity on merged checkouts: Pending
- Official gate checked: Pending
- Real provider/channel or explicit mock/console disclosure: Pending
- Draft Amharic/native review disclosure: Required
- Three consecutive successful rehearsals: 0 / 3 recorded
- Backup recording and final repository tags: Pending

## Revised scope: login and voice implementation checks · 2026-11-13

Automated Chrome offline fixtures on Ubuntu: login at1280×800 and360×800 passed empty validation, incorrect-credential handling, successful session integration, password exclusion from page context/history, and horizontal layout. Voice at1280×800,360×800 and1280×450 passed editable transcript/explicit Send/language/cleanup checks with fake microphone and provider responses. Reproducible scripts live in the backend: scripts/login-browser-smoke.mjs and scripts/voice-browser-smoke.mjs (Node22+/Chrome; login requires sibling static checkout).

These are functional automation results, not formal assistive-technology or real microphone evidence. Login adds an eighth page to the revised audit scope; its closed/open panel, axe, screen-reader and400% checks remain pending. Amharic STT, pronunciation, actual microphone and Android checks remain pending. One-question signup recovery remains pending R5 work.

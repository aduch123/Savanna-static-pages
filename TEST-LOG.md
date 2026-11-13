# ALX assistant verification record

Updated: 2026-11-13. Owner: Adonay. Scope: the assistant, three new demo pages and the modified areas of the original captures. This is a record of evidence, not a WCAG conformance claim.

## Environment and evidence

- Desktop browser screenshots show Firefox on Linux; precise browser version is not recorded.
- API uses mock LLM and console human help for the reported checks. Gemini/Telegram code exists; real-service verification is not recorded here.
- Static site: `http://localhost:5000`; API: `http://localhost:3000`; this machine's PostgreSQL: `127.0.0.1:5435` (shared default 5433).
- Runtime versions observed across sessions include Node 22.23.4 and user output Node 20.20.2. Record the final rehearsal version below.
- Evidence below is the developer's chat report after supplied commands/checklists. Automated axe/reflow exports were subsequently recorded below; NVDA transcripts, TalkBack recordings and full manual zoom measurements remain pending.
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
| Zero serious/critical axe findings on revised eight-page closed/open matrix | Automated pass; manual incomplete checks pending                                     | 16 combinations; exports in test-results/2026-11-13; seven incomplete rule occurrences require review                                                 |
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
| `index.html`                         | Auto pass | Auto pass | Measured; zoom pending | Launcher, skip link                                 |
| `pages/homepage-v1-paced.html`       | Auto pass | Auto pass | Measured; zoom pending | Week switch and score modal                         |
| `pages/homepage-v1-self-paced.html`  | Auto pass | Auto pass | Measured; zoom pending | Modules and programme modal                         |
| `pages/concept-with-navigation.html` | Auto pass | Auto pass | Measured; zoom pending | Curriculum and concept content                      |
| `pages/signup.html`                  | Auto pass | Auto pass | Measured; zoom pending | Error summary, password reveal/paste, success focus |
| `pages/login.html` | Auto pass | Auto pass | Measured; zoom pending | Credential validation and returning-user session |
| `pages/enroll.html`                  | Auto pass | Auto pass | Measured; zoom pending | Logged-out, unknown/duplicate course, success       |
| `pages/dashboard-demo.html`          | Auto pass | Auto pass | Measured; zoom pending | Logged-out, empty and enrolled states               |

## Defects

The automated findings below were fixed and retested. Remaining incomplete axe checks and manual/device acceptance still block a release claim. The initial and final exports are preserved in the evidence bundle.

| ID  | Journey/page | Steps to reproduce | WCAG | Severity | Owner | Status / fix / retest |
| --- | ------------ | ------------------ | ---- | -------- | ----- | --------------------- |
| A01 | Four captured/entry pages | Run baseline axe contrast checks | 1.4.3 | Serious | Adonay | Fixed darker red/link/warning text; final 16 scans clear |
| A02 | Captured learner pages | Inspect logo links and progress names | 4.1.2 | Serious | Adonay | Named home links and progress bars; retested |
| A03 | Sidebar/lesson anchors | Run list and hidden-focus checks | 1.3.1,4.1.2 | Serious | Adonay | Valid separators and nonfocusable anchor markers; retested |
| A04 | Self-paced help icon | Inspect tooltip span name/role | 4.1.2 | Serious | Adonay | Named keyboard-focusable info button; retested |
| A05 | Concept page/assistant | Set visible width 320px | 1.4.10 | Layout defect | Adonay | Curriculum/card reflow and visual-viewport sizing; measured pass |


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

These are functional automation results, not formal assistive-technology or real microphone evidence. Login adds an eighth page to the revised audit scope; its closed/open panel, axe, screen-reader and400% checks remain pending. Amharic STT, pronunciation, actual microphone and Android checks remain pending. One-question signup recovery is covered by the subsequent guided-signup increment below.

Guided signup offline Chrome checks at1280×800 and360×800 passed field-by-field validation, corrections, pause into ordinary chat, resume, component/state recovery, explicit final confirmation and password exclusion/cleanup. Synthetic Amharic transcription through the implemented service succeeded in4.2s after earlier timeout failures; ALX transliteration differed. Real microphone, pronunciation and assistive-technology acceptance remain pending.

## Automated axe/reflow matrix and fixes · 2026-11-13

[Full report bundle](test-results/2026-11-13/README.md) records eight pages × closed/open:16 axe scans, zero reported violations under WCAG A/AA tags, and seven incomplete-rule occurrences awaiting manual review. Login is included in this revised scope.32 CSS viewport checks at320px/desktop passed measured page/panel overflow checks. Actual400% browser zoom, assistive technology and interactive modal/error/help states remain pending.

Fixed measured defects: unreadable red/link/warning text; unnamed logo links/progress bars; focusable hidden lesson anchors; invalid sidebar separators; an unlabelled tooltip span; long curriculum selector/card-grid overflow. The widget now follows visual width as well as height, retaining visible controls even when a host layout expands wider than the physical viewport.

Backend build/full199 tests,126-key parity and real Chrome offline voice/login/guide checks passed. Live synthetic English WebM transcription and stateless TTS succeeded; Amharic WAV succeeded earlier, but two Amharic WebM attempts returned provider503. Amharic microphone readiness is therefore pending, not accepted. No further cloud probes or billing changes.

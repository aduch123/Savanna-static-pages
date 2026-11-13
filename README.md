<div align="center">

# Savanna · Accessible Learning Demo

**A multilingual assistant and human help for the ALX learner experience.**

[Getting started](#getting-started) · [Demo pages](#demo-pages) · [Accessibility](#accessibility) · [Test log](TEST-LOG.md) · [Backend API](https://github.com/aduch123/alx-assistant-api)

</div>

---

## Overview

This project extends three captured Savanna learner pages with an accessible assistant, English and Amharic interface support, and a live connection to human help. Four additional pages demonstrate account creation, returning-user sign-in, course enrolment, and a learner dashboard.

The assistant is delivered as a versioned Web Component. It reads the current page, explains its structure, moves focus to requested sections, recommends courses, and proposes actions for the learner to confirm.

> **Demo scope:** accounts and enrolments use our own demonstration data. They do not create real ALX accounts or enrolments. Amharic translations are drafts awaiting review.

## Features

| Area            | Experience                                                                        |
| --------------- | --------------------------------------------------------------------------------- |
| Page assistance | Page orientation, section lists, progress explanations, and focus navigation      |
| Language        | English/Amharic controls, translated errors, and language-tagged messages         |
| Guided actions  | Safe form filling and explicit confirmation before registration or enrolment      |
| Human support   | Live helper messages, reconnect handling, and polling fallback                    |
| Learner pages   | Sign-up, sign-in, course selection, and a dashboard of enrolled courses                    |
| Accessibility   | Keyboard controls, screen-reader semantics, visible focus, and responsive layouts |

## Getting started

### 1. Start the API

Follow the setup instructions in [alx-assistant-api](https://github.com/aduch123/alx-assistant-api). The API should run at `http://localhost:3000`.

Its `ALLOWED_ORIGINS` must include `http://localhost:5000`. Include `http://127.0.0.1:5000` too if you use that hostname.

### 2. Serve this repository

From the project root:

```bash
npx serve . -l 5000
```

### 3. Open the demo

Visit **[localhost:5000](http://localhost:5000)**. All eight pages load the assistant automatically. No browser-console setup is required.

Keep both servers running. Use the same browser tab for sign-up, enrolment, and the dashboard: session storage holds the learner session in that tab. If browser storage is blocked, a subsequent page may not retain the session.

The original captured content can be viewed offline. Assistant and account features require the HTTP servers.

## Demo pages

| Page                                                                       | Purpose                                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`index.html`](index.html)                                                 | Entry point linking to the captured learner pages                           |
| [`pages/homepage-v1-paced.html`](pages/homepage-v1-paced.html)             | Communication course dashboard with weeks, deliverables, scores, and events |
| [`pages/homepage-v1-self-paced.html`](pages/homepage-v1-self-paced.html)   | VA course dashboard with progress, modules, and activities                  |
| [`pages/concept-with-navigation.html`](pages/concept-with-navigation.html) | “The Future of the VA Industry” lesson with curriculum navigation           |
| [`pages/signup.html`](pages/signup.html)                                   | Demo account creation with accessible validation                            |
| [`pages/login.html`](pages/login.html) | Sign in to an existing demo account; password stays in the form |
| [`pages/enroll.html`](pages/enroll.html?course=VA-1)                       | Course selection and demo enrolment                                         |
| [`pages/dashboard-demo.html`](pages/dashboard-demo.html)                   | Learner name, enrolments, and links to course pages                         |

### Suggested walkthrough

1. Ask the assistant **“Where am I?”** and **“What sections are on this page?”**
2. Choose a section button to move focus into the page.
3. Switch to Amharic and try the interface controls.
4. Create a demo account with dummy details, then enrol in a course.
5. Open the dashboard to see the enrolment.
6. Choose **Help me now** to try the configured human-support channel.

Mock responses are identified with `[mock]`. A helper must claim a request through the backend's console endpoints or configured Telegram channel before replying.

## Accessibility

### Keyboard

| Key                 | Action                                                                         |
| ------------------- | ------------------------------------------------------------------------------ |
| `Tab` / `Shift+Tab` | Move between controls and the host page                                        |
| `Alt+H`             | Open the assistant and focus its input; close when its input already has focus |
| `Enter`             | Send a message                                                                 |
| `Shift+Enter`       | Insert a newline                                                               |
| `Escape`            | Cancel a focused confirmation or close the assistant                           |
| `Enter` / `Space`   | Activate the repaired sidebar and course-dropdown controls                     |

The first Tab stop reveals **Skip to main content**. Closing the assistant returns focus to its launcher. Restoring a saved panel does not take focus. A host modal temporarily hides the assistant.

### Semantics and language

- The launcher is a named button with `aria-expanded`; the panel is a labelled, non-modal dialog.
- Complete replies appear in `role="log"` with `aria-live="polite"`; status text uses `role="status"`.
- Toggles expose `aria-pressed`. Confirmations use real Yes/Cancel buttons.
- Messages declare their actual language. Amharic uses `lang="am"`; English course text remains `lang="en"` when a translation is unavailable.
- An English fallback reply preserves the selected interface language. An explicit language-switch action can change it.
- The sign-up form supports password managers, pasting, and password reveal. Passwords go to the registration endpoint, never to assistant chat.

### Verification status

Functional, targeted keyboard, responsive-layout, and API checks have been reported successful during implementation. **Formal NVDA, TalkBack, axe, Lighthouse, and measured zoom audits remain pending.** This repository does not claim verified WCAG conformance.

See [TEST-LOG.md](TEST-LOG.md) for the journey matrix, provisional Accessibility Gate, evidence, and remaining checks.

## Integration

Every page includes:

```html
<script src="http://localhost:3000/widget/assistant.v1.js" defer></script>
<alx-assistant
  api="http://localhost:3000/api/v1"
  language="auto"
></alx-assistant>
```

The backend serves the widget. Its Shadow DOM isolates styles from the captured application and Bootstrap. To change the deployment address, update both the script URL and the `api` attribute.

The widget supports `language="auto|en|am"` and a configurable `shortcut` attribute. Use `shortcut="none"` to disable its keyboard shortcut.

## Project structure

```text
.
├── index.html
├── pages/                  # Three learner captures and three new demo pages
├── assets/
│   ├── css/                # Original styles, accessibility patches, demo-page styles
│   ├── js/                 # Capture interactions and demo forms
│   ├── fonts/              # Locally bundled fonts
│   └── img/                # Logos and captured artwork
├── tools/                  # Idempotent integration and accessibility codemods
└── TEST-LOG.md              # Shared verification record
```

## Development

```bash
node --check assets/js/assistant-pages.js
node --check assets/js/a11y-fixes.js
node tools/add-snippet.mjs
node tools/apply-fixes.mjs
```

On an already-patched checkout, the codemods should report `Unchanged`. Backend tests and widget parity checks run in the API repository.

Use a feature branch and a pull request to this personal fork. Keep `upstream` for the original ALX repository. Avoid reformatting the large captured HTML files; targeted edits keep reviews manageable.

## Capture notes and limitations

The original pages are plain HTML/CSS captures, not the live ALX application. A small script restores sidebar toggling, week switching, score/programme modals, module selection, curriculum-bar scrolling, and Bootstrap controls. Other original application flows are inert.

The fork adds skip links, keyboard-operated controls, navigation labels, dashboard headings, and browser-translation support. It does not claim to repair all untouched legacy content.

Known limits include inert sidebar links, skipped legacy heading levels, missing original favicon assets, Firefox warnings for bundled Font Awesome fonts, and possible browser-menu conflicts with `Alt+H`. Gemini recording/playback requires available API quota; live Amharic transcription and human pronunciation checks remain pending. Mock replies remain mostly English.

---

Built for the ALX accessibility hackathon · [API repository](https://github.com/aduch123/alx-assistant-api) · [Verification record](TEST-LOG.md)

## Voice and returning learners

For an existing account, open **Sign in**, enter the email and password, then open the dashboard. Password reveal and paste are supported. Passwords go only to the authentication endpoint; the assistant can prefill a login email and navigate to the page.

In the assistant, expand **Voice**, record a short message and stop. Review the transcript before choosing **Send**. Each reply has **Read aloud**, with **Stop audio** in Voice. Automatic reading is off until enabled. Speech errors leave text available. Provider configuration and unresolved live checks are recorded in the [backend voice contract](https://github.com/aduch123/alx-assistant-api/blob/feat/voice-core/docs/VOICE.md).

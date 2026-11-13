# Automated accessibility evidence · 13 November 2026

- Engine: axe-core 4.14.0, Headless Chrome 157, Linux/Ubuntu, Node 22.
- Scope: eight real static pages and the real widget, closed/open, at 1280×800. Open state exposes voice controls, a test reply, and signup password-step controls where applicable.
- API responses are offline fixtures; no live accounts, microphone, helper or model activity is certified by this audit.
- [before-axe.json](before-axe.json): baseline before fixes, API d11989d/static a89aa85, with 29 serious rule occurrences.
- [axe.json](axe.json): zero reported WCAG 2.0/2.1/2.2 A/AA rule violations across 16 page/panel combinations. Seven rule occurrences remain incomplete, requiring manual review (chiefly contrast of partially obscured content).
- [reflow.json](reflow.json): 32 page/panel/viewport combinations at requested 320×800 and1280×800; zero measured horizontal page or panel overflow. This is CSS viewport emulation, not a manual 400% browser-zoom acceptance pass.
- [sources.json](sources.json): SHA256 hashes bind evidence to the page, stylesheet, host script and widget content. Documentation changes do not invalidate those hashes.
- [assistant-320.png](assistant-320.png): visual check of the open voice controls at 320px.

Reproduce from the sibling backend checkout with Node 22+ and Google Chrome:

```sh
npm pack axe-core@4.14.0 --pack-destination /tmp
mkdir -p /tmp/alx-axe-4.14.0
tar -xzf /tmp/axe-core-4.14.0.tgz -C /tmp/alx-axe-4.14.0 --strip-components=1
AXE_PATH=/tmp/alx-axe-4.14.0/axe.min.js node scripts/accessibility-audit.mjs
AUDIT_REFLOW=1 AXE_PATH=/tmp/alx-axe-4.14.0/axe.min.js A11Y_REPORT_DIR=/tmp/alx-reflow-report node scripts/accessibility-audit.mjs
```

Optional AUDIT_PAGE limits a diagnostic run to one known page path. Reports default to/tmp/alx-accessibility-report. No project dependency/lockfile change is required.

Still pending: manual incomplete-rule review, focus/keyboard journey audit, actual browser zoom/text resize, NVDA/TalkBack, Android microphone/playback, native Amharic review, modal/dropdown/error/claimed-help state audits, real Telegram handoff and release rehearsals. These reports are not a conformance or release claim.

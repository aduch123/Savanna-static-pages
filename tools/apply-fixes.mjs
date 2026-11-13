import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const originalPages = ['pages/homepage-v1-paced.html', 'pages/homepage-v1-self-paced.html', 'pages/concept-with-navigation.html'];
const allPages = ['index.html', ...originalPages];
const selected = process.argv.includes('--fix') ? process.argv[process.argv.indexOf('--fix') + 1]?.split(',') : ['F1','F2','F3','F4','F5','F6'];
if (!selected?.length || selected.some(fix => !/^F[1-6]$/.test(fix))) throw new Error('Use --fix F1,F2,…,F6 or omit it to apply all fixes');
const edits = new Map();
function read(path) {
  if (!edits.has(path)) {
    const url = new URL(path, root);
    const source = existsSync(url) ? readFileSync(url, 'utf8') : '';
    edits.set(path, { source, result: source });
  }
  return edits.get(path).result;
}
function update(path, transform) { edits.get(path) || read(path); edits.get(path).result = transform(read(path)); }
function insertBefore(source, anchor, addition) {
  const at = source.lastIndexOf(anchor);
  if (at < 0) throw new Error('Missing anchor: ' + anchor);
  return source.slice(0, at) + addition + source.slice(at);
}
function styles(fix, css) {
  update('assets/css/a11y-fixes.css', source => source.includes(`/* ${fix}:`) ? source : source + `\n/* ${fix}: */\n${css}\n`);
}
function behavior(fix, code) {
  update('assets/js/a11y-fixes.js', source => {
    if (!source) source = "(function () {\n  'use strict';\n  function ready(callback) {\n    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });\n    else callback();\n  }\n  /* @@FIXES@@ */\n})();\n";
    if (source.includes(`// ${fix}:`)) return source;
    return source.replace('  /* @@FIXES@@ */', `  // ${fix}:\n  ready(() => {\n${code}\n  });\n  /* @@FIXES@@ */`);
  });
  for (const path of originalPages) update(path, source => {
    if (source.includes('src="../assets/js/a11y-fixes.js"')) return source;
    const anchor = '<script src="../assets/js/static-page.js"></script>';
    if (!source.includes(anchor)) throw new Error('Missing static-page.js on ' + path);
    return source.replace(anchor, anchor + '\n    <script src="../assets/js/a11y-fixes.js"></script>');
  });
}
for (const fix of selected) {
  if (fix === 'F1') for (const path of allPages) update(path, source => {
    const prefix = path === 'index.html' ? '' : '../';
    if (!source.includes(`href="${prefix}assets/css/a11y-fixes.css"`)) source = insertBefore(source, '  </head>', `    <link rel="stylesheet" href="${prefix}assets/css/a11y-fixes.css" />\n`);
    if (!source.includes('class="alx-skip"')) source = source.replace(/(<body\b[^>]*>)/, '$1\n    <a class="alx-skip" href="#content">Skip to main content</a>');
    if (!source.includes('class="alx-skip"')) throw new Error('Missing body on ' + path);
    source = source.replace(/<main\b[^>]*>/, tag => {
      if (!tag.includes('id="content"')) tag = tag.replace('<main', '<main id="content"');
      if (!tag.includes('tabindex=')) tag = tag.replace('<main', '<main tabindex="-1"');
      return tag;
    });
    return source;
  });
  if (fix === 'F2') {
    behavior(fix, `    // WCAG 2.1.1, 4.1.2: make the captured div dropdown keyboard operable.
    document.querySelectorAll('#student-switch-curriculum [data-bs-toggle="dropdown"]').forEach(toggle => {
      toggle.setAttribute('role', 'button'); toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.addEventListener('keydown', event => {
        if (event.target === toggle && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault(); toggle.click();
        }
      });
    });`);
    styles(fix, `/* WCAG 2.4.7, 2.5.8 */
#student-switch-curriculum [data-bs-toggle="dropdown"] { min-height:44px; min-width:44px; }
#student-switch-curriculum [data-bs-toggle="dropdown"]:focus-visible { outline:3px solid #0b3d91; outline-offset:3px; }`);
  }
  if (fix === 'F3') {
    behavior(fix, `    // WCAG 2.1.1, 4.1.2: retain the existing click behavior and expose its state.
    const toggle = document.querySelector('.hamburger');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;
    toggle.setAttribute('role', 'button'); toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-label', 'Toggle navigation menu'); toggle.setAttribute('aria-controls', 'sidebar');
    const sync = () => toggle.setAttribute('aria-expanded', String(sidebar.classList.contains('expanded')));
    sync(); new MutationObserver(sync).observe(sidebar, { attributes:true, attributeFilter:['class'] });
    toggle.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle.click(); }
    });`);
    styles(fix, `/* WCAG 2.4.7, 2.5.8 */
.hamburger { display:inline-flex; align-items:center; justify-content:center; min-width:44px; min-height:44px; }
.hamburger:focus-visible { outline:3px solid #0b3d91; outline-offset:3px; }`);
  }
  if (fix === 'F4') for (const path of originalPages) update(path, source => {
    source = source.replace(/<(?:div|aside)\b[^>]*\bid="sidebar"[^>]*>/, tag => {
      if (!tag.includes('role=')) tag = tag.replace(/>$/, ' role="navigation">');
      if (!tag.includes('aria-label=')) tag = tag.replace(/>$/, ' aria-label="Main">');
      return tag;
    });
    if (path.includes('paced.html') && !path.includes('self-paced')) source = source.replace('<nav class="nav px-3 py-3 flex-nowrap overflow-x-scroll overflow-y-hidden">', '<nav class="nav px-3 py-3 flex-nowrap overflow-x-scroll overflow-y-hidden" aria-label="Course weeks">');
    return source;
  });
  if (fix === 'F5') for (const [path, title] of [
    [originalPages[0], 'Paced course dashboard'], [originalPages[1], 'Self-paced course dashboard'],
  ]) update(path, source => source.includes('data-alx-page-title') ? source : source.replace(/(<main\b[^>]*>)/, `$1\n      <h1 class="visually-hidden" data-alx-page-title>${title}</h1>`));
  if (fix === 'F6') for (const path of allPages) update(path, source => source
    .replace(/^[ \t]*<meta\b(?=[^>]*name="google")(?=[^>]*content="notranslate")[^>]*>\r?\n?/gm, '')
    .replace(/<body\b[^>]*>/, tag => tag.replace(/\s+translate="no"/g, '').replace(/class="([^"]*)"/, (_match, classes) => `class="${classes.split(/\s+/).filter(name => name !== 'notranslate').join(' ')}"`)));
}
for (const [path, edit] of edits) {
  if (edit.source === edit.result) { process.stdout.write(`Unchanged: ${path}\n`); continue; }
  writeFileSync(new URL(path, root), edit.result);
  process.stdout.write(`Updated: ${path}\n`);
}

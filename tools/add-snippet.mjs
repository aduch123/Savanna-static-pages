import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'pages/homepage-v1-paced.html', 'pages/homepage-v1-self-paced.html', 'pages/concept-with-navigation.html'];
const snippet = '  <script src="http://localhost:3000/widget/assistant.v1.js" defer></script>\n  <alx-assistant api="http://localhost:3000/api/v1" language="auto"></alx-assistant>\n';

// Prepare every edit before writing, so a missing anchor never leaves a partial run.
const edits = pages.map(page => {
  const path = new URL(page, root);
  const source = readFileSync(path, 'utf8');
  if (/<alx-assistant\b/i.test(source) || /<script\b[^>]*src=["'][^"']*assistant\.v1\.js/i.test(source)) {
    if (!/<alx-assistant\b/i.test(source) || !/<script\b[^>]*src=["'][^"']*assistant\.v1\.js/i.test(source)) throw new Error(`Incomplete assistant snippet: ${page}`);
    return { page, path, source, result: source };
  }
  const index = source.toLowerCase().lastIndexOf('</body>');
  if (index < 0) throw new Error(`Missing closing body tag: ${page}`);
  const lineStart = source.lastIndexOf('\n', index) + 1;
  const insertion = /^\s*$/.test(source.slice(lineStart, index)) ? lineStart : index;
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  return { page, path, source, result: source.slice(0, insertion) + snippet.replaceAll('\n', newline) + source.slice(insertion) };
});
for (const edit of edits) {
  if (edit.source === edit.result) { process.stdout.write(`Unchanged: ${edit.page}\n`); continue; }
  writeFileSync(fileURLToPath(edit.path), edit.result);
  process.stdout.write(`Added assistant: ${edit.page}\n`);
}

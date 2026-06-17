import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = dirname(dirname(__filename));
const src = join(root, 'GuestFlow - Run of Show.html');
const outDir = join(root, 'docs', 'design');
mkdirSync(outDir, { recursive: true });

const raw = readFileSync(src, 'utf8');

function pluckScript(type) {
  const re = new RegExp(`<script type=\"${type}\">([\\s\\S]*?)<\\/script>`);
  const m = raw.match(re);
  return m ? m[1] : null;
}

const templateJson = pluckScript('__bundler/template');
if (!templateJson) {
  console.error('Could not find template script');
  process.exit(1);
}
const template = JSON.parse(templateJson);

writeFileSync(join(outDir, 'run-of-show-template.html'), template);
console.log(`Wrote ${template.length} chars to docs/design/run-of-show-template.html`);

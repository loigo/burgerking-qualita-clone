/**
 * Replace Tailwind CDN with built CSS and normalize root asset paths.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TAILWIND_CDN_BLOCK = /[\s]*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>[\s]*<script>[\s\S]*?tailwind\.config[\s\S]*?<\/script>/;

const TAILWIND_LINK = `  <link rel="stylesheet" href="/css/tailwind.css">`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'shop' || entry.name === 'tools' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.html') && !entry.name.startsWith('source-')) files.push(full);
  }
  return files;
}

function patchFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1;
  const prefix = depth === 0 ? '/' : '../'.repeat(depth);

  let changed = false;

  if (TAILWIND_CDN_BLOCK.test(html)) {
    html = html.replace(TAILWIND_CDN_BLOCK, `\n${TAILWIND_LINK}\n`);
    changed = true;
  }

  if (depth === 0) {
    const before = html;
    html = html
      .replace(/href="css\/custom\.css"/g, 'href="/css/custom.css"')
      .replace(/src="js\//g, 'src="/js/');
    if (html !== before) changed = true;
  } else if (depth >= 1) {
    const cssPath = `${prefix}css/custom.css`.replace(/\/+/g, '/');
    const before = html;
    html = html
      .replace(/href="css\/custom\.css"/g, `href="${cssPath}"`)
      .replace(/src="js\//g, `src="${prefix}js/`);
    if (html !== before) changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('patched', rel);
  }
}

for (const file of walk(ROOT)) patchFile(file);
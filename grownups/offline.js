// Confirms every file listed in precache.json is saved on the device, and shows the version.
import { el } from '../shared/dom.js';
import { backButton } from './index.js';

export async function render(root, back) {
  const out = el('div', { class: 'card' }, 'Checking...');
  root.append(el('h1', {}, 'Offline check'), out, el('div', { style: 'margin-top:28px' }, backButton(back)));

  try {
    const res = await fetch('precache.json', { cache: 'no-store' });
    const manifest = await res.json();
    const missing = [];
    for (const f of manifest.files) {
      if (!(await caches.match(new URL(f, location.href), { ignoreSearch: true }))) missing.push(f);
    }
    const total = manifest.files.length;
    out.replaceChildren(
      el('p', {}, missing.length === 0
        ? `✅ All ${total} files are saved. It will work without the internet.`
        : `⚠️ ${total - missing.length} of ${total} files saved. Open it once while online and wait, then check again.`),
      missing.length > 0 && el('p', { class: 'muted' }, 'Missing: ' + missing.slice(0, 8).join(', ') + (missing.length > 8 ? '...' : '')),
      el('p', { class: 'muted' }, `Version ${manifest.version}`),
      el('p', { class: 'muted' }, navigator.serviceWorker?.controller ? 'Offline helper: running' : 'Offline helper: not running yet (reload once)'),
    );
  } catch (e) {
    out.textContent = 'Could not check: ' + e.message;
  }
}

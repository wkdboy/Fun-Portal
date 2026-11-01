// Confirms every file listed in precache.json is saved on the device, and shows the version.
import { el, add } from '../shared/dom.js';
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
    out.replaceChildren();
    add(out,
      el('p', {}, missing.length === 0
        ? `✅ All ${total} files are saved. It will work without the internet.`
        : `⚠️ ${total - missing.length} of ${total} files saved. Open it once while online and wait, then check again.`),
      missing.length > 0 && el('p', { class: 'muted' }, 'Missing: ' + missing.slice(0, 8).join(', ') + (missing.length > 8 ? '...' : '')),
      el('p', { class: 'muted' }, `Version ${manifest.appVersion} (build ${manifest.version})`),
      el('p', { class: 'muted' }, navigator.serviceWorker?.controller ? 'Offline helper: running' : 'Offline helper: not running yet (reload once)'),
    );
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg?.waiting) add(out, el('p', { class: 'card', style: 'background:#fff3b8' }, '🔄 A new version is ready. Close the app completely and open it again to use it.'));
    const log = await (await fetch('changelog.json')).json();
    add(out,
      el('h2', {}, 'Version log'),
      log.map((v) => el('div', {},
        el('strong', {}, `v${v.version}`, el('span', { class: 'muted' }, `  ${v.date}`)),
        el('ul', {}, v.notes.map((n) => el('li', {}, n))))),
    );
  } catch (e) {
    out.textContent = 'Could not check: ' + e.message;
  }
}

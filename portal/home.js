import { el, add } from '../shared/dom.js';
import { getSetting } from '../shared/storage.js';
import { APPS } from './apps.js';
import { picture } from '../shared/art.js';
import { TILES } from '../shared/art-tiles.js';
import { offlineStatus } from '../shared/offline-status.js';

export async function renderHome(root) {
  const name = await getSetting('childName');
  const emoji = await getSetting('childEmoji');

  const tiles = APPS.map((a) =>
    el('a', { class: 'tile', href: `#/app/${a.id}`, style: `background:${a.color}` },
      el('span', { class: 'pic', 'aria-hidden': 'true' }, picture(TILES, a.id, a.pic)),
      a.label));

  const offline = offlineButton();
  add(root,
    el('h1', { class: 'greeting' }, name ? `Hi, ${name}! ${emoji}` : `Hi! ${emoji}`),
    !name && el('div', { class: 'card setup-card' },
      el('p', {}, 'Welcome! A grown-up needs to set things up first.'),
      el('a', { class: 'btn big orange', href: '#/grownups' }, '🔧 Set up')),
    el('div', { class: 'grid tiles' }, tiles),
    el('a', { class: 'corner-btn grownups-link', href: '#/grownups', 'aria-label': 'Grown-ups' }, '🔒'),
    offline.node,
  );
  root.querySelector('.tile')?.focus();
  return offline.dispose;
}

// A small button at the top right. Hover (or focus, or tap) shows whether everything is saved for offline use.
function offlineButton() {
  const icon = el('button', { class: 'corner-btn offline-icon', 'aria-label': 'Offline check' }, '⏳');
  const tip = el('div', { class: 'offline-tip', role: 'status' }, 'Checking...');
  const wrap = el('div', { class: 'offline-wrap' }, icon, tip);

  async function check() {
    const s = await offlineStatus();
    if (s.error) { icon.textContent = '⚠️'; tip.textContent = 'Could not check.'; return; }
    const lines = [];
    if (s.missing === 0) { icon.textContent = '✅'; lines.push(`All ${s.total} files are saved. It works without the internet.`); }
    else { icon.textContent = '⚠️'; lines.push(`${s.total - s.missing} of ${s.total} files saved. Open it online and wait a moment.`); }
    if (!s.running) lines.push('Offline helper not running yet. Reload once.');
    if (s.update) { icon.textContent = '🔄'; lines.push('A new version is ready. Close the app and open it again.'); }
    lines.push(`Version ${s.version}`);
    tip.replaceChildren(...lines.map((t) => el('div', {}, t)));
  }

  icon.addEventListener('click', () => { wrap.classList.toggle('open'); check(); });
  wrap.addEventListener('mouseenter', check);
  const outside = (e) => { if (!wrap.contains(e.target)) wrap.classList.remove('open'); };
  document.addEventListener('click', outside);
  check();
  return { node: wrap, dispose: () => document.removeEventListener('click', outside) };
}

import { el, add } from '../shared/dom.js';
import { getSetting } from '../shared/storage.js';
import { APPS } from './apps.js';

export async function renderHome(root) {
  const name = await getSetting('childName');
  const emoji = await getSetting('childEmoji');

  const tiles = APPS.map((a) =>
    el('a', { class: 'tile', href: `#/app/${a.id}`, style: `background:${a.color}` },
      el('span', { class: 'pic', 'aria-hidden': 'true' }, a.pic),
      a.label));

  add(root,
    el('h1', { class: 'greeting' }, name ? `Hi, ${name}! ${emoji}` : `Hi! ${emoji}`),
    !name && el('div', { class: 'card setup-card' },
      el('p', {}, 'Welcome! A grown-up needs to set things up first.'),
      el('a', { class: 'btn big orange', href: '#/grownups' }, '🔧 Set up')),
    el('div', { class: 'grid tiles' }, tiles),
    el('a', { class: 'btn grey grownups-link', href: '#/grownups', 'aria-label': 'Grown-ups' }, '🔒'),
  );
  root.querySelector('.tile')?.focus();
}

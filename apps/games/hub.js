import { el, add } from '../../shared/dom.js';
import { GAMES } from './registry.js';

export function renderHub(root, nav) {
  const tiles = GAMES.map((g) => g.load
    ? el('button', { class: 'tile', style: `background:${g.color}`, onclick: () => nav.setup(g) },
      el('span', { class: 'pic' }, g.pic), g.label)
    : el('div', { class: 'tile g-soon', style: `background:${g.color}` },
      el('span', { class: 'pic' }, g.pic), g.label, el('small', {}, 'Coming soon')));
  add(root,
    el('h1', {}, 'Games 🎲'),
    el('div', { class: 'grid g-tiles' }, tiles),
    el('div', { style: 'margin-top:32px;text-align:center' },
      el('button', { class: 'btn orange big', onclick: () => nav.players(nav.hub) }, '👥 Players')));
  root.querySelector('button.tile')?.focus();
}

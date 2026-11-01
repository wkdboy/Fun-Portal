import { el, add } from '../../shared/dom.js';
import { GAMES } from './registry.js';
import { savedIds } from './save.js';
import { picture } from '../../shared/art.js';
import { TILES } from '../../shared/art-tiles.js';

export async function renderHub(root, nav) {
  const saved = await savedIds();
  const tiles = GAMES.map((g) => g.load
    ? el('button', { class: 'tile', style: `background:${g.color}`, onclick: () => nav.setup(g) },
      el('span', { class: 'pic' }, picture(TILES, g.id, g.pic)), g.label, saved.has(g.id) && el('small', {}, '▶ Game waiting'))
    : el('div', { class: 'tile g-soon', style: `background:${g.color}` },
      el('span', { class: 'pic' }, picture(TILES, g.id, g.pic)), g.label, el('small', {}, 'Coming soon')));
  add(root,
    el('h1', {}, 'Games 🎲'),
    el('div', { class: 'grid g-tiles' }, tiles),
    el('div', { style: 'margin-top:32px;text-align:center' },
      el('button', { class: 'btn orange big', onclick: () => nav.players(nav.hub) }, '👥 Players')));
  root.querySelector('button.tile')?.focus();
}

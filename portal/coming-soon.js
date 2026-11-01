import { el } from '../shared/dom.js';
import { picture } from '../shared/art.js';
import { TILES } from '../shared/art-tiles.js';

export function renderComingSoon(root, app) {
  root.append(
    el('div', { class: 'card center', style: 'max-width:700px;margin:40px auto' },
      el('div', { style: 'font-size:140px;line-height:1' }, picture(TILES, app.id, app.pic)),
      el('h1', {}, app.label),
      el('p', {}, 'Coming soon!'),
      el('a', { class: 'btn big green', href: '#/' }, '🏠 Home')),
  );
}

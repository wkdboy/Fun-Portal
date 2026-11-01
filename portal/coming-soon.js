import { el } from '../shared/dom.js';

export function renderComingSoon(root, app) {
  root.append(
    el('div', { class: 'card center', style: 'max-width:700px;margin:40px auto' },
      el('div', { style: 'font-size:140px;line-height:1' }, app.pic),
      el('h1', {}, app.label),
      el('p', {}, 'Coming soon!'),
      el('a', { class: 'btn big green', href: '#/' }, '🏠 Home')),
  );
}

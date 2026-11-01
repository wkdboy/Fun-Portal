// Choose a colouring-in picture.
import { el, add } from '../../shared/dom.js';
import { PAGES } from './pages.js';

export function renderColouring(root, nav) {
  const tiles = PAGES.map((p) => {
    const b = el('button', { class: 'pt-thumb pt-page', 'aria-label': p.name, onclick: () => nav.edit(null, p.id) });
    b.innerHTML = p.svg.replace('width="1200" height="900"', 'width="100%" height="100%"');
    return b;
  });
  add(root, el('h1', {}, 'Colouring in 🖍️'), el('div', { class: 'pt-grid' }, tiles),
    el('div', { style: 'margin-top:28px' }, el('button', { class: 'btn grey big', onclick: nav.gallery }, '← My pictures')));
  root.querySelector('.pt-page')?.focus();
}

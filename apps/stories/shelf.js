import { el, add } from '../../shared/dom.js';
import { BOOKS } from './books.js';

export const bookUrl = (book, file) => new URL(`./books/${book.id}/${file}`, import.meta.url).href;

export function renderShelf(root, nav, focusId) {
  const tiles = BOOKS.map((b) => el('button', { class: 'st-book', 'data-id': b.id, 'aria-label': b.title, onclick: () => nav.read(b) },
    el('span', { class: 'st-cover' },
      el('img', { src: bookUrl(b, 'cover.jpg'), alt: '' }),
      b.together && el('span', { class: 'st-together', title: 'Read together', 'aria-label': 'Read together with a grown-up' }, '👪')),
    el('span', {}, b.title)));
  add(root, el('h1', {}, 'Stories 📚'), el('div', { class: 'grid st-shelf' }, tiles));
  (root.querySelector(`[data-id="${focusId}"]`) || root.querySelector('.st-book'))?.focus();
}

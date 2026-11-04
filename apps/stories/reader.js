// One book, one spread at a time. Tap the sides of the picture, use the arrow buttons, or press left/right keys.
import { el, add } from '../../shared/dom.js';
import { play } from '../../shared/audio.js';
import { bookUrl } from './shelf.js';
import { creditsCard } from './credits.js';

export function renderReader(root, nav, book) {
  const last = book.pages; // pages 1..last, then the end screen (last + 1)
  let page = 1;
  const file = (n) => bookUrl(book, String(n).padStart(2, '0') + '.jpg');
  const img = el('img', { class: 'st-page', alt: '', draggable: 'false' });
  const left = el('button', { class: 'st-zone l', tabindex: '-1', 'aria-label': 'Back a page', onclick: () => go(-1) });
  const right = el('button', { class: 'st-zone r', tabindex: '-1', 'aria-label': 'Next page', onclick: () => go(1) });
  const stage = el('div', { class: 'st-stage' }, img, left, right);
  const again = el('button', { class: 'btn big green', onclick: () => { page = 1; paint(); next.focus(); } }, '↻ Read again');
  const end = el('div', { class: 'st-end' },
    el('div', { class: 'st-the-end' }, 'The end 🎉'),
    el('div', { class: 'row', style: 'justify-content:center' }, again,
      el('button', { class: 'btn big', onclick: () => nav.shelf(book.id) }, '📚 Books')),
    creditsCard(book));
  const prev = el('button', { class: 'btn st-nav', 'aria-label': 'Back a page', onclick: () => go(-1) }, '◀');
  const next = el('button', { class: 'btn st-nav green', 'aria-label': 'Next page', onclick: () => go(1) }, '▶');
  const count = el('span', { class: 'st-count' });
  const bar = el('div', { class: 'st-bar' }, el('button', { class: 'btn grey', 'aria-label': 'Books', onclick: () => nav.shelf(book.id) }, '📚'), prev, count, next);
  add(root, stage, end, bar);

  function paint() {
    const finished = page > last;
    stage.hidden = finished;
    end.hidden = !finished;
    if (!finished) img.src = file(page);
    count.textContent = finished ? '' : `${page} / ${last}`;
    prev.disabled = page <= 1;
    next.disabled = finished;
    if (finished) again.focus();
  }

  function go(d) {
    const n = Math.max(1, Math.min(last + 1, page + d));
    if (n === page) return;
    page = n;
    play('tap');
    paint();
  }

  // Capture phase so the arrows turn pages instead of moving focus between buttons.
  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1);
    else return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  document.addEventListener('keydown', onKey, true);

  // Load the next page ahead of time so turning is instant.
  img.addEventListener('load', () => { if (page < last) new Image().src = file(page + 1); });

  paint();
  next.focus();
  return () => document.removeEventListener('keydown', onKey, true);
}

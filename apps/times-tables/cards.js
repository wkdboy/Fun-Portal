// Flash cards for one table (or 0 = all tables mixed). Tap the card to see the answer, then say if you knew it.
// Cards you didn't know come back more often. No timers, no scores.
import { el, add } from '../../shared/dom.js';
import { rand } from '../../shared/random.js';
import { play } from '../../shared/audio.js';

export function renderCards(root, nav, table) {
  const facts = [];
  for (const a of table ? [table] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    for (let b = 1; b <= 12; b++) facts.push({ a, b, w: 1 });
  }
  let card = null;
  let flipped = false;

  const qEl = el('div', { class: 'tt-q' });
  const aEl = el('div', { class: 'tt-a' }, '?');
  const face = el('button', { class: 'tt-card', 'aria-label': 'Show the answer', onclick: () => flip() }, qEl, aEl);
  const show = el('button', { class: 'btn big orange', onclick: () => flip() }, '👀 Show');
  const yes = el('button', { class: 'btn big green', 'aria-label': 'I knew it', onclick: () => answer(true) }, '✔');
  const no = el('button', { class: 'btn big pink', 'aria-label': 'Not yet', onclick: () => answer(false) }, '✖');
  const buttons = el('div', { class: 'row tt-btns' });
  add(root,
    el('div', { class: 'row' }, el('button', { class: 'btn grey', onclick: nav.menu }, '← Tables')),
    el('div', { class: 'tt-stage' }, face, buttons));

  function draw() {
    const pool = facts.filter((f) => f !== card);
    let n = rand(1, pool.reduce((s, f) => s + f.w, 0));
    let next = pool[pool.length - 1];
    for (const f of pool) { n -= f.w; if (n <= 0) { next = f; break; } }
    card = next;
    flipped = false;
    // A single table keeps its own number first; a mix shows the numbers either way round.
    const swap = !table && Math.random() < 0.5;
    qEl.textContent = swap ? `${card.b} × ${card.a}` : `${card.a} × ${card.b}`;
    aEl.textContent = '= ?';
    face.classList.remove('flipped');
    buttons.replaceChildren(show);
    show.focus();
  }

  function flip() {
    if (flipped) return;
    flipped = true;
    aEl.textContent = '= ' + card.a * card.b;
    face.classList.add('flipped');
    play('pop');
    buttons.replaceChildren(no, yes);
    yes.focus();
  }

  function answer(knew) {
    card.w = knew ? Math.max(1, card.w - 2) : card.w + 3;
    if (knew) play('good');
    draw();
  }

  draw();
}

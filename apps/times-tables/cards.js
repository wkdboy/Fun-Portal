// Flash cards for one table (or 0 = all tables mixed). She types the answer (on-screen pad or keyboard); it is checked
// as soon as enough digits are in. A wrong answer gets one more try, then the answer is shown. No timers, no scores.
// Cards she got wrong come back more often.
import { el, add } from '../../shared/dom.js';
import { rand } from '../../shared/random.js';
import { play } from '../../shared/audio.js';

export function renderCards(root, nav, table) {
  const facts = [];
  for (const a of table ? [table] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    for (let b = 1; b <= 12; b++) facts.push({ a, b, w: 1 });
  }
  let card = null;
  let typed = '';
  let tries = 0;
  let locked = false;
  let timer = null;

  const qEl = el('div', { class: 'tt-q' });
  const box = el('div', { class: 'tt-box', 'aria-live': 'polite' });
  const face = el('div', { class: 'tt-card' }, qEl, el('div', { class: 'tt-eq' }, '=', box));
  const key = (label, fn, cls = '') => el('button', { class: 'btn tt-key ' + cls, onclick: fn }, label);
  const pad = el('div', { class: 'tt-pad' },
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => key(String(n), () => type(String(n)))),
    key('⌫', () => { if (!locked) { typed = typed.slice(0, -1); paint(); } }, 'grey'),
    key('0', () => type('0')),
    key('✔', () => check(true), 'green'));
  add(root,
    el('div', { class: 'row' }, el('button', { class: 'btn grey', onclick: nav.menu }, '← Tables')),
    el('div', { class: 'tt-stage' }, face, pad));

  const paint = () => { box.textContent = typed || '?'; box.classList.toggle('empty', !typed); };
  const answer = () => String(card.a * card.b);

  function draw() {
    const pool = facts.filter((f) => f !== card);
    let n = rand(1, pool.reduce((s, f) => s + f.w, 0));
    let next = pool[pool.length - 1];
    for (const f of pool) { n -= f.w; if (n <= 0) { next = f; break; } }
    card = next;
    typed = '';
    tries = 0;
    locked = false;
    face.classList.remove('right', 'wrong', 'shown');
    // A single table keeps its own number first; a mix shows the numbers either way round.
    const swap = !table && Math.random() < 0.5;
    qEl.textContent = swap ? `${card.b} × ${card.a}` : `${card.a} × ${card.b}`;
    paint();
  }

  function type(d) {
    if (locked || typed.length >= 3) return;
    typed += d;
    paint();
    if (typed.length >= answer().length) check(false);
  }

  function check(early) {
    if (locked || !typed) return;
    if (!early && typed.length < answer().length) return;
    locked = true;
    if (typed === answer()) {
      face.classList.add('right');
      card.w = tries ? card.w : Math.max(1, card.w - 2);
      play('good');
      timer = setTimeout(draw, 900);
      return;
    }
    tries++;
    card.w += 3;
    play('wrong');
    face.classList.add('wrong');
    if (tries >= 2) { // second miss: show the answer, then move on
      timer = setTimeout(() => {
        face.classList.remove('wrong');
        face.classList.add('shown');
        typed = answer();
        paint();
        timer = setTimeout(draw, 2200);
      }, 600);
    } else {
      timer = setTimeout(() => { face.classList.remove('wrong'); typed = ''; paint(); locked = false; }, 700);
    }
  }

  const onKey = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) { type(e.key); e.preventDefault(); } else if (e.key === 'Backspace' && !locked) { typed = typed.slice(0, -1); paint(); } else if (e.key === 'Enter') { check(true); e.preventDefault(); }
  };
  document.addEventListener('keydown', onKey);

  draw();
  return () => { clearTimeout(timer); document.removeEventListener('keydown', onKey); };
}

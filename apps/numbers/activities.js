// Year 1 maths activities. Each make() returns { key, text, visual, answer, min, max }.
import { el } from '../../shared/dom.js';
import { rand, pick, sample } from '../../shared/random.js';

const OBJ = ['🍎', '⭐', '🐟', '🌸', '🚗', '🐞', '🎈', '🍪', '🐥', '🍓'];

const objects = (n, emoji) => el('div', { class: 'nm-objs' }, Array.from({ length: n }, () => el('span', {}, emoji)));
const dots = (n, colour, faded = 0) => el('div', { class: 'nm-dots' },
  Array.from({ length: n }, (_, i) => el('span', { class: 'nm-dot' + (i >= n - faded ? ' off' : ''), style: `background:${colour}` })));
const tenFrame = (filled, colour) => el('div', { class: 'nm-frame' },
  Array.from({ length: 10 }, (_, i) => el('span', { class: 'nm-cell' }, i < filled ? el('span', { class: 'nm-dot', style: `background:${colour}` }) : null)));
const pair = (a, sign, b) => el('div', { class: 'nm-pair' }, a, el('span', { class: 'nm-sign' }, sign), b);
const q = (key, text, answer, visual, min = 0, max = 20) => ({ key, text, answer, visual, min, max });

export const ACTIVITIES = [
  { id: 'count10', label: 'Count to 10', pic: '🍎', slow: 25, make: () => { const n = rand(1, 10); return q('c' + n, 'How many?', n, objects(n, pick(OBJ)), 0, 12); } },
  { id: 'count20', label: 'Count to 20', pic: '🍓', slow: 35, make: () => { const n = rand(8, 20); return q('c' + n, 'How many?', n, objects(n, pick(OBJ)), 0, 22); } },
  {
    id: 'moreless', label: 'One more, one less', pic: '↕️', slow: 15,
    make: () => {
      if (Math.random() < 0.5) { const n = rand(0, 19); return q('m' + n, `What is one more than ${n}?`, n + 1, null); }
      const n = rand(1, 20);
      return q('l' + n, `What is one less than ${n}?`, n - 1, null);
    },
  },
  { id: 'bonds10', label: 'Make 10', pic: '🔟', slow: 15, make: () => { const a = rand(0, 10); return q('b' + a, `${a} + ? = 10`, 10 - a, tenFrame(a, '#2f9bff'), 0, 10); } },
  {
    id: 'add10', label: 'Add up to 10', pic: '➕', slow: 15,
    make: () => { const a = rand(1, 9); const b = rand(1, 10 - a); return q(`${a}+${b}`, `${a} + ${b} = ?`, a + b, pair(dots(a, '#ff5fa2'), '+', dots(b, '#2f9bff')), 0, 10); },
  },
  { id: 'bonds20', label: 'Make 20', pic: '🎯', slow: 18, make: () => { const a = rand(1, 19); return q('b' + a, `${a} + ? = 20`, 20 - a, null); } },
  {
    id: 'add20', label: 'Add up to 20', pic: '➕', slow: 18,
    make: () => { const a = rand(2, 18); const b = rand(Math.max(2, 11 - a), 20 - a); return q(`${a}+${b}`, `${a} + ${b} = ?`, a + b, null); },
  },
  {
    id: 'sub10', label: 'Take away (to 10)', pic: '➖', slow: 15,
    make: () => { const a = rand(2, 10); const b = rand(1, a); return q(`${a}-${b}`, `${a} − ${b} = ?`, a - b, dots(a, '#ff9f1c', b), 0, 10); },
  },
  {
    id: 'sub20', label: 'Take away (to 20)', pic: '➖', slow: 18,
    make: () => { const a = rand(11, 20); const b = rand(2, 9); return q(`${a}-${b}`, `${a} − ${b} = ?`, a - b, dots(a, '#ff9f1c', b)); },
  },
  {
    id: 'doubles', label: 'Doubles', pic: '👯', slow: 15,
    make: () => { const n = rand(1, 10); return q('d' + n, `Double ${n}`, n * 2, pair(dots(n, '#8e5cf6'), '+', dots(n, '#8e5cf6'))); },
  },
  { id: 'halves', label: 'Halves', pic: '🍰', slow: 15, make: () => { const n = rand(1, 10) * 2; return q('h' + n, `Half of ${n}`, n / 2, dots(n, '#2ec27e'), 0, 10); } },
];

// Three wrong answers near the right one (inside the question's range), plus the right one, shuffled by the caller.
export function choicesFor(question) {
  const { answer, min, max } = question;
  const near = [-3, -2, -1, 1, 2, 3].map((d) => answer + d).filter((v) => v >= min && v <= max);
  const wrong = sample(near, 3);
  while (wrong.length < 3) {
    const v = rand(min, max);
    if (v !== answer && !wrong.includes(v)) wrong.push(v);
  }
  return sample([answer, ...wrong], 4);
}

// 3 stars: at least 9 right at a relaxed pace. 2 stars: 7 or more right, or a slower 9-10. Otherwise 1.
export function rate({ correct, avgSec }, activity) {
  const slow = avgSec > activity.slow;
  if (correct >= 9 && !slow) return 3;
  if (correct >= 7) return 2;
  return 1;
}

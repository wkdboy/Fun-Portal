// Parent gate: a random two-digit sum answered on a big number pad. Resolves true (correct) or false (cancelled).
// This is toddler-proofing, not security.
import { el } from './dom.js';
import { play } from './audio.js';

const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function makeSum() {
  if (Math.random() < 0.4) {
    const a = rand(30, 99);
    const b = rand(11, a - 10);
    return { q: `${a} − ${b}`, ans: a - b };
  }
  const a = rand(11, 60);
  const b = rand(11, Math.min(60, 99 - a));
  return { q: `${a} + ${b}`, ans: a + b };
}

export function askGate() {
  return new Promise((resolve) => {
    let sum = makeSum();
    let entry = '';
    const sumEl = el('div', { class: 'sum' });
    const ansEl = el('div', { class: 'answer' });
    const card = el('div', { class: 'card' });
    const overlay = el('div', { class: 'overlay', role: 'dialog', 'aria-label': 'Grown-ups only' }, card);

    const show = () => { sumEl.textContent = `${sum.q} = ?`; ansEl.textContent = entry; };
    const close = (ok) => { overlay.remove(); resolve(ok); };
    const submit = () => {
      if (Number(entry) === sum.ans && entry !== '') return close(true);
      play('wrong');
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      sum = makeSum();
      entry = '';
      show();
    };
    const key = (label, fn, cls = '') => el('button', { class: 'btn ' + cls, onclick: fn }, label);
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => key(String(n), () => { if (entry.length < 3) { entry += n; show(); } }));

    card.append(
      el('div', { class: 'muted' }, 'Grown-ups only. Please answer:'),
      sumEl,
      ansEl,
      el('div', { class: 'keypad' },
        digits,
        key('⌫', () => { entry = entry.slice(0, -1); show(); }, 'orange'),
        key('0', () => { if (entry.length < 3) { entry += '0'; show(); } }),
        key('✔', submit, 'green'),
      ),
      el('div', { style: 'margin-top:18px' }, key('✖ Back', () => close(false), 'grey')),
    );
    show();
    document.body.append(overlay);
    digits[0].focus();
  });
}

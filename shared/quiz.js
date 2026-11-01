// A round of questions. make(i) returns { key, render(box, done) }; render calls done(solvedFirstTime) once solved.
// onFinish({ correct, total, avgSec }) is called after the last question. Returns a cleanup function.
import { el, add, loadCss } from './dom.js';
import { play } from './audio.js';

export function runQuiz(root, { count, make, onFinish }) {
  loadCss(new URL('./quiz.css', import.meta.url));
  const results = [];
  let secs = 0;
  let alive = true;
  let timer = null;
  const dots = el('div', { class: 'qz-dots' });
  const box = el('div', { class: 'qz-box' });
  add(root, dots, box);

  function paint() {
    dots.replaceChildren();
    add(dots, Array.from({ length: count }, (_, i) => el('span', {
      class: 'qz-dot' + (i === results.length ? ' now' : '') + (results[i] === true ? ' ok' : results[i] === false ? ' try' : ''),
    })));
  }

  function next() {
    if (!alive) return;
    if (results.length >= count) { onFinish({ correct: results.filter(Boolean).length, total: count, avgSec: secs / count }); return; }
    paint();
    const t0 = Date.now();
    const q = make(results.length);
    box.replaceChildren();
    q.render(box, (first) => {
      secs += Math.min(60, (Date.now() - t0) / 1000);
      results.push(first);
      paint();
      timer = setTimeout(next, 800);
    });
  }
  next();
  return () => { alive = false; clearTimeout(timer); };
}

// Big answer buttons. options: [{ label, value }]. A wrong tap greys that button out; the question stays open.
export function choiceRow(options, isCorrect, done, cls = '') {
  let first = true;
  let solved = false;
  const row = el('div', { class: 'qz-choices' });
  options.forEach((o) => {
    const b = el('button', {
      class: 'btn qz-choice ' + cls,
      onclick: () => {
        if (solved) return;
        if (isCorrect(o)) {
          solved = true;
          b.classList.add('right');
          play('good');
          done(first);
        } else {
          first = false;
          b.disabled = true;
          b.classList.add('wrong');
          play('wrong');
        }
      },
    }, o.label);
    row.append(b);
  });
  return row;
}

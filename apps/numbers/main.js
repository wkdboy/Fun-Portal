// Numbers: pick an activity, play a round of 10 questions, get 1-3 stars (best is remembered).
import { el, add, loadCss } from '../../shared/dom.js';
import { get, put } from '../../shared/storage.js';
import { runQuiz, choiceRow } from '../../shared/quiz.js';
import { play } from '../../shared/audio.js';
import { ACTIVITIES, choicesFor, rate } from './activities.js';

const KEY = 'numbersStars';
const starText = (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n);

export function mount(root) {
  loadCss(new URL('./numbers.css', import.meta.url));
  let stop = null;
  const show = async (fn) => {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    stop = (await fn(root)) || null;
  };
  const nav = {
    menu: () => show(menu),
    play: (a) => show((r) => round(r, a)),
  };

  async function menu(r) {
    const best = (await get('kv', KEY)) || {};
    add(r, el('h1', {}, 'Numbers 🔢'),
      el('div', { class: 'grid nm-menu' }, ACTIVITIES.map((a) => el('button', { class: 'nm-card', onclick: () => nav.play(a) },
        el('span', { class: 'nm-pic' }, a.pic),
        el('span', { class: 'nm-label' }, a.label),
        el('span', { class: 'nm-stars' }, starText(best[a.id] || 0))))));
    r.querySelector('.nm-card')?.focus();
  }

  function round(r, activity) {
    const seen = new Set();
    const stopQuiz = runQuiz(r, {
      count: 10,
      make: () => {
        let question;
        for (let i = 0; i < 12; i++) {
          question = activity.make();
          if (!seen.has(question.key)) break;
        }
        seen.add(question.key);
        const options = choicesFor(question).map((n) => ({ label: String(n), value: n }));
        return {
          render(box, done) {
            add(box, el('div', { class: 'qz-q' }, question.text), question.visual, choiceRow(options, (o) => o.value === question.answer, done));
            box.querySelector('.qz-choice')?.focus();
          },
        };
      },
      onFinish: (res) => finish(r, activity, res),
    });
    return stopQuiz;
  }

  async function finish(r, activity, res) {
    const stars = rate(res, activity);
    const best = (await get('kv', KEY)) || {};
    if (stars > (best[activity.id] || 0)) { best[activity.id] = stars; await put('kv', best, KEY); }
    play(stars === 3 ? 'win' : 'good');
    r.replaceChildren();
    add(r, el('div', { class: 'card qz-result' },
      el('div', { class: 'big-stars' }, starText(stars)),
      el('h1', {}, stars === 3 ? 'Brilliant!' : stars === 2 ? 'Well done!' : 'Good try!'),
      el('p', {}, `${res.correct} right first time out of ${res.total}`),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { class: 'btn big green', onclick: () => nav.play(activity) }, '▶ Again'),
        el('button', { class: 'btn big', onclick: nav.menu }, '🔢 Menu'))));
    r.querySelector('.btn.green')?.focus();
  }

  nav.menu();
  return () => stop?.();
}

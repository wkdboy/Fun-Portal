// Three phonics activities (no audio). ctx = { words: usable words, learned: learned sounds }.
import { el, add } from '../../shared/dom.js';
import { pick, shuffle, sample } from '../../shared/random.js';
import { choiceRow } from '../../shared/quiz.js';
import { play } from '../../shared/audio.js';
import { WORDS } from './words.js';

const wordBox = (word) => el('div', { class: 'ph-card' }, el('div', { class: 'ph-pic' }, word.pic), el('div', { class: 'ph-word' }, word.w));

function firstSound(ctx) {
  const word = pick(ctx.words);
  const first = word.g[0];
  const options = shuffle([first, ...sample(ctx.learned.filter((g) => g !== first), 3)]).map((g) => ({ label: g, value: g }));
  return {
    key: word.w,
    render(box, done) {
      add(box, el('div', { class: 'qz-q' }, 'What does it start with?'), wordBox(word),
        choiceRow(options, (o) => o.value === first, done, 'ph-choice'));
      box.querySelector('.qz-choice')?.focus();
    },
  };
}

function buildWord(ctx) {
  const word = pick(ctx.words);
  const extra = sample(ctx.learned.filter((g) => !word.g.includes(g)), 2);
  return {
    key: word.w,
    render(box, done) {
      let idx = 0;
      let first = true;
      const slots = word.g.map(() => el('span', { class: 'ph-slot' }));
      const tiles = shuffle([...word.g, ...extra]).map((g) => {
        const t = el('button', {
          class: 'btn qz-choice ph-choice ph-tile',
          onclick: () => {
            if (idx >= word.g.length) return;
            if (g === word.g[idx]) {
              slots[idx].textContent = g;
              slots[idx].classList.add('on');
              t.disabled = true;
              idx++;
              if (idx === word.g.length) { play('good'); done(first); } else play('pop');
            } else {
              first = false;
              play('wrong');
              t.classList.remove('shake');
              void t.offsetWidth;
              t.classList.add('shake');
            }
          },
        }, g);
        return t;
      });
      add(box, el('div', { class: 'qz-q' }, 'Build the word'), el('div', { class: 'ph-card' }, el('div', { class: 'ph-pic' }, word.pic)),
        el('div', { class: 'ph-slots' }, slots), el('div', { class: 'qz-choices' }, tiles));
      box.querySelector('.ph-tile')?.focus();
    },
  };
}

function readAndMatch(ctx) {
  const word = pick(ctx.words);
  const others = sample(WORDS.filter((x) => x.pic !== word.pic), 2);
  const options = shuffle([word, ...others]).map((x) => ({ label: x.pic, value: x.w }));
  return {
    key: word.w,
    render(box, done) {
      add(box, el('div', { class: 'qz-q' }, 'Which picture?'), el('div', { class: 'ph-card' }, el('div', { class: 'ph-word big' }, word.w)),
        choiceRow(options, (o) => o.value === word.w, done, 'ph-pics'));
      box.querySelector('.qz-choice')?.focus();
    },
  };
}

export const ACTIVITIES = [
  { id: 'first', label: 'First sound', pic: '🔤', make: firstSound },
  { id: 'build', label: 'Build the word', pic: '🧩', make: buildWord },
  { id: 'read', label: 'Read and match', pic: '📖', make: readAndMatch },
];

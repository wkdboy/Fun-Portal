// Phonics: uses only the sounds ticked as learned in the grown-ups area. No audio yet.
import { el, add, loadCss } from '../../shared/dom.js';
import { getSetting } from '../../shared/storage.js';
import { runQuiz } from '../../shared/quiz.js';
import { play } from '../../shared/audio.js';
import { usableWords } from './words.js';
import { ACTIVITIES } from './activities.js';
import { picture } from '../../shared/art.js';
import { TILES } from '../../shared/art-tiles.js';

const ROUND = 8;

export function mount(root) {
  loadCss(new URL('./phonics.css', import.meta.url));
  let stop = null;
  const show = async (fn) => {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    stop = (await fn(root)) || null;
  };
  const nav = { menu: () => show(menu), play: (a) => show((r) => round(r, a)) };

  async function menu(r) {
    const learned = await getSetting('phonicsLearned');
    const words = usableWords(learned);
    add(r, el('h1', {}, 'Phonics 🔤'));
    if (words.length < 4 || learned.length < 4) {
      add(r, el('div', { class: 'card center', style: 'max-width:700px;margin:0 auto' },
        el('p', {}, 'Ask a grown-up to tick the sounds learned at school (in the 🔒 grown-ups area).')));
      return;
    }
    add(r, el('div', { class: 'grid ph-menu' }, ACTIVITIES.map((a) => el('button', { class: 'tile', style: 'background:#ff5fa2', onclick: () => nav.play(a) },
      el('span', { class: 'pic' }, picture(TILES, a.id, a.pic)), a.label))));
    r.querySelector('.tile')?.focus();
  }

  async function round(r, activity) {
    const learned = await getSetting('phonicsLearned');
    const ctx = { learned, words: usableWords(learned) };
    const seen = new Set();
    return runQuiz(r, {
      count: ROUND,
      make: () => {
        let q;
        for (let i = 0; i < 12; i++) {
          q = activity.make(ctx);
          if (!seen.has(q.key)) break;
        }
        seen.add(q.key);
        return q;
      },
      onFinish: ({ correct, total }) => {
        play('win');
        r.replaceChildren();
        add(r, el('div', { class: 'card qz-result' },
          el('div', { class: 'big-stars' }, '🌟'),
          el('h1', {}, 'Well done!'),
          el('p', {}, `${correct} right first time out of ${total}`),
          el('div', { class: 'row', style: 'justify-content:center' },
            el('button', { class: 'btn big green', onclick: () => nav.play(activity) }, '▶ Again'),
            el('button', { class: 'btn big', onclick: nav.menu }, '🔤 Menu'))));
        r.querySelector('.btn.green')?.focus();
      },
    });
  }

  nav.menu();
  return () => stop?.();
}

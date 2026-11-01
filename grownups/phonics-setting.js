// Which sounds she has learned at school. Phonics will only practise ticked sounds.
import { el, add } from '../shared/dom.js';
import { getSetting, setSetting } from '../shared/storage.js';
import { PHONICS_GROUPS } from '../shared/phonics-sounds.js';
import { backButton } from './index.js';

export async function render(root, back) {
  const learned = new Set(await getSetting('phonicsLearned'));
  const save = () => setSetting('phonicsLearned', [...learned]);

  const chip = (s) => {
    const c = el('button', { class: 'chip' + (learned.has(s) ? ' on' : '') }, s);
    c.addEventListener('click', () => {
      learned.has(s) ? learned.delete(s) : learned.add(s);
      c.classList.toggle('on', learned.has(s));
      save();
    });
    return c;
  };

  add(root,
    el('h1', {}, 'Phonics sounds learned'),
    el('p', {}, 'Tap a sound to switch it on (green) once she has learned it at school.'),
    PHONICS_GROUPS.map((g) => {
      const chips = g.sounds.map(chip);
      const all = el('button', {
        class: 'btn grey',
        style: 'min-height:56px;padding:6px 18px',
        onclick: () => {
          const allOn = g.sounds.every((s) => learned.has(s));
          g.sounds.forEach((s, i) => {
            allOn ? learned.delete(s) : learned.add(s);
            chips[i].classList.toggle('on', learned.has(s));
          });
          save();
        },
      }, 'All / none');
      return el('div', {}, el('h2', {}, g.title), el('div', { class: 'row' }, chips, all));
    }),
    el('div', { style: 'margin-top:28px' }, backButton(back)),
  );
}

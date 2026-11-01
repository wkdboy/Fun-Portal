// She can make game players here (a person or a computer with a level). Deleting is in the grown-ups area.
import { el, add } from '../../shared/dom.js';
import { listGamePlayers, addPlayer } from '../../shared/players.js';
import { EMOJIS } from '../../shared/emojis.js';
import { play } from '../../shared/audio.js';

const describe = (p) => (p.id === 'me' ? '  (me)' : p.type === 'computer' ? `  (computer, level ${p.level})` : '  (person)');

export async function renderPlayers(root, back) {
  let emoji = EMOJIS[0];
  let type = 'computer';
  let level = 5;

  const list = el('div', { class: 'card' });
  async function refresh() {
    list.replaceChildren();
    add(list, (await listGamePlayers()).map((p) => el('div', { class: 'player-row' },
      el('span', { class: 'pic' }, p.emoji),
      el('span', { class: 'name' }, p.name, el('span', { class: 'muted' }, describe(p))))));
  }

  const name = el('input', { type: 'text', maxlength: '20', placeholder: 'Name', 'aria-label': 'Name', autocomplete: 'off' });
  const emojiBtns = EMOJIS.map((e) => el('button', {
    class: 'chip' + (e === emoji ? ' on' : ''),
    onclick: () => { emoji = e; paint(); },
  }, e));
  const typeBtns = [['computer', '🤖 Computer'], ['human', '🧑 Person']].map(([t, label]) =>
    el('button', { class: 'chip', onclick: () => { type = t; paint(); } }, label));
  const levelBtns = Array.from({ length: 10 }, (_, i) => el('button', {
    class: 'chip',
    onclick: () => { level = i + 1; paint(); },
  }, String(i + 1)));
  const levelRow = el('div', {}, el('h2', {}, 'How clever? (1 = easy, 10 = very clever)'), el('div', { class: 'g-row' }, levelBtns));
  const status = el('span', { class: 'muted' });

  function paint() {
    emojiBtns.forEach((b, i) => b.classList.toggle('on', EMOJIS[i] === emoji));
    typeBtns.forEach((b, i) => b.classList.toggle('on', ['computer', 'human'][i] === type));
    levelBtns.forEach((b, i) => b.classList.toggle('on', i + 1 === level));
    levelRow.hidden = type !== 'computer';
  }

  add(root,
    el('h1', {}, 'Players 👥'),
    list,
    el('h2', {}, 'Make a new player'),
    name,
    el('h2', {}, 'Picture'),
    el('div', { class: 'emoji-grid' }, emojiBtns),
    el('h2', {}, 'Who is it?'),
    el('div', { class: 'g-row' }, typeBtns),
    levelRow,
    el('div', { class: 'row', style: 'margin-top:28px' },
      el('button', {
        class: 'btn green big',
        onclick: async () => {
          if (!name.value.trim()) { status.textContent = 'Type a name first'; name.focus(); return; }
          await addPlayer({ name: name.value, emoji, type, level });
          play('good');
          name.value = '';
          status.textContent = 'Player made ✔';
          await refresh();
        },
      }, '➕ Make player'),
      el('button', { class: 'btn grey big', onclick: back }, '← Back'),
      status));
  paint();
  await refresh();
}

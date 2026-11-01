// Before a game: choose how many players (if the game allows), who they are, and the house rules.
import { el, add } from '../../shared/dom.js';
import { listGamePlayers } from '../../shared/players.js';
import { loadSave, clearSave } from './save.js';

export async function renderSetup(root, nav, def) {
  const { game } = await def.load();
  const players = await listGamePlayers();
  const others = players.filter((p) => p.id !== 'me');

  add(root, el('h1', {}, `${def.pic} ${def.label}`));

  const save = await loadSave(def.id);
  const savedPlayers = save?.playerIds.map((id) => players.find((p) => p.id === id));
  if (save && savedPlayers.every(Boolean)) {
    add(root, el('div', { class: 'card', style: 'max-width:760px;margin:0 auto 24px;text-align:center' },
      el('p', {}, `A game is waiting: ${savedPlayers.map((p) => p.emoji + ' ' + p.name).join(' and ')}`),
      el('div', { class: 'row', style: 'justify-content:center' },
        el('button', { class: 'btn big green', onclick: () => nav.play(def, game, savedPlayers, save.rules, save) }, '▶ Carry on'),
        el('button', { class: 'btn big grey', onclick: async () => { await clearSave(def.id); nav.setup(def); } }, '🗑️ Throw it away'))));
  } else if (save) {
    await clearSave(def.id); // a player in it no longer exists
  }

  if (others.length === 0) {
    add(root, el('div', { class: 'card center', style: 'max-width:700px;margin:0 auto' },
      el('p', {}, 'Make a player to play against first!'),
      el('button', { class: 'btn big orange', onclick: () => nav.players(() => nav.setup(def)) }, '👥 Make a player'),
      ' ',
      el('button', { class: 'btn big grey', onclick: nav.hub }, '← Back')));
    return;
  }

  const [minP, maxPlayers] = game.playerRange || [2, 2];
  const maxP = Math.min(maxPlayers, players.length);
  const saved = nav.memory[def.id];
  let sel = saved?.sel?.every((id) => players.some((p) => p.id === id))
    ? saved.sel.slice()
    : ['me', (others.find((p) => p.type === 'computer') || others[0]).id];
  const rules = Object.assign(Object.fromEntries(game.rulesSpec.map((s) => [s.id, s.default])), saved?.rules);

  function fit(n) {
    sel = sel.slice(0, n);
    for (const p of players) {
      if (sel.length >= n) break;
      if (!sel.includes(p.id)) sel.push(p.id);
    }
  }
  fit(Math.min(Math.max(sel.length, minP), maxP));

  const box = el('div', {});
  function draw() {
    nav.memory[def.id] = { sel, rules };
    box.replaceChildren();
    if (maxP > minP) {
      add(box, el('h2', {}, 'How many players?'),
        el('div', { class: 'g-row' }, Array.from({ length: maxP - minP + 1 }, (_, k) => minP + k).map((k) => el('button', {
          class: 'chip' + (sel.length === k ? ' on' : ''),
          onclick: () => { fit(k); draw(); },
        }, String(k)))));
    }
    const colours = game.seatColours?.(sel.length);
    sel.forEach((_, slot) => {
      const mark = game.symbols ? game.symbols[slot] : colours ? el('span', { class: 'g-dot', style: `background:${colours[slot]};display:inline-block;vertical-align:middle` }) : '';
      add(box, el('h2', {}, `Player ${slot + 1}  `, mark),
        el('div', { class: 'g-row' }, players.map((p) => el('button', {
          class: 'chip' + (sel[slot] === p.id ? ' on' : ''),
          disabled: sel.some((id, j) => j !== slot && id === p.id),
          onclick: () => { sel[slot] = p.id; draw(); },
        }, `${p.emoji} ${p.name}`, p.type === 'computer' ? ` 🤖${p.level}` : ''))));
    });
    add(box, el('h2', {}, '⚙️ House rules'));
    for (const spec of game.rulesSpec) {
      add(box, el('div', { class: 'g-sec' }, el('div', { class: 'muted' }, spec.label),
        el('div', { class: 'g-row' }, spec.options.map((o) => el('button', {
          class: 'chip' + (rules[spec.id] === o.value ? ' on' : ''),
          onclick: () => { rules[spec.id] = o.value; draw(); },
        }, o.label)))));
    }
  }
  draw();

  add(root, box,
    el('div', { class: 'row', style: 'margin-top:28px' },
      el('button', {
        class: 'btn green big',
        onclick: () => nav.play(def, game, sel.map((id) => players.find((p) => p.id === id)), { ...rules }),
      }, '▶ Play'),
      el('button', { class: 'btn orange big', onclick: () => nav.players(() => nav.setup(def)) }, '👥 Players'),
      el('button', { class: 'btn grey big', onclick: nav.hub }, '← Back')));
  root.querySelector('.btn.green')?.focus();
}

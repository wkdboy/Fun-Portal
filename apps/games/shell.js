// Runs a two-player game: players bar, turns, computer moves, result and who goes first next.
// A game module supplies: symbols, rulesSpec, initial(rules, starter), legalMoves(s), play(s, move),
// result(s) -> null | {winner: 0|1|-1, line?}, bestMoves(s, rules), makeBoard(container, rules, onMove).
import { el, add } from '../../shared/dom.js';
import { play as sfx } from '../../shared/audio.js';
import { chooseMove } from './ai.js';
import { showThinking } from './think.js';
import { writeSave, clearSave } from './save.js';

export function runGame(root, nav, def, game, players, rules, saved) {
  let starter = saved?.starter ?? 0;
  let state;
  let over = false;
  let timer = null;
  let loser = saved?.loser ?? null;

  const bar = el('div', { class: 'g-bar' });
  const msg = el('div', { class: 'g-msg' });
  const boardBox = el('div', { class: 'g-board' });
  const again = el('button', { class: 'btn big green', onclick: () => { starter = nextStarter(); newGame(); } }, '▶ Play again');
  again.hidden = true;
  const board = game.makeBoard(boardBox, rules, humanMove);

  add(root, bar, msg, boardBox,
    el('div', { class: 'row g-actions' },
      again,
      el('button', { class: 'btn orange', onclick: () => newGame() }, '🔄 Start again'),
      el('button', { class: 'btn', onclick: () => nav.setup(def) }, '⚙️ Players and rules'),
      el('button', { class: 'btn grey', onclick: nav.hub }, '← Games')));

  function drawBar() {
    bar.replaceChildren();
    add(bar, players.map((p, i) => el('div', { class: 'g-pl' + (state.turn === i && !over ? ' on' : '') },
      el('span', { class: 'pic' }, p.emoji), el('span', {}, p.name), el('span', { class: 'g-sym' }, game.symbols[i]),
      state.turn === i && !over && p.type === 'computer' && el('span', { class: 'g-bubble', 'aria-hidden': 'true' }, '💭'))));
  }

  function nextStarter() {
    if (rules.starter === 'first') return 0;
    if (rules.starter === 'loser') return loser ?? 1 - starter;
    return 1 - starter;
  }

  function newGame() {
    clearTimeout(timer);
    over = false;
    again.hidden = true;
    state = game.initial(rules, starter);
    step();
  }

  function step() {
    drawBar();
    const r = game.result(state);
    if (r) return finish(r);
    writeSave(def.id, { playerIds: players.map((p) => p.id), rules, state, starter, loser });
    const p = players[state.turn];
    const human = p.type === 'human';
    board.update(state, { interactive: human });
    if (human) {
      msg.textContent = `${p.name}'s turn`;
    } else {
      showThinking(msg, p.name);
      timer = setTimeout(() => apply(chooseMove(p.level, game.bestMoves(state, rules), game.legalMoves(state))), 700);
    }
  }

  function apply(move) {
    state = game.play(state, move);
    sfx('pop');
    step();
  }

  function humanMove(move) {
    if (over || players[state.turn].type !== 'human' || !game.legalMoves(state).includes(move)) return;
    apply(move);
  }

  function finish(r) {
    over = true;
    clearSave(def.id);
    loser = r.winner === -1 ? null : 1 - r.winner;
    drawBar();
    board.update(state, { interactive: false, result: r });
    msg.textContent = r.winner === -1 ? "It's a draw! 🤝" : `🎉 ${players[r.winner].name} wins!`;
    sfx(r.winner === -1 ? 'good' : 'win');
    again.hidden = false;
    again.focus();
  }

  if (saved) { state = saved.state; step(); } else newGame();
  return () => clearTimeout(timer);
}

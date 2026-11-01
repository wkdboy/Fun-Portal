// Runs a dice game for 2-4 players. A game module supplies:
//   playerRange, seatColours(n), rulesSpec, initial(rules, n, starter), setDice(s, value), legalMoves(s),
//   play(s, move), pass(s), result(s) -> null | {winner}, bestMoves(s, rules), status(s, seat),
//   makeBoard(container, rules, onMove, players) -> { update(state, {interactive, moves, result}) }
import { el, add } from '../../shared/dom.js';
import { play as sfx } from '../../shared/audio.js';
import { chooseMove } from './ai.js';
import { showThinking } from './think.js';
import { writeSave, clearSave } from './save.js';

const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export function runDiceGame(root, nav, def, game, players, rules, saved) {
  const n = players.length;
  const colours = game.seatColours(n);
  let starter = saved?.starter ?? 0;
  let state;
  let over = false;
  let rolling = false;
  let timer = null;
  let spin = null;

  const list = el('div', { class: 'g-plist' });
  const msg = el('div', { class: 'g-msg' });
  const dice = el('button', { class: 'g-dice', 'aria-label': 'Roll the dice', onclick: () => humanRoll() }, '🎲');
  const again = el('button', { class: 'btn big green', onclick: () => { starter = rules.starter === 'first' ? 0 : (starter + 1) % n; newGame(); } }, '▶ Play again');
  again.hidden = true;
  const boardBox = el('div', { class: 'g-board' });
  const board = game.makeBoard(boardBox, rules, humanMove, players);

  add(root, el('div', { class: 'g-sidewrap' },
    boardBox,
    el('div', { class: 'g-side' },
      list, msg, dice, again,
      el('div', { class: 'row' },
        el('button', { class: 'btn orange', onclick: () => newGame() }, '🔄 Start again'),
        el('button', { class: 'btn', onclick: () => nav.setup(def) }, '⚙️ Rules'),
        el('button', { class: 'btn grey', onclick: nav.hub }, '← Games')))));

  function paint() {
    list.replaceChildren();
    add(list, players.map((p, i) => el('div', { class: 'g-pl' + (state.turn === i && !over ? ' on' : '') },
      el('span', { class: 'g-dot', style: `background:${colours[i]}` }),
      el('span', { class: 'pic' }, p.emoji),
      el('span', { class: 'g-pname' }, p.name),
      el('span', { class: 'g-stat' }, game.status(state, i)),
      state.turn === i && !over && p.type === 'computer' && el('span', { class: 'g-bubble', 'aria-hidden': 'true' }, '💭'))));
    dice.textContent = state.dice ? FACES[state.dice - 1] : '🎲';
  }

  function clearTimers() {
    clearTimeout(timer);
    clearInterval(spin);
    rolling = false;
  }

  function newGame() {
    clearTimers();
    over = false;
    again.hidden = true;
    state = game.initial(rules, n, starter);
    step();
  }

  function step() {
    paint();
    const r = game.result(state);
    if (r) return finish(r);
    writeSave(def.id, { playerIds: players.map((p) => p.id), rules, state, starter });
    const p = players[state.turn];
    const human = p.type === 'human';
    const waiting = { interactive: false };
    if (state.dice === null) {
      board.update(state, waiting);
      dice.disabled = !human;
      if (human) {
        msg.textContent = `${p.name}: roll the dice!`;
        dice.focus();
      } else {
        showThinking(msg, p.name);
        timer = setTimeout(roll, 700);
      }
      return;
    }
    dice.disabled = true;
    const moves = game.legalMoves(state);
    if (moves.length === 0) {
      msg.textContent = `${p.name} can't move`;
      board.update(state, waiting);
      timer = setTimeout(() => { state = game.pass(state); step(); }, 1000);
    } else if (moves.length === 1) {
      board.update(state, { interactive: false, moves });
      timer = setTimeout(() => apply(moves[0]), 600);
    } else if (!human) {
      showThinking(msg, p.name);
      board.update(state, { interactive: false, moves });
      timer = setTimeout(() => apply(chooseMove(p.level, game.bestMoves(state, rules), moves)), 800);
    } else {
      msg.textContent = `${p.name}: pick a counter`;
      board.update(state, { interactive: true, moves });
    }
  }

  function roll() {
    if (rolling) return;
    rolling = true;
    dice.disabled = true;
    sfx('dice');
    let k = 0;
    spin = setInterval(() => {
      dice.textContent = FACES[Math.floor(Math.random() * 6)];
      if (++k >= 7) {
        clearInterval(spin);
        rolling = false;
        state = game.setDice(state, 1 + Math.floor(Math.random() * 6));
        step();
      }
    }, 90);
  }

  function humanRoll() {
    if (over || rolling || state.dice !== null || players[state.turn].type !== 'human') return;
    roll();
  }

  function apply(move) {
    state = game.play(state, move);
    sfx('pop');
    step();
  }

  function humanMove(move) {
    if (over || state.dice === null || players[state.turn].type !== 'human' || !game.legalMoves(state).includes(move)) return;
    apply(move);
  }

  function finish(r) {
    over = true;
    clearSave(def.id);
    dice.disabled = true;
    paint();
    board.update(state, { interactive: false, result: r });
    msg.textContent = `🎉 ${players[r.winner].name} wins!`;
    sfx('win');
    again.hidden = false;
    again.focus();
  }

  if (saved) { state = saved.state; step(); } else newGame();
  return clearTimers;
}

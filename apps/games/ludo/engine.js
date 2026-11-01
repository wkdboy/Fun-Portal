// Ludo rules. A move is a counter number 0-3 for the player whose turn it is.
import { RING } from './layout.js';

export const seatColours = (n) => (n === 2 ? [0, 2] : n === 3 ? [0, 1, 2] : [0, 1, 2, 3]);
const COLOUR_CSS = ['#e63946', '#2ec27e', '#ffd23f', '#2f6bff'];
export const displayColours = (n) => seatColours(n).map((q) => COLOUR_CSS[q]);

export function initial(rules, n, starter) {
  const pieces = Array.from({ length: n }, () => [-1, -1, -1, -1]);
  if (rules.leave === 'out') pieces.forEach((p) => { p[0] = 0; });
  return { n, rules, seats: seatColours(n), pieces, turn: starter, dice: null, tries: 0, last: null, winner: null };
}

export const setDice = (s, d) => ({ ...s, dice: d });

function target(s, p) {
  const d = s.dice;
  if (p === -1) return d === 6 || s.rules.leave === 'any' ? 0 : null;
  if (p === 56) return null;
  const np = p + d;
  if (np > 56) return s.rules.exact === 'yes' ? null : 56;
  return np;
}

export function legalMoves(s) {
  if (s.dice === null || s.winner !== null) return [];
  return [0, 1, 2, 3].filter((i) => target(s, s.pieces[s.turn][i]) !== null);
}

const ringIndex = (q, pos) => (13 * q + pos) % 52;

export function play(s, i) {
  const t = s.turn;
  const q = s.seats[t];
  const np = target(s, s.pieces[t][i]);
  const pieces = s.pieces.map((p) => p.slice());
  pieces[t][i] = np;
  let captured = 0;
  if (s.rules.capture === 'yes' && np <= 50) {
    const ri = ringIndex(q, np);
    if (ri % 13 !== 0) { // start squares are safe
      pieces.forEach((pcs, o) => {
        if (o === t) return;
        pcs.forEach((pos, j) => {
          if (pos >= 0 && pos <= 50 && ringIndex(s.seats[o], pos) === ri) { pcs[j] = -1; captured++; }
        });
      });
    }
  }
  const won = pieces[t].every((p) => p === 56);
  const extra = s.rules.extra === 'yes' && s.dice === 6 && !won;
  return {
    ...s,
    pieces,
    dice: null,
    tries: 0,
    turn: extra ? t : (t + 1) % s.n,
    last: { seat: t, piece: i, to: np, captured },
    winner: won ? t : null,
  };
}

// No legal move: with every counter in the yard and "need a 6", roll up to three times; otherwise next player.
export function pass(s) {
  const allHome = s.pieces[s.turn].every((p) => p === -1);
  if (allHome && s.rules.leave === 'six' && s.tries < 2) return { ...s, dice: null, tries: s.tries + 1 };
  return { ...s, dice: null, tries: 0, turn: (s.turn + 1) % s.n };
}

export const result = (s) => (s.winner !== null ? { winner: s.winner } : null);
export const status = (s, seat) => `🏠 ${s.pieces[seat].filter((p) => p === 56).length}/4`;

// Computer choice: finishing > sending a counter home > leaving the yard > entering the home column > advancing.
export function bestMoves(s) {
  const moves = legalMoves(s);
  let best = -Infinity;
  let out = [];
  for (const i of moves) {
    const p = s.pieces[s.turn][i];
    const after = play(s, i);
    const np = after.pieces[s.turn][i];
    let score = np / 10;
    if (np === 56) score += 100;
    score += after.last.captured * 80;
    if (p === -1) score += 60;
    if (p < 51 && np >= 51) score += 40;
    if (score > best) { best = score; out = [i]; } else if (score === best) out.push(i);
  }
  return out;
}

export { RING };

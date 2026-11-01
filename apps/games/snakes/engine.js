// Snakes and Ladders. Squares 1-100 (0 = not started). The only move is 'go'.
export const LADDERS = { 3: 22, 8: 30, 28: 56, 39: 58, 51: 71, 72: 92 };
export const SNAKES = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 36, 93: 73, 95: 75, 98: 79 };
const JUMPS = { ...LADDERS, ...SNAKES };

export const seatColours = (n) => ['#e63946', '#2ec27e', '#e0a800', '#2f6bff'].slice(0, n);

export const initial = (rules, n, starter) => ({ n, rules, pos: Array(n).fill(0), turn: starter, dice: null, last: null, winner: null });
export const setDice = (s, d) => ({ ...s, dice: d });
export const legalMoves = (s) => (s.dice === null || s.winner !== null ? [] : ['go']);
export const bestMoves = legalMoves;
export const pass = (s) => ({ ...s, dice: null, turn: (s.turn + 1) % s.n });
export const result = (s) => (s.winner !== null ? { winner: s.winner } : null);
export const status = (s, seat) => (s.pos[seat] === 0 ? 'start' : `📍${s.pos[seat]}`);

export function play(s) {
  const t = s.turn;
  const from = s.pos[t];
  let to = from + s.dice;
  if (to > 100) {
    if (s.rules.finish === 'any') to = 100;
    else if (s.rules.finish === 'stay') to = from;
    else to = 200 - to; // bounce back off 100
  }
  const landed = to;
  if (to !== from && JUMPS[to]) to = JUMPS[to];
  const pos = s.pos.slice();
  pos[t] = to;
  const won = to === 100;
  const extra = s.rules.extra === 'yes' && s.dice === 6 && !won;
  return {
    ...s,
    pos,
    dice: null,
    turn: extra ? t : (t + 1) % s.n,
    last: { seat: t, from, landed, to },
    winner: won ? t : null,
  };
}

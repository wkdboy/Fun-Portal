// Noughts and Crosses rules and perfect-play search. Player 0 = X, player 1 = O. Moves are cell indexes 0-8.
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

export const initial = (rules, starter) => ({ cells: Array(9).fill(null), turn: starter, last: null });

export function result(s) {
  for (const l of LINES) {
    const v = s.cells[l[0]];
    if (v !== null && v === s.cells[l[1]] && v === s.cells[l[2]]) return { winner: v, line: l };
  }
  return s.cells.every((c) => c !== null) ? { winner: -1 } : null;
}

const free = (s) => s.cells.flatMap((c, i) => (c === null ? [i] : []));
export const legalMoves = (s) => (result(s) ? [] : free(s));

export function play(s, move) {
  const cells = s.cells.slice();
  cells[move] = s.turn;
  return { cells, turn: 1 - s.turn, last: move };
}

const memo = new Map();
// Value for the player about to move: 1 win, 0 draw, -1 loss, with perfect play.
function value(s) {
  const key = s.cells.map((c) => (c === null ? '-' : c)).join('') + s.turn;
  if (memo.has(key)) return memo.get(key);
  const r = result(s);
  let v;
  if (r) v = r.winner === -1 ? 0 : r.winner === s.turn ? 1 : -1;
  else {
    v = -2;
    for (const m of free(s)) {
      v = Math.max(v, -value(play(s, m)));
      if (v === 1) break;
    }
  }
  memo.set(key, v);
  return v;
}

export function bestMoves(s) {
  let best = -2;
  let moves = [];
  for (const m of legalMoves(s)) {
    const v = -value(play(s, m));
    if (v > best) { best = v; moves = [m]; } else if (v === best) moves.push(m);
  }
  return moves;
}

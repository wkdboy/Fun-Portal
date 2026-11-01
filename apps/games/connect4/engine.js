// Connect 4 rules and a depth-limited search. Player 0 = red, player 1 = yellow.
// The grid is flat: index = row * cols + col, row 0 is the bottom. A move is a column number.
export function dims(rules) {
  return rules.size === 'small' ? { cols: 6, rows: 5 } : { cols: 7, rows: 6 };
}

export function initial(rules, starter) {
  const { cols, rows } = dims(rules);
  return { cols, rows, grid: Array(cols * rows).fill(null), turn: starter, last: null };
}

const DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];

// Cells of the winning line(s) through `idx`, or null.
function winLine(s, idx) {
  const { cols, rows, grid } = s;
  const p = grid[idx];
  const r0 = Math.floor(idx / cols);
  const c0 = idx % cols;
  let out = null;
  for (const [dc, dr] of DIRS) {
    const cells = [idx];
    for (const sign of [1, -1]) {
      let c = c0 + dc * sign;
      let r = r0 + dr * sign;
      while (c >= 0 && c < cols && r >= 0 && r < rows && grid[r * cols + c] === p) {
        cells.push(r * cols + c);
        c += dc * sign;
        r += dr * sign;
      }
    }
    if (cells.length >= 4) out = (out || []).concat(cells);
  }
  return out ? [...new Set(out)] : null;
}

const hasTop = (s, c) => s.grid[(s.rows - 1) * s.cols + c] === null;

export function result(s) {
  if (s.last !== null) {
    const line = winLine(s, s.last);
    if (line) return { winner: s.grid[s.last], line };
  }
  return s.grid.every((c) => c !== null) ? { winner: -1 } : null;
}

export function legalMoves(s) {
  if (result(s)) return [];
  return Array.from({ length: s.cols }, (_, c) => c).filter((c) => hasTop(s, c));
}

export function play(s, col) {
  const grid = s.grid.slice();
  let r = 0;
  while (grid[r * s.cols + col] !== null) r++;
  const idx = r * s.cols + col;
  grid[idx] = s.turn;
  return { ...s, grid, turn: 1 - s.turn, last: idx };
}

// ---- search ----
const windowCache = {};
function windows(cols, rows) {
  const key = cols + 'x' + rows;
  if (windowCache[key]) return windowCache[key];
  const list = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const [dc, dr] of DIRS) {
        const er = r + 3 * dr;
        const ec = c + 3 * dc;
        if (ec < 0 || ec >= cols || er < 0 || er >= rows) continue;
        list.push([0, 1, 2, 3].map((k) => (r + dr * k) * cols + c + dc * k));
      }
    }
  }
  return (windowCache[key] = list);
}

const POINTS = [0, 1, 6, 30, 0];
function evaluate(s) {
  const me = s.turn;
  let score = 0;
  for (const w of windows(s.cols, s.rows)) {
    let a = 0;
    let b = 0;
    for (const i of w) {
      const v = s.grid[i];
      if (v === me) a++; else if (v !== null) b++;
    }
    if (b === 0) score += POINTS[a]; else if (a === 0) score -= POINTS[b];
  }
  const mid = Math.floor(s.cols / 2);
  for (let r = 0; r < s.rows; r++) {
    const v = s.grid[r * s.cols + mid];
    if (v === me) score += 3; else if (v !== null) score -= 3;
  }
  return score;
}

// Value for the player about to move.
function negamax(s, depth, alpha, beta) {
  if (s.last !== null && winLine(s, s.last)) return -(1000 + depth); // the previous mover just won
  if (s.grid.every((c) => c !== null)) return 0;
  if (depth === 0) return evaluate(s);
  const mid = Math.floor(s.cols / 2);
  const order = Array.from({ length: s.cols }, (_, c) => c).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
  let best = -Infinity;
  for (const c of order) {
    if (!hasTop(s, c)) continue;
    best = Math.max(best, -negamax(play(s, c), depth - 1, -beta, -alpha));
    alpha = Math.max(alpha, best);
    if (alpha >= beta) break;
  }
  return best;
}

const DEPTH = 6;
export function bestMoves(s) {
  let best = -Infinity;
  let moves = [];
  for (const c of legalMoves(s)) {
    const v = -negamax(play(s, c), DEPTH - 1, -Infinity, Infinity);
    if (v > best) { best = v; moves = [c]; } else if (v === best) moves.push(c);
  }
  return moves;
}

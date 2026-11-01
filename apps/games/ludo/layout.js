// Ludo board geometry on a 15 x 15 grid. Colour q (0-3) goes clockwise round a 52-square ring.
// A counter's position: -1 = in the yard, 0-50 = ring squares counted from its start square,
// 51-55 = its home column, 56 = home (finished).
export const N = 15;
export const COLOURS = ['#e63946', '#2ec27e', '#ffd23f', '#2f6bff'];

const rot = ([x, y]) => [14 - y, x]; // quarter turn clockwise about the centre
const rotN = (c, q) => { for (let i = 0; i < q; i++) c = rot(c); return c; };

const BASE = [[1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0], [7, 0], [8, 0]];
export const RING = Array.from({ length: 52 }, (_, i) => rotN(BASE[i % 13], Math.floor(i / 13)));

export const cellFor = (q, pos) => (pos <= 50 ? RING[(13 * q + pos) % 52] : pos <= 55 ? rotN([pos - 50, 7], q) : rotN([6, 7], q));
export const yardSlot = (q, i) => rotN([[1, 1], [4, 1], [1, 4], [4, 4]][i], q);

// CSS class for every square of the board.
export function typeGrid() {
  const g = Array.from({ length: N }, () => Array(N).fill('blank'));
  for (let y = 6; y <= 8; y++) for (let x = 6; x <= 8; x++) g[y][x] = 'centre';
  for (let q = 0; q < 4; q++) {
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { const [a, b] = rotN([x, y], q); g[b][a] = 'yard yard' + q; }
  }
  for (const [x, y] of RING) g[y][x] = 'ring';
  for (let q = 0; q < 4; q++) {
    for (let k = 1; k <= 5; k++) { const [a, b] = rotN([k, 7], q); g[b][a] = 'home home' + q; }
    const [sx, sy] = RING[13 * q];
    g[sy][sx] = 'ring start start' + q;
    const [fx, fy] = rotN([6, 7], q);
    g[fy][fx] = 'centre fin' + q;
  }
  return g.map((row) => row.map((t) => 'lu-c ' + t));
}

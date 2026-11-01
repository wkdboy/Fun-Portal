import { el } from '../../../shared/dom.js';
import { LADDERS, SNAKES, seatColours } from './engine.js';

// Square n (1-100) -> [col, row] with row 0 at the bottom, rows zig-zag.
const cellXY = (n) => {
  const i = n - 1;
  const row = Math.floor(i / 10);
  return [row % 2 === 0 ? i % 10 : 9 - (i % 10), row];
};
const centre = (n) => {
  const [c, r] = cellXY(n);
  return [c * 10 + 5, (9 - r) * 10 + 5];
};

function artwork() {
  let svg = '';
  for (const [from, to] of Object.entries(LADDERS)) {
    const [x1, y1] = centre(+from);
    const [x2, y2] = centre(to);
    const len = Math.hypot(x2 - x1, y2 - y1);
    const nx = (-(y2 - y1) / len) * 1.4;
    const ny = ((x2 - x1) / len) * 1.4;
    svg += `<line x1="${x1 + nx}" y1="${y1 + ny}" x2="${x2 + nx}" y2="${y2 + ny}" stroke="#8b5a2b" stroke-width="1"/>`;
    svg += `<line x1="${x1 - nx}" y1="${y1 - ny}" x2="${x2 - nx}" y2="${y2 - ny}" stroke="#8b5a2b" stroke-width="1"/>`;
    for (let d = 3; d < len - 1; d += 4) {
      const t = d / len;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      svg += `<line x1="${px + nx}" y1="${py + ny}" x2="${px - nx}" y2="${py - ny}" stroke="#b9854a" stroke-width=".8"/>`;
    }
  }
  for (const [from, to] of Object.entries(SNAKES)) {
    const [x1, y1] = centre(+from);
    const [x2, y2] = centre(to);
    const len = Math.hypot(x2 - x1, y2 - y1);
    const nx = (-(y2 - y1) / len) * 6;
    const ny = ((x2 - x1) / len) * 6;
    const c1 = [x1 + (x2 - x1) / 3 + nx, y1 + (y2 - y1) / 3 + ny];
    const c2 = [x1 + (2 * (x2 - x1)) / 3 - nx, y1 + (2 * (y2 - y1)) / 3 - ny];
    svg += `<path d="M${x1} ${y1} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${x2} ${y2}" fill="none" stroke="#2ca66a" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>`;
    svg += `<circle cx="${x1}" cy="${y1}" r="2.3" fill="#1b7f4b"/><circle cx="${x1 - 0.8}" cy="${y1 - 0.6}" r=".55" fill="#fff"/><circle cx="${x1 + 0.8}" cy="${y1 - 0.6}" r=".55" fill="#fff"/>`;
  }
  return `<svg class="sl-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${svg}</svg>`;
}

export function makeBoard(container, rules, onMove, players) {
  const colours = seatColours(players.length);
  const cells = [];
  const grid = el('div', { class: 'sl-grid' });
  for (let r = 9; r >= 0; r--) {
    for (let c = 0; c < 10; c++) {
      const n = r % 2 === 0 ? r * 10 + c + 1 : r * 10 + (9 - c) + 1;
      const cell = el('div', { class: 'sl-cell' + ((r + c) % 2 ? ' alt' : '') }, el('span', { class: 'sl-num' }, n === 100 ? '🏁' : String(n)));
      cells[n] = cell;
      grid.append(cell);
    }
  }
  const area = el('div', { class: 'sl-area' }, grid);
  area.insertAdjacentHTML('beforeend', artwork());
  const pad = el('div', { class: 'sl-pad' }, 'Start ');
  container.append(el('div', { class: 'sl-wrap' }, area, pad));

  return {
    update(state) {
      for (const c of cells) c?.querySelectorAll('.sl-tok').forEach((t) => t.remove());
      pad.querySelectorAll('.sl-tok').forEach((t) => t.remove());
      cells.forEach((c) => c?.classList.remove('last'));
      if (state.last) cells[state.last.to]?.classList.add('last');
      state.pos.forEach((p, i) => {
        const tok = el('span', { class: 'sl-tok', style: `border-color:${colours[i]}` }, players[i].emoji);
        (p === 0 ? pad : cells[p]).append(tok);
      });
    },
  };
}

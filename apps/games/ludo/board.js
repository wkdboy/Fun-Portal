import { el } from '../../../shared/dom.js';
import { N, COLOURS, cellFor, yardSlot, typeGrid } from './layout.js';

export function makeBoard(container, rules, onMove) {
  const cells = [];
  const grid = el('div', { class: 'lu-grid' });
  typeGrid().forEach((row, y) => row.forEach((cls, x) => {
    const c = el('div', { class: cls });
    cells[y * N + x] = c;
    grid.append(c);
  }));
  container.append(el('div', { class: 'lu-wrap' }, grid));

  return {
    update(state, { interactive, moves = [] }) {
      cells.forEach((c) => c.replaceChildren());
      state.pieces.forEach((pcs, seat) => {
        const q = state.seats[seat];
        pcs.forEach((pos, i) => {
          const [x, y] = pos === -1 ? yardSlot(q, i) : cellFor(q, pos);
          const can = interactive && seat === state.turn && moves.includes(i);
          cells[y * N + x].append(el('button', {
            class: 'lu-pc' + (can ? ' can' : ''),
            style: `background:${COLOURS[q]}`,
            'aria-label': `Counter ${i + 1}`,
            disabled: !can,
            onclick: () => onMove(i),
          }, String(i + 1)));
        });
      });
      cells.forEach((c) => { c.dataset.n = c.children.length; });
      if (interactive && document.activeElement === document.body) grid.querySelector('.lu-pc.can')?.focus();
    },
  };
}

import { el } from '../../../shared/dom.js';
import { dims } from './engine.js';

export function makeBoard(container, rules, onMove) {
  const { cols, rows } = dims(rules);
  const drops = Array.from({ length: cols }, (_, c) => el('button', {
    class: 'btn g-drop',
    'aria-label': `Drop in column ${c + 1}`,
    onclick: () => onMove(c),
  }, '⬇'));

  const cells = [];
  const grid = el('div', { class: 'g-c4' });
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = 0; c < cols; c++) {
      const d = el('div', { class: 'g-disc', onclick: () => onMove(c) });
      cells[r * cols + c] = d;
      grid.append(d);
    }
  }
  container.append(el('div', { class: 'g-c4wrap', style: `--cols:${cols};--rows:${rows}` }, el('div', { class: 'g-drops' }, drops), grid));

  return {
    update(state, { interactive, result }) {
      state.grid.forEach((v, i) => {
        cells[i].className = 'g-disc' + (v === 0 ? ' red' : v === 1 ? ' yellow' : '') + (state.last === i ? ' last' : '') + (result?.line?.includes(i) ? ' win' : '');
      });
      drops.forEach((b, c) => { b.disabled = !interactive || state.grid[(rows - 1) * cols + c] !== null; });
      if (interactive && document.activeElement === document.body) drops.find((b) => !b.disabled)?.focus();
    },
  };
}

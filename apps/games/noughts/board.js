import { el } from '../../../shared/dom.js';

const SYMBOLS = ['X', 'O'];

export function makeBoard(container, rules, onMove) {
  const cells = Array.from({ length: 9 }, (_, i) => el('button', {
    class: 'g-cell',
    'aria-label': `Square ${i + 1}`,
    onclick: () => onMove(i),
  }));
  container.append(el('div', { class: 'g-nc' }, cells));

  return {
    update(state, { interactive, result }) {
      cells.forEach((b, i) => {
        const v = state.cells[i];
        b.textContent = v === null ? '' : SYMBOLS[v];
        b.className = 'g-cell' + (v === 0 ? ' x' : v === 1 ? ' o' : '') + (state.last === i ? ' last' : '') + (result?.line?.includes(i) ? ' win' : '');
        b.disabled = !interactive || v !== null;
      });
      if (interactive && document.activeElement === document.body) cells.find((b) => !b.disabled)?.focus();
    },
  };
}

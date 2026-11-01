// Times tables: pick a table (or a mix), then flash cards appear one at a time in random order.
import { el, add, loadCss } from '../../shared/dom.js';
import { renderCards } from './cards.js';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const COLOURS = ['#ff5fa2', '#ff9f1c', '#2ec27e', '#2f9bff', '#8e5cf6', '#14a89a'];

export function mount(root) {
  loadCss(new URL('./times-tables.css', import.meta.url));
  let stop = null;
  const show = (fn) => {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    stop = fn(root) || null;
  };
  const nav = { menu: () => show(menu), cards: (table) => show((r) => renderCards(r, nav, table)) };

  function menu(r) {
    const tile = (label, table, i, cls = '') => el('button', {
      class: 'tt-tile ' + cls,
      style: `background:${COLOURS[i % COLOURS.length]}`,
      onclick: () => nav.cards(table),
    }, label);
    add(r, el('h1', {}, 'Times tables ✖️'),
      el('div', { class: 'grid tt-menu' },
        TABLES.map((n, i) => tile(`${n}×`, n, i)),
        tile('🎲 Mix', 0, 11, 'mix')));
    r.querySelector('.tt-tile')?.focus();
  }

  nav.menu();
  return () => stop?.();
}

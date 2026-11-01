// Shopping list: fill the basket to match the list. Three levels: find the things, count them, then add up the prices.
import { el, add, loadCss } from '../../../shared/dom.js';
import { svgPic } from '../../../shared/art.js';
import { choiceRow } from '../../../shared/quiz.js';
import { play } from '../../../shared/audio.js';
import { sample, shuffle } from '../../../shared/random.js';
import { ITEMS, itemPic, makeList, total, shelfOrder } from './items.js';

const LEVELS = [
  { id: 1, label: 'Find the things', pic: '<circle cx="50" cy="50" r="38" fill="#fff"/><path d="M30 52 L44 66 L72 34" stroke="#2ec27e" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
  { id: 2, label: 'How many?', pic: '<rect x="8" y="22" width="84" height="56" rx="14" fill="#fff"/><text x="50" y="62" font-size="34" font-weight="800" text-anchor="middle" fill="#ff9f1c" font-family="Andika, Segoe UI, sans-serif">× 3</text>' },
  { id: 3, label: 'Pay up', pic: '<circle cx="50" cy="50" r="38" fill="#ffd23f" stroke="#ff9f1c" stroke-width="5"/><text x="50" y="64" font-size="40" font-weight="800" text-anchor="middle" fill="#ff9f1c" font-family="Andika, Segoe UI, sans-serif">p</text>' },
];
const COLOURS = ['#2ec27e', '#ff9f1c', '#2f9bff'];

export function run(root, nav) {
  loadCss(new URL('./shopping.css', import.meta.url));
  let stop = null;

  function menu() {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    add(root, el('h1', {}, 'Shopping list 🛒'),
      el('div', { class: 'grid sh-levels' }, LEVELS.map((l, i) => el('button', { class: 'tile', style: `background:${COLOURS[i]}`, onclick: () => round(l.id) },
        el('span', { class: 'pic' }, svgPic(l.pic)), l.label))),
      el('div', { style: 'margin-top:28px;text-align:center' }, el('button', { class: 'btn grey big', onclick: nav.hub }, '← Games')));
    root.querySelector('.tile')?.focus();
  }

  function round(level) {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    const list = makeList(level);
    const basket = new Map();
    let checked = false;
    let timer = null;
    stop = () => clearTimeout(timer);

    const listBox = el('div', { class: 'card sh-list' });
    const basketBox = el('div', { class: 'card sh-basket' });
    const msg = el('div', { class: 'sh-msg' });
    const doneBtn = el('button', { class: 'btn big green', onclick: check }, '✔ Done');

    const shelf = el('div', { class: 'sh-shelf' }, shelfOrder().map((item) => el('button', {
      class: 'sh-item',
      'aria-label': item.name,
      onclick: () => {
        if ((basket.get(item.id) || 0) >= 9) return;
        basket.set(item.id, (basket.get(item.id) || 0) + 1);
        play('pop');
        checked = false;
        msg.textContent = '';
        paint();
      },
    }, itemPic(item), el('span', { class: 'sh-name' }, item.name), level === 3 && el('span', { class: 'sh-price' }, `${item.price}p`))));

    function paint() {
      listBox.replaceChildren();
      add(listBox, el('h2', {}, 'My list'), list.map((r) => {
        const have = basket.get(r.item.id) || 0;
        const mark = checked ? (have === r.qty ? '✔' : '✖') : '';
        return el('div', { class: 'sh-row' + (checked ? (have === r.qty ? ' ok' : ' bad') : '') },
          el('span', { class: 'sh-pic' }, itemPic(r.item)),
          el('span', { class: 'sh-rname' }, r.item.name),
          level > 1 && el('span', { class: 'sh-qty' }, `× ${r.qty}`),
          el('span', { class: 'sh-mark' }, mark));
      }));
      basketBox.replaceChildren();
      add(basketBox, el('h2', {}, '🧺 My basket'));
      const entries = ITEMS.filter((i) => basket.get(i.id));
      if (!entries.length) add(basketBox, el('p', { class: 'muted' }, 'Tap things on the shelf.'));
      add(basketBox, entries.map((item) => {
        const onList = list.some((r) => r.item.id === item.id);
        return el('button', {
          class: 'sh-brow' + (checked && !onList ? ' bad' : ''),
          'aria-label': `Put back ${item.name}`,
          onclick: () => {
            const n = basket.get(item.id) - 1;
            n ? basket.set(item.id, n) : basket.delete(item.id);
            checked = false;
            paint();
          },
        }, el('span', { class: 'sh-pic' }, itemPic(item)), el('span', { class: 'sh-qty' }, `× ${basket.get(item.id)}`), el('span', { class: 'sh-x' }, '↩'));
      }));
    }

    function check() {
      checked = true;
      const right = list.every((r) => (basket.get(r.item.id) || 0) === r.qty) && [...basket.keys()].every((id) => list.some((r) => r.item.id === id));
      paint();
      if (!right) {
        play('wrong');
        msg.textContent = 'Not quite. Look at the ticks. Tap things in the basket to put them back.';
        return;
      }
      if (level < 3) return win();
      pay();
    }

    function pay() {
      const sum = total(list);
      play('good');
      const near = [-3, -2, -1, 1, 2, 3].map((d) => sum + d).filter((v) => v >= 1 && v <= 25);
      const options = shuffle([sum, ...sample(near, 3)]).map((v) => ({ label: `${v}p`, value: v }));
      root.replaceChildren();
      add(root, el('div', { class: 'qz-box' },
        el('div', { class: 'qz-q' }, 'How much altogether?'),
        el('div', { class: 'sh-receipt' }, list.map((r) => el('div', { class: 'sh-rrow' },
          el('span', { class: 'sh-pic' }, itemPic(r.item)),
          el('span', {}, r.qty > 1 ? `${r.qty} × ${r.item.price}p` : `${r.item.price}p`)))),
        choiceRow(options, (o) => o.value === sum, () => { timer = setTimeout(win, 800); })));
      root.querySelector('.qz-choice')?.focus();
    }

    function win() {
      play('win');
      root.replaceChildren();
      add(root, el('div', { class: 'card qz-result' },
        el('div', { class: 'big-stars' }, '🛒'),
        el('h1', {}, 'You got everything!'),
        el('div', { class: 'row', style: 'justify-content:center' },
          el('button', { class: 'btn big green', onclick: () => round(level) }, '▶ Another list'),
          el('button', { class: 'btn big', onclick: menu }, '🛒 Levels'))));
      root.querySelector('.btn.green')?.focus();
    }

    add(root, el('div', { class: 'sh-wrap' }, listBox, el('div', {}, shelf, msg), el('div', { class: 'sh-side' }, basketBox, doneBtn,
      el('button', { class: 'btn grey', onclick: menu }, '← Levels'))));
    paint();
    shelf.querySelector('button')?.focus();
  }

  menu();
  return () => stop?.();
}

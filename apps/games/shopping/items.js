// Things in the shop, their prices (in pence) and drawn pictures, plus the shopping-list generator.
import { K, W, O, Y, R, B, G, DG, P, BR, LB, TAN, line, svgPic } from '../../../shared/art.js';
import { PICTURES } from '../../phonics/pictures.js';
import { shuffle, sample, rand } from '../../../shared/random.js';

const ART = {
  apple: `<path d="M50 28 Q22 18 14 46 Q10 78 36 90 Q46 94 50 88 Q54 94 64 90 Q90 78 86 46 Q78 18 50 28Z" fill="${R}"/><ellipse cx="32" cy="48" rx="6" ry="12" fill="#fff" opacity=".3" transform="rotate(15 32 48)"/>${line('M50 28 Q52 14 62 8', 4, BR)}<path d="M56 16 Q74 6 80 22 Q62 28 56 16Z" fill="${G}"/>`,
  banana: `<path d="M14 26 Q16 72 64 84 Q86 90 94 74 Q64 76 44 52 Q34 38 32 20Z" fill="${Y}" stroke="#d9a400" stroke-width="3" stroke-linejoin="round"/><path d="M14 26 L32 20 L28 10 L12 16Z" fill="${BR}"/>`,
  bread: `<path d="M10 58 Q8 28 34 26 Q50 12 66 26 Q92 28 90 58 V82 Q90 90 82 90 H18 Q10 90 10 82Z" fill="#e0a45a" stroke="#b87a30" stroke-width="3"/>${line('M34 38 L30 54 M50 32 L46 50 M66 38 L62 54', 3, '#b87a30')}`,
  milk: `<polygon points="28,36 50,10 72,36" fill="${LB}" stroke="${B}" stroke-width="3" stroke-linejoin="round"/><rect x="28" y="36" width="44" height="54" fill="${W}" stroke="${B}" stroke-width="3"/><rect x="28" y="52" width="44" height="22" fill="${B}"/><circle cx="50" cy="63" r="6" fill="${W}"/>`,
  egg: `<ellipse cx="50" cy="56" rx="28" ry="34" fill="#fff3dc" stroke="#e0c9a0" stroke-width="3"/><ellipse cx="40" cy="42" rx="6" ry="10" fill="#fff" opacity=".7" transform="rotate(20 40 42)"/>`,
  carrot: `<path d="M44 26 Q36 8 28 12 Q38 18 44 26Z M50 24 Q48 2 56 4 Q56 16 50 24Z M56 26 Q64 8 74 12 Q64 18 56 26Z" fill="${G}"/><path d="M28 28 Q50 20 72 28 Q62 70 50 96 Q38 70 28 28Z" fill="${O}"/>${line('M40 42 H50 M52 56 H62 M44 68 H52', 3, '#d97f00')}`,
  orange: `<circle cx="50" cy="56" r="34" fill="${O}"/><path d="M50 24 Q58 8 74 12 Q66 28 50 24Z" fill="${G}"/><g fill="#e08400"><circle cx="38" cy="50" r="2"/><circle cx="60" cy="46" r="2"/><circle cx="50" cy="66" r="2"/><circle cx="68" cy="64" r="2"/><circle cx="34" cy="68" r="2"/></g>`,
  strawberry: `<path d="M50 92 Q12 64 16 40 Q20 24 50 30 Q80 24 84 40 Q88 64 50 92Z" fill="${R}"/><g fill="${Y}"><circle cx="36" cy="46" r="2.5"/><circle cx="52" cy="44" r="2.5"/><circle cx="66" cy="50" r="2.5"/><circle cx="42" cy="62" r="2.5"/><circle cx="58" cy="64" r="2.5"/><circle cx="50" cy="78" r="2.5"/></g><path d="M28 32 L50 14 L72 32 L60 30 L50 42 L40 30Z" fill="${G}"/>`,
  cake: `<rect x="12" y="56" width="76" height="32" rx="6" fill="#a86e3c"/><rect x="12" y="52" width="76" height="10" rx="5" fill="${W}"/><path d="M12 52 Q12 32 50 32 Q88 32 88 52Z" fill="${P}"/><circle cx="50" cy="26" r="7" fill="${R}"/>${line('M50 20 Q54 10 60 8', 3, DG)}`,
  biscuit: `<circle cx="50" cy="50" r="36" fill="${TAN}" stroke="#b87a30" stroke-width="3"/><g fill="#5a3a1a"><circle cx="38" cy="38" r="4"/><circle cx="60" cy="36" r="4"/><circle cx="44" cy="58" r="4"/><circle cx="64" cy="58" r="4"/><circle cx="52" cy="46" r="3"/></g>`,
  pear: `<path d="M50 14 Q60 14 62 30 Q64 42 76 54 Q88 78 68 90 Q50 98 32 90 Q12 78 24 54 Q36 42 38 30 Q40 14 50 14Z" fill="#b9d94a" stroke="#8fb02a" stroke-width="3"/>${line('M50 14 Q52 6 58 4', 4, BR)}<path d="M54 10 Q68 2 76 12 Q62 18 54 10Z" fill="${G}"/>`,
};

export const ITEMS = [
  { id: 'apple', name: 'apple', price: 3 },
  { id: 'banana', name: 'banana', price: 4 },
  { id: 'bread', name: 'bread', price: 5 },
  { id: 'milk', name: 'milk', price: 6 },
  { id: 'egg', name: 'egg', price: 2 },
  { id: 'carrot', name: 'carrot', price: 2 },
  { id: 'orange', name: 'orange', price: 3 },
  { id: 'strawberry', name: 'strawberry', price: 4 },
  { id: 'cake', name: 'cake', price: 9 },
  { id: 'fish', name: 'fish', price: 8 },
  { id: 'biscuit', name: 'biscuit', price: 1 },
  { id: 'pear', name: 'pear', price: 3 },
];

export const itemPic = (item) => svgPic(item.id === 'fish' ? PICTURES.fish : ART[item.id]);

// level 1: 3-5 different things. level 2: 3 things, 1-4 of each. level 3: 2-3 things, 1-2 of each, total at most 20p.
export function makeList(level) {
  for (let i = 0; i < 50; i++) {
    const count = level === 1 ? rand(3, 5) : level === 2 ? 3 : rand(2, 3);
    const list = sample(ITEMS, count).map((item) => ({ item, qty: level === 1 ? 1 : level === 2 ? rand(1, 4) : rand(1, 2) }));
    if (level < 3 || total(list) <= 20) return list;
  }
  return sample(ITEMS, 2).map((item) => ({ item, qty: 1 }));
}

export const total = (list) => list.reduce((sum, r) => sum + r.item.price * r.qty, 0);
export const shelfOrder = () => shuffle(ITEMS);

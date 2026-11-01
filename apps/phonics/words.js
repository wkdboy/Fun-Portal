// Original word list: each word split into the sounds (graphemes) a child blends, with a picture.
// Every grapheme must be one of those in shared/phonics-sounds.js.
const w = (word, pic) => ({ w: word, pic });
const SPLIT = {
  // single-letter and early sounds
  cat: 'c a t', dog: 'd o g', pig: 'p i g', sun: 's u n', hat: 'h a t', bug: 'b u g', bed: 'b e d', hen: 'h e n',
  nut: 'n u t', rat: 'r a t', pen: 'p e n', bus: 'b u s', bat: 'b a t', bin: 'b i n', sock: 's o ck', duck: 'd u ck',
  bell: 'b e ll', dress: 'd r e ss', pin: 'p i n', map: 'm a p', cap: 'c a p',
  // more single letters and pairs
  jet: 'j e t', van: 'v a n', web: 'w e b', box: 'b o x', six: 's i x', zip: 'z i p', ship: 'sh i p', shop: 'sh o p',
  fish: 'f i sh', chip: 'ch i p', chick: 'ch i ck', bath: 'b a th', thumb: 'th u m b', ring: 'r i ng', king: 'k i ng',
  // vowel sounds
  rain: 'r ai n', snail: 's n ai l', train: 't r ai n', tree: 't r ee', bee: 'b ee', sheep: 'sh ee p', feet: 'f ee t',
  light: 'l igh t', night: 'n igh t', boat: 'b oa t', goat: 'g oa t', coat: 'c oa t', moon: 'm oo n', spoon: 's p oo n',
  boot: 'b oo t', book: 'b oo k', car: 'c ar', star: 's t ar', park: 'p ar k', arm: 'ar m', fork: 'f or k', corn: 'c or n',
  torch: 't or ch', storm: 's t or m', burger: 'b ur g er', flower: 'f l ow er', cow: 'c ow', owl: 'ow l', clown: 'c l ow n',
  coin: 'c oi n', oil: 'oi l', ear: 'ear', chair: 'ch air', queen: 'qu ee n', shark: 'sh ar k',
};
const PICS = {
  cat: '🐱', dog: '🐶', pig: '🐷', sun: '☀️', hat: '🎩', bug: '🐛', bed: '🛏️', hen: '🐔', nut: '🥜', rat: '🐀', pen: '🖊️',
  bus: '🚌', bat: '🦇', bin: '🗑️', sock: '🧦', duck: '🦆', bell: '🔔', dress: '👗', pin: '📌', map: '🗺️', cap: '🧢',
  jet: '✈️', van: '🚐', web: '🕸️', box: '📦', six: '6️⃣', zip: '🤐', ship: '🚢', shop: '🏪', fish: '🐟', chip: '🍟', chick: '🐥',
  bath: '🛁', thumb: '👍', ring: '💍', king: '👑', rain: '🌧️', snail: '🐌', train: '🚂', tree: '🌳', bee: '🐝', sheep: '🐑',
  feet: '🦶', light: '💡', night: '🌃', boat: '🚤', goat: '🐐', coat: '🧥', moon: '🌙', spoon: '🥄', boot: '🥾', book: '📖',
  car: '🚗', star: '⭐', park: '🏞️', arm: '💪', fork: '🍴', corn: '🌽', torch: '🔦', storm: '⛈️', burger: '🍔', flower: '🌸',
  cow: '🐄', owl: '🦉', clown: '🤡', coin: '🪙', oil: '🛢️', ear: '👂', chair: '🪑', queen: '👸', shark: '🦈',
};

export const WORDS = Object.keys(SPLIT).map((k) => ({ ...w(k, PICS[k]), g: SPLIT[k].split(' ') }));

// Words she can read: every sound in them has been ticked as learned.
export const usableWords = (learned) => WORDS.filter((x) => x.g.every((g) => learned.includes(g)));

// Tracing: type a letter or word at the top, then trace it on the sheet below (guides get fainter row by row).
import { el, add, loadCss } from '../../shared/dom.js';
import { get, put, getSetting } from '../../shared/storage.js';
import { confirmPicture } from '../../shared/confirm.js';
import { play } from '../../shared/audio.js';
import { drawGuides } from './guides.js';
import { createInk } from './ink.js';

const COLOURS = ['#6c4cf1', '#e63946', '#2f6bff', '#1b7f4b', '#2b2250'];
const SIZES = [5, 10];
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export async function mount(root) {
  await Promise.all([
    loadCss(new URL('../paint/paint.css', import.meta.url)), // shared swatch and tool button styles
    loadCss(new URL('./tracing.css', import.meta.url)),
  ]);
  const name = await getSetting('childName');
  const learned = await getSetting('phonicsLearned');
  let text = (await get('kv', 'tracingText')) ?? (name || 'abc');
  let timer = null;

  const input = el('input', { type: 'text', class: 'tr-input', maxlength: '14', placeholder: 'Type here', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Letters or word to trace' });
  input.value = text;
  const chips = el('div', { class: 'tr-chips' }, (learned.length >= 4 ? learned : ALPHABET).map((s) => el('button', {
    class: 'chip tr-chip',
    onclick: () => { input.value = s; changed(); },
  }, s)));

  const stage = el('div', { class: 'tr-stage' });
  const guide = el('canvas', { class: 'tr-guide' });
  const inkCanvas = el('canvas', { class: 'tr-ink' });
  stage.append(guide, inkCanvas);
  const status = el('div', { class: 'pt-status' });
  let ink;
  let rows = 4;
  let dpr = 1;

  const swatches = COLOURS.map((c) => el('button', {
    class: 'pt-sw',
    style: `background:${c}`,
    'aria-label': 'Pen colour',
    onclick: () => { ink.setColour(c); colourNow = c; mark(); },
  }));
  const sizeBtns = SIZES.map((s) => el('button', {
    class: 'btn pt-tool',
    'aria-label': 'Pen size',
    onclick: () => { ink.setSize(s); sizeNow = s; mark(); },
  }, el('span', { class: 'pt-dot', style: `width:${s * 2 + 4}px;height:${s * 2 + 4}px` })));
  let sizeNow = SIZES[0];
  let colourNow = COLOURS[0];
  const rubber = el('button', { class: 'btn pt-tool', 'aria-label': 'Rubber', onclick: () => { ink.setErasing(!ink.erasing); mark(); } }, '🧽');
  function mark() {
    swatches.forEach((b, i) => b.classList.toggle('on', !ink.erasing && COLOURS[i] === colourNow));
    sizeBtns.forEach((b, i) => b.classList.toggle('sel', SIZES[i] === sizeNow));
    rubber.classList.toggle('sel', ink.erasing);
  }

  const tool = (label, aria, fn, cls = '') => el('button', { class: 'btn pt-tool ' + cls, 'aria-label': aria, onclick: fn }, label);
  const tools = el('div', { class: 'pt-tools' },
    sizeBtns,
    rubber,
    tool('↩️', 'Undo', () => ink.undo()),
    tool('🗑️', 'Clear writing', async () => { if (await confirmPicture('🗑️', 'Rub out my writing?')) ink.clear(); }, 'pink'),
    tool('💾', 'Save to my pictures', async () => {
      const out = document.createElement('canvas');
      out.width = guide.width;
      out.height = guide.height;
      const o = out.getContext('2d');
      o.drawImage(guide, 0, 0);
      o.drawImage(inkCanvas, 0, 0);
      const png = await new Promise((r) => out.toBlob(r, 'image/png'));
      await put('drawings', { id: 'trace' + Date.now().toString(36), png, modified: Date.now() });
      play('good');
      status.textContent = 'Saved in Paint ✔';
    }, 'green'));

  add(root, el('div', { class: 'tr-top' }, input, chips),
    el('div', { class: 'pt-layout' }, el('div', { class: 'pt-pal' }, swatches), el('div', { class: 'tr-wrapper' }, stage), el('div', {}, tools, status)));

  // Size the sheet to the space available (3 rows on a short screen).
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = stage.clientWidth || 1000;
  const cssH = stage.clientHeight || 500;
  rows = cssH < 480 ? 3 : 4;
  for (const c of [guide, inkCanvas]) {
    c.width = Math.round(cssW * dpr);
    c.height = Math.round(cssH * dpr);
    c.style.width = cssW + 'px';
    c.style.height = cssH + 'px';
  }
  ink = createInk(inkCanvas, () => { status.textContent = ''; });
  mark();

  function changed() {
    text = input.value;
    clearTimeout(timer);
    timer = setTimeout(() => {
      put('kv', text, 'tracingText');
      ink.clear();
      drawGuides(guide, text, rows, dpr);
    }, 150);
  }
  input.addEventListener('input', changed);
  await drawGuides(guide, text, rows, dpr);
  input.focus();
  return () => clearTimeout(timer);
}

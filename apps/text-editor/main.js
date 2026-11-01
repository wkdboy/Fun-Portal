// Write: one auto-saved note. Text size and colour apply to the whole note.
import { el, add, loadCss } from '../../shared/dom.js';
import { get, put } from '../../shared/storage.js';

const SIZES = [28, 44, 64, 96];
const COLOURS = ['#2b2250', '#e63946', '#ff9f1c', '#c99700', '#2ec27e', '#1b7f4b', '#2f9bff', '#2f4bff', '#8e5cf6', '#ff5fa2'];

export async function mount(root) {
  loadCss(new URL('./editor.css', import.meta.url));
  const rec = (await get('documents', 'note')) || {};
  let size = SIZES.includes(rec.size) ? rec.size : SIZES[1];
  let colour = COLOURS.includes(rec.colour) ? rec.colour : COLOURS[0];

  const ta = el('textarea', { class: 'te-text', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'My writing' });
  ta.value = rec.text || '';

  const save = () => put('documents', { id: 'note', text: ta.value, size, colour, modified: Date.now() });
  let timer;
  const later = () => { clearTimeout(timer); timer = setTimeout(save, 400); };
  ta.addEventListener('input', later);

  const sizeBtns = SIZES.map((s, i) => el('button', {
    class: 'btn te-size',
    'aria-label': 'Text size',
    style: `font-size:${14 + i * 8}px`,
    onclick: () => { size = s; apply(); later(); },
  }, 'A'));
  const swatches = COLOURS.map((c) => el('button', {
    class: 'pt-sw te-sw',
    style: `background:${c}`,
    'aria-label': 'Text colour',
    onclick: () => { colour = c; apply(); later(); },
  }));

  function apply() {
    ta.style.fontSize = size + 'px';
    ta.style.color = colour;
    sizeBtns.forEach((b, i) => b.classList.toggle('sel', SIZES[i] === size));
    swatches.forEach((b, i) => b.classList.toggle('on', COLOURS[i] === colour));
  }

  add(root, el('div', { class: 'te-bar' }, el('div', { class: 'row' }, sizeBtns), el('div', { class: 'row' }, swatches)), ta);
  apply();
  ta.focus();
  return () => { clearTimeout(timer); save(); };
}

import { el } from '../shared/dom.js';
import { getSetting, setSetting } from '../shared/storage.js';
import { EMOJIS } from '../shared/emojis.js';
import { backButton } from './index.js';

export async function render(root, back) {
  let emoji = await getSetting('childEmoji');
  const input = el('input', { type: 'text', maxlength: '20', value: await getSetting('childName'), 'aria-label': 'Her name', autocomplete: 'off' });
  const status = el('span', { class: 'muted' });
  const chips = EMOJIS.map((e) => el('button', {
    class: 'chip' + (e === emoji ? ' on' : ''),
    onclick: (ev) => {
      emoji = e;
      chips.forEach((c) => c.classList.toggle('on', c === ev.currentTarget));
    },
  }, e));

  root.append(
    el('h1', {}, 'Her name and picture'),
    el('p', {}, 'Used for "Hi, name!" and as her player in games. Stored only on this device.'),
    input,
    el('h2', {}, 'Picture'),
    el('div', { class: 'emoji-grid' }, chips),
    el('div', { class: 'row', style: 'margin-top:28px' },
      el('button', {
        class: 'btn green',
        onclick: async () => {
          await setSetting('childName', input.value.trim());
          await setSetting('childEmoji', emoji);
          status.textContent = 'Saved ✔';
        },
      }, 'Save'),
      backButton(back), status),
  );
  input.focus();
}

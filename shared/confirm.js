// Picture-style "are you sure?" box for children. Resolves true (tick) or false (cross).
import { el } from './dom.js';

export function confirmPicture(emoji, text) {
  return new Promise((resolve) => {
    const done = (ok) => { overlay.remove(); resolve(ok); };
    const no = el('button', { class: 'btn big grey', 'aria-label': 'No', onclick: () => done(false) }, '✖');
    const overlay = el('div', { class: 'overlay', role: 'dialog' },
      el('div', { class: 'card' },
        el('div', { style: 'font-size:110px;line-height:1' }, emoji),
        el('p', {}, text),
        el('div', { class: 'row', style: 'justify-content:center' },
          el('button', { class: 'btn big green', 'aria-label': 'Yes', onclick: () => done(true) }, '✔'),
          no)));
    document.body.append(overlay);
    no.focus();
  });
}

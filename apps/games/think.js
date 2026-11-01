// "Computer is thinking" message with a wobbling icon.
import { el, add } from '../../shared/dom.js';

export function showThinking(msg, name) {
  msg.replaceChildren();
  add(msg, el('span', { class: 'g-think', 'aria-hidden': 'true' }, '🤔'), ` ${name} is thinking...`);
}

export function showText(msg, text) {
  msg.textContent = text;
}

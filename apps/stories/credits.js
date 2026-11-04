// Who made a book, and the licence. Shown at the end of a story.
import { el } from '../../shared/dom.js';

export function creditsCard(book) {
  return el('div', { class: 'st-credits' },
    el('h2', {}, book.title),
    book.credits.map(([role, name]) => el('p', {}, `${role} `, el('b', {}, name))),
    el('p', { class: 'st-small' }, `Published by Book Dash in ${book.year}. This book is licensed under Creative Commons Attribution 4.0 (CC BY 4.0, creativecommons.org/licenses/by/4.0).`),
    el('p', { class: 'st-small' }, `Original: ${book.url.replace('https://', '')}. Changes: the pages were resized to fit this app.`));
}

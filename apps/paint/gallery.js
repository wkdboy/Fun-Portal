import { el, add } from '../../shared/dom.js';
import { all, del } from '../../shared/storage.js';
import { confirmPicture } from '../../shared/confirm.js';

export async function renderGallery(root, nav) {
  const pics = (await all('drawings')).sort((a, b) => b.modified - a.modified);
  const urls = [];
  const tiles = [
    el('button', { class: 'pt-new', onclick: () => nav.edit(null) }, el('span', { class: 'pt-plus' }, '➕'), 'New picture'),
    el('button', { class: 'pt-new', onclick: () => nav.colouring() }, el('span', { class: 'pt-plus' }, '🖍️'), 'Colouring in'),
  ];
  for (const p of pics) {
    const url = URL.createObjectURL(p.png);
    urls.push(url);
    tiles.push(el('div', { class: 'pt-card' },
      el('button', { class: 'pt-thumb', 'aria-label': 'Open picture', onclick: () => nav.edit(p.id) }, el('img', { src: url, alt: '' })),
      el('button', {
        class: 'btn pink pt-del',
        'aria-label': 'Delete picture',
        onclick: async () => {
          if (await confirmPicture('🗑️', 'Delete this picture?')) { await del('drawings', p.id); nav.gallery(); }
        },
      }, '🗑️')));
  }
  add(root, el('h1', {}, 'My pictures 🎨'), el('div', { class: 'pt-grid' }, tiles));
  root.querySelector('.pt-new')?.focus();
  return () => urls.forEach((u) => URL.revokeObjectURL(u));
}

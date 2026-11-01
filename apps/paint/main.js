// Paint: a gallery of saved pictures, a free-drawing editor and colouring-in pages.
import { loadCss } from '../../shared/dom.js';
import { renderGallery } from './gallery.js';
import { renderEditor } from './editor.js';
import { renderColouring } from './colouring.js';

export function mount(root) {
  loadCss(new URL('./paint.css', import.meta.url));
  let stop = null;
  const show = async (fn) => {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    stop = (await fn(root)) || null;
  };
  const nav = {
    gallery: () => show((r) => renderGallery(r, nav)),
    edit: (id, page, byNumbers) => show((r) => renderEditor(r, nav, id, page, byNumbers)),
    colouring: () => show((r) => renderColouring(r, nav)),
    numbers: () => show((r) => renderColouring(r, nav, true)),
  };
  nav.gallery();
  return () => stop?.();
}

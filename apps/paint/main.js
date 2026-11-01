// Paint: a gallery of saved pictures and a free-drawing editor.
import { loadCss } from '../../shared/dom.js';
import { renderGallery } from './gallery.js';
import { renderEditor } from './editor.js';

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
    edit: (id) => show((r) => renderEditor(r, nav, id)),
  };
  nav.gallery();
  return () => stop?.();
}

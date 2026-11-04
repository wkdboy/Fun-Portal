// Stories: a shelf of picture books (Book Dash, CC BY 4.0) and a page-turning reader. Books live in books/<id>/.
import { loadCss } from '../../shared/dom.js';
import { renderShelf } from './shelf.js';
import { renderReader } from './reader.js';

export function mount(root) {
  loadCss(new URL('./stories.css', import.meta.url));
  let stop = null;
  const show = (fn) => {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    stop = fn(root) || null;
  };
  const nav = {
    shelf: (focusId) => show((r) => renderShelf(r, nav, focusId)),
    read: (book) => show((r) => renderReader(r, nav, book)),
  };
  nav.shelf();
  return () => stop?.();
}

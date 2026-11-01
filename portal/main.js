// Entry point: sets up storage, sound, input, the service worker, and a simple hash router.
//   #/            home          #/app/<id>   an app          #/grownups   grown-ups area
import { requestPersistence } from '../shared/storage.js';
import { bindSoundButton, play } from '../shared/audio.js';
import { initInput } from '../shared/input.js';
import { el } from '../shared/dom.js';
import { APPS } from './apps.js';
import { renderHome } from './home.js';
import { renderComingSoon } from './coming-soon.js';

const view = document.getElementById('view');
const homeBtn = document.getElementById('home-btn');
const goHome = () => { location.hash = '#/'; };

let cleanup = null;
let routeId = 0;

async function route() {
  const id = ++routeId;
  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  const path = location.hash.replace(/^#\/?/, '');
  const [kind, name] = path.split('/');
  view.replaceChildren();
  homeBtn.hidden = path === '';
  let c;
  try {
    if (path === '') c = await renderHome(view);
    else if (kind === 'grownups') c = await (await import('../grownups/index.js')).render(view, goHome);
    else if (kind === 'app') {
      const app = APPS.find((a) => a.id === name);
      if (!app) return goHome();
      if (app.module) c = await (await import(app.module)).mount(view, { goHome });
      else renderComingSoon(view, app);
    } else return goHome();
  } catch (e) {
    console.error(e);
    view.replaceChildren(el('div', { class: 'card center' }, 'Oops, something went wrong. Press the home button.'));
  }
  if (id === routeId) cleanup = c || null;
  else if (typeof c === 'function') c();
}

homeBtn.addEventListener('click', goHome);
document.addEventListener('click', (e) => {
  if (e.target.closest('button') && e.target.id !== 'sound-btn') play('tap');
}, true);
window.addEventListener('hashchange', route);

bindSoundButton(document.getElementById('sound-btn'));
initInput();
requestPersistence();
route();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker failed', e));
}

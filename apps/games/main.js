// Games: hub, players, setup (players + house rules) and the game itself.
import { loadCss } from '../../shared/dom.js';
import { renderHub } from './hub.js';
import { renderPlayers } from './players-screen.js';
import { renderSetup } from './setup.js';
import { runGame } from './shell.js';
import { runDiceGame } from './dice-shell.js';

export function mount(root) {
  loadCss(new URL('./games.css', import.meta.url));
  let stop = null;
  let alive = true;
  const show = async (fn) => {
    if (stop) { stop(); stop = null; }
    root.replaceChildren();
    const s = await fn(root);
    if (alive) stop = s || null; else s?.();
  };
  const nav = {
    memory: {}, // remembers player/rule choices per game while the app is open
    hub: () => show((r) => renderHub(r, nav)),
    players: (back) => show((r) => renderPlayers(r, back)),
    setup: (def) => show((r) => renderSetup(r, nav, def)),
    play: (def, game, players, rules) => show((r) => (def.shell === 'dice' ? runDiceGame : runGame)(r, nav, def, game, players, rules)),
  };
  nav.hub();
  return () => { alive = false; stop?.(); };
}

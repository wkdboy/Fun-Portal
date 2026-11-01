// Keyboard arrows and gamepad move focus between buttons; Enter/Space/A press. Touch and mouse work natively.
const SELECTOR = 'button:not([disabled]), a[href], input, textarea, select, [tabindex="0"]';

function visibleItems() {
  return [...document.querySelectorAll(SELECTOR)].filter((n) => {
    const r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(n).visibility !== 'hidden';
  });
}

// Overlays (e.g. the parent gate) trap focus: only look inside the top one.
function scope() {
  const overlays = document.querySelectorAll('.overlay');
  return overlays.length ? overlays[overlays.length - 1] : document;
}

export function moveFocus(dx, dy) {
  const root = scope();
  const items = visibleItems().filter((n) => root === document || root.contains(n));
  const cur = document.activeElement;
  if (!items.length) return;
  if (!cur || !items.includes(cur)) { items[0].focus(); return; }
  const c = cur.getBoundingClientRect();
  const cx = c.left + c.width / 2;
  const cy = c.top + c.height / 2;
  let best = null;
  let bestScore = Infinity;
  for (const n of items) {
    if (n === cur) continue;
    const r = n.getBoundingClientRect();
    const ox = r.left + r.width / 2 - cx;
    const oy = r.top + r.height / 2 - cy;
    const along = dx ? ox * dx : oy * dy;
    const across = Math.abs(dx ? oy : ox);
    if (along <= 4) continue;
    const score = along + across * 2.5;
    if (score < bestScore) { bestScore = score; best = n; }
  }
  best?.focus();
}

export function initInput() {
  const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  document.addEventListener('keydown', (e) => {
    const d = dirs[e.key];
    if (!d || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    e.preventDefault();
    moveFocus(d[0], d[1]);
  });

  let last = 0;
  let wasA = false;
  let wasB = false;
  function poll(now) {
    const pad = [...(navigator.getGamepads?.() || [])].find(Boolean);
    if (pad) {
      const b = pad.buttons;
      const ax = pad.axes;
      if (now - last > 200) {
        let dx = 0, dy = 0;
        if (b[14]?.pressed || ax[0] < -0.6) dx = -1;
        else if (b[15]?.pressed || ax[0] > 0.6) dx = 1;
        else if (b[12]?.pressed || ax[1] < -0.6) dy = -1;
        else if (b[13]?.pressed || ax[1] > 0.6) dy = 1;
        if (dx || dy) { moveFocus(dx, dy); last = now; }
      }
      const a = !!b[0]?.pressed;
      const back = !!b[1]?.pressed;
      if (a && !wasA) document.activeElement?.click?.();
      if (back && !wasB) document.getElementById('home-btn')?.click();
      wasA = a;
      wasB = back;
    }
    requestAnimationFrame(poll);
  }
  requestAnimationFrame(poll);
}
